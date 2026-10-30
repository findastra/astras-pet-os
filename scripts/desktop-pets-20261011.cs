// Astra's desktop pets. OpenAI Codex (GPT-6), 2026-10-08; free-roaming redesign by Claude Opus 5.5, 2026-10-09.
// The star shows or hides every pet at once; "Show on Computer Screen" in the Farmer's menu ticks each pet on or off.
// Each pet roams the screen in its own compact window. No hooks, global input polling, or desktop-sized windows.
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;

// Windows names a sign-in program by its file description, not its file name (Astra, 2026-10-23: the Startup apps list
// said "desktop-pets-20261008"; it "should be 'Startup Star' with native star logo"). The logo is built in by
// build-desktop-pets-20261011.ps1 from art/app-icons/startup-star/, drawn by --write-star-icon.
[assembly: AssemblyTitle("Startup Star")]
[assembly: AssemblyProduct("Astra's PetOS")]
[assembly: AssemblyCompany("Astra")]

namespace AstraDesktopPets {
  internal static class PetFiles {
    internal const string RunName = "findastra-desktop-pets";
    internal const string Identity = "Local\\FindastraDesktopPets20261008";
    internal const string SettingsKey = "Software\\Findastra\\DesktopPets";
    internal static readonly JavaScriptSerializer Json = new JavaScriptSerializer { MaxJsonLength = 4194304 };
    internal static string Root;
    internal static string StateFile { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "astras-pet-os", "desktop-pets-status-20261008.json"); } }
    internal static string TestStateFile { get { return Path.Combine(Path.GetDirectoryName(StateFile),"desktop-pets-test-status-20261008.json"); } }
    // The draft list lives in this hub, next to the pictures (Flash Audit A58, one art source), so every star reads the same
    // list: a program started inside the Claude or Codex app sees that app's private copy of %LOCALAPPDATA% (2026-10-18).
    // ASTRAS_PET_DRAFTS points at another list, for previews and tests. The old local list is read only while the hub has none.
    internal const string DraftsList="desktop-art/desktop-drafts-20261018.json";
    internal static string DraftsFile { get {
      string other=Environment.GetEnvironmentVariable("ASTRAS_PET_DRAFTS");if(!String.IsNullOrWhiteSpace(other))return other;
      string hub=SafePath(DraftsList);return File.Exists(hub)?hub:Path.Combine(Path.GetDirectoryName(StateFile),"desktop-drafts-20261011.json"); } }
    internal static string Exe { get { return Path.Combine(Root,"bin","desktop-pets-20261008.exe"); } }
    internal static string StartupCommand { get { return "\"" + Exe + "\" \"" + Root + "\" --startup"; } }
    internal static string BugExe { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),"ChatGPT","Voicemeeter Bug","voicemeeter-bug-20261008.exe"); } }
    internal static Dictionary<string,object> Read(string relative) { return Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(SafePath(relative))); }
    internal static string SafePath(string relative) {
      if(String.IsNullOrWhiteSpace(relative)||Path.IsPathRooted(relative))throw new InvalidDataException("Expected a relative pet asset path.");
      string root=PicturesRoot!=null&&IsPicture(relative)?PicturesRoot:Root;
      string full=Path.GetFullPath(Path.Combine(root,relative.Replace('/',Path.DirectorySeparatorChar)));
      if(!full.StartsWith(root+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase))throw new InvalidDataException("Pet asset is outside its app folder.");
      return full;
    }
    // The pictures-only copy (Astra, 2026-10-24, all recommended; docs/one-art-source-20261017.md, "Addresses that never
    // change"). Startup Star's live sync keeps Documents\Astra's PetOS Data\pictures\astras-pet-os exactly like GitHub and
    // says in pictures-copy-status-20261024.json when this hub folder is held back (another branch, uncommitted changes or
    // unpushed work). Only then do the pictures, pets.json and the draft list come from the copy, and only while the sync
    // has checked in the last 10 minutes; otherwise everything comes from this folder, as before.
    internal static string PicturesRoot;
    internal static bool IsPicture(string relative) { string r=relative.Replace('\\','/');return r=="pets.json"||r.StartsWith("art/",StringComparison.OrdinalIgnoreCase)||r.StartsWith("desktop-art/",StringComparison.OrdinalIgnoreCase); }
    internal static string PicturesStatusFile { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),"Astra's PetOS Data","pictures","pictures-copy-status-20261024.json"); } }
    internal static string ChoosePicturesRoot(string statusFile,DateTime nowUtc) {
      try {
        if(!File.Exists(statusFile))return null;
        var status=Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(statusFile));object held,at;DateTime when;
        if(!status.TryGetValue("hub_held_back",out held)||!(held is bool)||!(bool)held)return null;
        if(!status.TryGetValue("synced_utc",out at)||!(at is string)||!DateTime.TryParse((string)at,CultureInfo.InvariantCulture,DateTimeStyles.AdjustToUniversal|DateTimeStyles.AssumeUniversal,out when))return null;
        if(nowUtc-when>TimeSpan.FromMinutes(10)||when-nowUtc>TimeSpan.FromMinutes(10))return null;
        string copy=Path.Combine(Path.GetDirectoryName(statusFile),"astras-pet-os");
        return File.Exists(Path.Combine(copy,"pets.json"))&&Directory.Exists(Path.Combine(copy,"art"))?Path.GetFullPath(copy).TrimEnd(Path.DirectorySeparatorChar):null;
      } catch { return null; }
    }
    // A draft's picture path is relative to this hub folder. Only an entry marked "private": true reads elsewhere: art that
    // may not be public (Claude Bot's exact BSOD copy; Astra, 2026-10-17) is read from its own repo folder next to the hub,
    // named by "repo" (on Astra's PC Claude Bot's sits one level down, in claude-bot-draft-art-20261011), or, in an old
    // local list, from a full path.
    internal static string DraftPath(Dictionary<string,object> entry,string path) {
      object flag;bool own=entry.TryGetValue("private",out flag)&&flag is bool&&(bool)flag;
      if(!own)return SafePath(path);
      if(Path.IsPathRooted(path))return Path.GetFullPath(path);
      string repo=Text(entry,"repo");
      if(!System.Text.RegularExpressions.Regex.IsMatch(repo,"^[a-z0-9]+(-[a-z0-9]+)*$"))throw new InvalidDataException("A private draft needs its repo name.");
      string parent=Path.GetDirectoryName(Root);
      foreach(string folder in new[]{Path.Combine(parent,repo),Path.Combine(parent,repo,repo+"-draft-art-20261011")}) {
        string full=Path.GetFullPath(Path.Combine(folder,path.Replace('/',Path.DirectorySeparatorChar)));
        if(!full.StartsWith(folder+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase))throw new InvalidDataException("Private draft art is outside its repo folder.");
        if(File.Exists(full))return full;
      }
      throw new FileNotFoundException("Private draft art is not in the "+repo+" folder next to the hub: "+path);
    }
    internal static string Text(Dictionary<string,object> obj,string key,string fallback="") { object value; return obj.TryGetValue(key,out value)&&value!=null?Convert.ToString(value,CultureInfo.InvariantCulture):fallback; }
    internal static bool StartupEnabled() { using(var key=Registry.CurrentUser.OpenSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run"))return key!=null&&String.Equals(Convert.ToString(key.GetValue(RunName)),StartupCommand,StringComparison.Ordinal); }
    internal static void Startup(bool enabled) { using(var key=Registry.CurrentUser.CreateSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run")) { if(enabled)key.SetValue(RunName,StartupCommand,RegistryValueKind.String);else if(String.Equals(Convert.ToString(key.GetValue(RunName)),StartupCommand,StringComparison.Ordinal))key.DeleteValue(RunName,false); } }
    internal static bool PetsOutSetting() { using(var key=Registry.CurrentUser.OpenSubKey(SettingsKey)) { object value=key==null?null:key.GetValue("PetsOut");return !(value is int)||(int)value!=0; } }
    // The pets unticked under "Show on Computer Screen" (Astra, 2026-10-24), by id, so they stay off after a restart.
    internal static HashSet<string> HiddenPetsSetting() { using(var key=Registry.CurrentUser.OpenSubKey(SettingsKey)) { string value=key==null?null:key.GetValue("HiddenPets") as string;return new HashSet<string>(String.IsNullOrEmpty(value)?new string[0]:value.Split(new[]{','},StringSplitOptions.RemoveEmptyEntries),StringComparer.Ordinal); } }
    internal static void SaveHiddenPets(IEnumerable<string> ids) { var sorted=new List<string>(ids);sorted.Sort(StringComparer.Ordinal);using(var key=Registry.CurrentUser.CreateSubKey(SettingsKey))key.SetValue("HiddenPets",String.Join(",",sorted.ToArray()),RegistryValueKind.String); }
    internal static bool Signal(string action,string suffix="") { try { using(var handle=EventWaitHandle.OpenExisting(Identity+suffix+"-"+action))handle.Set();return true; } catch(WaitHandleCannotBeOpenedException) { return false; } }
    internal static void WriteStatus(object value,bool test=false) { Directory.CreateDirectory(Path.GetDirectoryName(StateFile));File.WriteAllText(test?TestStateFile:StateFile,Json.Serialize(value)); }
    internal static void Open(string relative) { string file=SafePath(relative);if(File.Exists(file))Process.Start(new ProcessStartInfo(file) { UseShellExecute=true }); }
    internal static string DamselStart { get { return Path.Combine(Path.GetDirectoryName(Root),"discord-tower","open-discord-damsel-20261030.cmd"); } }
    internal static ProcessStartInfo DamselStartInfo() {
      return new ProcessStartInfo(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.System),"cmd.exe"),"/d /c \"\""+DamselStart+"\"\"") {
        UseShellExecute=false,CreateNoWindow=true,WindowStyle=ProcessWindowStyle.Hidden,WorkingDirectory=Path.GetDirectoryName(DamselStart)
      };
    }
    internal static void StartBug(string argument) { if(!File.Exists(BugExe))return;Process.Start(new ProcessStartInfo(BugExe,argument) { UseShellExecute=false,WindowStyle=argument=="--status"?ProcessWindowStyle.Normal:ProcessWindowStyle.Hidden,WorkingDirectory=Path.GetDirectoryName(BugExe) }); }
  }

  internal sealed class PetSprite : IDisposable {
    internal string Id,Name,Role,Interface,Kind;
    internal string ThreeClicks; // the tool bound to three clicks (`clicks` in pets.json), or null
    internal Bitmap Idle,Blink;
    internal bool DesktopArt;
    Bitmap idleInk,blinkInk,idleBands,blinkBands;
    // A pet that runs in the background shows its alarmed face while its program says it is alarmed (Astra, 2026-10-21:
    // "Log Lynx turns alarmed; nothing pops up"). Only those pets load the frame.
    internal string Repo;
    internal bool Alarmed;
    Bitmap alarmed,alarmedInk;
    internal bool HasAlarmed { get { return alarmed!=null; } }
    Bitmap Frame(bool blink) { return Alarmed&&alarmed!=null?alarmed:blink?Blink:Idle; }
    internal bool Rainbow { get { return Id=="rgbee"||Id=="deck-duck"; } }
    internal bool Layered { get { return Id=="ghost-protocol"||Id=="goldfish"||Id=="api-fairy"||Id=="astra-wisp"||Rainbow||Id=="wifi-butterfly"||Id=="mesh-moth"||Id=="vscode-angel"; } }
    internal string FuzzStyle;
    Dictionary<string,object> draftEntry;
    internal Rectangle Crop;
    internal RectangleF Hit;
    internal static PetSprite Load(Dictionary<string,object> entry,Dictionary<string,object> framesIndex) {
      var pet=new PetSprite { Id=PetFiles.Text(entry,"art"),Name=PetFiles.Text(entry,"pet"),Role=PetFiles.Text(entry,"role"),Interface=PetFiles.Text(entry,"interface_url"),Kind=PetFiles.Text(entry,"kind") };
      object clicks,three;if(entry.TryGetValue("clicks",out clicks)&&clicks is Dictionary<string,object>&&((Dictionary<string,object>)clicks).TryGetValue("3",out three)&&three is Dictionary<string,object>)pet.ThreeClicks=PetFiles.Text((Dictionary<string,object>)three,"tool",null);
      object raw;if(!framesIndex.TryGetValue(pet.Id,out raw))throw new InvalidDataException("No frames for "+pet.Name);
      var paths=(Dictionary<string,object>)((Dictionary<string,object>)raw)["frames"];
      // The drawing without its mood sticker (build-frames.mjs PLAIN, 2026-10-24): every mood carries one since hub
      // #237, and a sticker counted as the pet's height, shrank it and lifted the girls' tops out of their shared crop.
      object plain;var still=((Dictionary<string,object>)raw).TryGetValue("plain",out plain)&&plain is Dictionary<string,object>?(Dictionary<string,object>)plain:paths;
      string idle=PetFiles.SafePath(PetFiles.Text(still,"idle",PetFiles.Text(paths,"idle"))),blink=PetFiles.SafePath(PetFiles.Text(still,"blink",PetFiles.Text(paths,"blink")));
      if(!File.Exists(idle)||!File.Exists(blink)){idle=PetFiles.SafePath(PetFiles.Text(paths,"idle"));blink=PetFiles.SafePath(PetFiles.Text(paths,"blink"));}
      // Desktop-only drafts: the shared registry and website art keep their own assets.
      if(pet.Id=="health-hummy"||pet.Id=="farmer"||pet.Id=="discord-damsel"||pet.Id=="drum-dog"||pet.Id=="mommys-mommies"||pet.Id=="finance-finch"||pet.Id=="python-panther"||pet.Id=="paper-girl"||pet.Id=="chip"||pet.Id=="file-master"||pet.Id=="astra-wisp"||pet.Id=="project-parrot"||pet.Id=="portfolio-puffer"||pet.Id=="vscode-angel"||pet.Id=="voicemeeter-bug") {
        string localIdle=PetFiles.SafePath("desktop-art/"+pet.Id+"/idle-20261011.png"),localBlink=PetFiles.SafePath("desktop-art/"+pet.Id+"/blink-20261011.png");
        if(File.Exists(localIdle)!=File.Exists(localBlink))throw new InvalidDataException("Incomplete desktop artwork for "+pet.Name);
        if(File.Exists(localIdle)){idle=localIdle;blink=localBlink;pet.DesktopArt=true;}
      }
      pet.Idle=Detached(idle);pet.Blink=Detached(blink);
      pet.Repo=PetFiles.Text(entry,"repo",null);
      if(BackgroundPets.Watches(pet.Repo)&&paths.ContainsKey("alarmed")) { string sharp=PetFiles.SafePath(PetFiles.Text(paths,"alarmed"));if(File.Exists(sharp))pet.alarmed=Detached(sharp); }
      if(pet.DesktopArt) { CrispTransparency(pet.Idle);CrispTransparency(pet.Blink); }
      if(pet.Id=="portfolio-puffer") { PinkBelly(pet.Idle);PinkBelly(pet.Blink); }
      pet.Crop=Rectangle.Union(AlphaBounds(pet.Idle),AlphaBounds(pet.Blink));
      if(pet.alarmed!=null) { pet.Crop=Rectangle.Union(pet.Crop,AlphaBounds(pet.alarmed));pet.alarmedInk=BlackMask(pet.alarmed); }
      pet.PrepareEffects();pet.idleInk=BlackMask(pet.Idle);pet.blinkInk=BlackMask(pet.Blink);
      return pet;
    }
    internal static PetSprite LoadDraft(Dictionary<string,object> entry,string style="B") {
      var pet=new PetSprite { Id=PetFiles.Text(entry,"id"),Name=PetFiles.Text(entry,"name")+" (draft)",Role="pet",Interface=PetFiles.Text(entry,"interface"),DesktopArt=true };
      object variants;
      if(pet.Id=="fuzzboi-friend"&&entry.TryGetValue("variants",out variants)&&((ArrayList)variants).Count>0) {
        pet.draftEntry=entry;pet.FuzzStyle=style;pet.ThreeClicks="reroll";
        var choices=new List<Dictionary<string,object>>();foreach(Dictionary<string,object> variant in (ArrayList)variants)if(PetFiles.Text(variant,"style","B")==style)choices.Add(variant);
        if(choices.Count==0)throw new InvalidDataException("No original Fuzzboi recipes for style "+style);
        var choice=choices[new Random(Guid.NewGuid().GetHashCode()).Next(choices.Count)];
        pet.Idle=new Bitmap(256,256,PixelFormat.Format32bppArgb);
        using(var canvas=Graphics.FromImage(pet.Idle))foreach(string path in (ArrayList)choice["layers"]){
          using(var layer=Detached(PetFiles.DraftPath(entry,path))) {
            if(Path.GetFileName(path)=="outlineB.png")using(var ink=new ImageAttributes()){
              var black=new ColorMatrix();black.Matrix00=black.Matrix11=black.Matrix22=0;ink.SetColorMatrix(black);
              canvas.DrawImage(layer,new Rectangle(0,0,256,256),0,0,layer.Width,layer.Height,GraphicsUnit.Pixel,ink);
            }else canvas.DrawImage(layer,new Rectangle(0,0,256,256));
          }
        }
        pet.Blink=new Bitmap(pet.Idle);pet.Name+=" "+style+" #"+PetFiles.Text(choice,"code");
      }else {pet.Idle=Detached(PetFiles.DraftPath(entry,PetFiles.Text(entry,"idle")));pet.Blink=Detached(PetFiles.DraftPath(entry,PetFiles.Text(entry,"blink")));}
      CrispTransparency(pet.Idle);CrispTransparency(pet.Blink);
      pet.Crop=Rectangle.Union(AlphaBounds(pet.Idle),AlphaBounds(pet.Blink));
      pet.PrepareEffects();pet.idleInk=BlackMask(pet.Idle);pet.blinkInk=BlackMask(pet.Blink);return pet;
    }
    internal void NextFuzzStyle() {
      if(draftEntry==null)return;
      var next=LoadDraft(draftEntry,FuzzStyle=="B"?"C":FuzzStyle=="C"?"A":"B");
      Dispose();Idle=next.Idle;Blink=next.Blink;idleInk=next.idleInk;blinkInk=next.blinkInk;idleBands=next.idleBands;blinkBands=next.blinkBands;Crop=next.Crop;Name=next.Name;FuzzStyle=next.FuzzStyle;
    }
    void PrepareEffects() {
      idleBands=ApplyEffects(Idle);blinkBands=ApplyEffects(Blink);
    }
    Bitmap ApplyEffects(Bitmap frame) {
      if(!Layered)return null;
      var bands=Rainbow?new Bitmap(frame.Width,frame.Height,PixelFormat.Format32bppArgb):null;
      for(int y=Crop.Top;y<Crop.Bottom;y++)for(int x=Crop.Left;x<Crop.Right;x++) {
        Color c=frame.GetPixel(x,y);if(c.A==0)continue;
        float nx=(x-Crop.Left)/(float)Crop.Width,ny=(y-Crop.Top)/(float)Crop.Height;float opacity=1;
        if(Id=="ghost-protocol")opacity=.38f;
        else if(Id=="goldfish"&&c.R>150&&c.B>60&&c.G<160&&(ny<.27f||ny>.65f||nx<.27f||nx>.73f))opacity=.7f;
        else if(Id=="api-fairy"&&c.B>140&&c.G>100&&c.R>100&&(nx<.32f||nx>.68f))opacity=.65f;
        else if(Id=="astra-wisp"&&(nx<.28f||nx>.72f)&&ny>.18f&&ny<.8f)opacity=.65f;
        else if(Id=="wifi-butterfly"&&(nx<.40f||nx>.60f)&&ny>.18f)opacity=.72f;
        else if(Id=="rgbee"&&(nx<.30f||nx>.70f)&&ny>.18f&&c.B>160&&c.G>140)opacity=.6f;
        else if(Id=="vscode-angel"&&ny>.24f&&ny<.92f&&nx>.24f&&nx<.76f&&c.R>170&&c.G>170&&c.B>170&&Math.Max(c.R,Math.Max(c.G,c.B))-Math.Min(c.R,Math.Min(c.G,c.B))<45)opacity=.6f;
        else if(Id=="mesh-moth"&&(nx<.37f||nx>.63f)&&ny>.18f&&Math.Max(c.R,Math.Max(c.G,c.B))-Math.Min(c.R,Math.Min(c.G,c.B))<40)opacity=.7f;
        if(opacity<1)frame.SetPixel(x,y,Color.FromArgb((int)(c.A*opacity),c.R,c.G,c.B));
        // Only saturated abdomen bands cycle; pale blue/white wings stay unchanged.
        if((Id=="rgbee"&&ny>.47f&&nx>.24f&&nx<.76f&&Math.Max(c.R,Math.Max(c.G,c.B))>180&&Math.Min(c.R,Math.Min(c.G,c.B))<50)||(Id=="deck-duck"&&ny>.5f&&ny<.85f&&nx>.2f&&nx<.8f&&c.R>150&&c.G<90&&c.B<90)) {
          bands.SetPixel(x,y,c);frame.SetPixel(x,y,Color.Transparent);
        }
      }
      return bands;
    }
    // WinForms color-key transparency cannot display partial alpha: it blends with
    // the magenta window background and leaves pink flecks around generated sprites.
    static void CrispTransparency(Bitmap source) {
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) {
        Color c=source.GetPixel(x,y);
        if(c.A<128)source.SetPixel(x,y,Color.Transparent);
        else if(c.A<255)source.SetPixel(x,y,Color.FromArgb(255,c.R,c.G,c.B));
      }
    }
    // Desktop palette swap: only the cyan belly, preserving its pixel geometry and alpha.
    static void PinkBelly(Bitmap source) {
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) {
        Color c=source.GetPixel(x,y);
        if(c.A>0&&c.G>c.R+50&&c.B>c.R+50) {
          float light=Math.Max(c.G,c.B)/255f;
          source.SetPixel(x,y,Color.FromArgb(c.A,(int)(255*light),(int)(190*light),(int)(215*light)));
        }
      }
    }
    static Bitmap BlackMask(Bitmap source) {
      var result=new Bitmap(source.Width,source.Height,PixelFormat.Format32bppArgb);
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) { int alpha=source.GetPixel(x,y).A;if(alpha>0)result.SetPixel(x,y,Color.FromArgb(alpha,0,0,0)); }
      return result;
    }
    internal void Draw(Graphics g,bool blink,RectangleF bounds) {
      var mask=Alarmed&&alarmedInk!=null?alarmedInk:blink?blinkInk:idleInk;
      // Generated desktop sprites already include ink. Do not double their outline.
      // Legacy sprites receive one physical pixel, regardless of display scaling.
      float inkPixel=1;using(var transform=g.Transform)inkPixel=1/Math.Max(1,transform.Elements[0]);
      if(!DesktopArt&&!Layered)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++)if(x!=0||y!=0) {
        var edge=bounds;edge.Offset(x*inkPixel,y*inkPixel);g.DrawImage(mask,edge,Crop,GraphicsUnit.Pixel);
      }
      g.DrawImage(Frame(blink),bounds,Crop,GraphicsUnit.Pixel);
      if(Rainbow) {
        using(var colors=new ImageAttributes()) {
          colors.SetColorMatrix(RgbCycle(Environment.TickCount & Int32.MaxValue));
          g.DrawImage(blink?blinkBands:idleBands,new PointF[]{new PointF(bounds.Left,bounds.Top),new PointF(bounds.Right,bounds.Top),new PointF(bounds.Left,bounds.Bottom)},Crop,GraphicsUnit.Pixel,colors);
        }
      }
    }
    internal static ColorMatrix RgbCycle(long milliseconds) {
      double phase=(milliseconds%6000)/2000.0;int step=(int)phase;float blend=(float)(phase-step);
      var matrix=new float[5][];for(int i=0;i<5;i++)matrix[i]=new float[5];
      for(int channel=0;channel<3;channel++){matrix[channel][(channel+step)%3]=1-blend;matrix[channel][(channel+step+1)%3]=blend;}
      matrix[3][3]=matrix[4][4]=1;return new ColorMatrix(matrix);
    }
    internal bool HasPixel(bool blink,int x,int y) { return Frame(blink).GetPixel(x,y).A>0||(Rainbow&&(blink?blinkBands:idleBands).GetPixel(x,y).A>0); }
    internal void ValidateEffects() {
      if(!Layered)return;int translucent=0,bands=0;
      for(int y=Crop.Top;y<Crop.Bottom;y++)for(int x=Crop.Left;x<Crop.Right;x++) {
        int alpha=Idle.GetPixel(x,y).A;if(alpha>0&&alpha<255)translucent++;
        if(Id=="ghost-protocol"&&alpha>100)throw new Exception("Ghost must remain see-through.");
        if(idleBands!=null&&idleBands.GetPixel(x,y).A>0)bands++;
      }
      if(translucent==0&&Id!="deck-duck")throw new Exception("Missing translucent pixels: "+Id);
      if(Rainbow&&bands==0)throw new Exception("Missing animated rainbow bands: "+Id);
    }
    internal static Bitmap Detached(string path) { using(var original=new Bitmap(path))return new Bitmap(original); }
    internal static Rectangle AlphaBounds(Bitmap bitmap) {
      int x0=bitmap.Width,y0=bitmap.Height,x1=-1,y1=-1;
      for(int y=0;y<bitmap.Height;y++)for(int x=0;x<bitmap.Width;x++)if(bitmap.GetPixel(x,y).A>0) { x0=Math.Min(x0,x);y0=Math.Min(y0,y);x1=Math.Max(x1,x);y1=Math.Max(y1,y); }
      if(x1<x0)throw new InvalidDataException("A pet frame is empty.");return Rectangle.FromLTRB(x0,y0,x1+1,y1+1);
    }
    public void Dispose() { if(Idle!=null)Idle.Dispose();if(Blink!=null)Blink.Dispose();if(idleInk!=null)idleInk.Dispose();if(blinkInk!=null)blinkInk.Dispose();if(idleBands!=null)idleBands.Dispose();if(blinkBands!=null)blinkBands.Dispose();if(alarmed!=null)alarmed.Dispose();if(alarmedInk!=null)alarmedInk.Dispose(); }
  }

  // Uses mouse-down times and Windows' configured interval/rectangle. Nothing is
  // dispatched while another eligible click is held, or before a drag is ruled out.
  internal sealed class PetClicks {
    readonly Action<string,int> action;
    readonly Func<string,int> most;
    readonly int interval;
    readonly Size distance;
    string target,pressed;
    int count;
    Point anchor;
    long due,down;
    bool held;
    // `maxClicks` says how many clicks an actor's gesture can have: 2, or 3 when it has a tool on three clicks.
    internal PetClicks(Action<string,int> callback,int milliseconds,Size rectangle,Func<string,int> maxClicks) { action=callback;most=maxClicks;interval=milliseconds;distance=rectangle; }
    internal bool Pending { get { return held||count>0; } }
    internal bool PendingFor(string id) { return id==target||id==pressed; }
    internal void Press(string id,Point point,long now) {
      // Switching actors cancels the pending gesture, so a click on one pet can never
      // resolve as a double-click on another.
      if(count>0&&id!=target)Cancel();
      else if(count>0&&(now>due||Math.Abs(point.X-anchor.X)>distance.Width/2||Math.Abs(point.Y-anchor.Y)>distance.Height/2))Complete();
      pressed=id;held=true;down=now;if(count==0)anchor=point;
    }
    internal void Release(string id,long now,bool dragged) {
      if(!held)return;held=false;
      if(dragged||String.IsNullOrEmpty(id)||id!=pressed){Cancel();return;}
      target=id;pressed=null;count++;due=down+interval;
      if(count>=most(id))Complete();else Advance(now);
    }
    internal void Advance(long now) { if(!held&&count>0&&now>due)Complete(); }
    internal void Cancel() { target=pressed=null;count=0;held=false; }
    void Complete() { string id=target;int number=count;Cancel();if(number>0)action(id,number); }
  }

  // How one pet wanders: a heading for a few seconds, now and then a short rest, and a
  // bounce at the edges of the working area. Separate from the window so the self-test
  // can run thousands of steps without showing anything.
  internal sealed class Roamer {
    readonly Random random;
    int dx,dy,heading,rest;
    internal Roamer(Random source) { random=source; }
    internal Point Next(Point at,Size size,Rectangle area,int step) {
      if(rest>0){rest--;return PetsWindow.Clamp(at,size,area);}
      if(heading<=0) {
        heading=random.Next(15,41);
        if(random.Next(6)==0)rest=random.Next(5,16);
        do{dx=random.Next(-2,3);dy=random.Next(-1,2);}while(dx==0&&dy==0);
      }
      heading--;
      var next=new Point(at.X+dx*step,at.Y+dy*step);
      if(next.X<area.Left||next.X+size.Width>area.Right){dx=-dx;next.X=at.X+dx*step;}
      if(next.Y<area.Top||next.Y+size.Height>area.Bottom){dy=-dy;next.Y=at.Y+dy*step;}
      return PetsWindow.Clamp(next,size,area);
    }
  }

  // Paper Girl and File Master travel as one small group. After an owner moves either
  // pet, that pet waits while its companion walks back beside it, then they roam again.
  // Geometry is separate from Forms so bounds, pauses and catch-up can be tested unseen.
  internal sealed class PetPair {
    readonly Roamer walker;
    internal PetPair(Random random) { walker=new Roamer(random); }
    internal static Point Beside(Point leader,Size leaderSize,Point follower,Size followerSize,Rectangle area,int gap) {
      Point[] choices={new Point(leader.X+leaderSize.Width+gap,leader.Y+leaderSize.Height-followerSize.Height),new Point(leader.X-followerSize.Width-gap,leader.Y+leaderSize.Height-followerSize.Height),new Point(leader.X,leader.Y+leaderSize.Height+gap),new Point(leader.X,leader.Y-followerSize.Height-gap)};
      Point best=choices[0];double distance=Double.MaxValue;
      foreach(var choice in choices)if(area.Contains(new Rectangle(choice,followerSize))) { double d=Distance(choice,follower);if(d<distance){best=choice;distance=d;} }
      // A display normally has room for a pair; preserve its bounds even on unusually
      // small working areas where no separate position can physically fit.
      return distance==Double.MaxValue?PetsWindow.Clamp(best,followerSize,area):best;
    }
    internal Point[] Next(Point leader,Size leaderSize,Point follower,Size followerSize,Rectangle area,Rectangle travelArea,int gap,int step,bool paused,bool wander) {
      if(paused)return new[]{leader,follower};
      Point target=Beside(leader,leaderSize,follower,followerSize,area,gap);
      if(follower!=target) {
        int catchUp=Math.Max(step*4,Math.Min(step*30,(int)Math.Ceiling(Distance(follower,target)*.12)));
        return new[]{leader,WalkTo(follower,target,followerSize,new Rectangle(leader,leaderSize),travelArea,catchUp)};
      }
      if(!wander)return new[]{leader,follower};
      Rectangle group=Rectangle.Union(new Rectangle(leader,leaderSize),new Rectangle(follower,followerSize));
      Point next=walker.Next(group.Location,group.Size,area,step);int dx=next.X-group.X,dy=next.Y-group.Y;
      return new[]{new Point(leader.X+dx,leader.Y+dy),new Point(follower.X+dx,follower.Y+dy)};
    }
    internal static double Distance(Point a,Point b) { double x=(double)a.X-b.X,y=(double)a.Y-b.Y;return Math.Sqrt(x*x+y*y); }
    static Point Toward(Point at,Point target,int step) { double distance=Distance(at,target);if(distance<=step)return target;return new Point(at.X+(int)Math.Round((target.X-at.X)*step/distance),at.Y+(int)Math.Round((target.Y-at.Y)*step/distance)); }
    static bool ClearSegment(Point a,Point b,Rectangle obstacle) {
      // Clip a segment against the forbidden top-left positions of the follower.
      double enter=0,leave=1;int[] start={a.X,a.Y},delta={b.X-a.X,b.Y-a.Y},low={obstacle.Left,obstacle.Top},high={obstacle.Right,obstacle.Bottom};
      for(int axis=0;axis<2;axis++) { if(delta[axis]==0){if(start[axis]<=low[axis]||start[axis]>=high[axis])return true;continue;}double first=(low[axis]-start[axis])/(double)delta[axis],last=(high[axis]-start[axis])/(double)delta[axis];if(first>last){double swap=first;first=last;last=swap;}enter=Math.Max(enter,first);leave=Math.Min(leave,last);if(enter>=leave)return true; }
      return leave<=0||enter>=1;
    }
    static Point WalkTo(Point at,Point target,Size size,Rectangle leader,Rectangle travelArea,int step) {
      // The four outside corners are enough to take the shortest unobstructed route
      // around a rectangular companion. Never cut through it on the way to its side.
      if(new Rectangle(at,size).IntersectsWith(leader))return PetsWindow.Clamp(Toward(at,target,step),size,travelArea);
      Rectangle obstacle=new Rectangle(leader.Left-size.Width,leader.Top-size.Height,leader.Width+size.Width,leader.Height+size.Height);
      var nodes=new List<Point>{at,target};
      foreach(var p in new[]{new Point(obstacle.Left-2,obstacle.Top-2),new Point(obstacle.Right+2,obstacle.Top-2),new Point(obstacle.Left-2,obstacle.Bottom+2),new Point(obstacle.Right+2,obstacle.Bottom+2)})if(travelArea.Contains(new Rectangle(p,size)))nodes.Add(p);
      var distance=new double[nodes.Count];var previous=new int[nodes.Count];var visited=new bool[nodes.Count];for(int i=0;i<nodes.Count;i++){distance[i]=Double.MaxValue;previous[i]=-1;}distance[0]=0;
      for(int run=0;run<nodes.Count;run++) { int from=-1;for(int i=0;i<nodes.Count;i++)if(!visited[i]&&(from<0||distance[i]<distance[from]))from=i;if(from<0||distance[from]==Double.MaxValue)break;visited[from]=true;for(int to=0;to<nodes.Count;to++)if(!visited[to]&&ClearSegment(nodes[from],nodes[to],obstacle)){double candidate=distance[from]+Distance(nodes[from],nodes[to]);if(candidate<distance[to]){distance[to]=candidate;previous[to]=from;}} }
      if(previous[1]<0)return at;int next=1;while(previous[next]>0)next=previous[next];
      Point result=PetsWindow.Clamp(Toward(at,nodes[next],step),size,travelArea);
      return new Rectangle(result,size).IntersectsWith(leader)?at:result;
    }
  }

  // One small input surface per pet. Transparent pixels pass through; there is never a
  // desktop-sized interception window.
  internal sealed class PetWindow : Form {
    readonly PetsWindow host;
    internal readonly PetSprite Pet;
    readonly Roamer roamer;
    readonly float scale;

    internal bool HasSparkles { get { return false; } }
    const int padding=4;
    internal RectangleF Body { get { return new RectangleF(padding,padding,Pet.Hit.Width,Pet.Hit.Height); } }
    internal int SparkleCount { get { return 0; } }

    bool dragging,dragged,hover,blink;
    internal bool InteractionActive { get { return dragging||hover||host.ClickPending(Pet.Id)||(ContextMenuStrip!=null&&ContextMenuStrip.Visible); } }
    readonly System.Windows.Forms.Timer shimmer=new System.Windows.Forms.Timer { Interval=50 };
    Point dragMouse,dragWindow;
    internal PetWindow(PetsWindow owner,PetSprite pet,float dpi,Random random) {
      host=owner;Pet=pet;scale=dpi;roamer=new Roamer(random);
      FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;TopMost=true;AutoScaleMode=AutoScaleMode.None;BackColor=Color.Magenta;TransparencyKey=Color.Magenta;StartPosition=FormStartPosition.Manual;Text=pet.Name+" - desktop pet";
      if(Pet.Layered)TransparencyKey=Color.Empty;
      shimmer.Tick+=delegate{if(Visible)Present();};
      SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.OptimizedDoubleBuffer|ControlStyles.UserPaint,true);
      ClientSize=new Size((int)Math.Ceiling((pet.Hit.Width+padding*2)*scale),(int)Math.Ceiling((pet.Hit.Height+padding*2)*scale));
      MouseEnter+=delegate { hover=true;Cursor=Cursors.Hand; };MouseLeave+=delegate { hover=false; };
      MouseDown+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;host.PetPress(Pet.Id,Cursor.Position); };
      MouseMove+=delegate { if(!dragging)return;Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(PetsWindow.IsDrag(delta)){dragged=true;host.CancelClicks();}if(dragged)Location=PetsWindow.Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea); };
      MouseUp+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;if(dragged)host.PairDragEnded(Pet.Id);host.PetRelease(ClientRectangle.Contains(e.Location)?Pet.Id:null,dragged); };
      var menu=new ContextMenuStrip();menu.Opening+=delegate{host.CancelClicks();};menu.Items.Add("Open "+pet.Name,null,delegate{host.OpenPet(Pet);});menu.Items.Add("Hide the pets",null,delegate{host.SetPetsOut(false);});
      if(host.IsFarmer(pet))menu.Items.Add(host.ShowOnScreenMenu());
      ContextMenuStrip=menu;
    }
    protected override bool ShowWithoutActivation { get { return true; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;cp.ExStyle|=0x08000080;if(Pet!=null&&Pet.Layered)cp.ExStyle|=0x00080000;return cp; } }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;host.CancelClicks();host.PairDragEnded(Pet.Id);} }
    protected override void OnVisibleChanged(EventArgs e) { base.OnVisibleChanged(e);if(Pet!=null&&Pet.Layered&&Visible)Present();if(Pet!=null&&Pet.Rainbow)shimmer.Enabled=Visible; }
    internal void RefreshSize() { ClientSize=new Size((int)Math.Ceiling((Pet.Hit.Width+padding*2)*scale),(int)Math.Ceiling((Pet.Hit.Height+padding*2)*scale));Text=Pet.Name+" - desktop pet";Location=PetsWindow.Clamp(Location,Size,Screen.FromRectangle(Bounds).WorkingArea);Invalidate(); }
    internal bool HitPet(Point client) {
      float x=client.X/scale,y=client.Y/scale;var frame=blink?Pet.Blink:Pet.Idle;
      // Include the existing one-pixel black outline; sparkles never become input targets.
      for(int oy=-1;oy<=1;oy++)for(int ox=-1;ox<=1;ox++) {
        float px=(x+ox-padding)/Pet.Hit.Width,py=(y+oy-padding)/Pet.Hit.Height;
        if(px>=0&&px<1&&py>=0&&py<1&&Pet.HasPixel(blink,Pet.Crop.X+(int)(px*Pet.Crop.Width),Pet.Crop.Y+(int)(py*Pet.Crop.Height)))return true;
      }
      return false;
    }
    protected override void WndProc(ref Message message) {
      if(message.Msg==0x0084&&!dragging) {
        long packed=message.LParam.ToInt64();var point=PointToClient(new Point((short)(packed&65535),(short)((packed>>16)&65535)));
        if(!HitPet(point)){message.Result=new IntPtr(-1);return;}
      }
      base.WndProc(ref message);
    }
    protected override void OnPaint(PaintEventArgs e) { if(Pet.Layered){Present();return;}base.OnPaint(e);DrawPet(e.Graphics); }
    void DrawPet(Graphics g) { g.ScaleTransform(scale,scale);g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;Pet.Draw(g,blink,Body); }
    [StructLayout(LayoutKind.Sequential,Pack=1)] struct Blend { public byte operation,flags,alpha,format; }
    [DllImport("user32.dll",SetLastError=true)] static extern bool UpdateLayeredWindow(IntPtr window,IntPtr screen,ref Point location,ref Size size,IntPtr source,ref Point origin,int key,ref Blend blend,int flags);
    [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr window);
    [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr window,IntPtr dc);
    [DllImport("gdi32.dll")] static extern IntPtr CreateCompatibleDC(IntPtr dc);
    [DllImport("gdi32.dll")] static extern IntPtr SelectObject(IntPtr dc,IntPtr value);
    [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr value);
    [DllImport("gdi32.dll")] static extern bool DeleteDC(IntPtr dc);
    void Present() {
      if(!Pet.Layered||!Visible||!IsHandleCreated)return;
      using(var bitmap=new Bitmap(Width,Height,PixelFormat.Format32bppArgb)) {
        using(var canvas=Graphics.FromImage(bitmap)){canvas.Clear(Color.Transparent);DrawPet(canvas);}
        IntPtr screen=GetDC(IntPtr.Zero),memory=CreateCompatibleDC(screen),native=bitmap.GetHbitmap(Color.FromArgb(0)),previous=IntPtr.Zero;
        try {
          previous=SelectObject(memory,native);var at=Location;var size=Size;var origin=Point.Empty;var blend=new Blend{alpha=255,format=1};
          if(!UpdateLayeredWindow(Handle,screen,ref at,ref size,memory,ref origin,0,ref blend,2))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
        }finally{if(previous!=IntPtr.Zero)SelectObject(memory,previous);DeleteObject(native);DeleteDC(memory);ReleaseDC(IntPtr.Zero,screen);}
      }
    }
    internal void Step(bool nextBlink) {
      if(!Visible)return;
      if(blink!=nextBlink||Pet.Rainbow){blink=nextBlink;Invalidate();}
      if(!host.LinedUp&&!host.IsPaired(Pet.Id)&&!InteractionActive)Location=roamer.Next(Location,Size,Screen.FromRectangle(Bounds).WorkingArea,Math.Max(1,(int)Math.Round(scale)));
      if(Pet.Layered)Present();
    }
    protected override void Dispose(bool disposing) { if(disposing){shimmer.Dispose();if(ContextMenuStrip!=null)ContextMenuStrip.Dispose();}base.Dispose(disposing); }
  }

  // Pets that run in the background with no tray icon of their own (Astra, 2026-10-21: "these are not supposed to be in
  // the tray. only the Startup Star should ever be in the tray"). Each one's menu is in the star's menu, under its name:
  // its program writes the items to menu-20261021.json in its data folder, each one a command of that program, and the
  // star runs the program with it. Its mood is in mood-20261021.json there (log-den's contracts/background-pet-20261021.cs).
  internal static class BackgroundPets {
    internal sealed class Entry { internal string Repo,Pet,Exe,Folder;internal string[] StartArgs; }
    internal const string MenuFile="menu-20261021.json",MoodFile="mood-20261021.json";
    static readonly string[] Watched={"log-den","packet-river","evidence-locker"};
    // A menu file can only ask for its own program's commands: plain words, never a path, a quote or a command break.
    internal static readonly System.Text.RegularExpressions.Regex SafeArg=new System.Text.RegularExpressions.Regex("^(--[a-z][a-z-]*|[a-z0-9][a-z0-9.:-]*)$");
    internal static string DataRoot=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"astras-pet-os");
    internal static bool Watches(string repo) { return repo!=null&&Array.IndexOf(Watched,repo)>=0; }
    internal static List<Entry> All() {
      var list=new List<Entry>();string parent=Path.GetDirectoryName(PetFiles.Root);
      foreach(var p in new[]{new[]{"log-den","Log Lynx"},new[]{"packet-river","Packet Piranha"},new[]{"evidence-locker","Forensic Ferret"}})
        list.Add(new Entry{Repo=p[0],Pet=p[1],Exe=Path.Combine(parent,p[0],"bin",p[0]+"-20261018.exe"),Folder=Path.Combine(DataRoot,p[0]),StartArgs=new[]{"--startup"}});
      // Kernel Koala's leftover-watch (Astra, 2026-10-21: "monitoring unnecessary applications"); no desktop pet yet.
      list.Add(new Entry{Repo="kernel-grove",Pet="Kernel Koala",Exe=Path.Combine(parent,"kernel-grove","bin","kernel-grove-20261021.exe"),Folder=Path.Combine(DataRoot,"kernel-grove"),StartArgs=new[]{"--startup"}});
      // Inference Iguana's busy-watch (Astra, 2026-10-23: the graphics card watch is hers); no desktop pet yet.
      list.Add(new Entry{Repo="benchmark-rock",Pet="Inference Iguana",Exe=Path.Combine(parent,"benchmark-rock","bin","benchmark-rock-20261023.exe"),Folder=Path.Combine(DataRoot,"benchmark-rock"),StartArgs=new[]{"--startup"}});
      // Voicemeeter Bug (Astra, 2026-10-21, "4. A"): his menu moves here too; the star already hosts him.
      list.Add(new Entry{Repo="voicemeeter-bug",Pet="Voicemeeter Bug",Exe=PetFiles.BugExe,Folder=Path.GetDirectoryName(PetFiles.BugExe)==null?null:Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"findastra","voicemeeter-bug"),StartArgs=new[]{"--hosted"}});
      return list;
    }
    internal static Entry Find(string repo) { return All().Find(e=>e.Repo==repo); }
    // The star starts the crash watchers itself, so Windows' Startup apps list has only Startup Star (Astra, 2026-10-23:
    // log-den, packet-river and evidence-locker "should not be here at all"; they were Startup-folder shortcuts). The Bug is
    // started as before; Kernel Koala's and Inference Iguana's watches start only when Astra asks.
    internal static List<Entry> AtSignIn() { return All().FindAll(e=>Watches(e.Repo)); }
    internal static bool Running(Entry e) { try { return Process.GetProcessesByName(Path.GetFileNameWithoutExtension(e.Exe)).Length>0; }catch(Exception){return false;} }
    static Dictionary<string,object> Read(Entry e,string name,string schema) {
      try {
        string path=Path.Combine(e.Folder,name);if(!File.Exists(path))return null;
        var file=PetFiles.Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(path));
        return file!=null&&PetFiles.Text(file,"schema")==schema?file:null;
      }catch(Exception){return null;}
    }
    // The arguments of one item, or null when any of them is not a plain command word.
    internal static string[] Args(Dictionary<string,object> item) {
      object raw;if(!item.TryGetValue("args",out raw)||!(raw is ArrayList))return null;
      var args=new List<string>();foreach(object a in (ArrayList)raw){string word=a as string;if(word==null||!SafeArg.IsMatch(word))return null;args.Add(word);}
      return args.Count>0?args.ToArray():null;
    }
    internal static void Fill(ToolStripMenuItem parent,Entry e,Action<Entry,string[]> run,bool running) {
      parent.DropDownItems.Clear();
      if(!running) {
        parent.DropDownItems.Add(new ToolStripMenuItem(e.Pet+" is not running") { Enabled=false });
        parent.DropDownItems.Add("Start "+e.Pet,null,delegate { run(e,e.StartArgs); });
      }
      var file=Read(e,MenuFile,"astras-pet-os-menu-v1");object raw;
      if(file==null||!file.TryGetValue("items",out raw)||!(raw is ArrayList)) { if(running)parent.DropDownItems.Add(new ToolStripMenuItem(e.Pet+" has not written its menu yet") { Enabled=false });return; }
      if(!running)parent.DropDownItems.Add(new ToolStripSeparator());
      foreach(object o in (ArrayList)raw) {
        var i=o as Dictionary<string,object>;if(i==null)continue;
        if(i.ContainsKey("separator")) { parent.DropDownItems.Add(new ToolStripSeparator());continue; }
        var item=new ToolStripMenuItem(PetFiles.Text(i,"text"));object check;
        if(i.TryGetValue("checked",out check)&&check is bool) { item.Checked=(bool)check;item.ToolTipText="ON/OFF (kill switch) for this tool"; }
        string[] args=Args(i);
        if(args==null)item.Enabled=false;else item.Click+=delegate { run(e,args); };
        parent.DropDownItems.Add(item);
      }
    }
    // The pet's mood, while its program runs and its mood file is fresh (it writes it every minute).
    internal static string Mood(Entry e) {
      var file=Read(e,MoodFile,"astras-pet-os-mood-v1");if(file==null)return null;
      DateTimeOffset updated;
      if(!DateTimeOffset.TryParse(PetFiles.Text(file,"updated"),CultureInfo.InvariantCulture,DateTimeStyles.None,out updated)||DateTimeOffset.Now-updated>TimeSpan.FromMinutes(15))return null;
      return Running(e)?PetFiles.Text(file,"mood"):null;
    }
  }

  // The star and the Friendly Farmer. The star shows or hides every pet at once; while the
  // pets are out, each one roams the whole screen in its own PetWindow.
  internal sealed class PetsWindow : Form {
    internal const float NormalHeight=58.75f,BugHeight=58.75f,MaxPetWidth=96;
    // Group 3 share Mommy's Mommies' face and body in art pixels (docs/girls-same-size-20261017.md). Halos,
    // horns, wings, the star and the headset make their alpha bounds differ, so instead of each being fitted
    // by its bounds they all use one crop height, measured up from the soles: one scale for all six girls.
    // 202 is Mommy's Mommies' own height, so they are drawn exactly as before.
    internal static readonly string[] SameSize={"mommys-mommies","discord-damsel","api-fairy","astra-wisp","vscode-angel"};
    internal const int SameSizeCrop=202;
    const int LogicalWidth=20,LogicalHeight=20,StarDrop=0;
    readonly List<PetSprite> pets=new List<PetSprite>();
    readonly List<string> draftErrors=new List<string>();
    readonly List<PetWindow> roaming=new List<PetWindow>();
    readonly HashSet<string> hiddenPets=new HashSet<string>(StringComparer.Ordinal);
    internal bool LinedUp;
    readonly System.Windows.Forms.Timer timer=new System.Windows.Forms.Timer { Interval=200 };
    readonly System.Windows.Forms.Timer clickTimer=new System.Windows.Forms.Timer { Interval=20 };
    readonly System.Windows.Forms.Timer repaintTimer=new System.Windows.Forms.Timer { Interval=5000 };
    readonly Stopwatch clickClock=Stopwatch.StartNew();
    readonly PetClicks clicks;
    readonly Random random;
    readonly PetPair pair;
    string pairLeader="file-master";
    bool pairRejoining;
    readonly List<string> testActions=new List<string>();
    readonly object dockGate=new object();
    PetDockTracker tracker;
    Rectangle? dockBounds,queuedDock;
    bool dockQueued,spaceConstrained;
    readonly ToolTip tooltip=new ToolTip { InitialDelay=350,ReshowDelay=100 };
    readonly ContextMenuStrip menu=new ContextMenuStrip();
    readonly List<ToolStripMenuItem> background=new List<ToolStripMenuItem>();
    readonly bool test;
    PetSprite farmer,hover;
    int ticks;
    float scale=1;
    bool petsOut=true,blink,dragged,dragging,started,hoverStar;
    bool launcherVisible=true;
    NotifyIcon tray;
    Icon trayIcon;
    Bitmap starBitmap;
    [DllImport("user32.dll")] static extern int GetSystemMetricsForDpi(int index,uint dpi);
    [DllImport("user32.dll")] static extern bool DestroyIcon(IntPtr handle);
    Point dragMouse,dragWindow;
    Point expandedLocation;
    bool Compact { get { return !petsOut; } }
    internal PetsWindow(bool testMode,int? seed=null) {
      test=testMode;random=seed.HasValue?new Random(seed.Value):new Random();pair=new PetPair(random);
      clicks=new PetClicks(ResolveClicks,SystemInformation.DoubleClickTime,SystemInformation.DoubleClickSize,MostClicks);LoadPets();
      if(!test){petsOut=PetFiles.PetsOutSetting();hiddenPets.UnionWith(PetFiles.HiddenPetsSetting());}
      Text=test?"Astra's desktop pets - UI test":"Astra's desktop pets";
      FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=test;TopMost=true;AutoScaleMode=AutoScaleMode.None;
      BackColor=Color.Magenta;TransparencyKey=Color.Magenta;StartPosition=FormStartPosition.Manual;
      SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.OptimizedDoubleBuffer|ControlStyles.UserPaint,true);
      var toggle=new ToolStripMenuItem("Hide the pets");toggle.Click+=delegate { SetPetsOut(!petsOut); };menu.Items.Add(toggle);
      menu.Items.Add(ShowOnScreenMenu());
      menu.Items.Add("Open Farmer's desk",null,delegate { OpenPet(farmer); });
      menu.Items.Add("Line up on the floor",null,delegate { LineUp(); });
      menu.Items.Add("Let the pets roam",null,delegate { LinedUp=false;ShowPets(); });
      menu.Items.Add("Open the Farmer's desk",null,delegate { if(!test)PetFiles.Open("apps/astras-pet-os-20261008.html"); }); // the Cage page was removed (Astra, 2026-10-18)
      // The pets in the background, each with its own menu (no tray icon of their own since 2026-10-21).
      menu.Items.Add(new ToolStripSeparator());
      foreach(var entry in BackgroundPets.All()) {
        var e=entry;var item=new ToolStripMenuItem(e.Pet) { Tag=e };item.DropDownItems.Add(new ToolStripMenuItem("…") { Enabled=false });
        item.DropDownOpening+=delegate { BackgroundPets.Fill(item,e,RunBackground,test||BackgroundPets.Running(e)); };
        background.Add(item);menu.Items.Add(item);
      }
      menu.Opening+=delegate { foreach(var item in background)item.Visible=test||File.Exists(((BackgroundPets.Entry)item.Tag).Exe); };
      menu.Items.Add(new ToolStripSeparator());
      var startup=new ToolStripMenuItem("Start desktop pets when I sign in") { Checked=PetFiles.StartupEnabled(),CheckOnClick=true };
      startup.Click+=delegate { if(!test)PetFiles.Startup(startup.Checked);WriteStatus(); };menu.Items.Add(startup);
      menu.Items.Add("Quit desktop pets (audio recovery keeps running)",null,delegate { Close(); });
      menu.Opening+=delegate { CancelClicks();toggle.Text=petsOut?"Hide the pets":"Show the pets";startup.Checked=PetFiles.StartupEnabled(); };
      var launcherToggle=new ToolStripMenuItem("Hide desktop star");
      launcherToggle.Click+=delegate { ToggleLauncher(); };menu.Items.Insert(0,launcherToggle);
      menu.Opening+=delegate { launcherToggle.Text=launcherVisible?"Hide desktop star":"Show desktop star"; };
      ContextMenuStrip=menu;
      timer.Tick+=delegate { if(Compact)return;ticks++;bool next=ticks%20==0;if(next!=blink){blink=next;Invalidate();}StepPair();foreach(var pet in roaming)pet.Step(blink);if(ticks%25==1)RefreshMoods(); };
      // The star is see-through by its magenta colour key. After a lock, sleep or screen change Windows can drop that
      // drawing and leave a plain block until something repaints it, and the small star never repainted on its own
      // (Astra, 2026-10-23: "appearing in the bottom right-hand corner as a block and not the star"). Repaint on those
      // events, redraw the tray star too, and repaint the desktop star every five seconds as a backstop.
      repaintTimer.Tick+=delegate { Invalidate(); };
      if(!test){SystemEvents.SessionSwitch+=SystemRepaint;SystemEvents.DisplaySettingsChanged+=SystemRepaint;SystemEvents.PowerModeChanged+=SystemRepaint;}
      clickTimer.Tick+=delegate { clicks.Advance(clickClock.ElapsedMilliseconds);if(!clicks.Pending)clickTimer.Stop(); };
      MouseDown+=Press;MouseMove+=TrackPointer;MouseUp+=Release;
      MouseLeave+=delegate { hover=null;hoverStar=false;tooltip.SetToolTip(this,null);Cursor=Cursors.Default; };
      Shown+=delegate { started=true;ApplyDpi();PositionInitial();CreatePetWindows(Screen.FromRectangle(Bounds).WorkingArea);if(!test){CreateTray();repaintTimer.Start();PetFiles.StartBug("--hosted");StartBackgroundPets();tracker=new PetDockTracker(QueueDock);tracker.Start();}SyncVisible();WriteStatus(); };
      FormClosed+=delegate { if(!test){SystemEvents.SessionSwitch-=SystemRepaint;SystemEvents.DisplaySettingsChanged-=SystemRepaint;SystemEvents.PowerModeChanged-=SystemRepaint;}repaintTimer.Stop();if(tray!=null)tray.Visible=false;timer.Stop();clickTimer.Stop();CancelClicks();if(tracker!=null)tracker.Dispose();ClosePetWindows();SavePosition();WriteStatus(false); };
      RefreshStarIcon();LayoutPets();
    }
    // A background pet's command from its menu: its own program, started with the item's words.
    void RunBackground(BackgroundPets.Entry e,string[] args) {
      testActions.Add("background:"+e.Repo+":"+String.Join(" ",args));
      if(test)return;
      try { Process.Start(new ProcessStartInfo(e.Exe,String.Join(" ",args)) { UseShellExecute=false,WorkingDirectory=Path.GetDirectoryName(e.Exe) }); }
      catch(Exception error) { MessageBox.Show(e.Pet+" could not start: "+error.Message,"Astra's desktop pets"); }
    }
    // When the star starts: each crash watcher that is installed and not running yet, quietly (--startup: a second copy
    // exits and opens nothing). No pop-up when one cannot start; its menu then says it is not running.
    void StartBackgroundPets() {
      foreach(var e in BackgroundPets.AtSignIn()) {
        if(!test&&(!File.Exists(e.Exe)||BackgroundPets.Running(e)))continue;
        testActions.Add("sign-in:"+e.Repo+":"+String.Join(" ",e.StartArgs));
        if(test)continue;
        try { Process.Start(new ProcessStartInfo(e.Exe,String.Join(" ",e.StartArgs)) { UseShellExecute=false,WorkingDirectory=Path.GetDirectoryName(e.Exe) }); }catch(Exception){}
      }
    }
    // Every five seconds: a background pet whose program says alarmed shows its alarmed face.
    void RefreshMoods() {
      if(test)return;
      foreach(var pet in pets) {
        if(!pet.HasAlarmed)continue;
        var entry=BackgroundPets.Find(pet.Repo);bool alarmed=entry!=null&&BackgroundPets.Mood(entry)=="alarmed";
        if(alarmed==pet.Alarmed)continue;
        pet.Alarmed=alarmed;Invalidate();foreach(var window in roaming)if(window.Pet==pet)window.Invalidate();
      }
    }
    // Windows events (unlock, wake, screen change) arrive off the window's thread.
    void SystemRepaint(object sender,EventArgs e) { try { if(IsHandleCreated&&!IsDisposed)BeginInvoke((MethodInvoker)Repaint); }catch(InvalidOperationException){} }
    internal void Repaint() {
      RefreshStarIcon(true);Invalidate();foreach(var pet in roaming)if(pet.Visible)pet.Invalidate();
      testActions.Add("repaint");
    }
    void RefreshStarIcon(bool redraw=false) {
      int pixels;try { pixels=GetSystemMetricsForDpi(49,(uint)Math.Round(scale*96)); }catch(EntryPointNotFoundException){pixels=(int)Math.Round(16*scale);}
      pixels=Math.Max(16,pixels);
      if(!redraw&&starBitmap!=null&&starBitmap.Width==pixels)return;
      var bitmap=new Bitmap(pixels,pixels,PixelFormat.Format32bppArgb);
      using(var g=Graphics.FromImage(bitmap)) { g.Clear(Color.Transparent);g.ScaleTransform(pixels/40f,pixels/40f);DrawStar(g); }
      var oldBitmap=starBitmap;var oldIcon=trayIcon;starBitmap=bitmap;
      IntPtr handle=bitmap.GetHicon();try { using(var temporary=Icon.FromHandle(handle))trayIcon=(Icon)temporary.Clone(); }finally{DestroyIcon(handle);}
      if(tray!=null)tray.Icon=trayIcon;
      if(oldBitmap!=null)oldBitmap.Dispose();if(oldIcon!=null)oldIcon.Dispose();
    }
    void CreateTray() {
      RefreshStarIcon();
      tray=new NotifyIcon { Icon=trayIcon,Text="Startup Star - click to hide/show desktop star",ContextMenuStrip=menu,Visible=true };
      tray.MouseClick+=delegate(object sender,MouseEventArgs e) { if(e.Button==MouseButtons.Left)ToggleLauncher(); };
    }
    internal void ToggleLauncher() {
      CancelClicks();launcherVisible=!launcherVisible;
      if(started) { if(launcherVisible)Show();else Hide();SyncVisible(); }
      WriteStatus();
    }
    void LoadPets() {
      var registry=PetFiles.Read("pets.json");var index=(Dictionary<string,object>)PetFiles.Read("art/frames/index.json")["pets"];
      foreach(var raw in (ArrayList)registry["pets"]) { var sprite=PetSprite.Load((Dictionary<string,object>)raw,index);if(sprite.Role=="host") { if(farmer!=null)throw new InvalidDataException("There must be one Farmer.");farmer=sprite; }else pets.Add(sprite); }
      // The draft list (desktop-art/desktop-drafts-20261018.json, written by scripts/prepare-desktop-drafts-20261011.mjs) names the draft pets.
      string drafts=PetFiles.DraftsFile;
      if(File.Exists(drafts))foreach(var raw in (ArrayList)PetFiles.Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(drafts))["pets"]) {
        var entry=(Dictionary<string,object>)raw;string id=PetFiles.Text(entry,"id");
        // A draft that cannot load (a missing file, or a path outside the hub from an old list) is skipped, not fatal:
        // run scripts/prepare-desktop-drafts-20261011.mjs to write the list again. The status file names it.
        if(!pets.Exists(p=>p.Id==id)&&farmer.Id!=id)try{pets.Add(PetSprite.LoadDraft(entry));}catch(Exception error){if(!(error is InvalidDataException||error is IOException||error is ArgumentException))throw;draftErrors.Add(id+": "+error.Message);}
      }
      // A farm set up from scratch can be the Farmer alone (the installer's core kit, Astra 2026-10-18).
      if(farmer==null)throw new InvalidDataException("The desktop pets need their Farmer.");
    }
    protected override bool ShowWithoutActivation { get { return !test; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;if(!test)cp.ExStyle|=0x08000080;return cp; } }
    [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr hwnd);
    protected override void WndProc(ref Message message) {
      if(message.Msg==0x02E0) { scale=Math.Max(1,((long)message.WParam&65535)/96f);RefreshStarIcon();ResizeLogical();if(dockBounds.HasValue)PlaceDock();else ClampToScreen();Invalidate(); }
      base.WndProc(ref message);
    }
    void ApplyDpi() { try { scale=Math.Max(1,GetDpiForWindow(Handle)/96f); } catch(EntryPointNotFoundException) { using(var g=CreateGraphics())scale=Math.Max(1,g.DpiX/96f); }RefreshStarIcon();ResizeLogical(); }
    void ResizeLogical() { ClientSize=new Size((int)Math.Ceiling((Compact?20:LogicalWidth)*scale),(int)Math.Ceiling((Compact?20:LogicalHeight)*scale)); }
    internal static Point Clamp(Point point,Size size,Rectangle area) { return new Point(Math.Max(area.Left,Math.Min(area.Right-size.Width,point.X)),Math.Max(area.Top,Math.Min(area.Bottom-size.Height,point.Y))); }
    void ClampToScreen() { Location=Clamp(Location,Size,Screen.FromPoint(Location).WorkingArea); }
    void PositionInitial() {
      var work=Screen.PrimaryScreen.WorkingArea;expandedLocation=new Point(work.Left+22,work.Bottom-(int)Math.Ceiling(LogicalHeight*scale)-22);
      if(!test)using(var key=Registry.CurrentUser.OpenSubKey(PetFiles.SettingsKey))if(key!=null) {
        object x=key.GetValue("X"),y=key.GetValue("Y");if(x is int&&y is int)expandedLocation=new Point((int)x,(int)y);
      }
      Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen();
      if(!Compact)expandedLocation=Location;
    }
    void SavePosition() { if(test||!started||dockBounds.HasValue)return;using(var key=Registry.CurrentUser.CreateSubKey(PetFiles.SettingsKey)){Point location=Compact?expandedLocation:Location;key.SetValue("X",location.X);key.SetValue("Y",location.Y);} }
    void SavePetsOut() { if(test)return;using(var key=Registry.CurrentUser.CreateSubKey(PetFiles.SettingsKey))key.SetValue("PetsOut",petsOut?1:0); }
    void LayoutPets() {
      // Every pet stands the same height; wide art is fitted without distortion.
      foreach(var pet in pets) { float h=pet.Id=="voicemeeter-bug"?BugHeight:NormalHeight;float w=h*pet.Crop.Width/pet.Crop.Height;if(w>MaxPetWidth){h*=MaxPetWidth/w;w=MaxPetWidth;}float size=1;
        if(Array.IndexOf(SameSize,pet.Id)>=0) { pet.Crop=Rectangle.FromLTRB(pet.Crop.Left,pet.Crop.Bottom-SameSizeCrop,pet.Crop.Right,pet.Crop.Bottom);h=NormalHeight;w=h*pet.Crop.Width/pet.Crop.Height; }
        switch(pet.Id) { case "wifi-butterfly":size=0.7f;break;case "fuzzboi-friend":size=0.75f;break;case "paper-girl":h=NormalHeight;w=h*pet.Crop.Width/pet.Crop.Height;size=0.72f;break;case "claude-bot":h=NormalHeight;w=h*pet.Crop.Width/pet.Crop.Height;size=1.5f;break;case "rift-rabbit":size=0.9f;break;case "chat-rat":size=0.8f;break;case "meme-fiend":case "raspberry-berry":size=0.8f;break;case "rgbee":size=0.7f;break;case "mesh-moth":size=0.64f;break;case "spoonfed-sugarcube":size=0.7f;break;case "health-hummy":size=0.7776f;break;case "voicemeeter-bug":case "mail-snail":case "portfolio-puffer":case "ghost-protocol":size=0.8f;break;case "finance-finch":case "backup-beaver":case "patch-cat":size=0.85f;break;case "file-master":h=NormalHeight;w=h*pet.Crop.Width/pet.Crop.Height;size=0.72f;break; }
        pet.Hit=new RectangleF(0,0,w*size,h*size); }
      float fh=NormalHeight*0.9f,fw=fh*farmer.Crop.Width/farmer.Crop.Height;farmer.Hit=new RectangleF(0,0,fw,fh);
    }
    void CreatePetWindows(Rectangle area) { ClosePetWindows();LayoutPets();foreach(var pet in pets)roaming.Add(new PetWindow(this,pet,scale,random));roaming.Add(new PetWindow(this,farmer,scale,random));Scatter(area); }
    void ClosePetWindows() { foreach(var window in roaming){window.Close();window.Dispose();}roaming.Clear(); }
    // Everyone appears at once, spread over the whole working area: a shuffled grid with one
    // pet per cell and a random spot inside each cell, so nobody starts on top of anyone else.
    internal static Point[] ScatterPoints(IList<Size> sizes,Rectangle area,Random random) {
      int count=sizes.Count;var points=new Point[count];if(count==0)return points;
      int columns=Math.Max(1,Math.Min(count,(int)Math.Ceiling(Math.Sqrt(count*(double)area.Width/Math.Max(1,area.Height)))));
      int rows=(int)Math.Ceiling(count/(double)columns);
      var cells=new List<int>();for(int i=0;i<columns*rows;i++)cells.Add(i);
      for(int i=cells.Count-1;i>0;i--){int j=random.Next(i+1);int swap=cells[i];cells[i]=cells[j];cells[j]=swap;}
      double cellWidth=area.Width/(double)columns,cellHeight=area.Height/(double)rows;
      for(int i=0;i<count;i++) {
        int column=cells[i]%columns,row=cells[i]/columns;
        double x=area.Left+column*cellWidth+random.NextDouble()*Math.Max(0,cellWidth-sizes[i].Width);
        double y=area.Top+row*cellHeight+random.NextDouble()*Math.Max(0,cellHeight-sizes[i].Height);
        points[i]=Clamp(new Point((int)x,(int)y),sizes[i],area);
      }
      return points;
    }
    int PairGap { get { return Math.Max(4,(int)Math.Round(6*scale)); } }
    // The friends walk together only while both are on the screen; one left on alone roams like everyone else.
    internal bool IsPaired(string id) { return (id=="paper-girl"||id=="file-master")&&!hiddenPets.Contains("paper-girl")&&!hiddenPets.Contains("file-master"); }
    internal void PairDragEnded(string id) { if(!IsPaired(id))return;pairLeader=id;pairRejoining=true; }
    void StepPair() {
      var leader=roaming.Find(p=>p.Pet.Id==pairLeader);var follower=roaming.Find(p=>IsPaired(p.Pet.Id)&&p.Pet.Id!=pairLeader);
      if(leader==null||follower==null||!leader.Visible||!follower.Visible||(LinedUp&&!pairRejoining))return;
      Rectangle area=Screen.FromRectangle(leader.Bounds).WorkingArea,travel=area;
      // The virtual working rectangle permits smooth travel between screens, including
      // left/above monitors. Ordinary wandering remains inside the leader's display.
      foreach(var screen in Screen.AllScreens)travel=Rectangle.Union(travel,screen.WorkingArea);
      var next=pair.Next(leader.Location,leader.Size,follower.Location,follower.Size,area,travel,PairGap,Math.Max(1,(int)Math.Round(scale)),leader.InteractionActive||follower.InteractionActive,!LinedUp);
      leader.Location=next[0];follower.Location=next[1];
      if(follower.Location==PetPair.Beside(leader.Location,leader.Size,follower.Location,follower.Size,area,PairGap))pairRejoining=false;
    }
    void Scatter(Rectangle area) {
      var paper=roaming.Find(p=>p.Pet.Id=="paper-girl");var files=roaming.Find(p=>p.Pet.Id=="file-master");
      var units=roaming.FindAll(p=>paper==null||files==null||p!=paper);
      var sizes=units.ConvertAll(p=>p==files&&paper!=null?new Size(p.Width+PairGap+paper.Width,Math.Max(p.Height,paper.Height)):p.Size);
      var points=ScatterPoints(sizes,area,random);for(int i=0;i<units.Count;i++)units[i].Location=points[i];
      if(paper!=null&&files!=null) { int bottom=files.Top+Math.Max(files.Height,paper.Height);files.Top=bottom-files.Height;paper.Location=new Point(files.Right+PairGap,bottom-paper.Height);pairLeader="file-master";pairRejoining=false; }
    }
    static bool Flies(PetSprite pet) { return pet.Kind=="bird"||pet.Kind=="ghost"||pet.Kind=="angel"||pet.Kind=="fairy"||pet.Kind=="sprite"||pet.Id=="rgbee"||pet.Id=="wifi-butterfly"||pet.Id=="mesh-moth"; }
    internal void LineUp() { ShowPets();ArrangeFloor(Screen.FromRectangle(Bounds).WorkingArea);WriteStatus(); }
    void ArrangeFloor(Rectangle area) {
      LinedUp=true;int gap=PairGap,bottom=area.Bottom;
      foreach(bool flying in new bool[]{false,true}) {
        var group=roaming.FindAll(p=>Flies(p.Pet)==flying&&OnScreen(p.Pet));int index=0;
        var paper=group.Find(p=>p.Pet.Id=="paper-girl");var files=group.Find(p=>p.Pet.Id=="file-master");
        if(paper!=null&&files!=null){group.Remove(paper);group.Insert(group.IndexOf(files)+1,paper);}
        while(index<group.Count) {
          int end=index,width=0,height=0;
          while(end<group.Count) {
            bool paired=group[end]==files&&paper!=null&&end+1<group.Count&&group[end+1]==paper;
            int unitWidth=group[end].Width+(paired?gap+paper.Width:0);
            if(end>index&&width+gap+unitWidth>area.Width)break;
            width+=(end==index?0:gap)+unitWidth;height=Math.Max(height,group[end].Height);if(paired)height=Math.Max(height,paper.Height);end+=paired?2:1;
          }
          int x=area.Left+Math.Max(0,(area.Width-width)/2);
          for(int i=index;i<end;i++){var pet=group[i];pet.Location=Clamp(new Point(x,bottom-pet.Height),pet.Size,area);x+=pet.Width+gap;}
          bottom-=height+gap;index=end;
        }
      }
      pairRejoining=false;
    }
    RectangleF ExpandedStarBounds { get { return new RectangleF(0,StarDrop,20,20); } }
    RectangleF StarBounds { get { return Compact?new RectangleF(0,0,20,20):ExpandedStarBounds; } }
    bool HitStar(Point point) { return StarBounds.Contains(new PointF(point.X/scale,point.Y/scale)); }
    internal void SetPetsOut(bool value) {
      CancelClicks();if(!Compact)expandedLocation=Location;petsOut=value;blink=false;testActions.Add(value?"show":"hide");
      if(dockBounds.HasValue)PlaceDock();else { ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen(); }
      SyncVisible();Invalidate();SavePetsOut();WriteStatus();
    }
    void SyncVisible() {
      if(Compact){timer.Stop();foreach(var pet in roaming)pet.Hide();return;}
      if(started)timer.Start();
      foreach(var pet in roaming) {
        if(!OnScreen(pet.Pet)){if(pet.Visible)pet.Hide();continue;}
        if(started&&!pet.Visible){pet.Location=Clamp(pet.Location,pet.Size,Screen.FromRectangle(pet.Bounds).WorkingArea);pet.Show();}
      }
    }
    // "Show on Computer Screen" (Astra, 2026-10-24: "a check mark on the Friendly Farmer ... so you can choose what pets
    // you want to have the farmer show or unshow"): a tick for every pet, in the Farmer's menu and the star's. An unticked
    // pet stays off the screen while the others roam, until it is ticked again. The Farmer is a core pet and always shows.
    internal bool IsFarmer(PetSprite pet) { return pet==farmer; }
    internal bool OnScreen(PetSprite pet) { return pet==farmer||!hiddenPets.Contains(pet.Id); }
    internal void SetOnScreen(string id,bool show) {
      if(id==farmer.Id||!pets.Exists(p=>p.Id==id))return;
      if(show?!hiddenPets.Remove(id):!hiddenPets.Add(id))return;
      testActions.Add((show?"on-screen:":"off-screen:")+id);
      if(!test)PetFiles.SaveHiddenPets(hiddenPets);
      if(LinedUp)ArrangeFloor(Screen.FromRectangle(Bounds).WorkingArea);
      SyncVisible();WriteStatus();
    }
    internal ToolStripMenuItem ShowOnScreenMenu() {
      var parent=new ToolStripMenuItem("Show on Computer Screen");parent.DropDownItems.Add(new ToolStripMenuItem("…") { Enabled=false });
      parent.DropDownOpening+=delegate { FillShowOnScreen(parent); };
      // The list stays open after a tick, so several pets can be ticked or unticked in one go.
      parent.DropDown.Closing+=delegate(object sender,ToolStripDropDownClosingEventArgs e) { if(e.CloseReason==ToolStripDropDownCloseReason.ItemClicked)e.Cancel=true; };
      return parent;
    }
    internal void FillShowOnScreen(ToolStripMenuItem parent) {
      parent.DropDownItems.Clear();
      var ticks=new List<ToolStripMenuItem>();
      var all=new ToolStripMenuItem("Show every pet") { Enabled=hiddenPets.Count>0 };
      all.Click+=delegate { foreach(var item in ticks){item.Checked=true;SetOnScreen((string)item.Tag,true);}all.Enabled=false; };
      parent.DropDownItems.Add(all);parent.DropDownItems.Add(new ToolStripSeparator());
      parent.DropDownItems.Add(new ToolStripMenuItem(farmer.Name+" (always here)") { Checked=true,Enabled=false });
      var sorted=new List<PetSprite>(pets);sorted.Sort((a,b)=>String.Compare(a.Name,b.Name,StringComparison.CurrentCultureIgnoreCase));
      foreach(var pet in sorted) {
        var item=new ToolStripMenuItem(pet.Name) { Tag=pet.Id,Checked=OnScreen(pet),CheckOnClick=true };
        item.Click+=delegate { SetOnScreen((string)item.Tag,item.Checked);all.Enabled=hiddenPets.Count>0; };
        ticks.Add(item);parent.DropDownItems.Add(item);
      }
    }
    internal void ShowPets() { launcherVisible=true;SetPetsOut(true);if(!Visible)Show();if(!dockBounds.HasValue)ClampToScreen();Invalidate();WriteStatus(); }
    PetSprite At(Point point) { return null; }
    internal static bool IsDrag(Point delta) { return Math.Abs(delta.X)>SystemInformation.DragSize.Width/2||Math.Abs(delta.Y)>SystemInformation.DragSize.Height/2; }
    void Press(object sender,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;var pet=At(e.Location);if(HitStar(e.Location))PetPress("star",Cursor.Position);else if(pet!=null)PetPress(pet.Id,Cursor.Position);else CancelClicks(); }
    void TrackPointer(object sender,MouseEventArgs e) {
      if(dragging) { Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(IsDrag(delta)){dragged=true;CancelClicks();}if(dragged){Location=Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea);if(Compact)expandedLocation=new Point(Location.X,Location.Y-(int)(StarDrop*scale));}return; }
      bool star=HitStar(e.Location);PetSprite pet=At(e.Location);if(pet!=hover||star!=hoverStar){hover=pet;hoverStar=star;tooltip.SetToolTip(this,star?"Click to "+(petsOut?"hide":"show")+" pets; double-click to line up / roam":pet==null?"Drag to move the star ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· right-click for options":farmer.Name+" ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· double-click for his desk");Cursor=pet==null&&!star?Cursors.SizeAll:Cursors.Hand;}
    }
    void Release(object sender,MouseEventArgs e) {
      if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;
      if(dragged){CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();return;}
      if(HitStar(e.Location)){PetRelease("star",false);return;}
      var pet=At(e.Location);PetRelease(pet==null?null:pet.Id,false);
    }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();} }
    internal void PetPress(string id,Point point) { clicks.Press(id,point,clickClock.ElapsedMilliseconds);clickTimer.Start(); }
    internal void PetRelease(string id,bool drag) { clicks.Release(id,clickClock.ElapsedMilliseconds,drag);if(!clicks.Pending)clickTimer.Stop();WriteStatus(); }
    internal bool ClickPending(string id) { return clicks.PendingFor(id); }
    internal void CancelClicks() { clicks.Cancel();clickTimer.Stop(); }
    void ResolveClicks(string id,int count) {
      if(id=="fuzzboi-friend"&&count>=3) {
        var fuzz=pets.Find(p=>p.Id==id);if(fuzz==null)return;fuzz.NextFuzzStyle();LayoutPets();
        var window=roaming.Find(p=>p.Pet==fuzz);if(window!=null)window.RefreshSize();
        if(LinedUp)ArrangeFloor(Screen.FromRectangle(Bounds).WorkingArea);
        testActions.Add("reroll:"+fuzz.FuzzStyle);WriteStatus();return;
      }
      if(id=="star") { if(count>=2){if(LinedUp){LinedUp=false;ShowPets();}else LineUp();}else SetPetsOut(!petsOut);return; }
      if(id==farmer.Id) { if(count>=2)OpenPet(farmer); }
      else { var pet=pets.Find(p=>p.Id==id);if(pet==null)return;
        // Two clicks open the pet program page, for every pet (Astra, 2026-10-19: "one click always points to program
        // page"); three clicks run the tool in `clicks` in pets.json ("yes move voicemeeter bug to 3 clicks is the fix").
        // One click is the reminder dialog, not built yet (card 046).
        if(count==2)OpenPet(pet);
        else if(count>=3&&id=="voicemeeter-bug"&&pet.ThreeClicks=="repair"){testActions.Add("repair:voicemeeter-bug");if(!test)PetFiles.StartBug("--repair");} }
      WriteStatus();
    }
    // One and two clicks are the same for every pet; a pet with a tool on three clicks waits for a possible third.
    int MostClicks(string id) { var pet=pets.Find(p=>p.Id==id);return pet!=null&&pet.ThreeClicks!=null?3:2; }
    internal void OpenPet(PetSprite pet) {
      testActions.Add("open:"+pet.Id);
      if(pet.Id=="discord-damsel") {
        if(test){testActions.Add("start:discord-tower-controls");return;}
        // The pet owns its launcher and only its two presence programs. It opens the same generated page,
        // keeping that page's notes and reported issues, and supplies its fixed start/status buttons.
        if(File.Exists(PetFiles.DamselStart)) {
          try { Process.Start(PetFiles.DamselStartInfo());return; }
          catch(Exception error) { MessageBox.Show("Discord Damsel's launcher could not start: "+error.Message,"Discord Tower"); }
        }
      }
      if(test){WriteStatus();return;}
      // Voicemeeter Bug too: his own status window stays in his tray menu (Status and help).
      Uri url;if(Uri.TryCreate(pet.Interface,UriKind.Absolute,out url)) { if(url.Scheme=="https"||url.Scheme=="http")Process.Start(new ProcessStartInfo(url.AbsoluteUri){UseShellExecute=true}); }
      else if(!String.IsNullOrWhiteSpace(pet.Interface))PetFiles.Open(pet.Interface);
    }
    void QueueDock(Rectangle? bounds) {
      lock(dockGate){queuedDock=bounds;if(dockQueued||IsDisposed||Disposing)return;dockQueued=true;}
      try{BeginInvoke((MethodInvoker)delegate{lock(dockGate){dockBounds=queuedDock;dockQueued=false;}if(!dragging)PlaceDock();});}catch(InvalidOperationException){lock(dockGate)dockQueued=false;}
    }
    void PlaceDock() {
      if(!dockBounds.HasValue){spaceConstrained=false;ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen();SyncVisible();Invalidate();return;}
      Rectangle frame=dockBounds.Value;int right=(int)Math.Round(frame.Left+frame.Width*154.0/192),feet=(int)Math.Round(frame.Top+frame.Height*198.0/208);
      expandedLocation=new Point(right+(int)Math.Round(14*scale),frame.Top+(frame.Height-(int)Math.Round(LogicalHeight*scale))/2);
      Rectangle area=Screen.FromRectangle(frame).WorkingArea;spaceConstrained=expandedLocation.X+(int)Math.Ceiling(LogicalWidth*scale)>area.Right||expandedLocation.Y<area.Top;
      ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;SyncVisible();Invalidate();
    }
    protected override void OnPaint(PaintEventArgs e) { base.OnPaint(e);e.Graphics.ScaleTransform(scale,scale);PaintScene(e.Graphics); }
    void PaintScene(Graphics g) {
      g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;g.SmoothingMode=SmoothingMode.None;

      float iconSize=starBitmap.Width/scale;
      g.DrawImage(starBitmap,new RectangleF(StarBounds.X+(StarBounds.Width-iconSize)/2,StarBounds.Y+(StarBounds.Height-iconSize)/2,iconSize,iconSize),new RectangleF(0,0,starBitmap.Width,starBitmap.Height),GraphicsUnit.Pixel);
    }
    // Same puffy 40-pixel star and sparkle geometry as Voicemeeter Bug's launcher.
    static void DrawStar(Graphics g,bool sparkles=false) {
      var saved=g.Save();g.SmoothingMode=SmoothingMode.None;
      var points=new PointF[10];
      for(int i=0;i<10;i++) { double a=-Math.PI/2+i*Math.PI/5;double r=i%2==0?19:9.5;
        points[i]=new PointF(20+(float)(Math.Cos(a)*r),20+(float)(Math.Sin(a)*r)); }
      using(var fill=new SolidBrush(Color.FromArgb(255,220,35)))g.FillPolygon(fill,points);
      using(var edge=new Pen(Color.Black,2.5f)) { edge.LineJoin=LineJoin.Round;g.DrawPolygon(edge,points); }
      using(var eyes=new SolidBrush(Color.Black)) { g.FillRectangle(eyes,14,17,3,4);g.FillRectangle(eyes,23,17,3,4); }
      using(var glint=new SolidBrush(Color.White)) { g.FillRectangle(glint,14,17,1,1);g.FillRectangle(glint,23,17,1,1); }
      g.Restore(saved);
    }
    // The star as a Windows .ico (32-bit pictures with a mask, one per size), for the program's own icon.
    internal static void WriteStarIcon(string path) {
      int[] sizes={16,20,24,32,40,48,64,128};var images=new List<byte[]>();
      foreach(int n in sizes)using(var bitmap=new Bitmap(n,n,PixelFormat.Format32bppArgb)) {
        using(var g=Graphics.FromImage(bitmap)) { g.Clear(Color.Transparent);g.ScaleTransform(n/40f,n/40f);DrawStar(g); }
        using(var data=new MemoryStream())using(var w=new BinaryWriter(data)) {
          int maskRow=((n+31)/32)*4;
          w.Write(40);w.Write(n);w.Write(n*2);w.Write((short)1);w.Write((short)32);w.Write(0);w.Write(n*n*4+maskRow*n);w.Write(0);w.Write(0);w.Write(0);w.Write(0);
          for(int y=n-1;y>=0;y--)for(int x=0;x<n;x++) { Color c=bitmap.GetPixel(x,y);w.Write(c.B);w.Write(c.G);w.Write(c.R);w.Write(c.A); }
          for(int y=n-1;y>=0;y--) { var row=new byte[maskRow];for(int x=0;x<n;x++)if(bitmap.GetPixel(x,y).A==0)row[x/8]|=(byte)(0x80>>(x%8));w.Write(row); }
          w.Flush();images.Add(data.ToArray());
        }
      }
      Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path)));
      using(var w=new BinaryWriter(File.Create(path))) {
        w.Write((short)0);w.Write((short)1);w.Write((short)sizes.Length);int offset=6+16*sizes.Length;
        for(int i=0;i<sizes.Length;i++) { w.Write((byte)sizes[i]);w.Write((byte)sizes[i]);w.Write((byte)0);w.Write((byte)0);w.Write((short)1);w.Write((short)32);w.Write(images[i].Length);w.Write(offset);offset+=images[i].Length; }
        foreach(var image in images)w.Write(image);
      }
    }
    // A 1280x720 desktop in miniature: the star and Farmer in the corner, every pet out at once.
    internal void Preview(string path) {
      scale=1;RefreshStarIcon();petsOut=true;LayoutPets();
      var area=new Rectangle(0,0,1280,720);var allPets=new List<PetSprite>(pets);allPets.Add(farmer);var sizes=allPets.ConvertAll(p=>new Size((int)Math.Ceiling(p.Hit.Width+8),(int)Math.Ceiling(p.Hit.Height+8)));
      var spots=ScatterPoints(sizes,area,random);
      using(var bitmap=new Bitmap(area.Width,area.Height,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(bitmap)) {
        g.Clear(Color.FromArgb(27,24,38));
        var saved=g.Save();g.TranslateTransform(22,area.Height-LogicalHeight-22);PaintScene(g);g.Restore(saved);
        g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
        for(int i=0;i<allPets.Count;i++)allPets[i].Draw(g,false,new RectangleF(spots[i].X+4,spots[i].Y+4,allPets[i].Hit.Width,allPets[i].Hit.Height));
        bitmap.Save(path,ImageFormat.Png);
      }
    }
    object PairStatus() {
      var paper=roaming.Find(p=>p.Pet.Id=="paper-girl");var files=roaming.Find(p=>p.Pet.Id=="file-master");
      bool available=paper!=null&&files!=null,paused=available&&(paper.InteractionActive||files.InteractionActive);
      var leader=pairLeader=="paper-girl"?paper:files;var follower=pairLeader=="paper-girl"?files:paper;
      bool together=available&&follower.Location==PetPair.Beside(leader.Location,leader.Size,follower.Location,follower.Size,Screen.FromRectangle(leader.Bounds).WorkingArea,PairGap);
      string state=!available?"unavailable":!petsOut?"hidden":paused?"paused":LinedUp&&!pairRejoining?"lined-up":together?"together":"catching-up";
      return new { leader=pairLeader,state,following_enabled=true,paper_girl=paper==null?null:new { x=paper.Left,y=paper.Top,width=paper.Width,height=paper.Height },file_master=files==null?null:new { x=files.Left,y=files.Top,width=files.Width,height=files.Height },center_distance_px=available?(double?)PetPair.Distance(new Point(paper.Left+paper.Width/2,paper.Top+paper.Height/2),new Point(files.Left+files.Width/2,files.Top+files.Height/2)):null,gap_px=PairGap };
    }
    // A farm can leave any pet out (set up from scratch, or a pet deleted), so a missing pet reports 0, never a crash.
    float PetHit(string id,bool width) { var pet=pets.Find(p=>p.Id==id);return pet==null?0:width?pet.Hit.Width:pet.Hit.Height; }
    string[] HiddenIds() { var ids=new List<string>(hiddenPets);ids.Sort(StringComparer.Ordinal);return ids.ToArray(); }
    internal void WriteStatus(bool running=true) {
      if(test&&!started)return;
      int needed=(int)Math.Ceiling(LogicalWidth*scale);Rectangle area=Screen.FromRectangle(dockBounds??Bounds).WorkingArea;
      int sparkleCount=0;foreach(var pet in roaming)sparkleCount+=pet.SparkleCount;
      PetFiles.WriteStatus(new { running,test_mode=test,process_id=Process.GetCurrentProcess().Id,window_title=Text,visible=running&&Visible,desktop_star_visible=running&&launcherVisible,tray_visible=running&&tray!=null&&tray.Visible,star_icon_pixels=starBitmap.Width,desktop_star_pixels=starBitmap.Width,pets_out=petsOut,lined_up=LinedUp,compact=Compact,roaming_pet_count=roaming.Count,roaming_pet_visible_count=roaming.FindAll(p=>p.Visible).Count,pending_clicks=clicks.Pending,last_action=testActions.Count>0?testActions[testActions.Count-1]:null,actions=test?testActions.ToArray():null,pet_count=pets.Count+1,hidden_pets=HiddenIds(),farmer_roaming=roaming.Exists(p=>p.Pet==farmer),dock_sample_interval_ms=16,bug_present=pets.Exists(p=>p.Id=="voicemeeter-bug"),bug_height=PetHit("voicemeeter-bug",false),normal_height=NormalHeight,paper_girl_height=PetHit("paper-girl",false),paper_girl_width=PetHit("paper-girl",true),file_master_height=PetHit("file-master",false),file_master_width=PetHit("file-master",true),pet_pair=PairStatus(),desktop_art_pets=roaming.FindAll(p=>p.Pet.DesktopArt).ConvertAll(p=>p.Pet.Id).ToArray(),sparkle_pet_ids=roaming.FindAll(p=>p.HasSparkles).ConvertAll(p=>p.Pet.Id).ToArray(),draft_errors=draftErrors.ToArray(),sparkle_count=sparkleCount,sparkle_lifetime_ms=0,sparkle_padding=0,sparkles_allowed=false,translucent_pet_ids=pets.FindAll(p=>p.Layered).ConvertAll(p=>p.Id).ToArray(),fuzzboi_variant=pets.Find(p=>p.Id=="fuzzboi-friend")==null?null:pets.Find(p=>p.Id=="fuzzboi-friend").Name,animation_interval_ms=timer.Interval,animation_running=running&&timer.Enabled,startup_enabled=PetFiles.StartupEnabled(),dpi_scale=scale,width=Width,height=Height,docked=dockBounds.HasValue,dock_has_room=!spaceConstrained,dock_required_width_px=needed,dock_available_width_px=area.Right-expandedLocation.X,dock_star_left_must_be_at_or_before_px=area.Right-needed,on_screen=Screen.FromRectangle(Bounds).WorkingArea.IntersectsWith(Bounds),updated_utc=DateTime.UtcNow.ToString("o")},test);
    }
    internal void SelfTest() {
      if(pets.Count<1||farmer==null)throw new Exception("Roster test failed.");
      foreach(var pet in pets)pet.ValidateEffects();
      if(BugHeight!=NormalHeight)throw new Exception("Bug standard size test failed.");
      var damsel=pets.Find(p=>p.Id=="discord-damsel");if(damsel!=null) {
        ResolveClicks(damsel.Id,2);if(testActions[testActions.Count-1]!="start:discord-tower-controls")throw new Exception("Damsel must open her presence controls launcher.");
        var start=PetFiles.DamselStartInfo();if(start.UseShellExecute||!start.CreateNoWindow||start.WindowStyle!=ProcessWindowStyle.Hidden||!start.Arguments.EndsWith("open-discord-damsel-20261030.cmd\"\""))throw new Exception("Damsel launcher must be fixed and hidden.");
        testActions.Clear();
      }
      if(StarBounds.Right>LogicalWidth||StarBounds.Bottom>LogicalHeight)throw new Exception("Star layout overflow.");
      foreach(var pet in pets)if(pet.Hit.Height>(pet.Id=="claude-bot"?NormalHeight*1.5f:NormalHeight)+.01f||pet.Hit.Width>MaxPetWidth+.01f||pet.Hit.Width<1)throw new Exception("Pet size out of range: "+pet.Name);
      var paper=pets.Find(p=>p.Id=="paper-girl");var files=pets.Find(p=>p.Id=="file-master");
      if(Math.Abs(paper.Hit.Height-NormalHeight*.72f)>.01f||Math.Abs(files.Hit.Height-NormalHeight*.72f)>.01f)throw new Exception("Paper Girl or File Master resize failed.");
      foreach(string id in SameSize) { var girl=pets.Find(p=>p.Id==id);if(girl==null)continue;var art=Rectangle.Union(PetSprite.AlphaBounds(girl.Idle),PetSprite.AlphaBounds(girl.Blink));
        if(girl.Crop.Top<0||girl.Crop.Height!=SameSizeCrop||girl.Crop.Bottom!=art.Bottom||art.Top<girl.Crop.Top||Math.Abs(girl.Hit.Height-NormalHeight)>.01f)throw new Exception("Group 3 same-size scale failed: "+girl.Name); }

      Rectangle left=new Rectangle(-1920,0,1920,1080);Size size=new Size(690,172);
      if(Clamp(new Point(9999,9999),size,left)!=new Point(-690,908))throw new Exception("Screen clamp failed.");
      if(!PetFiles.StartupCommand.StartsWith("\""+PetFiles.Exe+"\" \""))throw new Exception("Startup quoting failed.");
      bool rejected=false;try{PetFiles.SafePath("../outside.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("Asset path validation failed.");
      // The pictures-only copy: read only while the sync says the hub is held back and checked in the last 10 minutes.
      { string dir=Path.Combine(Path.GetTempPath(),"pictures-copy-test-"+Process.GetCurrentProcess().Id),copy=Path.Combine(dir,"astras-pet-os"),file=Path.Combine(dir,"pictures-copy-status-20261024.json");DateTime now=DateTime.UtcNow;
        try {
          Directory.CreateDirectory(Path.Combine(copy,"art"));File.WriteAllText(Path.Combine(copy,"pets.json"),"{}");
          Func<bool,DateTime,string> pick=(held,at)=>{File.WriteAllText(file,"{\"hub_held_back\":"+(held?"true":"false")+",\"synced_utc\":\""+at.ToString("o")+"\"}");return PetFiles.ChoosePicturesRoot(file,now);};
          if(pick(true,now.AddMinutes(-1))!=Path.GetFullPath(copy))throw new Exception("A held-back hub did not switch to the pictures copy.");
          if(pick(false,now)!=null||pick(true,now.AddMinutes(-11))!=null)throw new Exception("The pictures copy was used while the hub is current or the sync is quiet.");
          if(PetFiles.ChoosePicturesRoot(Path.Combine(dir,"missing.json"),now)!=null)throw new Exception("No sync status must mean this folder.");
          string keep=PetFiles.PicturesRoot;PetFiles.PicturesRoot=Path.GetFullPath(copy);
          try {
            if(!PetFiles.SafePath("art/frames/index.json").StartsWith(PetFiles.PicturesRoot+Path.DirectorySeparatorChar)||!PetFiles.SafePath("pets.json").StartsWith(PetFiles.PicturesRoot))throw new Exception("Pictures did not come from the copy.");
            if(!PetFiles.SafePath("apps/pet-programs/x.html").StartsWith(PetFiles.Root+Path.DirectorySeparatorChar))throw new Exception("Pages must stay in the hub folder.");
            rejected=false;try{PetFiles.SafePath("art/../../outside.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("Copy path validation failed.");
          } finally { PetFiles.PicturesRoot=keep; }
        } finally { try{Directory.Delete(dir,true);}catch{} } }
      rejected=false;try{PetFiles.DraftPath(new Dictionary<string,object>{{"id","x"}},Path.Combine(Path.GetTempPath(),"outside.png"));}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("A public draft reached outside the hub.");
      rejected=false;try{PetFiles.DraftPath(new Dictionary<string,object>{{"id","x"},{"private",true},{"repo","claude-bot"}},"../../outside.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("A private draft reached outside its repo folder.");
      rejected=false;try{PetFiles.DraftPath(new Dictionary<string,object>{{"id","x"},{"private",true},{"repo","../x"}},"idle.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("A private draft named a folder that is not a repo.");
      bool initialPets=petsOut;ToggleLauncher();if(launcherVisible||petsOut!=initialPets)throw new Exception("Tray hide changed pet visibility state.");
      ToggleLauncher();if(!launcherVisible||petsOut!=initialPets)throw new Exception("Tray show changed pet visibility state.");
      var oldIcon=trayIcon;int oldPixels=starBitmap.Width;Repaint();if(trayIcon==oldIcon||starBitmap.Width!=oldPixels)throw new Exception("Repaint after a lock or sleep did not redraw the tray star at the same size.");
      ClickTests();
      BackgroundTests();
      CreatePetWindows(left);
      if(roaming.Count!=pets.Count+1||!roaming.Exists(p=>p.Pet==farmer))throw new Exception("Not every pet got its own window.");
      int sparklePets=0;
      foreach(var pet in roaming) {
        if(pet.Width>110||pet.Height>110||pet.Visible)throw new Exception("Pet windows must be compact and hidden in self-test.");
        if(pet.HasSparkles){sparklePets++;if(pet.HitPet(new Point(2,2)))throw new Exception("Transparent pet padding must pass mouse input through.");}
        bool requested=false;
        if(pet.HasSparkles!=requested)throw new Exception("Sparkles assigned to the wrong pet.");
      }
      if(sparklePets!=0)throw new Exception("No pets should have sparkle trails.");
      ArrangeFloor(left);foreach(var pet in roaming){if(!left.Contains(pet.Bounds))throw new Exception("Lineup left screen.");foreach(var other in roaming)if(pet!=other&&pet.Bounds.IntersectsWith(other.Bounds))throw new Exception("Lineup overlaps.");}foreach(var flyer in roaming.FindAll(p=>Flies(p.Pet)))foreach(var ground in roaming.FindAll(p=>!Flies(p.Pet)))if(flyer.Bottom>ground.Top)throw new Exception("Flying row must be above ground pets.");LinedUp=false;ResolveClicks("star",2);if(!LinedUp||!petsOut)throw new Exception("Star double click did not line up pets.");ResolveClicks("star",2);if(LinedUp||!petsOut)throw new Exception("Second star double click did not resume roaming.");ScatterTests(left);ScatterTests(new Rectangle(0,0,2560,1392));RoamTests(new Rectangle(0,0,1920,1032));
      PairTests();
      ShowOnScreenTests(left);
      SetPetsOut(false);if(petsOut||!Compact)throw new Exception("The star did not hide the pets.");
      SetPetsOut(true);if(!petsOut||Compact)throw new Exception("The star did not show the pets.");
      var fuzz=pets.Find(p=>p.Id=="fuzzboi-friend");if(fuzz!=null)foreach(string expected in new[]{"C","A","B"}){ResolveClicks(fuzz.Id,3);if(fuzz.FuzzStyle!=expected)throw new Exception("Fuzzboi body did not change to "+expected);}
      int black=0;for(int y=0;y<starBitmap.Height;y++)for(int x=0;x<starBitmap.Width;x++){Color c=starBitmap.GetPixel(x,y);if(c.A>0&&c.R==0&&c.G==0&&c.B==0)black++;if(c.A!=0&&c.A!=255)throw new Exception("Star edge must be crisp in both tray and desktop.");}if(black<10)throw new Exception("Star black outline missing.");
      foreach(var pet in roaming)if(pet.Visible)throw new Exception("Self-test must never show a pet window.");
      if(testActions.Exists(a=>a.StartsWith("open:")||a.StartsWith("repair:")))throw new Exception("Self-test dispatched an unintended app action.");
      // Astra, 2026-10-19: two clicks open the Bug's pet program page, like every pet's; his repair is three clicks.
      var bug=pets.Find(p=>p.Id=="voicemeeter-bug");
      if(bug!=null) {
        if(bug.ThreeClicks!="repair"||MostClicks(bug.Id)!=3||MostClicks(farmer.Id)!=2)throw new Exception("The Bug's three-click repair is not read from pets.json.");
        if(!bug.Interface.StartsWith("apps/pet-programs/"))throw new Exception("The Bug's two clicks must open his pet program page.");
        int before=testActions.Count;ResolveClicks(bug.Id,1);if(testActions.Count!=before)throw new Exception("One click on the Bug must not repair or open anything.");
        ResolveClicks(bug.Id,2);if(testActions[testActions.Count-1]!="open:voicemeeter-bug")throw new Exception("Two clicks on the Bug must open his pet program page.");
        ResolveClicks(bug.Id,3);if(testActions[testActions.Count-1]!="repair:voicemeeter-bug")throw new Exception("Three clicks on the Bug must repair.");
        testActions.RemoveRange(before,testActions.Count-before);
      }
      Console.WriteLine("PASS: roster, decoded sprites, layout, group 3 same-size scale, Paper Girl and File Master sizes and paired following, paired scatter/lineup, drag leadership and bounded catch-up, pair interaction pauses, standard-size Bug, hidden Damsel launcher, monitor clamping, startup quoting, asset boundaries, the pictures-only copy while the hub is held back, drafts only from the hub, click classification, the Bug's pet program page and three-click repair, drag cancellation, one compact window per pet, whole-screen scatter, bounded roaming, sparkle trails disabled for all pets, transparent sparkle hit-testing, star show/hide, Show on Computer Screen ticks in the Farmer's menu, the star redrawn after a lock or sleep, the background pets' menus (their own commands only), the crash watchers started by the star and Log Lynx's alarmed face.");
    }
    void ScatterTests(Rectangle area) {
      for(int run=0;run<25;run++) {
        Scatter(area);
        var boxes=roaming.ConvertAll(p=>p.Bounds);
        foreach(var box in boxes)if(!area.Contains(box))throw new Exception("A scattered pet started off the screen.");
        // Whole screen: every third across, every third down and every quarter has a pet.
        int[] across=new int[3],down=new int[3],quadrants=new int[4];
        foreach(var box in boxes) {
          int x=box.X+box.Width/2-area.Left,y=box.Y+box.Height/2-area.Top;
          across[Math.Min(2,x*3/area.Width)]++;down[Math.Min(2,y*3/area.Height)]++;quadrants[(x<area.Width/2?0:1)+(y<area.Height/2?0:2)]++;
        }
        foreach(int n in across)if(n==0)throw new Exception("Pets did not spread across the whole screen.");
        foreach(int n in down)if(n==0)throw new Exception("Pets did not spread down the whole screen.");
        foreach(int n in quadrants)if(n==0)throw new Exception("A quarter of the screen started empty.");
        for(int i=0;i<boxes.Count;i++)for(int j=i+1;j<boxes.Count;j++)if(Rectangle.Intersect(boxes[i],boxes[j]).Width*Rectangle.Intersect(boxes[i],boxes[j]).Height>boxes[i].Width*boxes[i].Height/2)throw new Exception("Two pets started on top of each other.");
      }
    }
    // The background pets' menus (2026-10-21): only their own commands, and an alarmed pet's alarmed face.
    void BackgroundTests() {
      foreach(string word in new[]{"--open","--tool","log-den-v1.0-crash-catcher-v1.0","off","github.com","--trace"})if(!BackgroundPets.SafeArg.IsMatch(word))throw new Exception("A menu word was refused: "+word);
      foreach(string word in new[]{"C:\\evil.exe","--x;calc","\"quoted\"","--x & calc","..\\x",""})if(BackgroundPets.SafeArg.IsMatch(word))throw new Exception("A menu word was let through: "+word);
      var koala=BackgroundPets.Find("kernel-grove");
      if(koala==null||koala.Pet!="Kernel Koala"||koala.StartArgs[0]!="--startup"||!koala.Exe.EndsWith("kernel-grove-20261021.exe")||BackgroundPets.Watches("kernel-grove"))throw new Exception("Kernel Koala's watch must be in the star's menu, started quietly, with no alarmed face.");
      var iguana=BackgroundPets.Find("benchmark-rock");
      if(iguana==null||iguana.Pet!="Inference Iguana"||iguana.StartArgs[0]!="--startup"||!iguana.Exe.EndsWith("benchmark-rock-20261023.exe")||BackgroundPets.Watches("benchmark-rock"))throw new Exception("Inference Iguana's watch must be in the star's menu, started quietly, with no alarmed face.");
      int signIn=testActions.Count;StartBackgroundPets();
      if(String.Join(",",testActions.GetRange(signIn,testActions.Count-signIn).ToArray())!="sign-in:log-den:--startup,sign-in:packet-river:--startup,sign-in:evidence-locker:--startup")throw new Exception("The star must start the three crash watchers quietly, and only them.");
      testActions.RemoveRange(signIn,testActions.Count-signIn);
      string folder=Path.Combine(Path.GetTempPath(),"star-menu-test-"+Guid.NewGuid().ToString("N").Substring(0,8));
      try {
        Directory.CreateDirectory(folder);
        File.WriteAllText(Path.Combine(folder,BackgroundPets.MenuFile),"{\"schema\":\"astras-pet-os-menu-v1\",\"pet\":\"Log Lynx\",\"items\":[{\"text\":\"Open Log Den\",\"args\":[\"--open\"]},{\"separator\":true},{\"text\":\"log-den-v1.0-crash-catcher-v1.0\",\"args\":[\"--tool\",\"log-den-v1.0-crash-catcher-v1.0\",\"off\"],\"checked\":true},{\"text\":\"Run something else\",\"args\":[\"C:\\\\x.exe\"]}]}");
        var e=new BackgroundPets.Entry{Repo="log-den",Pet="Log Lynx",Exe=Path.Combine(folder,"log-den-20261018.exe"),Folder=folder,StartArgs=new[]{"--startup"}};
        var parent=new ToolStripMenuItem("Log Lynx");BackgroundPets.Fill(parent,e,RunBackground,true);
        if(parent.DropDownItems.Count!=4)throw new Exception("The background pet's menu has the wrong items.");
        var tool=(ToolStripMenuItem)parent.DropDownItems[2];if(!tool.Checked||!tool.Enabled)throw new Exception("A tool that is ON must be ticked.");
        if(parent.DropDownItems[3].Enabled)throw new Exception("An item with a path for an argument must not run.");
        tool.PerformClick();if(testActions[testActions.Count-1]!="background:log-den:--tool log-den-v1.0-crash-catcher-v1.0 off")throw new Exception("A tool item must run its own --tool command.");
        BackgroundPets.Fill(parent,e,RunBackground,false);
        if(parent.DropDownItems[0].Enabled||parent.DropDownItems[0].Text!="Log Lynx is not running")throw new Exception("A pet that is not running must say so.");
        ((ToolStripMenuItem)parent.DropDownItems[1]).PerformClick();if(testActions[testActions.Count-1]!="background:log-den:--startup")throw new Exception("Start must use --startup.");
      } finally { try{Directory.Delete(folder,true);}catch(Exception){} }
      var lynx=pets.Find(p=>p.Repo=="log-den");
      if(lynx!=null) {
        if(!lynx.HasAlarmed)throw new Exception("Log Lynx needs its alarmed frame.");
        if(pets.Exists(p=>p.HasAlarmed&&!BackgroundPets.Watches(p.Repo)))throw new Exception("Only background pets load an alarmed frame.");
        lynx.Alarmed=true;bool differs=false;
        for(int y=lynx.Crop.Top;y<lynx.Crop.Bottom&&!differs;y+=3)for(int x=lynx.Crop.Left;x<lynx.Crop.Right&&!differs;x+=3)if(lynx.HasPixel(false,x,y)!=lynx.HasPixel(true,x,y)||lynx.HasPixel(false,x,y)!=(lynx.Idle.GetPixel(x,y).A>0))differs=true;
        lynx.Alarmed=false;
        if(!differs)throw new Exception("An alarmed Log Lynx must look different from his idle face.");
      }
    }
    void PairTests() {
      Size leaderSize=new Size(71,59),followerSize=new Size(55,77);const int gap=9,step=2;
      foreach(Rectangle area in new[]{new Rectangle(-1920,-300,1920,1080),new Rectangle(0,0,2560,1392)}) {
        var friends=new PetPair(new Random(11));Point leader=new Point(area.Left+400,area.Top+300),follower=PetPair.Beside(leader,leaderSize,leader,followerSize,area,gap);
        int moved=0;
        for(int tick=0;tick<10000;tick++) {
          var next=friends.Next(leader,leaderSize,follower,followerSize,area,area,gap,step,false,true);
          Rectangle a=new Rectangle(next[0],leaderSize),b=new Rectangle(next[1],followerSize);
          if(!area.Contains(a)||!area.Contains(b)||a.IntersectsWith(b))throw new Exception("Paired roaming overlapped or left its monitor.");
          if(PetPair.Distance(leader,next[0])>5||PetPair.Distance(follower,next[1])>5)throw new Exception("Together pets jumped while wandering.");
          if(Rectangle.Union(a,b).Width>leaderSize.Width+followerSize.Width+gap||Rectangle.Union(a,b).Height>leaderSize.Height+followerSize.Height+gap)throw new Exception("Paired pets drifted apart.");
          if(next[0]!=leader)moved++;leader=next[0];follower=next[1];
        }
        if(moved<100)throw new Exception("Paired pets never wandered.");
        // Simulate owner drops at corners, against edges and directly over the other
        // pet; catch-up must finish without moving the newly dragged leader.
        var drops=new List<Point>{new Point(area.Left,area.Top),new Point(area.Right-leaderSize.Width,area.Top),new Point(area.Left,area.Bottom-leaderSize.Height),new Point(area.Right-leaderSize.Width,area.Bottom-leaderSize.Height),new Point(area.Left+45,area.Top+400),new Point(area.Left+600,area.Top+400)};
        var dropRandom=new Random(17);for(int i=0;i<64;i++)drops.Add(new Point(area.Left+dropRandom.Next(area.Width-leaderSize.Width),area.Top+dropRandom.Next(area.Height-leaderSize.Height)));
        foreach(var drop in drops) {
          leader=drop;follower=PetsWindow.Clamp(new Point(area.Left+600,area.Top+400),followerSize,area);
          var paused=friends.Next(leader,leaderSize,follower,followerSize,area,area,gap,step,true,true);
          if(paused[0]!=leader||paused[1]!=follower)throw new Exception("A hover or click failed to pause the pair.");
          bool clear=!new Rectangle(leader,leaderSize).IntersectsWith(new Rectangle(follower,followerSize)),arrived=false;
          for(int tick=0;tick<180;tick++) {
            var next=friends.Next(leader,leaderSize,follower,followerSize,area,area,gap,step,false,false);
            if(next[0]!=leader||PetPair.Distance(follower,next[1])>step*30+1||!area.Contains(new Rectangle(next[1],followerSize)))throw new Exception("Dragged pair jumped, moved its leader or left the monitor.");
            bool overlap=new Rectangle(leader,leaderSize).IntersectsWith(new Rectangle(next[1],followerSize));if(clear&&overlap)throw new Exception("Catch-up walked through the pair leader.");if(!overlap)clear=true;
            follower=next[1];if(follower==PetPair.Beside(leader,leaderSize,follower,followerSize,area,gap)){arrived=true;break;}
          }
          if(!arrived||!clear)throw new Exception("The companion failed to catch up after a drag.");
          var lined=friends.Next(leader,leaderSize,follower,followerSize,area,area,gap,step,false,false);if(lined[0]!=leader||lined[1]!=follower)throw new Exception("A reunited lineup pair started roaming.");
        }
      }
      // A drag across a contiguous display boundary is gradual, not a screen jump.
      var cross=new PetPair(new Random(12));Rectangle destination=new Rectangle(0,-200,2560,1392),virtualArea=new Rectangle(-1920,-200,4480,1392);Point lead=new Point(1800,300),follow=new Point(-1800,300);bool caught=false;
      for(int tick=0;tick<180;tick++) { var next=cross.Next(lead,leaderSize,follow,followerSize,destination,virtualArea,gap,step,false,false);if(next[0]!=lead||PetPair.Distance(follow,next[1])>61||!virtualArea.Contains(new Rectangle(next[1],followerSize)))throw new Exception("Cross-monitor catch-up jumped or escaped desktop bounds.");follow=next[1];if(follow==PetPair.Beside(lead,leaderSize,follow,followerSize,destination,gap)){caught=true;break;} }
      if(!caught)throw new Exception("The pair did not reunite across negative-coordinate monitors.");
      var paper=roaming.Find(p=>p.Pet.Id=="paper-girl");var files=roaming.Find(p=>p.Pet.Id=="file-master");
      foreach(string id in new[]{"paper-girl","file-master"}) { PairDragEnded(id);if(pairLeader!=id||!pairRejoining)throw new Exception("Dragging either friend must make it the leader."); }
      PairDragEnded("farmer");if(pairLeader!="file-master")throw new Exception("Dragging another pet changed the pair leader.");
      PetPress("paper-girl",Point.Empty);if(!(paper.InteractionActive||files.InteractionActive))throw new Exception("Paper Girl click did not pause the pair.");CancelClicks();
      PetPress("file-master",Point.Empty);if(!(paper.InteractionActive||files.InteractionActive))throw new Exception("File Master click did not pause the pair.");CancelClicks();
      Point paperBefore=paper.Location,filesBefore=files.Location;StepPair();if(paper.Location!=paperBefore||files.Location!=filesBefore)throw new Exception("Hidden friends should not move.");
      foreach(int width in new[]{320,420,1920}) { Rectangle floor=new Rectangle(-1920,-300,width,4000);ArrangeFloor(floor);if(paper.Bottom!=files.Bottom||paper.Left-files.Right!=PairGap)throw new Exception("Lineup split Paper Girl from File Master.");foreach(var pet in roaming)if(!floor.Contains(pet.Bounds))throw new Exception("Paired lineup escaped the display."); }
      Size original=paper.Size;try { paper.Height+=13;Scatter(new Rectangle(-1920,-300,1920,1080));if(paper.Bottom!=files.Bottom||paper.Top<-300||files.Top<-300)throw new Exception("Unequal-size paired scatter failed."); }finally { paper.Size=original; }
      LinedUp=false;Scatter(new Rectangle(-1920,-300,1920,1080));if(pairLeader!="file-master"||paper.Bottom!=files.Bottom||paper.Left-files.Right!=PairGap)throw new Exception("The pair must scatter together, with File Master leading.");
    }
    // "Show on Computer Screen" (2026-10-24): a tick per pet in the Farmer's menu; unticked pets stay off, the Farmer never.
    void ShowOnScreenTests(Rectangle area) {
      var farmerWindow=roaming.Find(p=>p.Pet==farmer);var farmerMenu=farmerWindow.ContextMenuStrip.Items;
      var parent=farmerMenu[farmerMenu.Count-1] as ToolStripMenuItem;
      if(parent==null||parent.Text!="Show on Computer Screen")throw new Exception("The Farmer's menu needs Show on Computer Screen.");
      if(menu.Items[2].Text!="Show on Computer Screen")throw new Exception("The star's menu needs Show on Computer Screen under Hide the pets.");
      foreach(var other in roaming)if(other!=farmerWindow&&other.ContextMenuStrip.Items.Count!=2)throw new Exception("Only the Farmer's own menu has the pet list.");
      FillShowOnScreen(parent);
      if(parent.DropDownItems.Count!=pets.Count+3)throw new Exception("Show on Computer Screen must list every pet once, and the Farmer.");
      var farmerTick=(ToolStripMenuItem)parent.DropDownItems[2];if(!farmerTick.Checked||farmerTick.Enabled)throw new Exception("The Farmer must always be ticked and never untickable.");
      if(parent.DropDownItems[0].Enabled)throw new Exception("Show every pet must wait until a pet is unticked.");
      var lone=pets.Find(p=>!IsPaired(p.Id));var tick=FindTick(parent,lone.Id);
      if(!tick.Checked)throw new Exception("Every pet starts ticked.");
      tick.PerformClick();
      if(tick.Checked||OnScreen(lone)||testActions[testActions.Count-1]!="off-screen:"+lone.Id||!parent.DropDownItems[0].Enabled)throw new Exception("Unticking a pet must take it off the screen.");
      SetOnScreen(farmer.Id,false);if(!OnScreen(farmer))throw new Exception("The Farmer must stay on the screen.");
      var loneWindow=roaming.Find(p=>p.Pet==lone);Point away=new Point(area.Left-5000,area.Top-5000);loneWindow.Location=away;
      ArrangeFloor(area);if(loneWindow.Location!=away)throw new Exception("A pet off the screen must not take a place in the lineup.");
      foreach(var pet in roaming)if(pet!=loneWindow&&!area.Contains(pet.Bounds))throw new Exception("Lineup without one pet left the screen.");
      FillShowOnScreen(parent);if(FindTick(parent,lone.Id).Checked)throw new Exception("An unticked pet must stay unticked when the menu opens again.");
      FindTick(parent,lone.Id).PerformClick();if(!OnScreen(lone)||testActions[testActions.Count-1]!="on-screen:"+lone.Id)throw new Exception("Ticking a pet must put it back on the screen.");
      if(pets.Exists(p=>p.Id=="paper-girl")&&pets.Exists(p=>p.Id=="file-master")) {
        SetOnScreen("paper-girl",false);if(IsPaired("file-master"))throw new Exception("File Master must roam alone while Paper Girl is off the screen.");
        SetOnScreen("file-master",false);FillShowOnScreen(parent);((ToolStripMenuItem)parent.DropDownItems[0]).PerformClick();
        if(hiddenPets.Count!=0||!IsPaired("file-master")||!FindTick(parent,"paper-girl").Checked)throw new Exception("Show every pet must put them all back, the friends together.");
      }
      LinedUp=false;
    }
    static ToolStripMenuItem FindTick(ToolStripMenuItem parent,string id) { foreach(ToolStripItem item in parent.DropDownItems)if(item is ToolStripMenuItem&&(item.Tag as string)==id)return (ToolStripMenuItem)item;throw new Exception("No tick for "+id); }
    void RoamTests(Rectangle area) {
      var walker=new Roamer(new Random(7));Point at=new Point(area.Left+area.Width/2,area.Top+area.Height/2);Size size=new Size(70,70);
      int minX=at.X,maxX=at.X,minY=at.Y,maxY=at.Y,still=0;
      for(int i=0;i<20000;i++) {
        Point next=walker.Next(at,size,area,1);
        if(!area.Contains(new Rectangle(next,size)))throw new Exception("A roaming pet left the screen.");
        if(Math.Abs(next.X-at.X)>2||Math.Abs(next.Y-at.Y)>1)throw new Exception("A roaming pet jumped.");
        if(next==at)still++;at=next;minX=Math.Min(minX,at.X);maxX=Math.Max(maxX,at.X);minY=Math.Min(minY,at.Y);maxY=Math.Max(maxY,at.Y);
      }
      if(maxX-minX<area.Width/3||maxY-minY<area.Height/4)throw new Exception("A roaming pet did not wander.");
      if(still==0||still>8000)throw new Exception("Roaming pets should rest now and then, not stand still.");
    }
    static void ClickTests() {
      var got=new List<string>();var classifier=new PetClicks((id,n)=>got.Add(id+":"+n),500,new Size(8,8),id=>id=="fuzzboi-friend"||id=="voicemeeter-bug"?3:2);Point point=new Point(100,100);
      for(int i=0;i<2;i++){classifier.Press("fuzzboi-friend",point,-2000+i*200);classifier.Release("fuzzboi-friend",-1970+i*200,false);}if(got.Count!=0)throw new Exception("Fuzzboi double click must await a possible third click.");
      classifier.Press("fuzzboi-friend",point,-1600);classifier.Release("fuzzboi-friend",-1570,false);if(String.Join(",",got)!="fuzzboi-friend:3")throw new Exception("Fuzzboi triple-click classification failed.");got.Clear();
      for(int i=0;i<2;i++){classifier.Press("fuzzboi-friend",point,-1000+i*200);classifier.Release("fuzzboi-friend",-970+i*200,false);}classifier.Advance(-200);if(String.Join(",",got)!="fuzzboi-friend:2")throw new Exception("Fuzzboi double-click app opening failed.");got.Clear();
      classifier.Press("farmer",point,0);classifier.Release("farmer",30,false);classifier.Advance(501);if(String.Join(",",got)!="farmer:1")throw new Exception("Single click classification failed.");got.Clear();
      classifier.Press("farmer",point,1000);classifier.Release("farmer",1030,false);classifier.Press("farmer",point,1400);classifier.Advance(1600);if(got.Count!=0)throw new Exception("Held second click dispatched early.");classifier.Release("farmer",1630,false);classifier.Advance(1901);if(String.Join(",",got)!="farmer:2")throw new Exception("Double click classification failed.");got.Clear();
      for(int i=0;i<3;i++){classifier.Press("farmer",point,2000+i*200);classifier.Release("farmer",2030+i*200,false);}classifier.Advance(3000);if(String.Join(",",got)!="farmer:2,farmer:1")throw new Exception("A third click must start a new gesture, not open the desk twice.");got.Clear();
      classifier.Press("voicemeeter-bug",point,4000);classifier.Release("voicemeeter-bug",4030,false);classifier.Press("voicemeeter-bug",point,4200);classifier.Release("voicemeeter-bug",4230,false);if(got.Count!=0)throw new Exception("Bug double click must await a possible third click.");classifier.Advance(5000);if(String.Join(",",got)!="voicemeeter-bug:2")throw new Exception("Bug double click also repaired.");got.Clear();
      for(int i=0;i<3;i++){classifier.Press("voicemeeter-bug",point,5200+i*150);classifier.Release("voicemeeter-bug",5230+i*150,false);}if(String.Join(",",got)!="voicemeeter-bug:3")throw new Exception("Bug triple-click classification failed.");got.Clear();
      classifier.Press("farmer",point,6000);classifier.Release("farmer",6030,false);classifier.Press("farmer",point,6200);classifier.Cancel();classifier.Release("farmer",6300,true);classifier.Advance(7000);if(got.Count!=0)throw new Exception("Drag did not cancel pending clicks.");
      classifier.Press("goldfish",point,8000);classifier.Release("goldfish",8030,false);classifier.Press("chip",point,8200);classifier.Release("chip",8230,false);classifier.Advance(9000);if(String.Join(",",got)!="chip:1")throw new Exception("Clicks merged across actors.");got.Clear();
      classifier.Press("farmer",point,9200);classifier.Release("farmer",9230,false);classifier.Press("goldfish",point,9300);classifier.Release("goldfish",9330,false);classifier.Advance(9900);if(String.Join(",",got)!="goldfish:1"||classifier.Pending)throw new Exception("Actor switch kept a stale gesture.");got.Clear();
      classifier.Press("farmer",point,10000);classifier.Release("farmer",10030,false);classifier.Press("farmer",new Point(200,100),10200);classifier.Release("farmer",10230,false);classifier.Advance(11000);if(String.Join(",",got)!="farmer:1,farmer:1")throw new Exception("Double click rectangle ignored.");
    }
    protected override void Dispose(bool disposing) { if(disposing){if(tray!=null){tray.Visible=false;tray.Dispose();}if(starBitmap!=null)starBitmap.Dispose();if(trayIcon!=null)trayIcon.Dispose();if(tracker!=null)tracker.Dispose();ClosePetWindows();clickTimer.Dispose();timer.Dispose();repaintTimer.Dispose();tooltip.Dispose();menu.Dispose();foreach(var pet in pets)pet.Dispose();if(farmer!=null)farmer.Dispose();}base.Dispose(disposing); }
  }

  internal sealed class CommandListener : IDisposable {
    readonly EventWaitHandle show,quit,check,toggleStar,lineUp,stop=new EventWaitHandle(false,EventResetMode.ManualReset);
    readonly Thread thread;
    internal CommandListener(PetsWindow window,string suffix) {
      show=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-show");quit=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-quit");check=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-check");
      toggleStar=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-toggle-star");
      lineUp=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-line-up");thread=new Thread(delegate() { while(true){int action=WaitHandle.WaitAny(new WaitHandle[]{show,quit,check,toggleStar,stop,lineUp});if(action==4)return;try{window.BeginInvoke((MethodInvoker)delegate{if(action==0)window.ShowPets();else if(action==1)window.Close();else if(action==3)window.ToggleLauncher();else if(action==5)window.LineUp();else window.WriteStatus();});}catch(InvalidOperationException){return;}} }) { IsBackground=true,Name="Desktop pets command events" };thread.Start();
    }
    public void Dispose() { stop.Set();thread.Join(1000);show.Dispose();quit.Dispose();check.Dispose();toggleStar.Dispose();lineUp.Dispose();stop.Dispose(); }
  }

  internal static class Program {
    [STAThread] static int Main(string[] args) {
      if(args.Length<1)return 2;
      try {
        PetFiles.Root=Path.GetFullPath(args[0]).TrimEnd(Path.DirectorySeparatorChar);string mode=args.Length>1?args[1]:"";bool test=mode=="--test-ui";string suffix=test?"-test":"";
        if(mode=="--install-startup"){PetFiles.Startup(true);Console.WriteLine("Desktop pets login startup enabled.");return 0;}
        if(mode=="--remove-startup"){PetFiles.Startup(false);Console.WriteLine("Desktop pets login startup removed.");return 0;}
        if(mode=="--write-star-icon"&&args.Length>2){PetsWindow.WriteStarIcon(args[2]);Console.WriteLine(args[2]);return 0;}
        if(mode=="--line-up")return PetFiles.Signal("line-up")?0:1;
        if(mode=="--toggle-star")return PetFiles.Signal("toggle-star")?0:1;
        if(mode=="--quit"||mode=="--quit-test")return PetFiles.Signal("quit",mode=="--quit-test"?"-test":"")?0:1;
        if(mode=="--check"||mode=="--check-test") { bool testCheck=mode=="--check-test";string path=testCheck?PetFiles.TestStateFile:PetFiles.StateFile;DateTime since=DateTime.UtcNow;bool running=PetFiles.Signal("check",testCheck?"-test":"");if(!running)PetFiles.WriteStatus(new{running=false,startup_enabled=PetFiles.StartupEnabled(),updated_utc=DateTime.UtcNow.ToString("o")},testCheck);else for(int i=0;i<25;i++){Thread.Sleep(40);if(File.Exists(path)&&File.GetLastWriteTimeUtc(path)>=since)break;}Console.WriteLine(File.ReadAllText(path));return running?0:1; }
        Application.EnableVisualStyles();Application.SetCompatibleTextRenderingDefault(false);
        // The self-test and previews always read this folder; a running star reads the pictures-only copy while the hub is held back.
        if(mode!="--preview"&&mode!="--self-test")PetFiles.PicturesRoot=PetFiles.ChoosePicturesRoot(PetFiles.PicturesStatusFile,DateTime.UtcNow);
        if(mode=="--preview"||mode=="--self-test")using(var window=new PetsWindow(true,20261009)) { if(mode=="--self-test")window.SelfTest();else{string path=args.Length>2?Path.GetFullPath(args[2]):Path.Combine(PetFiles.Root,"desktop-pets-preview-20261008.png");window.Preview(path);Console.WriteLine(path);}return 0; }
        using(var mutex=new Mutex(false,PetFiles.Identity+suffix)) {
          bool own=false;try{own=mutex.WaitOne(0);}catch(AbandonedMutexException){own=true;}
          if(!own){if(mode!="--startup")PetFiles.Signal("show",suffix);return 0;}
          try { using(var window=new PetsWindow(test)) { IntPtr hwnd=window.Handle;using(var listener=new CommandListener(window,suffix))Application.Run(window); } }finally{mutex.ReleaseMutex();}
        }
        return 0;
      } catch(Exception error) { Console.Error.WriteLine(error.Message);try{PetFiles.WriteStatus(new{running=false,error=error.Message,updated_utc=DateTime.UtcNow.ToString("o")});}catch{}return 1; }
    }
  }
}
