# ==============================================================================
#  Ryuk CLI One-Line PowerShell Installer for Windows
#  Usage: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; irm https://raw.githubusercontent.com/codezenashish/ryuk/main/install.ps1 | iex
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ____            _    " -ForegroundColor Cyan
Write-Host " |  _ \ _   _ _ _| | __" -ForegroundColor Cyan
Write-Host " | |_) | | | | | | |/ /" -ForegroundColor Cyan
Write-Host " |  _ <| |_| | |_|   < " -ForegroundColor Cyan
Write-Host " |_| \_\\__,_|\__,_|_|\_\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing Ryuk CLI Tool for Windows..." -ForegroundColor Bold

# Check Node.js prerequisite
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Error: Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install Node.js (v18+) from https://nodejs.org and rerun this script." -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node -v
Write-Host "✔ Node.js detected: $nodeVersion" -ForegroundColor Green

# Prepare directories
$ryukDir = "$env:USERPROFILE\.ryuk"
$binDir = "$ryukDir\bin"

if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir -Force | Out-Null
}

$rawUrl = "https://raw.githubusercontent.com/codezenashish/ryuk/main/dist/cli.js"
$cliPath = "$ryukDir\cli.js"

Write-Host "`n📦 Installing Ryuk CLI executable..." -ForegroundColor Cyan

if (Test-Path ".\dist\cli.js") {
    Copy-Item ".\dist\cli.js" -Destination $cliPath -Force
} else {
    Invoke-WebRequest -Uri $rawUrl -OutFile $cliPath -UseBasicParsing
}

# Create Windows Batch wrapper (ryuk.cmd)
$cmdContent = "@echo off`r`nnode `"$cliPath`" %*"
Set-Content -Path "$binDir\ryuk.cmd" -Value $cmdContent -Encoding ASCII

# Add ~/.ryuk/bin to User Environment Path if missing
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$binDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$binDir", "User")
    Write-Host "ℹ Added $binDir to User PATH environment variable." -ForegroundColor Cyan
}

Write-Host "`n------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "✨ Ryuk CLI Ready on Windows!" -ForegroundColor Green
Write-Host "`n1. Authenticate with your Ryuk API Key:" -ForegroundColor White
Write-Host "   ryuk login" -ForegroundColor Cyan
Write-Host "`n2. Bookmark web pages directly from terminal:" -ForegroundColor White
Write-Host "   ryuk add https://nextjs.org" -ForegroundColor Cyan
Write-Host "`n3. Search bookmarks & notes:" -ForegroundColor White
Write-Host "   ryuk search" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------`n" -ForegroundColor DarkGray
