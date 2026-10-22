<#
.SYNOPSIS
    Installs Astra's PetOS (beta) for the current Windows user, with Astra's example pets or from scratch.

.DESCRIPTION
    - Opens a "Set up your farm" window with two choices (Astra, 2026-10-18):
        1. Set up Your Farm with Astra's Example Pets: every example pet comes along; delete, modify or clone any of them.
        2. Set up Your Farm From Scratch: the core kit only (the core pets, the System Map, the desktop star and the big
           red Stop button), plus any example pets you tick.
      Core pets are the ones a farm cannot run without; today that is the Friendly Farmer (role "host" in pets.json).
      Pass -Farm Example or -Farm Scratch (with -Pets) to choose without the window; -ListPets shows the ids.
    - Developer mode (Astra, 2026-10-19): a switch in the window, or -Developer. The same install in programming words
      (every pet is an agent, every pet program a control hub, The Farm the Agent Control Hub) with nothing on
      the desktop: no desktop pets are built or started, and each agent lives in the avatar panel (the cyberhome) of its
      control hub page, where one click says what it does. The Start menu gets the Agent Control Hub instead of the
      desktop pets and the Stop button. The pages read the choice from apps\words-mode-20261019.js; the words are in
      developer-words-20261019.json. Run the installer again without it to go back to the farm.
    - Copies this release to %LOCALAPPDATA%\Programs\astras-pet-os (no administrator rights needed).
    - Builds the desktop pets program FROM SOURCE on this PC with the C# compiler that ships with Windows
      (.NET Framework 4), so there is no pre-built .exe to trust: what runs is the source you can read.
    - Checks that the pets load before it says it is done.
    - Adds Start menu shortcuts: Astra's PetOS, System Map, Stop Astra's PetOS (the big red button) and Uninstall.
    - Does NOT start with Windows unless you tick it in the window or add -StartWithWindows.
    - Writes an install receipt with the version, the farm you chose and a SHA-256 of the program it built.
    - Run it again any time to change your farm: it stops the running pets, then sets the farm up again.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\installer\install-astras-pet-os-20261014.ps1

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\installer\install-astras-pet-os-20261014.ps1 -Farm Scratch -Pets goldfish,api-fairy

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\installer\install-astras-pet-os-20261014.ps1 -ListPets

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\installer\install-astras-pet-os-20261014.ps1 -Developer -Farm Scratch -Pets goldfish
#>
[CmdletBinding()]
param(
    [string]$InstallDir = (Join-Path $env:LOCALAPPDATA 'Programs\astras-pet-os'),
    [string]$ShortcutDir = (Join-Path ([Environment]::GetFolderPath('Programs')) "Astra's PetOS"),
    [ValidateSet('Example', 'Scratch')][string]$Farm,
    [string[]]$Pets = @(),
    [switch]$StartWithWindows,
    [switch]$NoLaunch,
    [switch]$ListPets,
    [switch]$Developer,
    # For tests and screenshots: draw the "Set up your farm" window (in developer words with -Developer) to this PNG
    # file and stop. Nothing is installed.
    [string]$SetupWindowPicture
)
$ErrorActionPreference = 'Stop'
$Version = 'v0.3.0-beta'

# A locked-down computer (Astra, 2026-10-19): when its administrator does not allow what this installer needs, stop
# before anything is copied and say how to use Astra's PetOS with nothing to install. Never work around its security.
$lockedDown = "Use Astra's PetOS with nothing to install: open the pets in a browser and give their Markdown files to an AI your organization allows (https://github.com/findastra/astras-pet-os/tree/main/markdown-pets), or ask your IT team whether you may install it."
if ($ExecutionContext.SessionState.LanguageMode -ne 'FullLanguage') {
    Write-Host "This computer's administrator runs PowerShell in $($ExecutionContext.SessionState.LanguageMode) mode, so the installer cannot run here. Nothing was installed."
    Write-Host $lockedDown
    exit 3
}
$source = Split-Path -Parent $PSScriptRoot
$draftsList = 'desktop-art\desktop-drafts-20261018.json'
Add-Type -AssemblyName System.Web.Extensions
$json = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$json.MaxJsonLength = 16777216

# The desktop pets read pets.json and the draft list with this same serializer, so the farm is written back with it.
function Read-Json([string]$Path) { $json.DeserializeObject([IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8)) }
function Write-Json([string]$Path, $Value) { [IO.File]::WriteAllText($Path, $json.Serialize($Value), (New-Object Text.UTF8Encoding $false)) }
function Get-Field($Entry, [string]$Key) { if ($Entry -and $Entry.ContainsKey($Key)) { $Entry[$Key] } }

# Every pet this release can put on a farm: the registered pets, then the desktop draft pets. DevName is the pet's
# name in developer mode (its agent, from developer-words-20261019.json), or its own name when it has none yet.
function Get-FarmPets([string]$Root) {
    $registry = Read-Json (Join-Path $Root 'pets.json')
    $jobs = @{}; foreach ($p in @(Get-Field $registry 'pipeline')) { if ($p) { $jobs[[string](Get-Field $p 'repo')] = [string](Get-Field $p 'job') } }
    $agents = @{}; $words = Join-Path $Root 'developer-words-20261019.json'
    if (Test-Path -LiteralPath $words) { $names = Get-Field (Read-Json $words) 'names'
        if ($names) { foreach ($k in $names.Keys) { $agents[[string]$k] = [string](Get-Field $names[$k] 'agent') } } }
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($p in @(Get-Field $registry 'pets')) {
        $repo = [string](Get-Field $p 'repo'); $name = [string](Get-Field $p 'pet')
        $list.Add([pscustomobject]@{ Id = [string](Get-Field $p 'art'); Name = $name; Repo = $repo
            Job = [string](Get-Field $p 'job'); Core = ([string](Get-Field $p 'role') -eq 'host'); Draft = $false
            DevName = $(if ($agents[$repo]) { $agents[$repo] } else { $name }) })
    }
    $drafts = Join-Path $Root $draftsList
    if (Test-Path -LiteralPath $drafts) {
        foreach ($d in @(Get-Field (Read-Json $drafts) 'pets')) {
            # Claude Bot's art is private (an exact copy of ChatGPT's BSOD), so it is never in a release.
            if ((Get-Field $d 'private') -eq $true) { continue }
            $id = [string](Get-Field $d 'id'); if (@($list | Where-Object { $_.Id -eq $id }).Count) { continue }
            # A draft points to its repo on GitHub, on any account (card 058, Part 3), or (since 2026-10-19) to its pet program page in this hub.
            $repo = ([string](Get-Field $d 'interface')) -replace '^https://github\.com/[^/]+/', '' -replace '^apps/pet-programs/(.+)-\d{8}\.html$', '$1'
            $name = [string](Get-Field $d 'name')
            $list.Add([pscustomobject]@{ Id = $id; Name = $name; Repo = $repo; Job = [string]$jobs[$repo]; Core = $false; Draft = $true
                DevName = $(if ($agents[$repo]) { $agents[$repo] } else { $name }) })
        }
    }
    , $list.ToArray()
}

# Keeps the core pets and the chosen example pets in the INSTALLED copy only. The draft list is written even when it is
# empty: without one, the desktop pets would look for an old list in %LOCALAPPDATA%. Entries are copied with foreach,
# not the pipeline, which would wrap them in PowerShell objects that the serializer cannot write.
function Set-FarmPets([string]$Dir, [string[]]$Keep) {
    $path = Join-Path $Dir 'pets.json'; $registry = Read-Json $path
    $pets = New-Object System.Collections.Generic.List[object]
    foreach ($p in $registry['pets']) { if ((Get-Field $p 'role') -eq 'host' -or $Keep -contains (Get-Field $p 'art')) { $pets.Add($p) } }
    $registry['pets'] = $pets.ToArray()
    Write-Json $path $registry
    $path = Join-Path $Dir $draftsList
    $drafts = @{ pets = @() }; if (Test-Path -LiteralPath $path) { $drafts = Read-Json $path }
    $chosen = New-Object System.Collections.Generic.List[object]
    foreach ($d in $drafts['pets']) { if ($Keep -contains (Get-Field $d 'id')) { $chosen.Add($d) } }
    $drafts['pets'] = $chosen.ToArray()
    Write-Json $path $drafts
}

# ---------- The farm lock (Astra, 2026-10-21: "All recommended on the six farm lock questions"; Part 5a of card 058,
# docs/farm-lock-20261021.md). The installer's twin of scripts/farm-lock-20261021.mjs: a pet picked from scratch
# brings every pet it requires (answer 6), and setting up a farm writes its farm lock, which the Friendly Farmer's
# farm-pets tool reads and keeps. test/farm-lock-test-20261021.mjs checks that these give what Node gives. ----------
$farmLock = 'farm-lock-20261021.json'
$farmCatalog = 'farm-catalog'
$upstreamOwner = 'findastra'   # Astra's PetOS itself (upstream), as upstream() in scripts/farm-owner-20261020.mjs says

# A JSON string, escaped exactly as Node's JSON.stringify escapes it.
function ConvertTo-JsonText([string]$Text) {
    $sb = New-Object System.Text.StringBuilder; [void]$sb.Append('"')
    foreach ($ch in $Text.ToCharArray()) {
        $c = [int]$ch
        if ($c -eq 34) { [void]$sb.Append('\"') } elseif ($c -eq 92) { [void]$sb.Append('\\') }
        elseif ($c -eq 8) { [void]$sb.Append('\b') } elseif ($c -eq 12) { [void]$sb.Append('\f') } elseif ($c -eq 10) { [void]$sb.Append('\n') }
        elseif ($c -eq 13) { [void]$sb.Append('\r') } elseif ($c -eq 9) { [void]$sb.Append('\t') }
        elseif ($c -lt 32) { [void]$sb.Append(('\u{0:x4}' -f $c)) } else { [void]$sb.Append($ch) }
    }
    [void]$sb.Append('"'); $sb.ToString()
}

# JSON with every object's keys in order and no spaces: the same text as canonicalJson in Node (whole numbers only).
function ConvertTo-CanonicalJson($Value) {
    if ($null -eq $Value) { return 'null' }
    if ($Value -is [bool]) { if ($Value) { return 'true' } else { return 'false' } }
    if ($Value -is [string]) { return ConvertTo-JsonText $Value }
    if ($Value -is [int] -or $Value -is [long] -or $Value -is [decimal] -or $Value -is [double] -or $Value -is [int16] -or $Value -is [byte]) {
        if ([Math]::Floor([double]$Value) -ne [double]$Value) { throw "ConvertTo-CanonicalJson: $Value is not a whole number" }
        return ([decimal]$Value).ToString('0', [Globalization.CultureInfo]::InvariantCulture)
    }
    if ($Value -is [System.Collections.IDictionary]) {
        $keys = [string[]]@($Value.Keys); [Array]::Sort($keys, [StringComparer]::Ordinal)
        return '{' + (@($keys | ForEach-Object { (ConvertTo-JsonText $_) + ':' + (ConvertTo-CanonicalJson $Value[$_]) }) -join ',') + '}'
    }
    if ($Value -is [System.Collections.IEnumerable]) { return '[' + (@(foreach ($v in $Value) { ConvertTo-CanonicalJson $v }) -join ',') + ']' }
    throw "ConvertTo-CanonicalJson: cannot write a $($Value.GetType().Name)"
}

# The SHA-256 of a pet's entry (its pets.json entry, or its line in the draft list), as written on the farm.
function Get-EntryHash($Entry) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $bytes = $sha.ComputeHash([Text.Encoding]::UTF8.GetBytes((ConvertTo-CanonicalJson $Entry))) } finally { $sha.Dispose() }
    -join @($bytes | ForEach-Object { $_.ToString('x2') })
}

# Now in America/Denver, as Astra's records are dated: 2026-10-21T22:30:00-06:00.
function Get-DenverNow {
    $tz = [TimeZoneInfo]::FindSystemTimeZoneById('Mountain Standard Time')
    [TimeZoneInfo]::ConvertTime([DateTimeOffset]::UtcNow, $tz).ToString("yyyy-MM-dd'T'HH:mm:sszzz", [Globalization.CultureInfo]::InvariantCulture)
}

# Each repo's needs from pets.json (registered, then pipeline: a later entry wins, as in farmPets).
function Get-NeedsByRepo($Registry) {
    $map = @{}
    foreach ($p in @(Get-Field $Registry 'pets') + @(Get-Field $Registry 'pipeline')) { if ($p) { $map[[string](Get-Field $p 'repo')] = Get-Field $p 'needs' } }
    $map
}
# One farm pet's needs: a registered pet's own entry's, a draft pet's by its repo.
function Get-PetNeeds($Registry, $NeedsByRepo, $Pet) {
    if (-not $Pet.Draft) { foreach ($p in @(Get-Field $Registry 'pets')) { if ($p -and [string](Get-Field $p 'art') -eq $Pet.Id) { return Get-Field $p 'needs' } } return $null }
    $NeedsByRepo[$Pet.Repo]
}
function Get-RequiredRepos($Needs) { @(@(Get-Field $Needs 'pets') | Where-Object { $_ -and (Get-Field $_ 'how') -eq 'required' } | ForEach-Object { [string](Get-Field $_ 'repo') }) }

# The pets that must come too when $Picks (ids) come to a farm: every required pet, all the way down; optional pets never
# pull anything in. The twin of requiredClosure in scripts/farm-lock-20261021.mjs: Keep (ids coming, in the list's
# order), NeededBy (id: the repos that need it, for the ones that come only as a need) and Stops.
function Resolve-NeededPets([object[]]$FarmPets, $Registry, [string[]]$Picks, [string[]]$Here) {
    $s = @{ ByRepo = @{}; Needs = (Get-NeedsByRepo $Registry); Registry = $Registry; Here = @($Here); Coming = @{}
        NeededBy = [ordered]@{}; Stops = (New-Object System.Collections.Generic.List[string]) }
    foreach ($p in $FarmPets) { $s.ByRepo[$p.Repo] = $p }
    foreach ($id in @($Picks)) {
        $pet = @($FarmPets | Where-Object { $_.Id -eq $id })[0]
        if (-not $pet -or $s.Here -contains $id) { continue }
        $s.Coming[$id] = $true
        Add-NeededPets $pet @($pet.Repo) $s
    }
    foreach ($id in @($Picks)) { if ($s.NeededBy.Contains($id)) { $s.NeededBy.Remove($id) } }
    @{ Keep = @($FarmPets | Where-Object { $s.Coming.ContainsKey($_.Id) } | ForEach-Object { $_.Id }); NeededBy = $s.NeededBy; Stops = $s.Stops.ToArray() }
}
function Add-NeededPets($Pet, [string[]]$Path, $s) {
    foreach ($repo in (Get-RequiredRepos (Get-PetNeeds $s.Registry $s.Needs $Pet))) {
        $next = $s.ByRepo[$repo]
        if ($Path -contains $repo) { $s.Stops.Add("a loop of required pets: $(($Path + $repo) -join ' > ')"); continue }
        if (-not $next) { $s.Stops.Add("$($Pet.Name) needs $repo, which is not one of this farm's pets (its release or hub copy): get it with a pet pack, or register it first"); continue }
        if ($s.Here -contains $next.Id) { continue }
        if (-not $s.NeededBy.Contains($next.Id)) { $s.NeededBy[$next.Id] = New-Object System.Collections.Generic.List[string] }
        if (-not $s.NeededBy[$next.Id].Contains($Pet.Repo)) { $s.NeededBy[$next.Id].Add($Pet.Repo) }
        if ($s.Coming.ContainsKey($next.Id)) { continue }
        $s.Coming[$next.Id] = $true
        Add-NeededPets $next (@($Path) + $repo) $s
    }
}

# The names an AI or a person typed for -Pets (ids, repos, pet names or agent names) as pet ids.
function Find-FarmPicks([object[]]$FarmPets, [string[]]$Names) {
    $ids = @()
    foreach ($name in @($Names | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })) {
        $match = @($FarmPets | Where-Object { -not $_.Core -and ($_.Id -eq $name -or $_.Repo -eq $name -or $_.Name -eq $name -or $_.DevName -eq $name) })
        if (-not $match.Count) { throw "There is no example pet called '$name'. You can pick: $(($FarmPets | Where-Object { -not $_.Core } | ForEach-Object { $_.Id }) -join ', ')" }
        $ids += $match[0].Id
    }
    @($ids | Select-Object -Unique)
}

# What a pet needs that this farm does not have and the Friendly Farmer cannot add (answer 4: it still comes in, and the
# farm lock marks it). The twin of missingNeeds in scripts/farm-lock-20261021.mjs.
function Get-MissingNeeds($Needs, [string]$Os, $Parts, $Registry, $ProgramNames) {
    if (-not $Needs) { return , @() }
    $key = Get-Field $Registry 'needs_key'; $out = New-Object System.Collections.Generic.List[object]
    $oses = @(@(Get-Field $Needs 'os') | Where-Object { $_ } | ForEach-Object { [string]$_ })
    if ($oses.Count -and $oses -notcontains $Os) {
        $names = @($oses | ForEach-Object { $n = Get-Field (Get-Field $key 'os') $_; if ($n) { ([string]$n) -replace '\.$', '' } else { $_ } })
        $out.Add([ordered]@{ kind = 'os'; id = ($oses -join ','); name = ($names -join ' or '); state = 'not this computer' })
    }
    foreach ($c in @(Get-Field $Needs 'core')) { if ($c -and (Get-Field $c 'how') -eq 'required' -and -not $Parts[[string](Get-Field $c 'part')]) {
        $part = [string](Get-Field $c 'part'); $n = Get-Field (Get-Field (Get-Field $key 'core') $part) 'name'
        $out.Add([ordered]@{ kind = 'core'; id = $part; name = $(if ($n) { [string]$n } else { $part }); state = 'not on this farm' }) } }
    foreach ($p in @(Get-Field $Needs 'programs')) { if ($p -and (Get-Field $p 'how') -eq 'required') {
        $node = [string](Get-Field $p 'node')
        $out.Add([ordered]@{ kind = 'program'; id = $node; name = $(if ($ProgramNames[$node]) { $ProgramNames[$node] } else { $node }); state = 'not checked' }) } }
    , $out.ToArray()
}

# The System Map's names for its nodes (system-map.json), for the programs a pet needs.
function Get-ProgramNames([string]$Root) {
    $names = @{}; $map = Join-Path $Root 'system-map.json'
    if (Test-Path -LiteralPath $map) { foreach ($n in @(Get-Field (Read-Json $map) 'nodes')) { if ($n) { $names[[string](Get-Field $n 'id')] = [string](Get-Field $n 'name') } } }
    $names
}

# The account a repo lives on, as the farm's pets.json says: the twin of ownerOf in scripts/farm-owner-20261020.mjs.
function Get-PetAccount($Registry, [string]$Repo) {
    $farm = [string](Get-Field $Registry 'github_owner'); if (-not $farm) { $farm = $upstreamOwner }
    foreach ($p in @(Get-Field $Registry 'pets') + @(Get-Field $Registry 'pipeline')) {
        if ($p -and [string](Get-Field $p 'repo') -eq $Repo) { $o = Get-Field $p 'github_owner'; if ($null -ne $o) { return [string]$o }; return $farm } }
    if ($Repo -and $Repo -eq [string](Get-Field $Registry 'cage')) { return $farm }
    foreach ($c in @(Get-Field $Registry 'candidates')) {
        if ($c -and [string](Get-Field $c 'repo') -eq $Repo) { $o = Get-Field $c 'github_owner'; if ($null -ne $o) { return [string]$o }; return $farm } }
    $upstreamOwner
}

# The farm lock for the farm in $Dir, from what is on it now: the twin of buildLock in scripts/farm-lock-20261021.mjs.
# $Info: Version, Commit, Mode, Os, Parts. $Previous: the lock before (its history and each pet's code are kept).
function New-FarmLock([string]$Dir, [string[]]$Chosen, $Info, $ProgramNames, $Previous, [string]$Did, [string]$Now) {
    $registry = Read-Json (Join-Path $Dir 'pets.json')
    $drafts = @{ pets = @() }; if (Test-Path -LiteralPath (Join-Path $Dir $draftsList)) { $drafts = Read-Json (Join-Path $Dir $draftsList) }
    $onFarm = Get-FarmPets $Dir; $needsByRepo = Get-NeedsByRepo $registry
    $needsOf = @{}; foreach ($p in $onFarm) { $needsOf[$p.Id] = Get-PetNeeds $registry $needsByRepo $p }
    $before = @{}; foreach ($p in @(Get-Field $Previous 'pets')) { if ($p) { $before[[string](Get-Field $p 'id')] = $p } }
    $pets = New-Object System.Collections.Generic.List[object]
    foreach ($p in $onFarm) {
        $entry = $null
        if ($p.Draft) { foreach ($d in @(Get-Field $drafts 'pets')) { if ($d -and [string](Get-Field $d 'id') -eq $p.Id) { $entry = $d; break } } }
        else { foreach ($x in @(Get-Field $registry 'pets')) { if ($x -and [string](Get-Field $x 'art') -eq $p.Id) { $entry = $x; break } } }
        if (-not $entry) { throw "$($p.Name) ($($p.Id)) is on the farm's list but has no entry in its $(if ($p.Draft) { 'draft list' } else { 'pets.json' })" }
        $version = $null
        foreach ($x in @(Get-Field $registry 'pets') + @(Get-Field $registry 'pipeline')) { if ($x -and [string](Get-Field $x 'repo') -eq $p.Repo) { $version = Get-Field $x 'version'; break } }
        $neededBy = @($onFarm | Where-Object { (Get-RequiredRepos $needsOf[$_.Id]) -contains $p.Repo } | ForEach-Object { $_.Repo })
        $pets.Add([ordered]@{ id = $p.Id; repo = $p.Repo; pet = $p.Name; account = (Get-PetAccount $registry $p.Repo); core = [bool]$p.Core; draft = [bool]$p.Draft
            version = $version; entry = [ordered]@{ came_from = 'installer'; release = $Info.Version; sha256 = (Get-EntryHash $entry) }
            code = $(if ($before.ContainsKey($p.Id)) { Get-Field $before[$p.Id] 'code' } else { $null })
            chosen = ([bool]$p.Core -or @($Chosen) -contains $p.Id); needed_by = [object[]]$neededBy; needs = $needsOf[$p.Id]
            missing = [object[]](Get-MissingNeeds $needsOf[$p.Id] $Info.Os $Info.Parts $registry $ProgramNames) })
    }
    $history = New-Object System.Collections.Generic.List[object]
    foreach ($h in @(Get-Field $Previous 'history')) { if ($h) { $history.Add($h) } }
    $history.Add([ordered]@{ at = $Now; did = $Did; pets = [object[]]@($onFarm | ForEach-Object { $_.Repo }); by = 'installer/install-astras-pet-os-20261014.ps1' })
    $owner = [string](Get-Field $registry 'github_owner'); if (-not $owner) { $owner = $upstreamOwner }
    [ordered]@{ schema = 'astras-pet-os-farm-lock-v1'; written_by = 'installer/install-astras-pet-os-20261014.ps1'; updated = $Now
        farm = [ordered]@{ github_owner = $owner; kind = 'installed'; release = [ordered]@{ version = $Info.Version; commit = $Info.Commit }
            mode = $Info.Mode; os = $Info.Os; core_parts = $Info.Parts }
        pets = $pets.ToArray(); history = $history.ToArray() }
}

# The window's words: the farm words, or developer mode's programming words (Astra, 2026-10-19: "so that the legitimate
# programmers don't get annoyed when they install these packages"). {0} is a number or a pet's job.
function Get-SetupWords([bool]$Dev) {
    if ($Dev) {
        return @{ Window = "Install - Astra's PetOS $Version (developer mode)"; Heading = "Install Astra's PetOS"
            Lead = 'Programming words and nothing on your desktop: each agent lives in its control hub page. Installs for you only (no administrator rights).'
            Example = "1.  Install with Astra's Example Agents"
            ExampleText = "All {0} of Astra's agents, plus the core kit. They are examples: you can delete, modify, or fork any of them."
            Scratch = '2.  Minimal Install'
            ScratchText = "Just the core kit: the core agents, the Agent Control Hub and the System Map. Tick any of Astra's agents below to add them."
            Column = 'Agent'; CoreGroup = 'Core agents: always installed, they cannot be removed'; ExampleGroup = "Astra's example agents"
            Draft = 'Draft agent.'; DraftJob = 'Draft. {0}'; NeededBy = 'Needed by {0}.'; One = '1 agent will be installed.'; Many = '{0} agents will be installed.'; Ok = 'Install' }
    }
    @{ Window = "Set up your farm - Astra's PetOS $Version"; Heading = 'Set up your farm'
        Lead = "Astra's PetOS is in beta. It installs for you only (no administrator rights) and you can uninstall it from the Start menu."
        Example = "1.  Set up Your Farm with Astra's Example Pets"
        ExampleText = "All {0} of Astra's pets come to your farm, plus the core kit. They are examples: you can delete, modify, or clone any of them."
        Scratch = '2.  Set up Your Farm From Scratch'
        ScratchText = "Just the core kit: the core pets, the desktop star, the System Map and the big red Stop button. Tick any of Astra's pets below to bring them along too."
        Column = 'Pet'; CoreGroup = 'Core pets: on every farm, they cannot be taken away'; ExampleGroup = "Astra's example pets"
        Draft = 'Draft pet.'; DraftJob = 'Draft. {0}'; NeededBy = 'Needed by {0}.'; One = '1 pet will live on your farm.'; Many = '{0} pets will live on your farm.'; Ok = 'Set up my farm' }
}

# Developer mode's word swap for the pets' jobs: the same lists and rules as the pages, read from the file the build
# writes for them (apps\developer-words-20261019.js, from developer-words-20261019.json). Names and the exact words go
# first, as written; then the other words in any case, keeping the case found; never inside a longer word, a file name,
# a path or a hyphenated label. test/developer-mode-test-20261019.mjs checks it gives what the pages give.
function Get-DevWords([string]$Root) {
    $file = Join-Path $Root 'apps\developer-words-20261019.js'
    if (-not (Test-Path -LiteralPath $file)) { return $null }
    $line = @([IO.File]::ReadAllLines($file, [Text.Encoding]::UTF8) | Where-Object { $_.StartsWith('window.PetOSWordsData = ') })[0]
    if (-not $line) { return $null }
    $data = $json.DeserializeObject($line.Substring('window.PetOSWordsData = '.Length).TrimEnd(';'))
    $pass = { param($Pairs, [bool]$IgnoreCase)
        $map = New-Object 'System.Collections.Generic.Dictionary[string,string]'   # case-sensitive, unlike @{}
        foreach ($p in $Pairs) { $k = if ($IgnoreCase) { ([string]$p[0]).ToLowerInvariant() } else { [string]$p[0] }; if (-not $map.ContainsKey($k)) { $map[$k] = [string]$p[1] } }
        $alt = ($Pairs | ForEach-Object { [string]$_[0] } | Sort-Object { $_.Length } -Descending | ForEach-Object { [regex]::Escape($_) }) -join '|'
        $options = if ($IgnoreCase) { [Text.RegularExpressions.RegexOptions]::IgnoreCase } else { [Text.RegularExpressions.RegexOptions]::None }
        @{ Map = $map; IgnoreCase = $IgnoreCase
            Re = New-Object Text.RegularExpressions.Regex("(?<![A-Za-z0-9_./\\@#-])($alt)(?![A-Za-z0-9_/\\@-]|\.[A-Za-z0-9_])", $options) } }
    @{ Exact = (& $pass $data['exact'] $false); Words = (& $pass $data['words'] $true) }
}
function Format-DevCase([string]$Found, [string]$Out) {
    if ($Found.Length -gt 1 -and $Found -ceq $Found.ToUpperInvariant() -and $Found -cmatch '[A-Z]') { return $Out.ToUpperInvariant() }
    $parts = $Found.Split(' ')
    if ($parts.Count -gt 1 -and @($parts | Where-Object { $_ -cnotmatch '^[A-Z]' }).Count -eq 0) {
        return (($Out.Split(' ') | ForEach-Object { if ($_ -cmatch '^[a-z]') { $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1) } else { $_ } }) -join ' ') }
    if ($Found -cmatch '^[A-Z]') { return $Out.Substring(0, 1).ToUpperInvariant() + $Out.Substring(1) }
    $Out
}
function Convert-DevWords([string]$Text, $DevWords) {
    if (-not $DevWords -or -not $Text) { return $Text }
    foreach ($pass in @($DevWords.Exact, $DevWords.Words)) {
        $sb = New-Object System.Text.StringBuilder; $at = 0
        foreach ($m in $pass.Re.Matches($Text)) {
            [void]$sb.Append($Text, $at, $m.Index - $at)
            [void]$sb.Append($(if ($pass.IgnoreCase) { Format-DevCase $m.Value $pass.Map[$m.Value.ToLowerInvariant()] } else { $pass.Map[$m.Value] }))
            $at = $m.Index + $m.Length
        }
        [void]$sb.Append($Text, $at, $Text.Length - $at); $Text = $sb.ToString()
    }
    $Text
}

# The "Set up your farm" window. Returns the choice, or $null when it is closed or cancelled. Its Developer mode switch
# changes every word of the window at once. With $SavePicture, it draws the window to that PNG file and returns $null.
# $StartScratch and $StartPicks open it on From Scratch with those pets ticked (the farm's own, when it runs again).
function Show-FarmSetup([object[]]$FarmPets, [bool]$StartChecked, [bool]$DevChecked, [string]$SavePicture, $Registry, [string[]]$StartPicks, [bool]$StartScratch) {
    Add-Type -AssemblyName System.Windows.Forms, System.Drawing
    [System.Windows.Forms.Application]::EnableVisualStyles()
    $examples = @($FarmPets | Where-Object { -not $_.Core }).Count
    $devWords = Get-DevWords $source
    $bold = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
    $grey = [System.Drawing.Color]::FromArgb(90, 90, 90)
    $form = New-Object System.Windows.Forms.Form -Property @{
        Text = "Set up your farm - Astra's PetOS $Version"; StartPosition = 'CenterScreen'; FormBorderStyle = 'FixedDialog'
        MaximizeBox = $false; MinimizeBox = $false; ClientSize = New-Object System.Drawing.Size(620, 722); TopMost = $true
        Font = New-Object System.Drawing.Font('Segoe UI', 9.5); BackColor = [System.Drawing.Color]::White }
    $picture = Join-Path $source 'desktop-art\farmer\happy-20261011.png'
    if (Test-Path -LiteralPath $picture) {
        $farmer = New-Object System.Drawing.Bitmap($picture)
        $form.Controls.Add((New-Object System.Windows.Forms.PictureBox -Property @{ Image = $farmer; SizeMode = 'Zoom'; Location = '532, 10'; Size = '72, 72' }))
        try { $form.Icon = [System.Drawing.Icon]::FromHandle($farmer.GetHicon()) } catch { }
    }
    $heading = New-Object System.Windows.Forms.Label -Property @{ Text = 'Set up your farm'; Location = '16, 14'; Size = '500, 34'
        Font = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold) }
    $lead = New-Object System.Windows.Forms.Label -Property @{ Location = '18, 50'; Size = '500, 40'; ForeColor = $grey
        Text = "Astra's PetOS is in beta. It installs for you only (no administrator rights) and you can uninstall it from the Start menu." }
    # Developer mode (Astra, 2026-10-19): "a switch, developer switch, to have at the installation at the beginning".
    $dev = New-Object System.Windows.Forms.CheckBox -Property @{ Text = 'Developer mode: programming words (agents, control hubs) and no pets on the desktop'
        Location = '18, 94'; Size = '590, 24'; Checked = $DevChecked }
    $form.Controls.AddRange(@($heading, $lead, $dev))

    $example = New-Object System.Windows.Forms.RadioButton -Property @{ Text = "1.  Set up Your Farm with Astra's Example Pets"; Font = $bold
        Location = '16, 128'; Size = '590, 26'; Checked = $true }
    $exampleText = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 156'; Size = '560, 38'
        Text = "All $examples of Astra's pets come to your farm, plus the core kit. They are examples: you can delete, modify, or clone any of them." }
    $scratch = New-Object System.Windows.Forms.RadioButton -Property @{ Text = '2.  Set up Your Farm From Scratch'; Font = $bold
        Location = '16, 202'; Size = '590, 26' }
    $scratchText = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 230'; Size = '560, 38'
        Text = "Just the core kit: the core pets, the desktop star, the System Map and the big red Stop button. Tick any of Astra's pets below to bring them along too." }
    $exampleText.Add_Click({ $example.Checked = $true }); $scratchText.Add_Click({ $scratch.Checked = $true })
    $form.Controls.AddRange(@($example, $exampleText, $scratch, $scratchText))

    $list = New-Object System.Windows.Forms.ListView -Property @{ View = 'Details'; CheckBoxes = $true; FullRowSelect = $true
        HeaderStyle = 'Nonclickable'; ShowItemToolTips = $true; Location = '40, 274'; Size = '564, 300'; Enabled = $false }
    [void]$list.Columns.Add('Pet', 170); [void]$list.Columns.Add('What it does', 370)
    $coreGroup = New-Object System.Windows.Forms.ListViewGroup('Core pets: on every farm, they cannot be taken away')
    $exampleGroup = New-Object System.Windows.Forms.ListViewGroup("Astra's example pets")
    $list.Groups.AddRange(@($coreGroup, $exampleGroup))
    foreach ($p in @($FarmPets | Where-Object { $_.Core }) + @($FarmPets | Where-Object { -not $_.Core } | Sort-Object Name)) {
        $what = if (-not $p.Draft) { $p.Job } elseif ($p.Job) { "Draft. $($p.Job)" } else { 'Draft pet.' }
        $item = New-Object System.Windows.Forms.ListViewItem($p.Name)
        [void]$item.SubItems.Add($what); $item.ToolTipText = $what; $item.Tag = $p; $item.Checked = $true
        $item.Group = if ($p.Core) { $coreGroup } else { $exampleGroup }
        if ($p.Core) { $item.ForeColor = [System.Drawing.SystemColors]::GrayText }
        [void]$list.Items.Add($item)
    }
    $form.Controls.Add($list)
    $count = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 580'; Size = '564, 22'; ForeColor = $grey }
    $form.Controls.Add($count)
    $start = New-Object System.Windows.Forms.CheckBox -Property @{ Text = 'Start my pets when Windows starts'; Location = '18, 622'
        Size = '400, 24'; Checked = $StartChecked }
    $form.Controls.Add($start)
    $ok = New-Object System.Windows.Forms.Button -Property @{ Text = 'Set up my farm'; Location = '372, 670'; Size = '136, 34'; DialogResult = 'OK' }
    $cancel = New-Object System.Windows.Forms.Button -Property @{ Text = 'Cancel'; Location = '516, 670'; Size = '88, 34'; DialogResult = 'Cancel' }
    $form.Controls.AddRange(@($ok, $cancel)); $form.AcceptButton = $ok; $form.CancelButton = $cancel

    # Example: every pet ticked and the list locked. From Scratch: the list opens with only the core pets ticked, or the
    # farm's own picks when the installer runs again (its farm lock), and keeps the picks made last time From Scratch was
    # chosen. A core pet can never be unticked. A pet that a ticked pet needs is ticked too and locked, "Needed by ..."
    # (Astra's answer 6, 2026-10-21: the same check as the Friendly Farmer's, Resolve-NeededPets).
    $picks = @{}; foreach ($id in @($StartPicks)) { if ($id) { $picks[$id] = $true } }
    # Ready: the list sends its own check events while its window is made; only a person's clicks after that are picks.
    $state = @{ Needed = [ordered]@{}; Busy = $false; Ready = $false }
    $byRepo = @{}; foreach ($p in $FarmPets) { $byRepo[$p.Repo] = $p }
    $coreIds = @($FarmPets | Where-Object { $_.Core } | ForEach-Object { $_.Id })
    $showCount = { $n = @($list.Items | Where-Object { $_.Checked }).Count; $w = Get-SetupWords $dev.Checked
        $count.Text = if ($n -eq 1) { $w.One } else { $w.Many -f $n } }
    $describe = { param($p)
        $w = Get-SetupWords $dev.Checked
        $job = if ($dev.Checked) { Convert-DevWords $p.Job $devWords } else { $p.Job }
        $what = if (-not $p.Draft) { $job } elseif ($job) { $w.DraftJob -f $job } else { $w.Draft }
        if ($state.Needed.Contains($p.Id)) {
            $names = @($state.Needed[$p.Id] | ForEach-Object { $q = $byRepo[$_]; if (-not $q) { $_ } elseif ($dev.Checked) { $q.DevName } else { $q.Name } }) -join ' and '
            $what = "$($w.NeededBy -f $names) $what" }
        $what }
    $apply = {
        $state.Busy = $true
        $state.Needed = if ($scratch.Checked -and $Registry) { (Resolve-NeededPets $FarmPets $Registry @($picks.Keys | Where-Object { $picks[$_] }) $coreIds).NeededBy } else { [ordered]@{} }
        $list.BeginUpdate()
        foreach ($i in $list.Items) { $p = $i.Tag
            $i.Text = if ($dev.Checked) { $p.DevName } else { $p.Name }
            if (-not $p.Core) {
                $i.Checked = (-not $scratch.Checked) -or [bool]$picks[$p.Id] -or $state.Needed.Contains($p.Id)
                $i.ForeColor = if ($state.Needed.Contains($p.Id) -and -not $picks[$p.Id]) { [System.Drawing.SystemColors]::GrayText } else { [System.Drawing.SystemColors]::WindowText } }
            $what = & $describe $p; $i.SubItems[1].Text = $what; $i.ToolTipText = $what }
        $list.EndUpdate()
        $state.Busy = $false; & $showCount }
    $list.Add_ItemCheck({ param($s, $e) if ($s.Items[$e.Index].Tag.Core) { $e.NewValue = 'Checked' } elseif ($state.Ready -and -not $state.Busy -and $state.Needed.Contains($s.Items[$e.Index].Tag.Id)) { $e.NewValue = 'Checked' } })
    $list.Add_ItemChecked({ param($s, $e) if ($state.Ready -and -not $state.Busy -and $scratch.Checked -and -not $e.Item.Tag.Core) { $picks[$e.Item.Tag.Id] = $e.Item.Checked; & $apply } elseif ($state.Ready) { & $showCount } })
    $scratch.Add_CheckedChanged({ $list.Enabled = $scratch.Checked; & $apply })
    # Developer mode: every word of the window changes at once; there are no desktop pets to start with Windows.
    $relabel = {
        $w = Get-SetupWords $dev.Checked
        $form.Text = $w.Window; $heading.Text = $w.Heading; $lead.Text = $w.Lead
        $example.Text = $w.Example; $exampleText.Text = $w.ExampleText -f $examples
        $scratch.Text = $w.Scratch; $scratchText.Text = $w.ScratchText
        $list.Columns[0].Text = $w.Column; $coreGroup.Header = $w.CoreGroup; $exampleGroup.Header = $w.ExampleGroup
        $start.Visible = -not $dev.Checked; $ok.Text = $w.Ok
        & $apply }
    $dev.Add_CheckedChanged($relabel)
    $form.Add_Shown({ $form.TopMost = $false; $form.Activate(); $ok.Focus() })
    $form.Add_Shown({ $state.Ready = $true; & $apply
        if ($scratch.Checked) { $first = @(@($list.Items | Where-Object { $state.Needed.Contains($_.Tag.Id) }) + @($list.Items | Where-Object { $_.Checked -and -not $_.Tag.Core }))[0]; if ($first) { $first.EnsureVisible() } } })
    if ($StartScratch) { $scratch.Checked = $true }
    & $relabel

    if ($SavePicture) {   # for tests and screenshots: draw the window off the screen, save it, close it
        $form.StartPosition = 'Manual'; $form.Location = New-Object System.Drawing.Point(-4000, -4000); $form.TopMost = $false
        $form.Show(); [System.Windows.Forms.Application]::DoEvents()
        $shot = New-Object System.Drawing.Bitmap($form.Width, $form.Height)
        $form.DrawToBitmap($shot, (New-Object System.Drawing.Rectangle(0, 0, $form.Width, $form.Height)))
        $png = New-Object System.IO.MemoryStream; $shot.Save($png, [System.Drawing.Imaging.ImageFormat]::Png); $shot.Dispose()
        [IO.File]::WriteAllBytes($SavePicture, $png.ToArray())
        $form.Close(); $form.Dispose()
        return $null
    }
    $answer = $form.ShowDialog()
    $choice = if ($answer -eq [System.Windows.Forms.DialogResult]::OK) {
        [pscustomobject]@{ Farm = $(if ($scratch.Checked) { 'Scratch' } else { 'Example' }); StartWithWindows = ($start.Checked -and -not $dev.Checked)
            Developer = $dev.Checked; Pets = @($list.Items | Where-Object { $_.Checked -and -not $_.Tag.Core -and ($example.Checked -or $picks[$_.Tag.Id]) } | ForEach-Object { $_.Tag.Id }) } }
    $form.Dispose()
    $choice
}

function Show-Message([string]$Text, [string]$Icon = 'Information') {
    Add-Type -AssemblyName System.Windows.Forms
    [void][System.Windows.Forms.MessageBox]::Show($Text, "Astra's PetOS $Version", 'OK', $Icon)
}

Write-Host "Astra's PetOS $Version installer"
$windowUsed = $false
try {
    # 1. Check what we need (the C# compiler only for the desktop pets, so after the choice: developer mode has none)
    if (-not (Test-Path -LiteralPath (Join-Path $source 'pets.json'))) { throw "Run this from the unzipped Astra's PetOS folder (pets.json not found next to installer\)." }
    $csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
    if ($InstallDir -notmatch 'astras-pet-os$') { throw "InstallDir must end in 'astras-pet-os' so the uninstaller can find it safely." }

    # 2. Choose the farm: in the window, or with -Farm (and -Pets, and -Developer) for no window
    $farmPets = Get-FarmPets $source
    $registry = Read-Json (Join-Path $source 'pets.json')
    $coreIds = @($farmPets | Where-Object { $_.Core } | ForEach-Object { $_.Id })
    # Running it again: the farm lock says which pets the farm has, so the window opens with them (Part 5a of card 058).
    $previousLock = $null; $lockPath = Join-Path $InstallDir $farmLock
    if (Test-Path -LiteralPath $lockPath) { try { $previousLock = Read-Json $lockPath } catch { Write-Host "The farm lock in $InstallDir could not be read; the farm is set up again from your choice." } }
    if ($ListPets) {   # for AI agents: the ids -Pets takes; nothing is installed. With -Developer, each pet's agent too.
        $devWords = if ($Developer) { Get-DevWords $source }
        $farmPets | ForEach-Object { $row = [ordered]@{ id = $_.Id; pet = $_.Name }; if ($Developer) { $row.agent = $_.DevName }
            $row.kind = $(if ($_.Core) { $(if ($Developer) { 'core: always installed' } else { 'core: always on the farm' }) } elseif ($_.Draft) { 'example (draft)' } else { 'example' }); $row.job = $(if ($Developer) { Convert-DevWords $_.Job $devWords } else { $_.Job })
            [pscustomobject]$row } | Format-Table -AutoSize -Wrap | Out-String -Width 180 | Write-Host
        return
    }
    if ($SetupWindowPicture) {
        $SetupWindowPicture = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($SetupWindowPicture)
        # With -Farm Scratch -Pets, the picture shows those picks and the pets they need.
        $startPicks = if ($Farm -eq 'Scratch') { @(Find-FarmPicks $farmPets $Pets) } else { @() }
        $null = Show-FarmSetup $farmPets $StartWithWindows.IsPresent $Developer.IsPresent $SetupWindowPicture $registry $startPicks ($Farm -eq 'Scratch')
        Write-Host "Saved a picture of the window to $SetupWindowPicture. Nothing was installed."
        return
    }
    if (-not $Farm) {
        Write-Host 'Choose your farm in the "Set up your farm" window.'
        $windowUsed = $true
        $startPicks = @(); $startScratch = $false
        if ($previousLock) {
            $lockPets = @(@(Get-Field $previousLock 'pets') | Where-Object { $_ -and -not (Get-Field $_ 'core') })
            $startPicks = @($lockPets | Where-Object { Get-Field $_ 'chosen' } | ForEach-Object { [string](Get-Field $_ 'id') } | Where-Object { $id = $_; @($farmPets | Where-Object { $_.Id -eq $id }).Count })
            $startScratch = $lockPets.Count -lt @($farmPets | Where-Object { -not $_.Core }).Count
        }
        $choice = Show-FarmSetup $farmPets $StartWithWindows.IsPresent $Developer.IsPresent '' $registry $startPicks $startScratch
        if (-not $choice) { Write-Host 'Cancelled. Nothing was installed.'; return }
        $Farm = $choice.Farm; $Pets = $choice.Pets; $StartWithWindows = [bool]$choice.StartWithWindows; $Developer = [bool]$choice.Developer
    }
    # Developer mode (Astra, 2026-10-19): programming words and nothing on the desktop, so nothing to build or start.
    $dev = [bool]$Developer
    if ($dev) { $StartWithWindows = $false }
    elseif (-not (Test-Path -LiteralPath $csc)) { throw "The C# compiler that ships with Windows (.NET Framework 4) was not found: $csc. Nothing was installed. $lockedDown" }
    $keep = @(); $picked = @()
    if ($Farm -eq 'Scratch') {
        $picked = @(Find-FarmPicks $farmPets $Pets)
        # A picked pet brings every pet it requires, all the way down (Astra's answer 6, 2026-10-21).
        $needed = Resolve-NeededPets $farmPets $registry $picked $coreIds
        if ($needed.Stops.Count) { throw "This farm cannot be set up: $($needed.Stops -join '; ')." }
        $keep = @($needed.Keep)
        $called = { param($p) if ($dev) { $p.DevName } else { $p.Name } }
        foreach ($id in @($needed.NeededBy.Keys)) {
            $by = @($needed.NeededBy[$id] | ForEach-Object { $r = $_; & $called @($farmPets | Where-Object { $_.Repo -eq $r })[0] })
            Write-Host "$(& $called @($farmPets | Where-Object { $_.Id -eq $id })[0]) comes along: $($by -join ' and ') $(if ($by.Count -eq 1) { 'needs' } else { 'need' }) it."
        }
    }
    $onFarm = @($farmPets | Where-Object { $_.Core -or $Farm -eq 'Example' -or $keep -contains $_.Id })
    if ($dev) { Write-Host "Developer mode: $(if ($Farm -eq 'Example') { "Astra's example agents" } else { 'minimal install' }) ($($onFarm.Count) agents: $(($onFarm | ForEach-Object { $_.DevName }) -join ', '))" }
    else { Write-Host "Farm: $(if ($Farm -eq 'Example') { "Astra's example pets" } else { 'from scratch' }) ($($onFarm.Count) pets: $(($onFarm | ForEach-Object { $_.Name }) -join ', '))" }

    # 3. Stop this install's desktop pets if they are running, so they can be rebuilt (running the installer again)
    $exe = Join-Path $InstallDir 'bin\desktop-pets-20261008.exe'
    $ours = { param($p) $p -and $p.StartsWith($InstallDir + '\', [StringComparison]::OrdinalIgnoreCase) }
    if (@(Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path }).Count) {
        Write-Host 'Stopping the pets that are running from this folder'
        if (Test-Path -LiteralPath $exe) { & $exe $InstallDir --quit 2>$null | Out-Null; Start-Sleep -Milliseconds 800 }
        Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path } | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 300
    }

    # 4. Copy the release (never the git history, local builds or packages), then keep only the chosen pets
    Write-Host "Copying to $InstallDir"
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    $null = & robocopy $source $InstallDir /E /XD .git node_modules bin .claude $farmCatalog /XF $farmLock /NFL /NDL /NJH /NJS /NP
    if ($LASTEXITCODE -ge 8) { throw "Copy failed (robocopy exit $LASTEXITCODE)." }
    Get-ChildItem -LiteralPath $InstallDir -Recurse -File | Unblock-File -ErrorAction SilentlyContinue
    # The farm's list of pets (its catalog): the release's own pets.json and draft list, unfiltered, so the Friendly
    # Farmer can add a pet later without the unzipped release (Part 5a of card 058).
    $catalogDir = Join-Path $InstallDir $farmCatalog
    New-Item -ItemType Directory -Force -Path (Join-Path $catalogDir 'desktop-art') | Out-Null
    Copy-Item -LiteralPath (Join-Path $source 'pets.json') -Destination (Join-Path $catalogDir 'pets.json') -Force
    if (Test-Path -LiteralPath (Join-Path $source $draftsList)) { Copy-Item -LiteralPath (Join-Path $source $draftsList) -Destination (Join-Path $catalogDir $draftsList) -Force }
    if ($Farm -eq 'Scratch') { Set-FarmPets $InstallDir $keep }
    # The words every page shows: the pages read this one line (apps\developer-words-20261019.js).
    $modeFile = Join-Path $InstallDir 'apps\words-mode-20261019.js'
    $modeLine = "window.ASTRAS_PET_OS_WORDS = '$(if ($dev) { 'developer' } else { 'farm' })';"
    $modeText = [IO.File]::ReadAllText($modeFile, [Text.Encoding]::UTF8)
    if ($modeText -notmatch "window\.ASTRAS_PET_OS_WORDS = '[a-z]+';") { throw "$modeFile does not hold the words line the pages read." }
    [IO.File]::WriteAllText($modeFile, ($modeText -replace "window\.ASTRAS_PET_OS_WORDS = '[a-z]+';", $modeLine), (New-Object Text.UTF8Encoding $false))
    $hub = Join-Path $InstallDir 'apps\pet-programs\astras-pet-os-20261018.html'   # the Agent Control Hub: The Farm's page

    if ($dev) {
        # 5. Developer mode: no desktop pets. A desktop pets program from an earlier install is taken away, with its
        # start-with-Windows entry, so nothing of this install runs by itself.
        if (Test-Path -LiteralPath $exe) { & $exe $InstallDir --remove-startup 2>$null | Out-Null }
        $bin = Join-Path $InstallDir 'bin'
        if (Test-Path -LiteralPath $bin) { Write-Host 'Removing the desktop pets program of an earlier install'; Remove-Item -LiteralPath $bin -Recurse -Force }
        Write-Host 'Developer mode: no desktop pets are built or started.'
        $exe = $null
    } else {
        # 5. Build the desktop pets program from source, on this PC, and check that the pets load
        Write-Host 'Building the desktop pets program from source'
        $exe = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $InstallDir 'build-desktop-pets-20261011.ps1') | Select-Object -Last 1
        if (-not $exe -or -not (Test-Path -LiteralPath $exe)) { throw 'Building the desktop pets program failed.' }
        Write-Host 'Checking that your pets load'
        $preview = Join-Path ([IO.Path]::GetTempPath()) "astras-pet-os-check-$PID.png"
        $ErrorActionPreference = 'Continue'   # so the check's own error text reaches the message below
        # A program the computer's security blocks fails to start at all, so that is caught here too (Astra, 2026-10-19).
        try { $said = & (Join-Path $InstallDir 'bin\desktop-pets-check-20261011.exe') $InstallDir --preview $preview 2>&1; $code = $LASTEXITCODE }
        catch { $said = $_.Exception.Message; $code = -1 }
        $ErrorActionPreference = 'Stop'
        if ($code -ne 0 -and "$said" -match 'group policy|blocked by|Application Control|AppLocker|administrator has blocked') {
            throw "This computer's security does not allow programs built on it, so the desktop pets cannot run here. None are running and no shortcuts were made; to remove the copied files, delete $InstallDir. $lockedDown" }
        if ($code -ne 0) { throw "Your pets did not load: $said" }
        Remove-Item -LiteralPath $preview -ErrorAction SilentlyContinue
    }

    # 6. Start menu shortcuts, and none left over from the other mode
    New-Item -ItemType Directory -Force -Path $ShortcutDir | Out-Null
    $shell = New-Object -ComObject WScript.Shell
    function New-Shortcut([string]$Name, [string]$Target, [string]$Arguments, [string]$Description) {
        $s = $shell.CreateShortcut((Join-Path $ShortcutDir "$Name.lnk")); $s.TargetPath = $Target; $s.Arguments = $Arguments
        $s.WorkingDirectory = $InstallDir; $s.Description = $Description; $s.Save() }
    function Remove-Shortcut([string]$Name) { Remove-Item -LiteralPath (Join-Path $ShortcutDir "$Name.lnk") -Force -ErrorAction SilentlyContinue }
    $ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
    if ($dev) {
        New-Shortcut 'Agent Control Hub' $hub '' 'Open the Agent Control Hub: every agent and its control hub page'
        Remove-Shortcut "Astra's PetOS"; Remove-Shortcut "Stop Astra's PetOS (big red button)"
    } else {
        New-Shortcut "Astra's PetOS" $exe "`"$InstallDir`"" 'Start the desktop pets'
        Remove-Shortcut 'Agent Control Hub'
    }
    New-Shortcut 'System Map' (Join-Path $InstallDir 'system-map-20261012.html') '' "Open the 3D System Map"
    if (-not $dev) { New-Shortcut "Stop Astra's PetOS (big red button)" $exe "`"$InstallDir`" --quit" 'Stop every desktop pet now' }
    New-Shortcut "Uninstall Astra's PetOS" $ps "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $InstallDir 'installer\uninstall-astras-pet-os-20261014.ps1')`" -ShortcutDir `"$ShortcutDir`"" "Remove Astra's PetOS from this PC"

    # 7. Start with Windows only when asked; a second install with it off takes it away again
    if ($dev) { Write-Host 'Starts with Windows: off (developer mode has nothing to start)' }
    elseif ($StartWithWindows) { & $exe $InstallDir --install-startup | Out-Null; Write-Host 'Starts with Windows: on' }
    else { & $exe $InstallDir --remove-startup | Out-Null; Write-Host 'Starts with Windows: off (tick it in the window, or add -StartWithWindows, to turn it on)' }

    # 8. Install receipt (a passport stamp)
    $commit = $null; if (Test-Path -LiteralPath (Join-Path $source '.git')) { try { $commit = (& git -C $source rev-parse HEAD 2>$null) } catch { } }
    [pscustomobject]@{
        product = "Astra's PetOS"; version = $Version; installed = (Get-Date).ToString('s'); install_dir = $InstallDir
        mode = $(if ($dev) { 'developer' } else { 'farm' })
        farm = $Farm.ToLowerInvariant(); pets = @($onFarm | ForEach-Object { $_.Id })
        source_commit = $commit; built_from_source = (-not $dev)
        program_sha256 = $(if ($exe) { (Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash } else { $null })
        source_sha256 = (Get-FileHash -LiteralPath (Join-Path $InstallDir 'scripts\desktop-pets-20261011.cs') -Algorithm SHA256).Hash
        starts_with_windows = [bool]$StartWithWindows
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $InstallDir 'install-receipt.json') -Encoding UTF8

    # 9. The farm lock (Astra, 2026-10-21, Part 5a of card 058): exactly which pets this farm runs, where each came from
    # with a hash of its entry, and which pets need which, for the Friendly Farmer's farm-pets tool. It keeps its history.
    $chosenIds = if ($Farm -eq 'Example') { @($farmPets | Where-Object { -not $_.Core } | ForEach-Object { $_.Id }) } else { $picked }
    $lockInfo = @{ Version = $Version; Commit = $commit; Mode = $(if ($dev) { 'developer' } else { 'farm' }); Os = 'windows'
        Parts = [ordered]@{ 'startup-star' = (-not $dev); 'daily-round' = $false } }
    $lock = New-FarmLock $InstallDir $chosenIds $lockInfo (Get-ProgramNames $source) $previousLock 'set up' (Get-DenverNow)
    [IO.File]::WriteAllText($lockPath, (ConvertTo-CanonicalJson $lock) + "`n", (New-Object Text.UTF8Encoding $false))

    Write-Host "Installed. Start menu: $ShortcutDir"
    if ($dev) {
        if (-not $NoLaunch) { Start-Process -FilePath $hub }
        if ($windowUsed) {
            $where = if ($NoLaunch) { 'Open it from the Start menu: Agent Control Hub.' } else { 'The Agent Control Hub is open in your browser.' }
            Show-Message ("Installed in developer mode: $($onFarm.Count) $(if ($onFarm.Count -eq 1) { 'agent' } else { 'agents' }). $where`n`n" +
                "Nothing runs on your desktop. Each agent lives in the avatar panel of its control hub page: click it to see what it does. The words switch at the bottom of a page changes the words in that browser.`n`n" +
                "In the Start menu, under Astra's PetOS: the Agent Control Hub, the System Map and Uninstall. To change the install, or to go back to the farm words and desktop pets, run the installer again.")
        }
    } else {
        if (-not $NoLaunch) { Start-Process -FilePath $exe -ArgumentList "`"$InstallDir`"" }
        if ($windowUsed) {
            $where = if ($NoLaunch) { "Start them from the Start menu: Astra's PetOS." } else { 'They are on your desktop now.' }
            Show-Message ("Your farm is ready: $($onFarm.Count) $(if ($onFarm.Count -eq 1) { 'pet' } else { 'pets' }). $where`n`n" +
                "The little star in the bottom-left corner looks after them: click it to hide or show your pets, double-click it to line them up. Double-click a pet to open its app.`n`n" +
                "In the Start menu, under Astra's PetOS: the System Map, the big red Stop button and Uninstall. To change your farm, run the installer again.")
        }
    }
} catch {
    if ($windowUsed) { Show-Message "Astra's PetOS could not be installed:`n`n$($_.Exception.Message)" 'Error' }
    throw
}
