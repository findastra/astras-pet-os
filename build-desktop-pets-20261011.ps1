param([switch]$CandidateOnly)
$ErrorActionPreference = 'Stop'
$petsCompiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$petsOutput = Join-Path $PSScriptRoot 'bin\desktop-pets-20261008.exe'
if ($CandidateOnly) { $petsOutput = Join-Path $PSScriptRoot 'bin\desktop-pets-candidate-20261011.exe' }
$petsCheck = Join-Path $PSScriptRoot 'bin\desktop-pets-check-20261011.exe'
$petsSource = Join-Path $PSScriptRoot 'scripts\desktop-pets-20261011.cs'
$petsTracker = Join-Path $PSScriptRoot 'scripts\pet-dock-tracker-20261011.cs'
$petsManifest = Join-Path $PSScriptRoot 'scripts\desktop-pets-20261011.manifest'
$petsArgs = @('/nologo','/platform:x64','/optimize+','/reference:System.dll','/reference:System.Core.dll','/reference:System.Drawing.dll','/reference:System.Windows.Forms.dll','/reference:System.Web.Extensions.dll',('/win32manifest:' + $petsManifest))
# Startup Star's own star, shown in Windows' Startup apps list (Astra, 2026-10-23); drawn by the program's --write-star-icon.
$petsIcon = Join-Path $PSScriptRoot 'art\app-icons\startup-star\startup-star-icon-20261023.ico'
if (Test-Path $petsIcon) { $petsArgs += ('/win32icon:' + $petsIcon) }
$petsWpf = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\WPF'
$petsArgs += @(('/reference:' + (Join-Path $petsWpf 'UIAutomationClient.dll')), ('/reference:' + (Join-Path $petsWpf 'UIAutomationTypes.dll')), ('/reference:' + (Join-Path $petsWpf 'WindowsBase.dll')))
New-Item -ItemType Directory -Force (Join-Path $PSScriptRoot 'bin') | Out-Null
& $petsCompiler @petsArgs '/target:winexe' ('/out:' + $petsOutput) $petsSource $petsTracker
if ($LASTEXITCODE -ne 0) { throw 'Desktop pets build failed. Quit the desktop pets before rebuilding if the executable is in use.' }
& $petsCompiler @petsArgs '/target:exe' ('/out:' + $petsCheck) $petsSource $petsTracker
if ($LASTEXITCODE -ne 0) { throw 'Desktop pets diagnostic build failed.' }
# The pet chat helper (card 283), which the star starts at sign-in. A running helper keeps its program in use, so its
# build failing is a warning, never a failed star build: stop it (Pet chat, then Stop pet chat) and build again.
$chatSource = Join-Path $PSScriptRoot 'scripts\pet-chat-helper-20261103.cs'
$chatOutput = Join-Path $PSScriptRoot 'bin\pet-chat-helper-20261103.exe'
$chatArgs = @('/nologo','/platform:x64','/optimize+','/target:winexe','/reference:System.dll','/reference:System.Core.dll','/reference:System.Windows.Forms.dll','/reference:System.Web.Extensions.dll')
$chatSaid = & $petsCompiler @chatArgs ('/out:' + $chatOutput) $chatSource
if ($LASTEXITCODE -ne 0) { Write-Warning ("The pet chat helper was not built (is it running?): " + ($chatSaid -join ' ')) }
Write-Output $petsOutput
