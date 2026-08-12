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

# Install path setup (~/.local/bin is standard on Linux/macOS)
INSTALL_DIR="$HOME/.local/bin"
mkdir -p "$INSTALL_DIR"

# Also try pnpm link / npm link if inside repository
if [ -f "package.json" ]; then
    if command -v pnpm &> /dev/null; then
        pnpm link --global 2>/dev/null || true
    elif command -v npm &> /dev/null; then
        npm link 2>/dev/null || true
    fi
fi

# Fallback wrapper in ~/.local/bin/ryuk
cat << 'EOF' > "$INSTALL_DIR/ryuk"
#!/usr/bin/env bash
if [ -f "$HOME/Desktop/dev-nest/cli/index.ts" ]; then
    exec npx tsx "$HOME/Desktop/dev-nest/cli/index.ts" "$@"
elif [ -f "$HOME/.ryuk/cli/index.js" ]; then
    exec node "$HOME/.ryuk/cli/index.js" "$@"
else
    exec npx -y ryuk-cli "$@"
fi
EOF

chmod +x "$INSTALL_DIR/ryuk"

# Try copying symlink to /usr/local/bin if writable
if [ -w "/usr/local/bin" ]; then
    cp "$INSTALL_DIR/ryuk" /usr/local/bin/ryuk 2>/dev/null || true
fi

echo -e "\n------------------------------------------------------------"
echo -e "${BOLD}${GREEN}✨ Ryuk CLI Ready!${NC}"
echo -e "\n1. Authenticate with your Ryuk API Key:"
echo -e "   ${BOLD}${CYAN}ryuk login${NC}\n"
echo -e "2. Bookmark web pages directly from terminal:"
echo -e "   ${BOLD}${CYAN}ryuk add https://nextjs.org${NC}\n"
echo -e "------------------------------------------------------------"
