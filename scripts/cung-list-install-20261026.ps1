<#
.SYNOPSIS
  The Cung List: puts the free developer tools on this PC, once. Safe to run again: anything already there is skipped.

.DESCRIPTION
  Run it from a normal (not administrator) PowerShell window in the astras-pet-os folder:

      powershell -ExecutionPolicy Bypass -File scripts\cung-list-install-20261026.ps1

  Add -DryRun to see what it would do without installing anything.

  Each step checks first, installs only what is missing, and says what happened. At the end a table lists every step.
  What it installs (all free; docs/cung-list-20261026.md says why each one):
    1. Ollama            winget Ollama.Ollama           (your user only, no administrator)
    2. Node.js LTS       winget OpenJS.NodeJS.LTS       (only when node is missing; Windows asks for administrator)
    3. uv                winget astral-sh.uv            (your user only), then a first download of Serena
    4. Docker Desktop    winget Docker.DockerDesktop    (only if you answer y; its own installer window opens)
    5. Gemini CLI        npm install -g @google/gemini-cli
    6. Dyad              winget Dyad.Dyad               (your user only; prints the download page if winget fails)
    7. ccusage           npx -y ccusage@latest daily    (a test run only, nothing installed)

  It never reads, writes or signs in with your Claude account or its credentials, never sets an API key, never adds
  anything to Startup apps, and never runs itself as administrator. Only Node.js and Docker Desktop need
  administrator rights, and for those Windows itself asks you.

  Cung List items 6, 7, 13, 14 and 15, ideas from Tyson Cung's public GitHub. By Astra.
  Written by Claude Opus 5.5 (claude-opus-5-5), 2026-10-26. Tested on Linux by test/cung-list-install-test-20261026.mjs
  (a text check: it has not run on Windows yet).

.PARAMETER DryRun
  Only show what would be installed or run.

.PARAMETER SkipDocker
  Do not ask about Docker Desktop.
#>
[CmdletBinding()]
param(
  [switch]$DryRun,
  [switch]$SkipDocker
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'
$global:LASTEXITCODE = 0

$Results = New-Object System.Collections.Generic.List[object]

function Add-Result {
  param([string]$Step, [string]$Status, [string]$Detail)
  $Results.Add([pscustomobject]@{ Step = $Step; Status = $Status; Detail = $Detail })
  $color = 'Gray'
  if ($Status -eq 'installed' -or $Status -eq 'ok') { $color = 'Green' }
  elseif ($Status -eq 'failed') { $color = 'Red' }
  elseif ($Status -eq 'manual' -or $Status -eq 'needs you') { $color = 'Yellow' }
  Write-Host ("  {0}: {1}. {2}" -f $Step, $Status, $Detail) -ForegroundColor $color
}

function Test-Command {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

# Pick up PATH changes an installer just made, without opening a new window.
function Update-SessionPath {
  $parts = @()
  foreach ($scope in @('Machine', 'User')) {
    $p = [Environment]::GetEnvironmentVariable('Path', $scope)
    if ($p) { $parts += $p.Split(';') }
  }
  $parts += $env:Path.Split(';')
  $env:Path = (($parts | Where-Object { $_ } | Select-Object -Unique) -join ';')
}

function Test-WingetPackage {
  param([string]$Id)
  if (-not (Test-Command 'winget')) { return $false }
  $out = & winget list --id $Id --exact --accept-source-agreements --disable-interactivity 2>$null | Out-String
  return ($LASTEXITCODE -eq 0 -and $out -match [regex]::Escape($Id))
}

# Install one winget package. Returns $true when winget says it worked.
function Install-WingetPackage {
  param([string]$Id, [string]$Scope = '', [switch]$Interactive)
  $wingetArgs = @('install', '--id', $Id, '--exact', '--source', 'winget',
    '--accept-source-agreements', '--accept-package-agreements')
  if ($Scope) { $wingetArgs += @('--scope', $Scope) }
  if ($Interactive) { $wingetArgs += '--interactive' } else { $wingetArgs += '--disable-interactivity' }
  if ($DryRun) {
    Write-Host ("  would run: winget {0}" -f ($wingetArgs -join ' '))
    return $true
  }
  & winget @wingetArgs
  $code = $LASTEXITCODE
  Update-SessionPath
  # 0 is success; -1978335189 (0x8A15002B) means the newest version is already there.
  return ($code -eq 0 -or $code -eq -1978335189)
}

function Get-FirstLine {
  param([string]$Command, [string[]]$Arguments)
  try {
    $line = & $Command @Arguments 2>$null | Select-Object -First 1
    if ($line) { return ([string]$line).Trim() }
  } catch { }
  return ''
}

Write-Host ''
Write-Host 'The Cung List: developer tools for Astra''s PetOS' -ForegroundColor Cyan
if ($DryRun) { Write-Host '(dry run: nothing will be installed)' -ForegroundColor Cyan }
Write-Host ''

# 0. Not as administrator: user installs must land in your own profile.
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$isAdmin = (New-Object Security.Principal.WindowsPrincipal($identity)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
  Write-Host 'This window is running as administrator. Close it and run the script from a normal PowerShell window.' -ForegroundColor Red
  Write-Host 'Windows asks for administrator rights by itself for the two programs that need them.' -ForegroundColor Red
  exit 1
}

$hasWinget = Test-Command 'winget'
if (-not $hasWinget) {
  Write-Host 'winget is missing. Install "App Installer" from the Microsoft Store (https://apps.microsoft.com/detail/9NBLGGH4NNS1), then run this again.' -ForegroundColor Yellow
}

# 1. Ollama (item 6): local models. model-library's run-ollama-shelf script chooses and pulls the models.
$step = 'Ollama'
if ((Test-Command 'ollama') -or (Test-WingetPackage 'Ollama.Ollama')) {
  Add-Result $step 'already there' (Get-FirstLine 'ollama' @('--version'))
} elseif (-not $hasWinget) {
  Add-Result $step 'manual' 'Download it from https://ollama.com/download/windows'
} elseif (Install-WingetPackage 'Ollama.Ollama' -Scope 'user') {
  if ($DryRun) { Add-Result $step 'would install' 'Ollama.Ollama' }
  else {
    Add-Result $step 'installed' (Get-FirstLine 'ollama' @('--version'))
    $startup = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\Ollama.lnk'
    if (Test-Path $startup) {
      Add-Result 'Ollama at sign-in' 'needs you' 'Ollama added itself to Startup apps; only Startup Star belongs there. Turn it off in Task Manager > Startup apps.'
    }
  }
} else {
  Add-Result $step 'failed' 'winget could not install Ollama.Ollama; download it from https://ollama.com/download/windows'
}

# 2. Node.js LTS: only when node is missing. Gemini CLI and ccusage need it.
$step = 'Node.js'
$nodeVersion = ''
if (Test-Command 'node') { $nodeVersion = Get-FirstLine 'node' @('--version') }
if ($nodeVersion) {
  $major = 0
  [void][int]::TryParse(($nodeVersion -replace '^v(\d+).*$', '$1'), [ref]$major)
  if ($major -ge 20) { Add-Result $step 'already there' $nodeVersion }
  else { Add-Result $step 'needs you' ("{0} is older than 20; update it with: winget upgrade --id OpenJS.NodeJS.LTS" -f $nodeVersion) }
} elseif (-not $hasWinget) {
  Add-Result $step 'manual' 'Download the LTS version from https://nodejs.org/'
} else {
  Write-Host '  Node.js installs for every user, so Windows will ask for administrator rights.' -ForegroundColor Yellow
  if (Install-WingetPackage 'OpenJS.NodeJS.LTS') {
    if ($DryRun) { Add-Result $step 'would install' 'OpenJS.NodeJS.LTS' }
    else { Add-Result $step 'installed' (Get-FirstLine 'node' @('--version')) }
  } else {
    Add-Result $step 'failed' 'winget could not install OpenJS.NodeJS.LTS; download it from https://nodejs.org/'
  }
}

# 3. uv (item 7): runs Serena for Claude Code and Codex (.mcp.json). Then fetch Serena once so the first session is quick.
$step = 'uv'
if (Test-Command 'uv') {
  Add-Result $step 'already there' (Get-FirstLine 'uv' @('--version'))
} elseif (-not $hasWinget) {
  Add-Result $step 'manual' 'See https://docs.astral.sh/uv/getting-started/installation/'
} elseif (Install-WingetPackage 'astral-sh.uv') {
  if ($DryRun) { Add-Result $step 'would install' 'astral-sh.uv' }
  else { Add-Result $step 'installed' (Get-FirstLine 'uv' @('--version')) }
} else {
  Add-Result $step 'failed' 'winget could not install astral-sh.uv; see https://docs.astral.sh/uv/getting-started/installation/'
}

$step = 'Serena'
if (-not (Test-Command 'git')) {
  Add-Result $step 'needs you' 'uvx fetches Serena with git; install Git (winget install --id Git.Git) and run this again'
} elseif ($DryRun) {
  Add-Result $step 'would run' 'uvx --from git+https://github.com/oraios/serena serena --version'
} elseif (Test-Command 'uvx') {
  $serena = Get-FirstLine 'uvx' @('--from', 'git+https://github.com/oraios/serena', 'serena', '--version')
  if ($serena) { Add-Result $step 'ok' ("{0}; Claude Code starts it from .mcp.json" -f $serena) }
  else { Add-Result $step 'failed' 'uvx could not start Serena; run the command by hand to see why' }
} else {
  Add-Result $step 'needs you' 'uvx is not on PATH yet; open a new PowerShell window and run this again'
}

# 4. Docker Desktop: only when you say so (it is big, needs WSL 2 and administrator rights). Never silent.
$step = 'Docker Desktop'
if ((Test-Command 'docker') -or (Test-WingetPackage 'Docker.DockerDesktop')) {
  Add-Result $step 'already there' (Get-FirstLine 'docker' @('--version'))
} elseif ($SkipDocker) {
  Add-Result $step 'skipped' 'You passed -SkipDocker'
} elseif ($DryRun) {
  Add-Result $step 'would ask' 'Install Docker Desktop? (only on y; its own installer window opens)'
} elseif (-not $hasWinget) {
  Add-Result $step 'manual' 'Download it from https://www.docker.com/products/docker-desktop/'
} else {
  Write-Host ''
  Write-Host '  Docker Desktop runs self-hosted n8n and other containers. It is large, needs WSL 2 and administrator rights,' -ForegroundColor Yellow
  Write-Host '  and is free for personal use. Its own installer window will open.' -ForegroundColor Yellow
  $answer = Read-Host '  Install Docker Desktop now? [y/N]'
  if ($answer -match '^(y|yes)$') {
    if (Install-WingetPackage 'Docker.DockerDesktop' -Interactive) {
      Add-Result $step 'installed' 'Restart Windows if the installer asks, then open Docker Desktop once to finish setup'
    } else {
      Add-Result $step 'failed' 'winget could not install Docker.DockerDesktop; download it from https://www.docker.com/products/docker-desktop/'
    }
  } else {
    Add-Result $step 'skipped' 'You said no; run this again any time'
  }
}

# 5. Gemini CLI (item 14): Google's free-tier coding agent. Sign in with your Google account, never your Claude one.
$step = 'Gemini CLI'
if (Test-Command 'gemini') {
  Add-Result $step 'already there' (Get-FirstLine 'gemini' @('--version'))
} elseif (-not (Test-Command 'npm')) {
  Add-Result $step 'needs you' 'Needs Node.js first; open a new PowerShell window and run this again'
} elseif ($DryRun) {
  Add-Result $step 'would run' 'npm install -g @google/gemini-cli'
} else {
  & npm install -g '@google/gemini-cli'
  $ok = ($LASTEXITCODE -eq 0)
  Update-SessionPath
  if ($ok) { Add-Result $step 'installed' 'Type gemini in a project folder and choose "Sign in with Google" for the free tier' }
  else { Add-Result $step 'failed' 'npm install -g @google/gemini-cli did not finish; run it by hand to see why' }
}

# 6. Dyad (item 15): local open-source app builder. Use its free local models (Ollama) or your own keys with a spend limit.
$step = 'Dyad'
$dyadFolder = Join-Path $env:LOCALAPPDATA 'dyad'
$dyadPage = 'https://www.dyad.sh/ (or https://github.com/dyad-sh/dyad/releases)'
if ((Test-Path $dyadFolder) -or (Test-WingetPackage 'Dyad.Dyad')) {
  Add-Result $step 'already there' $dyadFolder
} elseif (-not $hasWinget) {
  Add-Result $step 'manual' ("Download it from {0}" -f $dyadPage)
} elseif (Install-WingetPackage 'Dyad.Dyad' -Scope 'user') {
  if ($DryRun) { Add-Result $step 'would install' 'Dyad.Dyad' }
  else { Add-Result $step 'installed' 'Open Dyad from the Start menu; pick Ollama or a key with a spend limit, never your Claude login' }
} else {
  Add-Result $step 'failed' ("winget could not install Dyad.Dyad; download it from {0}" -f $dyadPage)
}

# 7. ccusage (item 13): a test run only. It reads Claude Code's local usage logs; the dollar figures are what the same
#    tokens would cost on the API, not your plan's bill. token-canopy reads these reports.
$step = 'ccusage'
$since = (Get-Date).AddDays(-7).ToString('yyyyMMdd')
if (-not (Test-Command 'npx')) {
  Add-Result $step 'needs you' 'Needs Node.js first; open a new PowerShell window and run this again'
} elseif ($DryRun) {
  Add-Result $step 'would run' ("npx -y ccusage@latest daily --since {0}" -f $since)
} else {
  & npx -y 'ccusage@latest' daily --since $since
  if ($LASTEXITCODE -eq 0) { Add-Result $step 'ok' 'Run npx ccusage@latest any time; nothing was installed' }
  else { Add-Result $step 'failed' 'npx ccusage@latest daily did not finish; run it by hand to see why' }
}

# What only you can do, inside Claude Code (no script can type these for you).
Add-Result 'Superpowers' 'manual' 'In Claude Code, type: /plugin install superpowers@claude-plugins-official (skills/pet-app/SKILL.md)'
Add-Result 'Context7 and Serena' 'manual' 'Open Claude Code in this folder and approve the two servers from .mcp.json when it asks'

Write-Host ''
Write-Host 'Summary' -ForegroundColor Cyan
$Results | Format-Table -AutoSize -Wrap | Out-String -Width 200 | Write-Host
$failed = @($Results | Where-Object { $_.Status -eq 'failed' }).Count
if ($failed -gt 0) {
  Write-Host ("{0} step(s) failed. Fix what the line says and run this again: finished steps are skipped." -f $failed) -ForegroundColor Red
  exit 1
}
Write-Host 'Done. Run it again any time; it only installs what is missing.' -ForegroundColor Green
exit 0
