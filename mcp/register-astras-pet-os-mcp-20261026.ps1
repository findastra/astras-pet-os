<#
.SYNOPSIS
  Installs the Astra's PetOS MCP server's own dependencies and registers it with Claude Code, Claude Desktop and Codex.

.DESCRIPTION
  the-farm-v1.0-astras-pet-os-mcp-v1.0, a read-only native tool of The Farm (docs/astras-pet-os-mcp-20261026.md).
  Safe to run again: each client gets exactly one "astras-pet-os" entry, replaced in place; every config file it
  changes is copied to <file>.bak-<date-time> first. It changes nothing else, installs nothing outside mcp\node_modules,
  and never adds anything to startup.

  1. Checks Node.js 20 or newer.
  2. npm ci in mcp\ (the SDK and zod, from package-lock.json; nothing is installed in the hub itself).
  3. Runs the server's tests with the SDK required.
  4. Registers the server:
       Claude Code     claude mcp add --scope user (when the claude command is found)
       Claude Desktop  %APPDATA%\Claude\claude_desktop_config.json, "mcpServers" (when Claude Desktop's folder exists)
       Codex           %USERPROFILE%\.codex\config.toml (or $env:CODEX_HOME), [mcp_servers.astras-pet-os]

.PARAMETER Hub
  The astras-pet-os folder. Default: %USERPROFILE%\Documents\Astra's PetOS\astras-pet-os

.PARAMETER Clients
  Which clients to register with. Default: all three (each is skipped, with a note, when it is not installed).

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Documents\Astra's PetOS\astras-pet-os\mcp\register-astras-pet-os-mcp-20261026.ps1"

.NOTES
  Claude Opus 5.5 (claude-opus-5-5), 2026-10-26, Astra's Cung List item 3. Written for Windows PowerShell 5.1 and
  PowerShell 7. Not run on Windows yet when it was written.
#>
[CmdletBinding()]
param(
  [string]$Hub = (Join-Path $env:USERPROFILE "Documents\Astra's PetOS\astras-pet-os"),
  [ValidateSet('ClaudeCode', 'ClaudeDesktop', 'Codex')]
  [string[]]$Clients = @('ClaudeCode', 'ClaudeDesktop', 'Codex'),
  [switch]$SkipInstall,
  [switch]$SkipTest
)
$ErrorActionPreference = 'Stop'
$Name = 'astras-pet-os'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$Utf8 = New-Object System.Text.UTF8Encoding($false)

function Say([string]$Text) { Write-Host "[astras-pet-os-mcp] $Text" }
function Backup([string]$Path) {
  if (Test-Path -LiteralPath $Path) { Copy-Item -LiteralPath $Path -Destination "$Path.bak-$Stamp" -Force; Say "backed up $Path" }
}

# 1. The hub, the server and Node.js
$McpDir = Join-Path $Hub 'mcp'
$Server = Join-Path $McpDir 'server-20261026.mjs'
if (-not (Test-Path -LiteralPath $Server)) { throw "No MCP server at $Server. Pull the hub first (git -C `"$Hub`" pull)." }
$NodeCmd = Get-Command node -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $NodeCmd) { throw 'Node.js is not on PATH. Install Node.js 20 or newer, then run this again.' }
$Node = $NodeCmd.Source
$NodeMajor = [int]((& $Node --version).TrimStart('v').Split('.')[0])
if ($NodeMajor -lt 20) { throw "Node.js $NodeMajor is too old; the server needs 20 or newer." }
Say "server: $Server"
Say "node:   $Node"

# 2. The server's own dependencies, only in mcp\node_modules
if (-not $SkipInstall) {
  $Npm = Get-Command npm.cmd -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $Npm) { $Npm = Get-Command npm -CommandType Application -ErrorAction Stop | Select-Object -First 1 }
  Push-Location -LiteralPath $McpDir
  try {
    & $Npm.Source ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed in $McpDir" }
  } finally { Pop-Location }
}

# 3. The tests, with the SDK required
if (-not $SkipTest) {
  $env:ASTRAS_PET_OS_MCP_REQUIRE_SDK = '1'
  try {
    & $Node --test (Join-Path $Hub 'test\astras-pet-os-mcp-test-20261026.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'The MCP server tests failed; nothing was registered.' }
  } finally { Remove-Item Env:\ASTRAS_PET_OS_MCP_REQUIRE_SDK -ErrorAction SilentlyContinue }
}

$Done = @()

# 4a. Claude Code (user scope, so every project folder sees it)
if ($Clients -contains 'ClaudeCode') {
  # The native program (claude.exe) or npm's claude.cmd; never claude.ps1, whose argument handling differs.
  $Claude = Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $Claude) {
    Say 'Claude Code: claude command not found; skipped.'
  } else {
    $old = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    & $Claude.Source mcp remove --scope user $Name 2>$null | Out-Null
    $ErrorActionPreference = $old
    & $Claude.Source mcp add --scope user $Name $Node $Server
    if ($LASTEXITCODE -ne 0) { throw 'claude mcp add failed.' }
    $Done += 'Claude Code (user scope)'
  }
}

# 4b. Claude Desktop
if ($Clients -contains 'ClaudeDesktop') {
  $DesktopDir = Join-Path $env:APPDATA 'Claude'
  if (-not (Test-Path -LiteralPath $DesktopDir)) {
    Say "Claude Desktop: $DesktopDir not found; skipped."
  } else {
    $Config = Join-Path $DesktopDir 'claude_desktop_config.json'
    $json = $null
    if (Test-Path -LiteralPath $Config) {
      $raw = [System.IO.File]::ReadAllText($Config)
      if ($raw.Trim()) { $json = $raw | ConvertFrom-Json }
    }
    if (-not $json) { $json = New-Object PSObject }
    if (-not ($json.PSObject.Properties.Name -contains 'mcpServers')) {
      $json | Add-Member -NotePropertyName mcpServers -NotePropertyValue (New-Object PSObject)
    }
    $entry = [ordered]@{ command = $Node; args = @($Server) }
    $json.mcpServers | Add-Member -NotePropertyName $Name -NotePropertyValue ([PSCustomObject]$entry) -Force
    Backup $Config
    [System.IO.File]::WriteAllText($Config, ($json | ConvertTo-Json -Depth 32), $Utf8)
    $Done += "Claude Desktop ($Config; quit and reopen Claude Desktop)"
  }
}

# 4c. Codex
if ($Clients -contains 'Codex') {
  $CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
  $Toml = Join-Path $CodexHome 'config.toml'
  $hasCodex = (Test-Path -LiteralPath $CodexHome) -or (Get-Command codex -ErrorAction SilentlyContinue)
  if (-not $hasCodex) {
    Say "Codex: $CodexHome not found and no codex command; skipped."
  } else {
    if (-not (Test-Path -LiteralPath $CodexHome)) { New-Item -ItemType Directory -Path $CodexHome | Out-Null }
    $text = if (Test-Path -LiteralPath $Toml) { [System.IO.File]::ReadAllText($Toml) } else { '' }
    $start = '# astras-pet-os-mcp:start (mcp\register-astras-pet-os-mcp-20261026.ps1; run it again to update)'
    $end = '# astras-pet-os-mcp:end'
    # TOML basic strings: escape backslashes and double quotes. The apostrophe in "Astra's PetOS" needs no escape here.
    $q = { param($s) '"' + ($s -replace '\\', '\\' -replace '"', '\"') + '"' }
    $block = @($start, "[mcp_servers.$Name]", "command = $(& $q $Node)", "args = [$(& $q $Server)]", $end) -join "`r`n"
    $pattern = '(?s)# astras-pet-os-mcp:start.*?# astras-pet-os-mcp:end'
    if ($text -match $pattern) {
      $text = [regex]::Replace($text, $pattern, [System.Text.RegularExpressions.MatchEvaluator] { param($m) $block })
    } elseif ($text -match "(?m)^\s*\[mcp_servers\.(`"?)$([regex]::Escape($Name))\1\]") {
      throw "Codex: $Toml already has its own [mcp_servers.$Name] table. Remove it (or this script's markers will not find it) and run again."
    } else {
      if ($text -and -not $text.EndsWith("`n")) { $text += "`r`n" }
      $text += "`r`n" + $block + "`r`n"
    }
    Backup $Toml
    [System.IO.File]::WriteAllText($Toml, $text, $Utf8)
    $Done += "Codex ($Toml; start a new Codex session)"
  }
}

if ($Done.Count) { Say ('registered with: ' + ($Done -join '; ')) } else { Say 'registered with no client (none was found).' }
Say 'read only: the server has no write tools. Try asking: "list the open handoff cards for claude".'
