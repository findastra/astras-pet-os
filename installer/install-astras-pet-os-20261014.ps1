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
#>
[CmdletBinding()]
param(
    [string]$InstallDir = (Join-Path $env:LOCALAPPDATA 'Programs\astras-pet-os'),
    [string]$ShortcutDir = (Join-Path ([Environment]::GetFolderPath('Programs')) "Astra's PetOS"),
    [ValidateSet('Example', 'Scratch')][string]$Farm,
    [string[]]$Pets = @(),
    [switch]$StartWithWindows,
    [switch]$NoLaunch,
    [switch]$ListPets
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

# Every pet this release can put on a farm: the registered pets, then the desktop draft pets.
function Get-FarmPets([string]$Root) {
    $registry = Read-Json (Join-Path $Root 'pets.json')
    $jobs = @{}; foreach ($p in @(Get-Field $registry 'pipeline')) { if ($p) { $jobs[[string](Get-Field $p 'repo')] = [string](Get-Field $p 'job') } }
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($p in @(Get-Field $registry 'pets')) {
        $list.Add([pscustomobject]@{ Id = [string](Get-Field $p 'art'); Name = [string](Get-Field $p 'pet'); Repo = [string](Get-Field $p 'repo')
            Job = [string](Get-Field $p 'job'); Core = ([string](Get-Field $p 'role') -eq 'host'); Draft = $false })
    }
    $drafts = Join-Path $Root $draftsList
    if (Test-Path -LiteralPath $drafts) {
        foreach ($d in @(Get-Field (Read-Json $drafts) 'pets')) {
            # Claude Bot's art is private (an exact copy of ChatGPT's BSOD), so it is never in a release.
            if ((Get-Field $d 'private') -eq $true) { continue }
            $id = [string](Get-Field $d 'id'); if (@($list | Where-Object { $_.Id -eq $id }).Count) { continue }
            $repo = ([string](Get-Field $d 'interface')) -replace '^https://github\.com/[^/]+/', ''  # on any account (card 058, Part 3)
            $list.Add([pscustomobject]@{ Id = $id; Name = [string](Get-Field $d 'name'); Repo = $repo; Job = [string]$jobs[$repo]; Core = $false; Draft = $true })
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

# The "Set up your farm" window. Returns the choice, or $null when it is closed or cancelled.
function Show-FarmSetup([object[]]$FarmPets, [bool]$StartChecked) {
    Add-Type -AssemblyName System.Windows.Forms, System.Drawing
    [System.Windows.Forms.Application]::EnableVisualStyles()
    $examples = @($FarmPets | Where-Object { -not $_.Core }).Count
    $bold = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
    $grey = [System.Drawing.Color]::FromArgb(90, 90, 90)
    $form = New-Object System.Windows.Forms.Form -Property @{
        Text = "Set up your farm - Astra's PetOS $Version"; StartPosition = 'CenterScreen'; FormBorderStyle = 'FixedDialog'
        MaximizeBox = $false; MinimizeBox = $false; ClientSize = New-Object System.Drawing.Size(620, 690); TopMost = $true
        Font = New-Object System.Drawing.Font('Segoe UI', 9.5); BackColor = [System.Drawing.Color]::White }
    $picture = Join-Path $source 'desktop-art\farmer\happy-20261011.png'
    if (Test-Path -LiteralPath $picture) {
        $farmer = New-Object System.Drawing.Bitmap($picture)
        $form.Controls.Add((New-Object System.Windows.Forms.PictureBox -Property @{ Image = $farmer; SizeMode = 'Zoom'; Location = '532, 10'; Size = '72, 72' }))
        try { $form.Icon = [System.Drawing.Icon]::FromHandle($farmer.GetHicon()) } catch { }
    }
    $form.Controls.Add((New-Object System.Windows.Forms.Label -Property @{ Text = 'Set up your farm'; Location = '16, 14'; Size = '500, 34'
        Font = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold) }))
    $form.Controls.Add((New-Object System.Windows.Forms.Label -Property @{ Location = '18, 50'; Size = '500, 40'; ForeColor = $grey
        Text = "Astra's PetOS is in beta. It installs for you only (no administrator rights) and you can uninstall it from the Start menu." }))

    $example = New-Object System.Windows.Forms.RadioButton -Property @{ Text = "1.  Set up Your Farm with Astra's Example Pets"; Font = $bold
        Location = '16, 96'; Size = '590, 26'; Checked = $true }
    $exampleText = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 124'; Size = '560, 38'
        Text = "All $examples of Astra's pets come to your farm, plus the core kit. They are examples: you can delete, modify, or clone any of them." }
    $scratch = New-Object System.Windows.Forms.RadioButton -Property @{ Text = '2.  Set up Your Farm From Scratch'; Font = $bold
        Location = '16, 170'; Size = '590, 26' }
    $scratchText = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 198'; Size = '560, 38'
        Text = "Just the core kit: the core pets, the desktop star, the System Map and the big red Stop button. Tick any of Astra's pets below to bring them along too." }
    $exampleText.Add_Click({ $example.Checked = $true }); $scratchText.Add_Click({ $scratch.Checked = $true })
    $form.Controls.AddRange(@($example, $exampleText, $scratch, $scratchText))

    $list = New-Object System.Windows.Forms.ListView -Property @{ View = 'Details'; CheckBoxes = $true; FullRowSelect = $true
        HeaderStyle = 'Nonclickable'; ShowItemToolTips = $true; Location = '40, 242'; Size = '564, 300'; Enabled = $false }
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
    $count = New-Object System.Windows.Forms.Label -Property @{ Location = '40, 548'; Size = '564, 22'; ForeColor = $grey }
    $form.Controls.Add($count)
    $start = New-Object System.Windows.Forms.CheckBox -Property @{ Text = 'Start my pets when Windows starts'; Location = '18, 590'
        Size = '400, 24'; Checked = $StartChecked }
    $form.Controls.Add($start)
    $ok = New-Object System.Windows.Forms.Button -Property @{ Text = 'Set up my farm'; Location = '372, 638'; Size = '136, 34'; DialogResult = 'OK' }
    $cancel = New-Object System.Windows.Forms.Button -Property @{ Text = 'Cancel'; Location = '516, 638'; Size = '88, 34'; DialogResult = 'Cancel' }
    $form.Controls.AddRange(@($ok, $cancel)); $form.AcceptButton = $ok; $form.CancelButton = $cancel

    # Example: every pet ticked and the list locked. From Scratch: the list opens with only the core pets ticked, or the
    # picks made last time From Scratch was chosen. A core pet can never be unticked.
    $picks = @{}
    $showCount = { $n = @($list.Items | Where-Object { $_.Checked }).Count
        $count.Text = if ($n -eq 1) { '1 pet will live on your farm.' } else { "$n pets will live on your farm." } }
    $list.Add_ItemCheck({ param($s, $e) if ($s.Items[$e.Index].Tag.Core) { $e.NewValue = 'Checked' } })
    $list.Add_ItemChecked({ & $showCount })
    $scratch.Add_CheckedChanged({
        foreach ($i in $list.Items) { if ($i.Tag.Core) { continue }
            if ($scratch.Checked) { $i.Checked = [bool]$picks[$i.Tag.Id] } else { $picks[$i.Tag.Id] = $i.Checked; $i.Checked = $true } }
        $list.Enabled = $scratch.Checked; & $showCount })
    $form.Add_Shown({ $form.TopMost = $false; $form.Activate(); $ok.Focus() })
    & $showCount

    $answer = $form.ShowDialog()
    $choice = if ($answer -eq [System.Windows.Forms.DialogResult]::OK) {
        [pscustomobject]@{ Farm = $(if ($scratch.Checked) { 'Scratch' } else { 'Example' }); StartWithWindows = $start.Checked
            Pets = @($list.Items | Where-Object { $_.Checked -and -not $_.Tag.Core } | ForEach-Object { $_.Tag.Id }) } }
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
    # 1. Check what we need
    if (-not (Test-Path -LiteralPath (Join-Path $source 'pets.json'))) { throw "Run this from the unzipped Astra's PetOS folder (pets.json not found next to installer\)." }
    $csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
    if (-not (Test-Path -LiteralPath $csc)) { throw "The C# compiler that ships with Windows (.NET Framework 4) was not found: $csc. Nothing was installed. $lockedDown" }
    if ($InstallDir -notmatch 'astras-pet-os$') { throw "InstallDir must end in 'astras-pet-os' so the uninstaller can find it safely." }

    # 2. Choose the farm: in the window, or with -Farm (and -Pets) for no window
    $farmPets = Get-FarmPets $source
    if ($ListPets) {   # for AI agents: the ids -Pets takes; nothing is installed
        $farmPets | ForEach-Object { [pscustomobject]@{ id = $_.Id; pet = $_.Name; kind = $(if ($_.Core) { 'core: always on the farm' } elseif ($_.Draft) { 'example (draft)' } else { 'example' }); job = $_.Job } } | Format-Table -AutoSize -Wrap | Out-String -Width 160 | Write-Host
        return
    }
    if (-not $Farm) {
        Write-Host 'Choose your farm in the "Set up your farm" window.'
        $windowUsed = $true
        $choice = Show-FarmSetup $farmPets $StartWithWindows.IsPresent
        if (-not $choice) { Write-Host 'Cancelled. Nothing was installed.'; return }
        $Farm = $choice.Farm; $Pets = $choice.Pets; $StartWithWindows = [bool]$choice.StartWithWindows
    }
    $keep = @()
    if ($Farm -eq 'Scratch') {
        foreach ($name in @($Pets | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })) {
            $match = @($farmPets | Where-Object { -not $_.Core -and ($_.Id -eq $name -or $_.Repo -eq $name -or $_.Name -eq $name) })
            if (-not $match.Count) { throw "There is no example pet called '$name'. You can pick: $(($farmPets | Where-Object { -not $_.Core } | ForEach-Object { $_.Id }) -join ', ')" }
            $keep += $match[0].Id
        }
        $keep = @($keep | Select-Object -Unique)
    }
    $onFarm = @($farmPets | Where-Object { $_.Core -or $Farm -eq 'Example' -or $keep -contains $_.Id })
    Write-Host "Farm: $(if ($Farm -eq 'Example') { "Astra's example pets" } else { 'from scratch' }) ($($onFarm.Count) pets: $(($onFarm | ForEach-Object { $_.Name }) -join ', '))"

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
    $null = & robocopy $source $InstallDir /E /XD .git node_modules bin .claude /NFL /NDL /NJH /NJS /NP
    if ($LASTEXITCODE -ge 8) { throw "Copy failed (robocopy exit $LASTEXITCODE)." }
    Get-ChildItem -LiteralPath $InstallDir -Recurse -File | Unblock-File -ErrorAction SilentlyContinue
    if ($Farm -eq 'Scratch') { Set-FarmPets $InstallDir $keep }

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

    # 6. Start menu shortcuts
    New-Item -ItemType Directory -Force -Path $ShortcutDir | Out-Null
    $shell = New-Object -ComObject WScript.Shell
    function New-Shortcut([string]$Name, [string]$Target, [string]$Arguments, [string]$Description) {
        $s = $shell.CreateShortcut((Join-Path $ShortcutDir "$Name.lnk")); $s.TargetPath = $Target; $s.Arguments = $Arguments
        $s.WorkingDirectory = $InstallDir; $s.Description = $Description; $s.Save() }
    $ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
    New-Shortcut "Astra's PetOS" $exe "`"$InstallDir`"" 'Start the desktop pets'
    New-Shortcut 'System Map' (Join-Path $InstallDir 'system-map-20261012.html') '' "Open the 3D System Map"
    New-Shortcut "Stop Astra's PetOS (big red button)" $exe "`"$InstallDir`" --quit" 'Stop every desktop pet now'
    New-Shortcut "Uninstall Astra's PetOS" $ps "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $InstallDir 'installer\uninstall-astras-pet-os-20261014.ps1')`" -ShortcutDir `"$ShortcutDir`"" "Remove Astra's PetOS from this PC"

    # 7. Start with Windows only when asked; a second install with it off takes it away again
    if ($StartWithWindows) { & $exe $InstallDir --install-startup | Out-Null; Write-Host 'Starts with Windows: on' }
    else { & $exe $InstallDir --remove-startup | Out-Null; Write-Host 'Starts with Windows: off (tick it in the window, or add -StartWithWindows, to turn it on)' }

    # 8. Install receipt (a passport stamp)
    $commit = $null; if (Test-Path -LiteralPath (Join-Path $source '.git')) { try { $commit = (& git -C $source rev-parse HEAD 2>$null) } catch { } }
    [pscustomobject]@{
        product = "Astra's PetOS"; version = $Version; installed = (Get-Date).ToString('s'); install_dir = $InstallDir
        farm = $Farm.ToLowerInvariant(); pets = @($onFarm | ForEach-Object { $_.Id })
        source_commit = $commit; built_from_source = $true
        program_sha256 = (Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash
        source_sha256 = (Get-FileHash -LiteralPath (Join-Path $InstallDir 'scripts\desktop-pets-20261011.cs') -Algorithm SHA256).Hash
        starts_with_windows = [bool]$StartWithWindows
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $InstallDir 'install-receipt.json') -Encoding UTF8

    Write-Host "Installed. Start menu: $ShortcutDir"
    if (-not $NoLaunch) { Start-Process -FilePath $exe -ArgumentList "`"$InstallDir`"" }
    if ($windowUsed) {
        $where = if ($NoLaunch) { "Start them from the Start menu: Astra's PetOS." } else { 'They are on your desktop now.' }
        Show-Message ("Your farm is ready: $($onFarm.Count) $(if ($onFarm.Count -eq 1) { 'pet' } else { 'pets' }). $where`n`n" +
            "The little star in the bottom-left corner looks after them: click it to hide or show your pets, double-click it to line them up. Double-click a pet to open its app.`n`n" +
            "In the Start menu, under Astra's PetOS: the System Map, the big red Stop button and Uninstall. To change your farm, run the installer again.")
    }
} catch {
    if ($windowUsed) { Show-Message "Astra's PetOS could not be installed:`n`n$($_.Exception.Message)" 'Error' }
    throw
}
