# ==============================================================================
#  Ryuk CLI One-Line PowerShell Installer for Windows
#  Usage: iwr -useb https://raw.githubusercontent.com/codezenashish/ryuk/main/install.ps1 | iex
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

# Perform npm global installation
Write-Host "`n📦 Installing Ryuk CLI globally..." -ForegroundColor Cyan

try {
    npm install -g ryuk-cli --silent
} catch {
    npm install -g landing
}

Write-Host "`n------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "✨ Ryuk CLI Ready on Windows!" -ForegroundColor Green
Write-Host "`n1. Authenticate with your Ryuk API Key:" -ForegroundColor White
Write-Host "   ryuk login" -ForegroundColor Cyan
Write-Host "`n2. Bookmark web pages directly from terminal:" -ForegroundColor White
Write-Host "   ryuk add https://nextjs.org" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------`n" -ForegroundColor DarkGray
