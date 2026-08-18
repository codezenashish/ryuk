#!/usr/bin/env bash

# ==============================================================================
#  Ryuk CLI One-Line Shell Installer for Linux & macOS (Bash, Zsh, Fish)
#  Usage: curl -fsSL https://raw.githubusercontent.com/codezenashish/devnest/main/install.sh | bash
# ==============================================================================

set -e

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

OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM="Linux";;
    Darwin*)    PLATFORM="macOS";;
    *)          PLATFORM="${OS}"
esac

echo -e "${CYAN}ℹ Operating System:${NC} ${PLATFORM}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Error: Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js (v18+) from https://nodejs.org and rerun this script.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✔ Node.js detected:${NC} ${NODE_VERSION}"

# Install directories
RYUK_DIR="$HOME/.ryuk"
INSTALL_DIR="$HOME/.local/bin"

mkdir -p "$RYUK_DIR"
mkdir -p "$INSTALL_DIR"

RAW_URL="https://raw.githubusercontent.com/codezenashish/devnest/main/dist/cli.js"

echo -e "${CYAN}ℹ Installing Ryuk executable binary...${NC}"
if [ -f "./dist/cli.js" ]; then
    cp "./dist/cli.js" "$RYUK_DIR/cli.js"
elif command -v curl &> /dev/null; then
    curl -fsSL "$RAW_URL" -o "$RYUK_DIR/cli.js"
elif command -v wget &> /dev/null; then
    wget -qO "$RYUK_DIR/cli.js" "$RAW_URL"
else
    echo -e "${RED}✖ Error: curl or wget is required to download Ryuk.${NC}"
    exit 1
fi

chmod +x "$RYUK_DIR/cli.js"

# Create executable wrapper in ~/.local/bin/ryuk
cat << 'EOF' > "$INSTALL_DIR/ryuk"
#!/usr/bin/env bash
exec node "$HOME/.ryuk/cli.js" "$@"
EOF

chmod +x "$INSTALL_DIR/ryuk"

# Try copying executable to /usr/local/bin if writable
if [ -w "/usr/local/bin" ]; then
    cp "$INSTALL_DIR/ryuk" /usr/local/bin/ryuk 2>/dev/null || true
fi

echo -e "\n------------------------------------------------------------"
echo -e "${BOLD}${GREEN}✨ Ryuk CLI installed successfully!${NC}"
echo -e "\n1. Authenticate with your Ryuk API Key:"
echo -e "   ${BOLD}${CYAN}ryuk login${NC}\n"
echo -e "2. Bookmark web pages directly from terminal:"
echo -e "   ${BOLD}${CYAN}ryuk add https://nextjs.org${NC}\n"
echo -e "3. Search bookmarks and notes:"
echo -e "   ${BOLD}${CYAN}ryuk search${NC}\n"
echo -e "------------------------------------------------------------"
