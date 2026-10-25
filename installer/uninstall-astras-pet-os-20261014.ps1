<#
.SYNOPSIS
    Removes Astra's PetOS from this PC for the current user.

.DESCRIPTION
    Stops the desktop pets, removes the start-with-Windows entry, the Start menu shortcuts and the install folder.
    It only deletes a folder that ends in 'astras-pet-os' and holds an install-receipt.json, so it cannot remove
    anything else. Settings the desktop pets saved in %LOCALAPPDATA%\astras-pet-os are kept unless you add -RemoveSettings.
    The code that pet packs brought (Part 5b of card 058): each folder the farm lock lists next to the install is removed
    only when every file in it is still the one the Friendly Farmer put there; a changed folder is kept and named.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File "$env:LOCALAPPDATA\Programs\astras-pet-os\installer\uninstall-astras-pet-os-20261014.ps1"
#>
[CmdletBinding()]
param(
    [string]$InstallDir = (Join-Path $env:LOCALAPPDATA 'Programs\astras-pet-os'),
    [string]$ShortcutDir = (Join-Path ([Environment]::GetFolderPath('Programs')) "Astra's PetOS"),
    [switch]$RemoveSettings
)
$ErrorActionPreference = 'Stop'
if ($InstallDir -notmatch 'astras-pet-os$' -or -not (Test-Path -LiteralPath (Join-Path $InstallDir 'install-receipt.json'))) {
    throw "No Astra's PetOS install found at $InstallDir (it needs install-receipt.json). Nothing was removed." }

$exe = Join-Path $InstallDir 'bin\desktop-pets-20261008.exe'
# Only touch what belongs to THIS install: another copy of the desktop pets (for example a developer's own) shares
# the quit signal and the start-with-Windows entry, so check that each one points into this folder first.
$ours = { param($p) $p -and $p.StartsWith($InstallDir, [StringComparison]::OrdinalIgnoreCase) }
$running = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path })
if ($running.Count -and (Test-Path -LiteralPath $exe)) { & $exe $InstallDir --quit 2>$null | Out-Null; Start-Sleep -Milliseconds 800 }
Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path } | Stop-Process -Force -ErrorAction SilentlyContinue
$run = Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
$startupIsOurs = $run -and @($run.PSObject.Properties | Where-Object { $_.Value -is [string] -and $_.Value.IndexOf($InstallDir, [StringComparison]::OrdinalIgnoreCase) -ge 0 }).Count
if ($startupIsOurs -and (Test-Path -LiteralPath $exe)) { & $exe $InstallDir --remove-startup 2>$null | Out-Null }
if (Test-Path -LiteralPath $ShortcutDir) { Remove-Item -LiteralPath $ShortcutDir -Recurse -Force }

# How a pet pack's folder differs from the files the farm lock lists: a list of reasons, empty when it is the same.
# Links and junctions are never followed: one is a reason to keep the folder.
function Get-PackFolderChanges([string]$Dir, $Want) {
    $changes = New-Object System.Collections.Generic.List[string]; $seen = @{}
    $walk = { param([string]$At, [string]$Rel)
        foreach ($entry in [IO.Directory]::GetFileSystemEntries($At)) {
            $name = [IO.Path]::GetFileName($entry); $r = if ($Rel) { "$Rel/$name" } else { $name }
            $attr = [IO.File]::GetAttributes($entry)
            if ($attr -band [IO.FileAttributes]::ReparsePoint) { $changes.Add("$r is a link"); continue }
            if ($attr -band [IO.FileAttributes]::Directory) { & $walk $entry $r; continue }
            $seen[$r] = $true
            if (-not $Want.ContainsKey($r)) { $changes.Add("$r was added") }
            elseif ((Get-FileHash -LiteralPath $entry -Algorithm SHA256).Hash.ToLowerInvariant() -ne [string]$Want[$r]) { $changes.Add("$r was changed") }
        } }
    & $walk $Dir ''
    foreach ($k in @($Want.Keys)) { if (-not $seen.ContainsKey($k)) { $changes.Add("$k is missing") } }
    , $changes.ToArray()
}
$lockPath = Join-Path $InstallDir 'farm-lock-20261021.json'
if (Test-Path -LiteralPath $lockPath) {
    Add-Type -AssemblyName System.Web.Extensions
    $json = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $json.MaxJsonLength = 16777216
    $lock = $null
    try { $lock = $json.DeserializeObject([IO.File]::ReadAllText($lockPath, [Text.Encoding]::UTF8)) } catch { Write-Host 'The farm lock could not be read, so the folders pet packs brought are left as they are.' }
    foreach ($p in @($(if ($lock) { $lock['pets'] }))) {
        if (-not $p -or -not $p.ContainsKey('code') -or -not $p['code'] -or $p['code']['came_from'] -ne 'pet-pack') { continue }
        $rel = [string]$p['code']['folder']
        if ($rel -notmatch '^\.\./(pets/)?[a-z0-9][a-z0-9-]*$') { Write-Host "Left as it is: $rel is not a folder a pet pack goes in."; continue }
        $dir = [IO.Path]::GetFullPath((Join-Path $InstallDir ($rel -replace '/', '\')))
        if (-not (Test-Path -LiteralPath $dir -PathType Container)) { continue }
        $changed = Get-PackFolderChanges $dir $p['code']['files']   # an array as it is: @() around it would wrap it again
        if ($changed.Count) { Write-Host "Kept $dir ($($p['pet'])'s code from its pet pack): $($changed.Count) of its files changed since it came in, starting with $($changed[0])." }
        else { Remove-Item -LiteralPath $dir -Recurse -Force; Write-Host "Removed $dir, the code $($p['pet'])'s pet pack brought." }
    }
}

# The uninstaller lives inside the folder it removes, so it hands the last step to a short background command.
$cmd = "Start-Sleep -Seconds 2; Remove-Item -LiteralPath '$($InstallDir.Replace("'", "''"))' -Recurse -Force"
Start-Process -FilePath (Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe') -ArgumentList '-NoProfile', '-Command', $cmd -WindowStyle Hidden
if ($RemoveSettings) { Remove-Item -LiteralPath (Join-Path $env:LOCALAPPDATA 'astras-pet-os') -Recurse -Force -ErrorAction SilentlyContinue }
Write-Host "Astra's PetOS was removed: its shortcuts, its start-with-Windows entry (if it had one) and $InstallDir are gone$(if ($RemoveSettings) { ', and its settings' } else { '; settings kept' })."
