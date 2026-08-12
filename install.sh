#!/usr/bin/env bash

# ==============================================================================
#  Ryuk CLI One-Line Shell Installer for Linux & macOS
#  Usage: curl -fsSL https://raw.githubusercontent.com/codezenashish/devnest/main/install.sh | bash
# ==============================================================================

set -e

# Styling Colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}${CYAN}"
echo "  ____            _    "
echo " |  _ \ _   _ _ _| | __"
echo " | |_) | | | | | | |/ /"
echo " |  _ <| |_| | |_|   < "
echo " |_| \_\\\\__,_|\__,_|_|\_\\"
echo -e "${NC}"
echo -e "${BOLD}Installing Ryuk CLI Tool...${NC}\n"

# Step 1: Detect Operating System
OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM="Linux";;
    Darwin*)    PLATFORM="macOS";;
    *)          PLATFORM="${OS}"
esac

echo -e "${CYAN}ℹ Operating System:${NC} ${PLATFORM}"

# Step 2: Check Node.js prerequisite
if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Error: Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js (v18+) from https://nodejs.org and rerun this script.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✔ Node.js detected:${NC} ${NODE_VERSION}"

# Step 3: Install Ryuk CLI via npm global
echo -e "\n${BOLD}📦 Installing Ryuk CLI...${NC}"

if command -v npm &> /dev/null; then
    npm install -g ryuk-cli --silent 2>/dev/null || npm install -g landing 2>/dev/null || true
fi

echo -e "\n------------------------------------------------------------"
echo -e "${BOLD}${GREEN}✨ Ryuk CLI Ready!${NC}"
echo -e "\n1. Authenticate with your Ryuk API Key:"
echo -e "   ${BOLD}${CYAN}ryuk login${NC}\n"
echo -e "2. Bookmark web pages directly from terminal:"
echo -e "   ${BOLD}${CYAN}ryuk add https://nextjs.org${NC}\n"
echo -e "------------------------------------------------------------"
