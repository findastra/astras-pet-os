<#
.SYNOPSIS
  Registers Playwright MCP (Safari's WebKit engine) with Claude Code and Codex, held to Astra's own pages.

.DESCRIPTION
  MCP Roadmap row 14 (docs/mcp-roadmap-20261109.md): Platform Platypus keeps it; Browser Bat and Test Tortoise may use
  it. Astra's "all recommended", 2026-11-12: checked with MCP Inspector first, then connected, limited to this PC
  (127.0.0.1) and findastra.github.io.

  The server is @playwright/mcp 0.0.83, run with npx (nothing installed globally), with
  mcp\playwright-mcp-config-20261112.json:
    - WebKit, headless, an isolated profile in memory (none of Astra's sign-ins, nothing kept between sessions)
    - it may load only http://127.0.0.1:* and https://findastra.github.io; anything else is blocked
  Checked 2026-11-12 with MCP Inspector 2.13.0: 25 tools, 7 read-only (snapshot, screenshot, find, console messages,
  network requests, a request's details, wait). The rest click, type, fill forms, upload files, evaluate scripts and run
  Playwright code: only on the allowed pages.

  Safe to run again: each client gets exactly one "playwright" entry, replaced in place; Codex's config.toml is copied
  to config.toml.bak-<date-time> first. It installs WebKit build 2368 for the server once (npx @playwright/mcp
  install-browser webkit), into %LOCALAPPDATA%\ms-playwright.

.PARAMETER Clients
  Which clients to register with. Default: both (each is skipped, with a note, when it is not installed).

.PARAMETER Remove
  Takes the "playwright" entry out of both clients instead.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Documents\Astra's PetOS\astras-pet-os\mcp\register-playwright-mcp-20261112.ps1"

.NOTES
  Claude Opus 5.5 (claude-opus-5-5), 2026-11-12. Run it from your own PowerShell window, never from a Claude or Codex
  chat (the same rule as register-astras-pet-os-mcp-20261026.ps1).
#>
[CmdletBinding()]
param(
  [string]$Hub = (Join-Path $env:USERPROFILE "Documents\Astra's PetOS\astras-pet-os"),
  [ValidateSet('ClaudeCode', 'Codex')]
  [string[]]$Clients = @('ClaudeCode', 'Codex'),
  [switch]$Remove
)
$ErrorActionPreference = 'Stop'
$Name = 'playwright'
$Package = '@playwright/mcp@0.0.83'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$Utf8 = New-Object System.Text.UTF8Encoding($false)
function Say([string]$Text) { Write-Host "[playwright-mcp] $Text" }

if ($env:CLAUDECODE -eq '1') {
  throw 'Run this from your own PowerShell window (Start menu, Windows PowerShell), not from a Claude chat.'
}
$Config = Join-Path $Hub 'mcp\playwright-mcp-config-20261112.json'
if (-not (Test-Path -LiteralPath $Config)) { throw "No config at $Config. Pull the hub first (git -C `"$Hub`" pull)." }
$Npx = Get-Command npx.cmd -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $Npx) { throw 'npx is not on PATH. Install Node.js 20 or newer, then run this again.' }
$ServerArgs = @('-y', $Package, '--config', $Config)

if (-not $Remove) {
  Say 'installing the WebKit build the server uses (once; about 60 MB)'
  & $Npx.Source -y $Package install-browser webkit
  if ($LASTEXITCODE -ne 0) { throw 'Could not install WebKit for Playwright MCP.' }
}
$Done = @()

# Claude Code, user scope (every project folder sees it)
if ($Clients -contains 'ClaudeCode') {
  $Claude = Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $Claude) {
    $tries = @(Join-Path $env:USERPROFILE '.local\bin\claude.exe')
    $appCopy = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'Claude-Data') -Recurse -Depth 4 -Filter 'claude.exe' -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime | Select-Object -Last 1
    if ($appCopy) { $tries += $appCopy.FullName }
    $found = $tries | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if ($found) { $Claude = [PSCustomObject]@{ Source = $found }; Say "Claude Code: using $found" }
  }
  if (-not $Claude) {
    Say 'Claude Code: claude command not found; skipped.'
  } else {
    $old = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    & $Claude.Source mcp remove --scope user $Name 2>$null | Out-Null
    $ErrorActionPreference = $old
    if (-not $Remove) {
      & $Claude.Source mcp add --scope user $Name -- $Npx.Source @ServerArgs
      if ($LASTEXITCODE -ne 0) { throw 'claude mcp add failed.' }
    }
    $Done += 'Claude Code (user scope)'
  }
}

# Codex
if ($Clients -contains 'Codex') {
  $CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
  $Toml = Join-Path $CodexHome 'config.toml'
  if (-not (Test-Path -LiteralPath $CodexHome) -and -not (Get-Command codex -ErrorAction SilentlyContinue)) {
    Say "Codex: $CodexHome not found and no codex command; skipped."
  } else {
    if (-not (Test-Path -LiteralPath $CodexHome)) { New-Item -ItemType Directory -Path $CodexHome | Out-Null }
    $text = if (Test-Path -LiteralPath $Toml) { [System.IO.File]::ReadAllText($Toml) } else { '' }
    $q = { param($s) '"' + ($s -replace '\\', '\\' -replace '"', '\"') + '"' }
    $start = '# playwright-mcp:start (mcp\register-playwright-mcp-20261112.ps1; run it again to update)'
    $end = '# playwright-mcp:end'
    $block = if ($Remove) { '' } else {
      @($start, "[mcp_servers.$Name]", "command = $(& $q $Npx.Source)", "args = [$(($ServerArgs | ForEach-Object { & $q $_ }) -join ', ')]", $end) -join "`r`n"
    }
    $pattern = '(?s)# playwright-mcp:start.*?# playwright-mcp:end'
    if ($text -match $pattern) {
      $text = [regex]::Replace($text, $pattern, [System.Text.RegularExpressions.MatchEvaluator] { param($m) $block })
    } elseif ($text -match "(?m)^\s*\[mcp_servers\.(`"?)$([regex]::Escape($Name))\1\]") {
      throw "Codex: $Toml already has its own [mcp_servers.$Name] table. Remove it and run again."
    } elseif (-not $Remove) {
      if ($text -and -not $text.EndsWith("`n")) { $text += "`r`n" }
      $text += "`r`n" + $block + "`r`n"
    }
    if (Test-Path -LiteralPath $Toml) { Copy-Item -LiteralPath $Toml -Destination "$Toml.bak-$Stamp" -Force; Say "backed up $Toml" }
    [System.IO.File]::WriteAllText($Toml, $text, $Utf8)
    $Done += "Codex ($Toml; start a new Codex session)"
  }
}

$verb = if ($Remove) { 'removed from' } else { 'registered with' }
if ($Done.Count) { Say ("$verb " + ($Done -join '; ')) } else { Say "$verb no client (none was found)." }
if (-not $Remove) { Say 'Only http://127.0.0.1 and https://findastra.github.io open. Start a new chat to use it.' }
