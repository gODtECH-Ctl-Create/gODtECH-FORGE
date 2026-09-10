[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Version
)

$ErrorActionPreference = "Stop"
$Repository = "gODtECH-Ctl-Create/gODtECH-FORGE"

function Fail-ForgeInstall {
    param([string]$Message)
    throw "FORGE install failed: $Message"
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) { $npm = Get-Command npm -ErrorAction SilentlyContinue }
if (-not $npm) { Fail-ForgeInstall "npm is required (Node.js 20 or newer)." }

$Version = $Version.Trim()
if ($Version.StartsWith("v")) { $Version = $Version.Substring(1) }
if ([string]::IsNullOrWhiteSpace($Version) -or $Version -notmatch '^[0-9A-Za-z.-]+$') {
    Fail-ForgeInstall "invalid version. Example: .\install.ps1 -Version 0.6.0"
}

$Tag = "v$Version"
$Asset = "forge-$Version.tgz"
$BaseUrl = "https://github.com/$Repository/releases/download/$Tag"
$TempDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("forge-install-" + [Guid]::NewGuid().ToString("N"))
$Archive = Join-Path $TempDirectory $Asset
$Checksums = Join-Path $TempDirectory "SHA256SUMS.txt"

New-Item -ItemType Directory -Path $TempDirectory | Out-Null

try {
    Write-Host "Downloading FORGE $Version..."
    try {
        Invoke-WebRequest -Uri "$BaseUrl/$Asset" -OutFile $Archive
        Invoke-WebRequest -Uri "$BaseUrl/SHA256SUMS.txt" -OutFile $Checksums
    }
    catch {
        Fail-ForgeInstall "could not download release assets from the canonical GitHub release. $($_.Exception.Message)"
    }

    $ChecksumText = Get-Content -Raw -Path $Checksums
    $EscapedAsset = [Regex]::Escape($Asset)
    $Match = [Regex]::Match($ChecksumText, "(?im)^([0-9a-f]{64})\s+\*?$EscapedAsset\s*$")
    if (-not $Match.Success) {
        Fail-ForgeInstall "SHA256SUMS.txt does not contain a valid SHA-256 entry for $Asset."
    }

    $Expected = $Match.Groups[1].Value.ToLowerInvariant()
    $Actual = (Get-FileHash -Path $Archive -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($Actual -ne $Expected) {
        Fail-ForgeInstall "checksum mismatch for $Asset; nothing was installed."
    }

    Write-Host "Checksum verified. Installing FORGE $Version..."
    & $npm.Source install --global $Archive
    if ($LASTEXITCODE -ne 0) { Fail-ForgeInstall "npm installation failed." }

    $forge = Get-Command forge.cmd -ErrorAction SilentlyContinue
    if (-not $forge) { $forge = Get-Command forge -ErrorAction SilentlyContinue }
    if ($forge) {
        $Installed = (& $forge.Source --version 2>$null | Select-Object -First 1).Trim()
        if ($Installed -ne $Version) {
            Fail-ForgeInstall "installed forge reports version '$Installed', expected '$Version'."
        }
    }

    Write-Host "FORGE $Version installed successfully."
    Write-Host "Run: forge --version"
}
finally {
    Remove-Item -Recurse -Force -Path $TempDirectory -ErrorAction SilentlyContinue
}
