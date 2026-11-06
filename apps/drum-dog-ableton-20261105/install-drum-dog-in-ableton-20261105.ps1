# Puts the Drum Dog add-on (drum_dog) in Ableton's User Library, where Live looks for control surface scripts.
# Then: restart Ableton, Settings > Link, Tempo & MIDI, a free Control Surface row: drum_dog, Input None, Output None.
# Claude Opus 5.5 (claude-opus-5-5), 2026-11-05, for Astra.
$ErrorActionPreference = 'Stop'
$userLibrary = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Ableton\User Library'
if (-not (Test-Path $userLibrary)) { throw "No Ableton User Library at $userLibrary. Open Ableton once first." }
$target = Join-Path $userLibrary 'Remote Scripts\drum_dog'
New-Item -ItemType Directory -Force $target | Out-Null
Copy-Item -Force (Join-Path $PSScriptRoot 'drum_dog\__init__.py') $target
Write-Output "Drum Dog is in $target. Restart Ableton, then pick drum_dog as a Control Surface (Input and Output: None)."
