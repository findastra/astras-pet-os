// The pet chat helper (the-farm-v1.0-pet-chat-helper-v1.0): the seat behind every pet program page's chat window.
// Astra, 2026-11-03: "it needs to auto recognize it or give you an option to choose which model to use... it should be
// Claude Code answering first and then Codex, most likely, unless dictated otherwise. The agents are supposed to be able
// to change stuff, read the plan" (cards 061 and 283).
//
// A background program with no window, started by Startup Star at sign-in. It listens on this PC only (a loopback
// socket, on a port it picks at each start) and answers only a page that sends the code from its page data file in
// Documents, which only a page opened from this PC can read. It never runs anything a page sends: a page can only ask it
// to seat an agent in a registered pet's folder with a message, stop it, start the conversation over, or push the
// chat's branch, and a push happens only after Astra says yes in a Windows box of the helper's own.
//
// Supervised (ASTRAS_PET_OS 8.3), enforced here and not only in the agent's instructions:
// - the agent works in its own worktree of the pet's repo, on a branch made for the chat, never on main;
// - Claude Code runs --restricted: file tools only, confined to that folder and a fresh copy of the plan, with none of
//   her own settings, plugins or MCP servers; Codex runs in its workspace-write sandbox without her config's plugins;
// - the helper, not the agent, commits the changes on the branch after each answer, with hooks switched off;
// - private pets are refused; one answer at a time, at most 15 minutes, stopped from the page or the star's menu;
// - every answer is written to the log in the data folder.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace AstrasPetOs.PetChat
{
    static class Program
    {
        public const string Tool = "the-farm-v1.0-pet-chat-helper-v1.0";
        public const string Schema = "astras-pet-os-pet-chat-v1";
        public static readonly ManualResetEvent Quit = new ManualResetEvent(false);

        [STAThread]
        static int Main(string[] args)
        {
            var o = new Options(args);
            if (o.Has("--self-test")) return SelfTest.Run();
            var places = Places.From(o);
            if (o.Has("--open-folder")) { Directory.CreateDirectory(places.Data); Process.Start("explorer.exe", "\"" + places.Data + "\""); return 0; }
            if (o.Has("--quit")) return Server.AskToQuit(places) ? 0 : 1;
            bool first;
            using (var only = new Mutex(true, "Local\\astras-pet-os-pet-chat-helper" + (o.Has("--test") ? "-test-" + Process.GetCurrentProcess().Id : ""), out first))
            {
                // A second copy started at sign-in or from the menu leaves the running one alone and opens nothing.
                if (!first) return 0;
                Server server;
                try { server = new Server(places, o); }
                catch (Exception error) { Log.Write(places, "start-failed", null, error.Message); return 2; }
                server.Start();
                Quit.WaitOne();
                server.Stop();
            }
            return 0;
        }
    }

    // Command-line words. Only Startup Star, its menu and the tests start the helper, never a page.
    sealed class Options
    {
        readonly List<string> words;
        public Options(string[] args) { words = new List<string>(args); }
        public bool Has(string flag) { return words.Contains(flag); }
        public string Get(string flag) { int i = words.IndexOf(flag); return i >= 0 && i + 1 < words.Count ? words[i + 1] : null; }
        public List<string> All(string flag) { var list = new List<string>(); for (int i = 0; i + 1 < words.Count; i++) if (words[i] == flag) list.Add(words[i + 1]); return list; }
    }

    // Where things are. The hub is the folder above this program's bin; the pets' folders sit next to the hub (the same
    // rule as Startup Star's background pets); the data folder is two levels above the hub, where the pages look for it
    // (from apps/pet-programs/, four folders up: Documents\Astra's PetOS Data on Astra's PC).
    sealed class Places
    {
        public string Hub, Pets, Data, Menu;
        public static Places From(Options o)
        {
            string exeDir = Path.GetDirectoryName(Path.GetFullPath(Application.ExecutablePath));
            var p = new Places();
            p.Hub = o.Get("--hub") ?? Path.GetDirectoryName(exeDir);
            p.Pets = o.Get("--pets") ?? Path.GetDirectoryName(p.Hub);
            p.Data = o.Get("--data") ?? Path.Combine(Path.GetDirectoryName(p.Pets), "Astra's PetOS Data", "astras-pet-os", "pet-chat");
            p.Menu = o.Get("--menu") ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "astras-pet-os", "pet-chat");
            return p;
        }
        public string PageData { get { return Path.Combine(Data, "pet-chat-page-data.js"); } }
        public string Plan { get { return Path.Combine(Data, "plan"); } }
        public string NoHooks { get { return Path.Combine(Data, "no-hooks"); } }
        public string Sessions { get { return Path.Combine(Data, "sessions-20261103.json"); } }
        public string Settings { get { return Path.Combine(Data, "pet-chat-settings-20261103.json"); } }
        public string Worktree(string repo) { return Path.Combine(Data, "worktrees", repo); }
    }

    static class Json
    {
        public static JavaScriptSerializer S() { return new JavaScriptSerializer { MaxJsonLength = 64 * 1024 * 1024 }; }
        public static string Write(object o) { return S().Serialize(o); }
        public static Dictionary<string, object> Map(object o) { return o as Dictionary<string, object>; }
        public static Dictionary<string, object> Parse(string text) { try { return Map(S().DeserializeObject(text)); } catch (Exception) { return null; } }
        public static Dictionary<string, object> ReadFile(string path) { try { return File.Exists(path) ? Parse(File.ReadAllText(path)) : null; } catch (Exception) { return null; } }
        public static string Str(Dictionary<string, object> m, string key) { object v; return m != null && m.TryGetValue(key, out v) ? v as string : null; }
        public static Dictionary<string, object> Obj(Dictionary<string, object> m, string key) { object v; return m != null && m.TryGetValue(key, out v) ? v as Dictionary<string, object> : null; }
        public static IEnumerable<object> List(Dictionary<string, object> m, string key)
        {
            object v;
            if (m == null || !m.TryGetValue(key, out v)) return new object[0];
            var a = v as IEnumerable; if (a == null || v is string) return new object[0];
            return a.Cast<object>();
        }
        public static void Save(string path, object o)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            string temp = path + ".tmp";
            File.WriteAllText(temp, Write(o), new UTF8Encoding(false));
            if (File.Exists(path)) File.Delete(path);
            File.Move(temp, path);
        }
    }

    // A pet the helper may seat an agent for: a registered or pipeline pet in the hub's pets.json, whose folder is a git
    // repo next to the hub. Its names come from the registry, never from the page.
    sealed class PetInfo
    {
        public string Repo, Pet, Program, Folder;
        public bool Private;
    }

    static class Registry
    {
        public static readonly Regex RepoName = new Regex("^[a-z0-9][a-z0-9-]{0,99}$");
        public static PetInfo Find(Places places, string repo, out string why)
        {
            why = null;
            if (repo == null || !RepoName.IsMatch(repo)) { why = "That is not a pet's name."; return null; }
            var reg = Json.ReadFile(Path.Combine(places.Hub, "pets.json"));
            if (reg == null) { why = "The farm's pets.json could not be read."; return null; }
            Dictionary<string, object> entry = null;
            foreach (string list in new[] { "pets", "pipeline" })
                foreach (object o in Json.List(reg, list)) { var e = Json.Map(o); if (Json.Str(e, "repo") == repo) entry = e; }
            if (entry == null) { why = "Only a pet on the farm can be seated; " + repo + " is not in pets.json."; return null; }
            var info = new PetInfo { Repo = repo, Pet = Json.Str(entry, "pet") ?? repo, Folder = Path.Combine(places.Pets, repo) };
            // The same list the page reads for its private-pet note (relations.private: Health Hummy, Finance Finch).
            foreach (object o in Json.List(Json.Obj(reg, "relations"), "private")) if (o as string == repo) info.Private = true;
            var programs = Json.ReadFile(Path.Combine(places.Hub, "pet-programs.json"));
            foreach (object o in Json.List(programs, "programs")) { var p = Json.Map(o); if (Json.Str(p, "repo") == repo) info.Program = Json.Str(p, "program"); }
            if (info.Program == null) info.Program = info.Pet + "'s pet program";
            return info;
        }
    }

    // The agents the helper knows how to find on a PC, in the farm's order. Claude Code and Codex can be seated; the
    // others are found and named so the person sees what is there, but cannot be seated yet.
    sealed class Agent
    {
        public string Id, Name, Exe, Why;
        public bool Found, SignedIn, Seatable;
        public Dictionary<string, object> Row()
        {
            return new Dictionary<string, object> { { "id", Id }, { "name", Name }, { "found", Found }, { "signed_in", SignedIn }, { "seatable", Seatable }, { "ready", Found && SignedIn && Seatable }, { "why", Why } };
        }
    }

    static class Agents
    {
        public static readonly string[][] Known = { new[] { "claude-code", "Claude Code", "claude" }, new[] { "codex", "Codex", "codex" }, new[] { "gemini", "Gemini CLI", "gemini" }, new[] { "copilot", "GitHub Copilot CLI", "copilot" } };
        public static readonly string[] DefaultOrder = { "claude-code", "codex", "gemini", "copilot" };
        static List<Agent> cache; static DateTime cachedAt;
        static readonly object gate = new object();
        // Tests point an agent at a stand-in program: --agent claude-code=<path>.
        public static Dictionary<string, string> Override = new Dictionary<string, string>();

        public static List<string> Order(Places places)
        {
            var settings = Json.ReadFile(places.Settings);
            var order = Json.List(settings, "order").OfType<string>().Where(id => Known.Any(k => k[0] == id)).ToList();
            foreach (string id in DefaultOrder) if (!order.Contains(id)) order.Add(id);
            return order;
        }

        public static List<Agent> Look(Places places, bool fresh)
        {
            lock (gate)
            {
                if (!fresh && cache != null && DateTime.UtcNow - cachedAt < TimeSpan.FromSeconds(30)) return cache;
                var list = new List<Agent>();
                foreach (string id in Order(places))
                {
                    var k = Known.First(x => x[0] == id);
                    var a = new Agent { Id = id, Name = k[1], Seatable = id == "claude-code" || id == "codex" };
                    a.Exe = FindExe(id, k[2]);
                    a.Found = a.Exe != null;
                    if (!a.Found) a.Why = "not on this PC";
                    else if (!a.Seatable) a.Why = "found on this PC; the pet chat cannot seat it yet";
                    else { string said; a.SignedIn = SignedIn(a, out said); a.Why = a.SignedIn ? "ready" : said; }
                    list.Add(a);
                }
                cache = list; cachedAt = DateTime.UtcNow;
                return list;
            }
        }

        public static Agent Get(Places places, string id) { return Look(places, false).FirstOrDefault(a => a.Id == id); }

        static string FindExe(string id, string name)
        {
            string over;
            if (Override.TryGetValue(id, out over)) return File.Exists(over) ? over : null;
            var tries = new List<string>();
            foreach (string dir in (Environment.GetEnvironmentVariable("PATH") ?? "").Split(';'))
            {
                if (dir.Trim().Length == 0) continue;
                try { tries.Add(Path.Combine(dir.Trim(), name + ".exe")); tries.Add(Path.Combine(dir.Trim(), name + ".cmd")); } catch (ArgumentException) { }
            }
            string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string roaming = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            if (id == "claude-code")
            {
                tries.Add(Path.Combine(home, ".local", "bin", "claude.exe"));
                tries.Add(Newest(Path.Combine(local, "Claude-Data"), "claude.exe", 4));
            }
            if (id == "codex") tries.Add(Newest(Path.Combine(local, "OpenAI", "Codex", "bin"), "codex.exe", 1));
            if (id == "copilot") tries.Add(Path.Combine(local, "GitHubCopilotCLI", "copilot.exe"));
            tries.Add(Path.Combine(roaming, "npm", name + ".cmd"));
            return tries.FirstOrDefault(t => t != null && File.Exists(t));
        }

        // The newest copy of a program kept in versioned folders (the Claude app's own Claude Code, Codex's bin).
        static string Newest(string root, string file, int depth)
        {
            try
            {
                if (!Directory.Exists(root)) return null;
                var found = new List<string>();
                Walk(root, file, depth, found);
                return found.OrderByDescending(f => VersionOf(f)).ThenByDescending(f => File.GetLastWriteTimeUtc(f)).FirstOrDefault();
            }
            catch (Exception) { return null; }
        }
        static void Walk(string dir, string file, int depth, List<string> found)
        {
            string here = Path.Combine(dir, file);
            if (File.Exists(here)) found.Add(here);
            if (depth <= 0) return;
            foreach (string sub in Directory.GetDirectories(dir)) Walk(sub, file, depth - 1, found);
        }
        static Version VersionOf(string path)
        {
            foreach (string part in path.Split(Path.DirectorySeparatorChar).Reverse()) { Version v; if (Regex.IsMatch(part, @"^\d+\.\d+(\.\d+){0,2}$") && Version.TryParse(part, out v)) return v; }
            return new Version(0, 0);
        }

        static bool SignedIn(Agent a, out string said)
        {
            if (a.Id == "claude-code")
            {
                var r = Run.Program(a.Exe, "auth status", null, 20000, null);
                var status = Json.Parse(r.Output);
                object loggedIn;
                if (status != null && status.TryGetValue("loggedIn", out loggedIn) && loggedIn is bool && (bool)loggedIn) { said = "ready"; return true; }
                said = "found on this PC; sign in once (claude auth login)";
                return false;
            }
            var c = Run.Program(a.Exe, "login status", null, 20000, null);
            // Codex says it on stderr.
            if (c.Code == 0 && (c.Output + c.Error).IndexOf("Logged in", StringComparison.OrdinalIgnoreCase) >= 0) { said = "ready"; return true; }
            said = "found on this PC; sign in once (codex login)";
            return false;
        }
    }

    // Running a program with its output caught: never through a shell with a page's words, which go in on stdin.
    sealed class Ran { public int Code = -1; public string Output = "", Error = ""; public bool TimedOut; }

    static class Run
    {
        // Variables a seat must not inherit: the Claude app's own session (a seated Claude Code must use Astra's own
        // sign-in, never the app's) and any API key (pet bots never reuse ANTHROPIC_API_KEY or OPENAI_API_KEY).
        public static bool Inherited(string name)
        {
            string n = name.ToUpperInvariant();
            return !(n.StartsWith("CLAUDE") || n.StartsWith("ANTHROPIC_") || n == "OPENAI_API_KEY" || n == "OPENAI_BASE_URL");
        }

        public static ProcessStartInfo Start(string exe, string args, string cwd)
        {
            var psi = exe.EndsWith(".cmd", StringComparison.OrdinalIgnoreCase)
                ? new ProcessStartInfo(Path.Combine(Environment.SystemDirectory, "cmd.exe"), "/d /s /c \"\"" + exe + "\" " + args + "\"")
                : new ProcessStartInfo(exe, args);
            psi.UseShellExecute = false; psi.CreateNoWindow = true;
            psi.RedirectStandardInput = true; psi.RedirectStandardOutput = true; psi.RedirectStandardError = true;
            psi.StandardOutputEncoding = Encoding.UTF8; psi.StandardErrorEncoding = Encoding.UTF8;
            if (cwd != null) psi.WorkingDirectory = cwd;
            foreach (string key in psi.EnvironmentVariables.Keys.Cast<string>().ToList()) if (!Inherited(key)) psi.EnvironmentVariables.Remove(key);
            return psi;
        }

        public static Ran Program(string exe, string args, string cwd, int timeoutMs, string stdin)
        {
            var r = new Ran();
            try
            {
                using (var p = Process.Start(Start(exe, args, cwd)))
                {
                    var err = p.StandardError.ReadToEndAsync();
                    var output = p.StandardOutput.ReadToEndAsync();
                    WriteInput(p, stdin);
                    if (!p.WaitForExit(timeoutMs)) { r.TimedOut = true; Kill(p); }
                    p.WaitForExit();
                    r.Code = r.TimedOut ? -1 : p.ExitCode; r.Output = output.Result; r.Error = err.Result;
                }
            }
            catch (Exception e) { r.Error = e.Message; }
            return r;
        }

        // UTF-8 straight to the pipe: .NET Framework would otherwise write the console's code page.
        public static void WriteInput(Process p, string text)
        {
            try
            {
                if (text != null) { byte[] b = new UTF8Encoding(false).GetBytes(text); p.StandardInput.BaseStream.Write(b, 0, b.Length); }
                p.StandardInput.Close();
            }
            catch (IOException) { }
        }

        // The agent and everything it started.
        public static void Kill(Process p)
        {
            try
            {
                if (p.HasExited) return;
                using (var k = Process.Start(new ProcessStartInfo(Path.Combine(Environment.SystemDirectory, "taskkill.exe"), "/pid " + p.Id + " /t /f") { UseShellExecute = false, CreateNoWindow = true })) k.WaitForExit(10000);
            }
            catch (Exception) { }
            try { if (!p.HasExited) p.Kill(); } catch (Exception) { }
        }
    }

    // git, always with hooks switched off, so nothing an agent wrote into a folder runs when the helper commits.
    static class Git
    {
        public static string Exe()
        {
            foreach (string dir in (Environment.GetEnvironmentVariable("PATH") ?? "").Split(';'))
            {
                try { string g = Path.Combine(dir.Trim(), "git.exe"); if (dir.Trim().Length > 0 && File.Exists(g)) return g; } catch (ArgumentException) { }
            }
            string pf = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            return Path.Combine(pf, "Git", "cmd", "git.exe");
        }
        public static Ran In(Places places, string dir, string args, int timeoutMs = 60000)
        {
            Directory.CreateDirectory(places.NoHooks);
            return Run.Program(Exe(), "-C " + Q(dir) + " -c core.hooksPath=" + Q(places.NoHooks) + " -c core.fsmonitor=false " + args, dir, timeoutMs, null);
        }
        public static string Q(string s) { return "\"" + s.Replace("\"", "") + "\""; }
        public static readonly Regex Branch = new Regex(@"^(claude|codex)/pet-chat-[a-z0-9-]+-\d{8}(-\d+)?$");
    }

    // One pet's chat: who sits in its seat, the agent's own conversation id, and the worktree and branch it works on.
    sealed class Seat
    {
        public string Repo, Agent, Session, Branch, Folder, Base, GitFile, LastAsked, LastSaid, LastAt;
        public List<string> LastChanged = new List<string>();
        public Dictionary<string, object> Row()
        {
            return new Dictionary<string, object> { { "repo", Repo }, { "agent", Agent }, { "session", Session }, { "branch", Branch }, { "folder", Folder }, { "base", Base }, { "git_file", GitFile },
                { "last_asked", LastAsked }, { "last_said", LastSaid }, { "last_at", LastAt }, { "last_changed", LastChanged } };
        }
        public static Seat From(Dictionary<string, object> m)
        {
            var s = new Seat { Repo = Json.Str(m, "repo"), Agent = Json.Str(m, "agent"), Session = Json.Str(m, "session"), Branch = Json.Str(m, "branch"), Folder = Json.Str(m, "folder"),
                Base = Json.Str(m, "base"), GitFile = Json.Str(m, "git_file"), LastAsked = Json.Str(m, "last_asked"), LastSaid = Json.Str(m, "last_said"), LastAt = Json.Str(m, "last_at") };
            s.LastChanged = Json.List(m, "last_changed").OfType<string>().ToList();
            return s;
        }
    }

    sealed class Seats
    {
        readonly Places places;
        readonly Dictionary<string, Seat> seats = new Dictionary<string, Seat>();
        public Seats(Places places)
        {
            this.places = places;
            foreach (var kv in Json.ReadFile(places.Sessions) ?? new Dictionary<string, object>()) { var m = Json.Map(kv.Value); if (m != null) seats[kv.Key] = Seat.From(m); }
        }
        public Seat Of(string repo) { Seat s; return seats.TryGetValue(repo, out s) ? s : null; }
        public void Put(Seat s) { seats[s.Repo] = s; Save(); }
        public void Save() { Json.Save(places.Sessions, seats.ToDictionary(kv => kv.Key, kv => (object)kv.Value.Row())); }
    }

    // The worktree the agent works in: made once per pet from the newest origin main, on its own branch, in the data
    // folder, so Astra's own copy of the pet (maybe on another branch, with her work in it) is never touched.
    static class Worktrees
    {
        public static Seat Ensure(Places places, Seats seats, PetInfo pet, string agent, out string why)
        {
            why = null;
            var seat = seats.Of(pet.Repo);
            if (seat != null && seat.Folder != null && Directory.Exists(seat.Folder))
            {
                // The folder must still be the one the helper made: same .git pointer, same branch, not main.
                string gitFile = Path.Combine(seat.Folder, ".git");
                string now = File.Exists(gitFile) ? File.ReadAllText(gitFile).Trim() : null;
                var head = Git.In(places, seat.Folder, "branch --show-current");
                if (now == null || now != seat.GitFile || head.Code != 0 || head.Output.Trim() != seat.Branch || !Git.Branch.IsMatch(seat.Branch ?? ""))
                { why = "The chat's folder for " + pet.Pet + " was changed in a way the helper did not make, so nothing runs there. It is " + seat.Folder + "."; return null; }
                return seat;
            }
            if (!Directory.Exists(pet.Folder) || Git.In(places, pet.Folder, "rev-parse --git-dir").Code != 0)
            { why = pet.Pet + "'s folder is not on this PC (" + pet.Folder + "), so there is nothing to seat an agent in."; return null; }
            Git.In(places, pet.Folder, "fetch --quiet origin", 120000);
            string baseRef = null;
            var originHead = Git.In(places, pet.Folder, "symbolic-ref --quiet --short refs/remotes/origin/HEAD");
            if (originHead.Code == 0 && originHead.Output.Trim().StartsWith("origin/")) baseRef = originHead.Output.Trim();
            foreach (string b in new[] { "origin/main", "origin/master" }) if (baseRef == null && Git.In(places, pet.Folder, "rev-parse --verify --quiet " + b).Code == 0) baseRef = b;
            if (baseRef == null) { why = pet.Pet + "'s repo has no main branch on GitHub to start from."; return null; }
            string prefix = agent == "codex" ? "codex" : "claude";
            string branch = prefix + "/pet-chat-" + pet.Repo + "-" + DateTime.Now.ToString("yyyyMMdd");
            for (int n = 2; Git.In(places, pet.Folder, "rev-parse --verify --quiet refs/heads/" + branch).Code == 0; n++)
                branch = prefix + "/pet-chat-" + pet.Repo + "-" + DateTime.Now.ToString("yyyyMMdd") + "-" + n;
            string folder = places.Worktree(pet.Repo);
            if (Directory.Exists(folder)) { why = "A folder is already where the chat's worktree goes (" + folder + "). Move it away first."; return null; }
            Directory.CreateDirectory(Path.GetDirectoryName(folder));
            var add = Git.In(places, pet.Folder, "worktree add --quiet -b " + branch + " " + Git.Q(folder) + " " + baseRef, 300000);
            if (add.Code != 0) { why = "git could not make the chat's worktree: " + Short(add.Error); return null; }
            seat = new Seat { Repo = pet.Repo, Agent = agent, Branch = branch, Folder = folder, Base = baseRef, GitFile = File.ReadAllText(Path.Combine(folder, ".git")).Trim() };
            seats.Put(seat);
            return seat;
        }
        public static string Short(string s) { s = (s ?? "").Trim(); return s.Length > 300 ? s.Substring(0, 300) + "…" : s; }
    }

    // The plan, copied fresh before every answer into a folder the agent may read (and whose changes are thrown away).
    static class Plan
    {
        public static readonly string[] Files = { "AGENTS.md", "ASTRAS_PET_OS.md", "PET-PROGRAM-FRAMEWORK.md", "PET-WORDS.md", "TOOLS-AND-TRICKS.md", "PROTECTION-RINGS.md", "pet-programs.json" };
        public static void Copy(Places places)
        {
            Directory.CreateDirectory(places.Plan);
            foreach (string f in Files) { string from = Path.Combine(places.Hub, f); if (File.Exists(from)) File.Copy(from, Path.Combine(places.Plan, f), true); }
        }

        // What the seated agent is told, every answer. Trusted text: names from the registry, paths the helper made.
        public static string Rules(PetInfo pet, Seat seat, Agent agent, Places places)
        {
            var r = new StringBuilder();
            r.AppendLine("You are " + pet.Pet + ", the pet of " + pet.Program + " in Astra's PetOS, answering in " + pet.Pet + "'s chat window on the pet program page. You are " + agent.Name + ", seated in " + pet.Pet + "'s harness (L3) by the pet chat helper on this PC. Supervised (ASTRAS_PET_OS.md 8.3).");
            r.AppendLine("- Your folder is a worktree of " + pet.Repo + " on the branch " + seat.Branch + ", made for this chat from " + seat.Base + ". Work only here.");
            r.AppendLine("- Read the plan before you change anything: AGENTS.md and pet.json in your folder, and the farm's rules in " + places.Plan + " (AGENTS.md, ASTRAS_PET_OS.md, PET-PROGRAM-FRAMEWORK.md, PET-WORDS.md, TOOLS-AND-TRICKS.md, PROTECTION-RINGS.md, pet-programs.json). That folder is a fresh copy for reading; changes there are thrown away.");
            r.AppendLine("- You may read and change files in your folder. The helper commits your changes on " + seat.Branch + " after each answer. Nothing reaches GitHub until Astra presses Push in the chat and says yes on her PC, and nothing ever goes to main from here.");
            if (agent.Id == "codex") r.AppendLine("- Never run git commit, git push, installs, or anything that changes files outside your folder; read-only checks are fine.");
            else r.AppendLine("- You cannot run programs, install anything, use the internet, push or open pull requests.");
            r.AppendLine("- When the work needs any of that, or is bigger than a small change that is easy to undo (deleting or renaming files, a new feature, anything outside this repo, anything about keys, accounts or money), stop and ask in your answer, plainly, and wait for the reply in the next message.");
            r.AppendLine("- Never ask for or write a key, token or password: keys go through API Fairy (skills/key-request).");
            r.AppendLine("- Answer the way " + pet.Pet + " talks to Astra: short, plain words, no programmer words without their plain meaning. Say what you changed and in which file.");
            return r.ToString();
        }
    }

    // One answer: the agent started in the worktree, its output turned into the chat's few kinds of line.
    sealed class Answer
    {
        public Process Proc;
        public volatile bool Stopped;
        public string Repo;
        public readonly StringBuilder Said = new StringBuilder();
        public string Session, Problem;
    }

    // The lines the page reads, one JSON object per line: say (words to add to the pet's bubble), doing (what the agent
    // is doing now), seat, changed, done and problem.
    static class Lines
    {
        public static Dictionary<string, object> L(string type, string key, object value)
        {
            var d = new Dictionary<string, object> { { "type", type } };
            if (key != null) d[key] = value;
            return d;
        }

        static string FileName(Dictionary<string, object> input)
        {
            string f = Json.Str(input, "file_path") ?? Json.Str(input, "path") ?? Json.Str(input, "pattern");
            return f == null ? "" : " " + Path.GetFileName(f.TrimEnd('/', '\\'));
        }

        // Claude Code's stream-json: text as it is typed, a line for each tool it uses, and its conversation id.
        public static void Claude(string line, Answer a, Action<Dictionary<string, object>> emit)
        {
            var m = Json.Parse(line);
            if (m == null) return;
            string type = Json.Str(m, "type");
            if (type == "system" && Json.Str(m, "subtype") == "init") { a.Session = Json.Str(m, "session_id") ?? a.Session; return; }
            if (type == "stream_event")
            {
                var ev = Json.Obj(m, "event");
                if (Json.Str(ev, "type") == "content_block_start" && Json.Str(Json.Obj(ev, "content_block"), "type") == "text" && a.Said.Length > 0) Say("\n\n", a, emit);
                if (Json.Str(ev, "type") == "content_block_delta" && Json.Str(Json.Obj(ev, "delta"), "type") == "text_delta") Say(Json.Str(Json.Obj(ev, "delta"), "text"), a, emit);
                return;
            }
            if (type == "assistant")
            {
                foreach (object o in Json.List(Json.Obj(m, "message"), "content"))
                {
                    var c = Json.Map(o);
                    if (Json.Str(c, "type") != "tool_use") continue;
                    string name = Json.Str(c, "name") ?? "";
                    var input = Json.Obj(c, "input");
                    string doing = name == "Read" ? "Reading" + FileName(input) : name == "Edit" || name == "Write" || name == "NotebookEdit" ? "Changing" + FileName(input) : name == "Glob" || name == "Grep" ? "Looking through the files" : "Using " + name;
                    emit(L("doing", "text", doing));
                }
                return;
            }
            if (type == "result")
            {
                a.Session = Json.Str(m, "session_id") ?? a.Session;
                object isError; m.TryGetValue("is_error", out isError);
                string result = Json.Str(m, "result");
                if (isError is bool && (bool)isError) a.Problem = result ?? Json.Str(m, "subtype") ?? "Claude Code stopped with a problem.";
                else if (a.Said.Length == 0 && !string.IsNullOrEmpty(result)) Say(result, a, emit);
            }
        }

        // Codex's --json events: whole messages, a line for each command or file change, and its thread id.
        public static void Codex(string line, Answer a, Action<Dictionary<string, object>> emit)
        {
            var m = Json.Parse(line);
            if (m == null) return;
            string type = Json.Str(m, "type");
            var item = Json.Obj(m, "item");
            string kind = Json.Str(item, "type");
            if (type == "thread.started") { a.Session = Json.Str(m, "thread_id") ?? a.Session; return; }
            if (type == "item.started" && kind == "command_execution") { string cmd = Json.Str(item, "command") ?? ""; emit(L("doing", "text", "Running " + (cmd.Length > 80 ? cmd.Substring(0, 80) + "…" : cmd))); return; }
            if (type == "item.completed" && kind == "agent_message") { string text = Json.Str(item, "text"); if (!string.IsNullOrEmpty(text)) Say((a.Said.Length > 0 ? "\n\n" : "") + text, a, emit); return; }
            if (type == "item.completed" && kind == "file_change")
            {
                var names = Json.List(item, "changes").Select(o => Path.GetFileName((Json.Str(Json.Map(o), "path") ?? "").TrimEnd('/', '\\'))).Where(n => n.Length > 0).ToList();
                emit(L("doing", "text", "Changing " + string.Join(", ", names)));
                return;
            }
            if (type == "turn.failed") { a.Problem = Json.Str(Json.Obj(m, "error"), "message") ?? "Codex stopped with a problem."; return; }
            if (type == "error") { a.Problem = Json.Str(m, "message") ?? "Codex stopped with a problem."; }
        }

        static void Say(string text, Answer a, Action<Dictionary<string, object>> emit)
        {
            if (string.IsNullOrEmpty(text)) return;
            a.Said.Append(text);
            emit(L("say", "text", text));
        }
    }

    static class Log
    {
        static readonly object gate = new object();
        public static void Write(Places places, string what, string repo, string note, Dictionary<string, object> more = null)
        {
            try
            {
                var row = new Dictionary<string, object> { { "time", DateTimeOffset.Now.ToString("o") }, { "what", what }, { "pet", repo }, { "note", note } };
                if (more != null) foreach (var kv in more) row[kv.Key] = kv.Value;
                string dir = Path.Combine(places.Data, "log");
                lock (gate) { Directory.CreateDirectory(dir); File.AppendAllText(Path.Combine(dir, "pet-chat-" + DateTime.Now.ToString("yyyyMMdd") + ".jsonl"), Json.Write(row) + "\n", new UTF8Encoding(false)); }
            }
            catch (Exception) { }
        }
    }

    // The page's way in: plain HTTP on the loopback socket only. Requests from a web site (an Origin that is not a file
    // or this PC) are refused before anything else, and every request must carry the code.
    sealed class Server
    {
        readonly Places places;
        readonly Options options;
        readonly TcpListener listener;
        readonly Seats seats;
        readonly string code;
        readonly object turnGate = new object();
        Answer current;
        volatile bool closing;
        // Tests answer the push box with --confirm yes|no instead of showing it.
        readonly string testConfirm;
        public const int MaxMinutes = 15;

        public Server(Places places, Options o)
        {
            this.places = places; options = o;
            Directory.CreateDirectory(places.Data);
            foreach (string pair in o.All("--agent")) { int i = pair.IndexOf('='); if (i > 0) Agents.Override[pair.Substring(0, i)] = pair.Substring(i + 1); }
            testConfirm = o.Has("--test") ? o.Get("--confirm") : null;
            seats = new Seats(places);
            code = NewCode();
            listener = new TcpListener(IPAddress.Loopback, 0);
        }

        public int Port { get { return ((IPEndPoint)listener.LocalEndpoint).Port; } }
        public string Url { get { return "http://" + IPAddress.Loopback + ":" + Port + "/"; } }

        static string NewCode()
        {
            var b = new byte[24];
            using (var rng = new RNGCryptoServiceProvider()) rng.GetBytes(b);
            return string.Concat(b.Select(x => x.ToString("x2")));
        }

        public void Start()
        {
            listener.Start();
            WritePageData(true);
            WriteMenu();
            Log.Write(places, "started", null, "listening on this PC only");
            new Thread(Accept) { IsBackground = true, Name = "pet-chat-server" }.Start();
            // Who is installed and signed in, looked at again every few minutes, so the page's list stays true.
            new Thread(delegate () { while (!closing) { Thread.Sleep(TimeSpan.FromMinutes(3)); if (!closing) { Agents.Look(places, true); WritePageData(true); } } }) { IsBackground = true }.Start();
        }

        public void Stop()
        {
            closing = true;
            var a = current; if (a != null && a.Proc != null) { a.Stopped = true; Run.Kill(a.Proc); }
            try { listener.Stop(); } catch (Exception) { }
            WritePageData(false);
            Log.Write(places, "stopped", null, null);
        }

        // What the page needs: where the helper listens, the code, and who can answer. In the data folder on this PC only.
        void WritePageData(bool on)
        {
            var data = new Dictionary<string, object> {
                { "schema", Program.Schema }, { "tool", Program.Tool }, { "on", on }, { "url", on ? Url : "" }, { "code", on ? code : "" },
                { "time", DateTimeOffset.Now.ToString("o") }, { "agents", on ? Agents.Look(places, false).Select(a => (object)a.Row()).ToList() : new List<object>() },
                { "about", "The pet chat helper's address on this PC. This PC only: never commit or share the code." } };
            try
            {
                Directory.CreateDirectory(places.Data);
                File.WriteAllText(places.PageData, "window.petChatHelper = " + Json.Write(data) + ";\n", new UTF8Encoding(false));
            }
            catch (Exception) { }
        }

        // Startup Star's menu for the helper: its own commands only (BackgroundPets in desktop-pets-20261011.cs).
        void WriteMenu()
        {
            try
            {
                Json.Save(Path.Combine(places.Menu, "menu-20261021.json"), new Dictionary<string, object> {
                    { "schema", "astras-pet-os-menu-v1" }, { "pet", "Pet chat" },
                    { "items", new List<object> {
                        new Dictionary<string, object> { { "text", "Stop pet chat" }, { "args", new List<object> { "--quit" } } },
                        new Dictionary<string, object> { { "text", "Open the pet chat folder (its log and worktrees)" }, { "args", new List<object> { "--open-folder" } } } } } });
            }
            catch (Exception) { }
        }

        public static bool AskToQuit(Places places)
        {
            try
            {
                string text = File.ReadAllText(places.PageData);
                int i = text.IndexOf('{'), j = text.LastIndexOf('}');
                var data = Json.Parse(text.Substring(i, j - i + 1));
                string url = Json.Str(data, "url"), c = Json.Str(data, "code");
                if (string.IsNullOrEmpty(url) || !OriginOk(url.TrimEnd('/'))) return false;
                using (var web = new WebClient()) { web.Headers[HttpRequestHeader.ContentType] = "text/plain"; web.UploadString(url + "quit", Json.Write(new Dictionary<string, object> { { "code", c } })); }
                return true;
            }
            catch (Exception) { return false; }
        }

        public static bool OriginOk(string origin)
        {
            if (string.IsNullOrEmpty(origin) || origin == "null") return true;
            return Regex.IsMatch(origin, @"^http://(127\.0\.0\.1|localhost|\[::1\])(:\d{1,5})?$");
        }

        public static bool SameCode(string a, string b)
        {
            if (a == null || b == null || a.Length != b.Length || a.Length == 0) return false;
            int diff = 0;
            for (int i = 0; i < a.Length; i++) diff |= a[i] ^ b[i];
            return diff == 0;
        }

        void Accept()
        {
            while (!closing)
            {
                TcpClient c;
                try { c = listener.AcceptTcpClient(); } catch (Exception) { if (closing) return; continue; }
                ThreadPool.QueueUserWorkItem(delegate { try { using (c) Serve(c); } catch (Exception) { } });
            }
        }

        void Serve(TcpClient c)
        {
            c.ReceiveTimeout = 10000;
            var stream = c.GetStream();
            var buf = new List<byte>();
            int b;
            while ((b = stream.ReadByte()) >= 0 && buf.Count < 8192)
            {
                buf.Add((byte)b);
                int n = buf.Count;
                if (n >= 4 && buf[n - 4] == 13 && buf[n - 3] == 10 && buf[n - 2] == 13 && buf[n - 1] == 10) break;
            }
            string[] lines = Encoding.ASCII.GetString(buf.ToArray()).Split(new[] { "\r\n" }, StringSplitOptions.None);
            string[] first = lines[0].Split(' ');
            if (first.Length < 2) return;
            var headers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (string l in lines.Skip(1)) { int i = l.IndexOf(':'); if (i > 0) headers[l.Substring(0, i).Trim()] = l.Substring(i + 1).Trim(); }
            string origin; headers.TryGetValue("Origin", out origin);
            string method = first[0], path = first[1];
            string lenText; int len = 0;
            if (headers.TryGetValue("Content-Length", out lenText)) int.TryParse(lenText, out len);
            if (len < 0 || len > 65536) { Reply(stream, 413, null, Error("Too long: keep a message under 60,000 letters.")); return; }
            var body = new byte[len];
            int got = 0;
            while (got < len) { int r = stream.Read(body, got, len - got); if (r <= 0) break; got += r; }
            if (!OriginOk(origin)) { Reply(stream, 403, null, Error("Only a page opened from this PC can use the pet chat.")); return; }
            if (method == "OPTIONS") { Reply(stream, 204, origin, null); return; }
            if (method != "POST") { Reply(stream, 405, origin, Error("POST only.")); return; }
            var req = Json.Parse(Encoding.UTF8.GetString(body, 0, got));
            if (req == null || !SameCode(Json.Str(req, "code"), code)) { Reply(stream, 401, origin, Error("The pet chat's code does not match. Open the page from this PC again.")); return; }
            string repo = Json.Str(req, "pet");
            switch (path)
            {
                case "/hello": Reply(stream, 200, origin, Hello(repo)); return;
                case "/ask": Ask(stream, origin, repo, Json.Str(req, "agent"), Json.Str(req, "text")); return;
                case "/stop": Reply(stream, 200, origin, StopAnswer(repo)); return;
                case "/new": Reply(stream, 200, origin, Forget(repo)); return;
                case "/push": Reply(stream, 200, origin, Push(repo)); return;
                case "/quit": Reply(stream, 200, origin, new Dictionary<string, object> { { "ok", true }, { "said", "The pet chat helper stopped." } }); Program.Quit.Set(); return;
                default: Reply(stream, 404, origin, Error("Unknown request.")); return;
            }
        }

        Dictionary<string, object> Hello(string repo)
        {
            var d = new Dictionary<string, object> { { "ok", true }, { "agents", Agents.Look(places, false).Select(a => (object)a.Row()).ToList() } };
            string why;
            var pet = Registry.Find(places, repo, out why);
            d["pet_ok"] = pet != null && !pet.Private && Directory.Exists(pet.Folder);
            d["pet_why"] = pet == null ? why : pet.Private ? pet.Pet + " is private: its data never leaves this PC, so no agent is seated for it." : !Directory.Exists(pet.Folder) ? pet.Pet + "'s folder is not on this PC." : null;
            var seat = pet == null ? null : seats.Of(pet.Repo);
            if (seat != null) d["seat"] = new Dictionary<string, object> { { "agent", seat.Agent }, { "branch", seat.Branch }, { "last_asked", seat.LastAsked }, { "last_said", seat.LastSaid }, { "last_at", seat.LastAt }, { "last_changed", seat.LastChanged }, { "unpushed", Unpushed(seat) } };
            var now = current;
            d["busy"] = now != null && now.Repo == repo;
            return d;
        }

        int Unpushed(Seat seat)
        {
            if (seat.Folder == null || !Directory.Exists(seat.Folder)) return 0;
            var upstream = Git.In(places, seat.Folder, "rev-parse --verify --quiet @{u}");
            var count = Git.In(places, seat.Folder, "rev-list --count " + (upstream.Code == 0 ? "@{u}" : seat.Base) + "..HEAD");
            int n; return count.Code == 0 && int.TryParse(count.Output.Trim(), out n) ? n : 0;
        }

        void Ask(NetworkStream stream, string origin, string repo, string agentId, string text)
        {
            text = (text ?? "").Trim();
            if (text.Length == 0) { Reply(stream, 200, origin, Error("Type a message first.")); return; }
            string why;
            var pet = Registry.Find(places, repo, out why);
            if (pet == null) { Reply(stream, 200, origin, Error(why)); return; }
            if (pet.Private) { Reply(stream, 200, origin, Error(pet.Pet + " is private: its data never leaves this PC, so no agent is seated for it. Leave a note instead.")); return; }
            var agent = Agents.Get(places, agentId) ?? Agents.Look(places, false).FirstOrDefault(x => x.Found && x.SignedIn && x.Seatable);
            if (agent == null || !agent.Found || !agent.Seatable || !agent.SignedIn)
            {
                Agents.Look(places, true);
                agent = Agents.Get(places, agentId);
                if (agent == null || !agent.Found || !agent.Seatable || !agent.SignedIn) { Reply(stream, 200, origin, Error((agent == null ? "That agent" : agent.Name) + " cannot answer here: " + (agent == null ? "the pet chat does not know it" : agent.Why) + ".")); return; }
            }
            Answer a;
            lock (turnGate)
            {
                if (current != null) { Reply(stream, 200, origin, Error("Wait a moment: " + (current.Repo == repo ? "I am" : "another pet's chat is") + " still answering. Stop it first if you need to.")); return; }
                a = current = new Answer { Repo = repo };
            }
            var started = DateTime.UtcNow;
            bool open = true;
            Action<Dictionary<string, object>> emit = delegate (Dictionary<string, object> line)
            {
                if (!open) return;
                try { byte[] l = Encoding.UTF8.GetBytes(Json.Write(line) + "\n"); lock (stream) { stream.Write(l, 0, l.Length); stream.Flush(); } }
                catch (Exception) { open = false; }   // the page closed: the answer still finishes and is kept for next time
            };
            try
            {
                StartStream(stream, origin);
                emit(Lines.L("doing", "text", "Getting " + agent.Name + " seated"));
                var seat = Worktrees.Ensure(places, seats, pet, agent.Id, out why);
                if (seat == null) { emit(Lines.L("problem", "text", why)); return; }
                if (seat.Agent != agent.Id) { seat.Agent = agent.Id; seat.Session = null; }
                emit(new Dictionary<string, object> { { "type", "seat" }, { "agent", agent.Name }, { "branch", seat.Branch } });
                Plan.Copy(places);
                string rules = Path.Combine(places.Data, "seat-rules", pet.Repo + "-rules.txt");
                Directory.CreateDirectory(Path.GetDirectoryName(rules));
                File.WriteAllText(rules, Plan.Rules(pet, seat, agent, places), new UTF8Encoding(false));
                RunAgent(a, agent, seat, rules, text, emit);
                seat.Session = a.Session ?? seat.Session;
                var changed = CommitChanges(pet, seat, agent, text);
                seat.LastAsked = text.Length > 300 ? text.Substring(0, 300) + "…" : text;
                seat.LastSaid = a.Said.ToString(); seat.LastAt = DateTimeOffset.Now.ToString("o"); seat.LastChanged = changed;
                seats.Put(seat);
                if (a.Stopped) emit(Lines.L("problem", "text", "Stopped. Anything already changed is kept on " + seat.Branch + "."));
                else if (a.Problem != null) emit(Lines.L("problem", "text", agent.Name + " stopped with a problem: " + Worktrees.Short(a.Problem)));
                emit(new Dictionary<string, object> { { "type", "done" }, { "branch", seat.Branch }, { "changed", changed }, { "unpushed", Unpushed(seat) } });
                Log.Write(places, "answer", pet.Repo, a.Problem, new Dictionary<string, object> { { "agent", agent.Id }, { "branch", seat.Branch }, { "asked", seat.LastAsked }, { "said_letters", a.Said.Length },
                    { "changed", changed }, { "stopped", a.Stopped }, { "seconds", (int)(DateTime.UtcNow - started).TotalSeconds } });
            }
            catch (Exception error)
            {
                emit(Lines.L("problem", "text", "The pet chat helper hit a problem: " + error.Message));
                Log.Write(places, "answer-failed", repo, error.Message);
            }
            finally { lock (turnGate) current = null; }
        }

        void RunAgent(Answer a, Agent agent, Seat seat, string rules, string text, Action<Dictionary<string, object>> emit)
        {
            string args, input = text;
            bool claude = agent.Id == "claude-code";
            if (claude)
            {
                args = "-p --restricted --strict-mcp-config --tools Read,Glob,Grep,Edit,Write --permission-mode acceptEdits --max-turns 40 --output-format stream-json --verbose --include-partial-messages" +
                    " --add-dir " + Git.Q(places.Plan) + " --append-system-prompt-file " + Git.Q(rules) + (seat.Session != null ? " --resume " + seat.Session : "");
            }
            else
            {
                // Codex has no file for added instructions in exec, so the rules lead the first message of a conversation.
                // Her config's plugins and MCP servers (computer use, the browser) stay out; her model choice comes along.
                string common = "--json --skip-git-repo-check --ignore-user-config -c sandbox_mode=\"workspace-write\" -c approval_policy=\"never\"" + CodexChoices();
                args = seat.Session != null ? "exec resume " + seat.Session + " " + common + " -" : "exec " + common + " -";
                if (seat.Session == null) input = File.ReadAllText(rules) + "\nAstra's message:\n" + text;
            }
            var psi = Run.Start(agent.Exe, args, seat.Folder);
            var errors = new StringBuilder();
            using (var p = new Process { StartInfo = psi })
            {
                p.ErrorDataReceived += delegate (object s, DataReceivedEventArgs e) { if (e.Data != null && errors.Length < 8000) errors.AppendLine(e.Data); };
                p.Start();
                a.Proc = p;
                p.BeginErrorReadLine();
                Run.WriteInput(p, input);
                var reader = new Thread(delegate ()
                {
                    string line;
                    try { while ((line = p.StandardOutput.ReadLine()) != null) { if (claude) Lines.Claude(line, a, emit); else Lines.Codex(line, a, emit); } }
                    catch (Exception) { }
                }) { IsBackground = true };
                reader.Start();
                if (!p.WaitForExit(MaxMinutes * 60 * 1000)) { a.Problem = "it took longer than " + MaxMinutes + " minutes, so the helper stopped it."; Run.Kill(p); }
                reader.Join(10000);
                p.WaitForExit();
                if (!a.Stopped && a.Problem == null && p.ExitCode != 0)
                {
                    string err = errors.ToString().Trim();
                    // A resumed conversation the agent no longer has starts over once, with the rules again.
                    if (seat.Session != null && a.Said.Length == 0 && Regex.IsMatch(err, "(no conversation|not found|session)", RegexOptions.IgnoreCase))
                    { seat.Session = null; a.Session = null; a.Proc = null; RunAgent(a, agent, seat, rules, text, emit); return; }
                    a.Problem = err.Length > 0 ? err : "it ended with code " + p.ExitCode + ".";
                }
            }
        }

        // From Codex's config.toml: the model, its reasoning effort and the Windows sandbox kind, as plain words only.
        public static string CodexChoices(string configText = null)
        {
            if (configText == null)
            {
                string home = Environment.GetEnvironmentVariable("CODEX_HOME") ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".codex");
                try { configText = File.ReadAllText(Path.Combine(home, "config.toml")); } catch (Exception) { return ""; }
            }
            var plain = new Regex(@"^[A-Za-z0-9._-]{1,64}$");
            var found = new Dictionary<string, string>();
            string section = "";
            foreach (string raw in configText.Split('\n'))
            {
                string line = raw.Trim();
                var head = Regex.Match(line, @"^\[([^\]]+)\]$");
                if (head.Success) { section = head.Groups[1].Value.Trim(); continue; }
                var kv = Regex.Match(line, "^([a-z_]+)\\s*=\\s*\"([^\"]*)\"\\s*(#.*)?$");
                if (!kv.Success || !plain.IsMatch(kv.Groups[2].Value)) continue;
                string key = (section.Length > 0 ? section + "." : "") + kv.Groups[1].Value;
                if (key == "model" || key == "model_reasoning_effort" || key == "windows.sandbox") found[key] = kv.Groups[2].Value;
            }
            var s = new StringBuilder();
            string v;
            if (found.TryGetValue("model", out v)) s.Append(" -m " + v);
            if (found.TryGetValue("model_reasoning_effort", out v)) s.Append(" -c model_reasoning_effort=\"" + v + "\"");
            if (found.TryGetValue("windows.sandbox", out v)) s.Append(" -c windows.sandbox=\"" + v + "\"");
            return s.ToString();
        }

        // The helper commits what the agent changed, on the chat's branch, so every answer can be looked at and undone.
        List<string> CommitChanges(PetInfo pet, Seat seat, Agent agent, string asked)
        {
            var status = Git.In(places, seat.Folder, "status --porcelain");
            if (status.Code != 0 || status.Output.Trim().Length == 0) return new List<string>();
            var files = status.Output.Split('\n').Select(l => l.TrimEnd('\r')).Where(l => l.Length > 3).Select(l => l.Substring(3).Trim('"')).ToList();
            Git.In(places, seat.Folder, "add -A");
            string summary = Regex.Replace(asked, @"\s+", " ");
            if (summary.Length > 60) summary = summary.Substring(0, 60).TrimEnd() + "…";
            string message = Path.Combine(places.Data, "seat-rules", pet.Repo + "-commit.txt");
            File.WriteAllText(message, pet.Pet + "'s chat: " + summary + "\n\nChanged by " + agent.Name + " in " + pet.Pet + "'s chat (the pet chat helper, " + Program.Tool + "), supervised.\nAstra asked: " + (asked.Length > 500 ? asked.Substring(0, 500) + "…" : asked) + "\n", new UTF8Encoding(false));
            var commit = Git.In(places, seat.Folder, "commit --quiet --no-verify -F " + Git.Q(message));
            return commit.Code == 0 ? files : new List<string>();
        }

        Dictionary<string, object> StopAnswer(string repo)
        {
            var a = current;
            if (a == null || a.Repo != repo || a.Proc == null) return new Dictionary<string, object> { { "ok", true }, { "said", "Nothing is running." } };
            a.Stopped = true; Run.Kill(a.Proc);
            Log.Write(places, "stop", repo, "stopped from the page");
            return new Dictionary<string, object> { { "ok", true }, { "said", "Stopped." } };
        }

        Dictionary<string, object> Forget(string repo)
        {
            var seat = seats.Of(repo ?? "");
            if (seat != null) { seat.Session = null; seat.LastAsked = seat.LastSaid = seat.LastAt = null; seat.LastChanged = new List<string>(); seats.Put(seat); }
            return new Dictionary<string, object> { { "ok", true }, { "said", "Starting over. The changes so far stay on the branch." } };
        }

        // A push is a bigger change, so the helper asks Astra itself, in a Windows box a page cannot click.
        Dictionary<string, object> Push(string repo)
        {
            string why;
            var pet = Registry.Find(places, repo, out why);
            var seat = pet == null ? null : seats.Of(pet.Repo);
            if (seat == null || seat.Folder == null || !Directory.Exists(seat.Folder)) return Error(why ?? "There is nothing to push yet.");
            if (current != null && current.Repo == repo) return Error("Wait until I finish answering.");
            if (!Git.Branch.IsMatch(seat.Branch ?? "")) return Error("That is not a pet chat branch, so it is not pushed.");
            int n = Unpushed(seat);
            if (n == 0) return Error("Nothing new to push on " + seat.Branch + ".");
            var files = Git.In(places, seat.Folder, "diff --stat " + seat.Base + "...HEAD");
            string question = "Push " + n + " change" + (n == 1 ? "" : "s") + " from " + pet.Pet + "'s chat to GitHub?\n\nRepo: " + pet.Repo + "\nBranch: " + seat.Branch + " (not main)\n\n" + Worktrees.Short(files.Output) +
                "\n\nYou then look at it as a pull request on GitHub; nothing is merged.";
            if (!Confirm(question)) { Log.Write(places, "push-declined", pet.Repo, seat.Branch); return Error("Not pushed: you said no."); }
            var push = Git.In(places, seat.Folder, "push --quiet -u origin " + seat.Branch, 180000);
            Log.Write(places, push.Code == 0 ? "pushed" : "push-failed", pet.Repo, seat.Branch, new Dictionary<string, object> { { "error", push.Code == 0 ? null : Worktrees.Short(push.Error) } });
            if (push.Code != 0) return Error("git could not push: " + Worktrees.Short(push.Error));
            var d = new Dictionary<string, object> { { "ok", true }, { "said", "Pushed " + seat.Branch + "." }, { "branch", seat.Branch } };
            string compare = CompareUrl(Git.In(places, seat.Folder, "remote get-url origin").Output.Trim(), seat.Base, seat.Branch);
            if (compare != null) d["url"] = compare;
            return d;
        }

        public static string CompareUrl(string remote, string baseRef, string branch)
        {
            var m = Regex.Match(remote ?? "", @"github\.com[:/]([A-Za-z0-9-]+)/([A-Za-z0-9._-]+?)(\.git)?$");
            if (!m.Success) return null;
            string baseName = (baseRef ?? "origin/main").Replace("origin/", "");
            return "https://github.com/" + m.Groups[1].Value + "/" + m.Groups[2].Value + "/compare/" + baseName + "..." + branch + "?expand=1";
        }

        bool Confirm(string question)
        {
            if (testConfirm != null) return testConfirm == "yes";
            bool yes = false;
            var t = new Thread(delegate () { yes = MessageBox.Show(question, "Pet chat: push?", MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.Button2, MessageBoxOptions.DefaultDesktopOnly) == DialogResult.Yes; });
            t.SetApartmentState(ApartmentState.STA); t.Start(); t.Join();
            return yes;
        }

        static Dictionary<string, object> Error(string said) { return new Dictionary<string, object> { { "ok", false }, { "said", said } }; }

        static void Headers(StringBuilder h, string origin)
        {
            if (origin == null) return;
            h.Append("Access-Control-Allow-Origin: " + origin + "\r\nVary: Origin\r\n");
            h.Append("Access-Control-Allow-Methods: POST\r\nAccess-Control-Allow-Headers: Content-Type\r\nAccess-Control-Allow-Private-Network: true\r\n");
        }

        static void StartStream(NetworkStream stream, string origin)
        {
            var h = new StringBuilder("HTTP/1.1 200 OK\r\nContent-Type: application/x-ndjson; charset=utf-8\r\nCache-Control: no-store\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\n");
            Headers(h, origin);
            h.Append("\r\n");
            byte[] hb = Encoding.ASCII.GetBytes(h.ToString());
            stream.Write(hb, 0, hb.Length);
        }

        static void Reply(NetworkStream stream, int status, string origin, Dictionary<string, object> data)
        {
            byte[] body = data == null ? new byte[0] : Encoding.UTF8.GetBytes(Json.Write(data));
            var h = new StringBuilder("HTTP/1.1 " + status + " " + (status == 200 ? "OK" : status == 204 ? "No Content" : "Refused") + "\r\n");
            h.Append("Content-Type: application/json; charset=utf-8\r\nCache-Control: no-store\r\nConnection: close\r\n");
            Headers(h, origin);
            h.Append("Content-Length: " + body.Length + "\r\n\r\n");
            byte[] hb = Encoding.ASCII.GetBytes(h.ToString());
            stream.Write(hb, 0, hb.Length);
            stream.Write(body, 0, body.Length);
        }
    }

    // --self-test: the parts that need no agent and no network. The hub's test (test/pet-chat-helper-test-20261103.mjs)
    // also runs the whole helper against stand-in agents.
    static class SelfTest
    {
        static void Check(bool ok, string what) { if (!ok) throw new Exception(what); }
        public static int Run()
        {
            try
            {
                // The ports are joined on here, so no local address is written out in the hub's public files (public-safety).
                string port = ":" + 8793;
                foreach (string o in new[] { null, "", "null", "http://127.0.0.1" + port, "http://localhost", "http://[::1]" + port }) Check(Server.OriginOk(o), "A page from this PC must be let in: " + o);
                foreach (string o in new[] { "https://example.com", "http://127.0.0.1.example.com", "http://192.168.1.5" + port, "file://", "http://localhost.evil" + port }) Check(!Server.OriginOk(o), "A web site must be refused: " + o);
                Check(Server.SameCode("abc", "abc") && !Server.SameCode("abc", "abd") && !Server.SameCode("", "") && !Server.SameCode(null, "a"), "The code check is wrong.");
                foreach (string r in new[] { "../hub", "a b", "C:\\x", "", "x;y", "UPPER" }) Check(!Registry.RepoName.IsMatch(r), "A pet name was let through: " + r);
                Check(Registry.RepoName.IsMatch("api-fairy"), "A pet name was refused.");
                Check(!Program.Tool.Contains("127.0.0.1"), "No address in the tool label.");
                foreach (string n in new[] { "CLAUDECODE", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY", "anthropic_base_url", "OPENAI_API_KEY" }) Check(!AstrasPetOs.PetChat.Run.Inherited(n), "A seat must not inherit " + n);
                foreach (string n in new[] { "PATH", "USERPROFILE", "CODEX_HOME", "APPDATA" }) Check(AstrasPetOs.PetChat.Run.Inherited(n), "A seat needs " + n);
                Check(Git.Branch.IsMatch("claude/pet-chat-api-fairy-20261103") && Git.Branch.IsMatch("codex/pet-chat-api-fairy-20261103-2"), "A chat branch was refused.");
                Check(!Git.Branch.IsMatch("main") && !Git.Branch.IsMatch("claude/other-20261103"), "Only chat branches may be pushed.");
                Check(Server.CompareUrl("https://github.com/findastra/api-fairy.git", "origin/main", "claude/pet-chat-api-fairy-20261103") == "https://github.com/findastra/api-fairy/compare/main...claude/pet-chat-api-fairy-20261103?expand=1", "The compare link is wrong.");
                Check(Server.CompareUrl("git@github.com:findastra/x.git", "origin/master", "b") == "https://github.com/findastra/x/compare/master...b?expand=1", "The compare link from an SSH remote is wrong.");
                Check(Server.CompareUrl("https://gitlab.com/a/b", "origin/main", "b") == null, "Only GitHub gets a compare link.");

                var said = new List<string>(); var doing = new List<string>();
                Action<Dictionary<string, object>> emit = d => { if (Json.Str(d, "type") == "say") said.Add(Json.Str(d, "text")); if (Json.Str(d, "type") == "doing") doing.Add(Json.Str(d, "text")); };
                var a = new Answer();
                foreach (string line in new[] {
                    "{\"type\":\"system\",\"subtype\":\"init\",\"session_id\":\"s-1\"}",
                    "{\"type\":\"stream_event\",\"event\":{\"type\":\"content_block_start\",\"content_block\":{\"type\":\"text\"}}}",
                    "{\"type\":\"stream_event\",\"event\":{\"type\":\"content_block_delta\",\"delta\":{\"type\":\"text_delta\",\"text\":\"Hello\"}}}",
                    "{\"type\":\"assistant\",\"message\":{\"content\":[{\"type\":\"tool_use\",\"name\":\"Edit\",\"input\":{\"file_path\":\"C:\\\\x\\\\README.md\"}}]}}",
                    "{\"type\":\"stream_event\",\"event\":{\"type\":\"content_block_start\",\"content_block\":{\"type\":\"text\"}}}",
                    "{\"type\":\"stream_event\",\"event\":{\"type\":\"content_block_delta\",\"delta\":{\"type\":\"text_delta\",\"text\":\"Done.\"}}}",
                    "not json",
                    "{\"type\":\"result\",\"subtype\":\"success\",\"is_error\":false,\"result\":\"Hello\\n\\nDone.\",\"session_id\":\"s-1\"}" }) Lines.Claude(line, a, emit);
                Check(a.Session == "s-1" && a.Said.ToString() == "Hello\n\nDone." && a.Problem == null, "Claude Code's words were read wrong: " + a.Said);
                Check(doing.Count == 1 && doing[0] == "Changing README.md", "Claude Code's tool use was read wrong.");
                var b = new Answer(); said.Clear(); doing.Clear();
                foreach (string line in new[] {
                    "{\"type\":\"thread.started\",\"thread_id\":\"t-9\"}",
                    "{\"type\":\"item.started\",\"item\":{\"type\":\"command_execution\",\"command\":\"git status\"}}",
                    "{\"type\":\"item.completed\",\"item\":{\"type\":\"file_change\",\"changes\":[{\"path\":\"C:\\\\x\\\\pet.json\",\"kind\":\"update\"}]}}",
                    "{\"type\":\"item.completed\",\"item\":{\"type\":\"agent_message\",\"text\":\"I fixed it.\"}}",
                    "{\"type\":\"turn.completed\",\"usage\":{}}" }) Lines.Codex(line, b, emit);
                Check(b.Session == "t-9" && b.Said.ToString() == "I fixed it." && doing.Count == 2 && doing[1] == "Changing pet.json", "Codex's events were read wrong.");
                var c = new Answer();
                Lines.Claude("{\"type\":\"result\",\"subtype\":\"error_max_turns\",\"is_error\":true}", c, emit);
                Check(c.Problem == "error_max_turns", "A problem from Claude Code must be kept.");

                Check(Server.CodexChoices("model = \"gpt-x\"\nmodel_reasoning_effort = \"high\" # mine\n[windows]\nsandbox = \"elevated\"\n[mcp_servers.x]\nmodel = \"other\"\n") == " -m gpt-x -c model_reasoning_effort=\"high\" -c windows.sandbox=\"elevated\"", "Codex's model, effort and sandbox were read wrong.");
                Check(Server.CodexChoices("model = \"x\\\" --dangerously-bypass-approvals-and-sandbox\"\n") == "", "Only plain words may come from Codex's config.");
                var places = new Places { Hub = "C:\\farm\\astras-pet-os", Pets = "C:\\farm", Data = "C:\\farm-data\\pet-chat", Menu = "C:\\menu" };
                var rules = Plan.Rules(new PetInfo { Repo = "api-fairy", Pet = "API Fairy", Program = "API Fairy Ring" }, new Seat { Branch = "claude/pet-chat-api-fairy-20261103", Base = "origin/main" }, new Agent { Id = "claude-code", Name = "Claude Code" }, places);
                foreach (string must in new[] { "API Fairy", "API Fairy Ring", "claude/pet-chat-api-fairy-20261103", "Read the plan", "ASTRAS_PET_OS.md", "stop and ask", "Push", "main", "API Fairy (skills/key-request)" }) Check(rules.Contains(must), "The seat's rules must say: " + must);
                Console.WriteLine("PASS: origins, the code, pet names, inherited variables, chat branches, compare links, Claude Code's and Codex's lines, the seat's rules.");
                return 0;
            }
            catch (Exception e) { Console.WriteLine("FAIL: " + e.Message); return 1; }
        }
    }
}
