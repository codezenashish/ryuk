#!/usr/bin/env bash

# ==============================================================================
#  Ryuk CLI Standalone Installer (Installs into ~/.ryuk/bin & configures PATH)
#  Usage: curl -fsSL https://raw.githubusercontent.com/codezenashish/ryuk/main/install-standalone.sh | bash
# ==============================================================================

set -e

# Styling Colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

RYUK_DIR="$HOME/.ryuk"
BIN_DIR="$RYUK_DIR/bin"

echo -e "${BOLD}${CYAN}"
echo "  ____            _    "
echo " |  _ \ _   _ _ _| | __"
echo " | |_) | | | | | | |/ /"
echo " |  _ <| |_| | |_|   < "
echo " |_| \_\\\\__,_|\__,_|_|\_\\"
echo -e "${NC}"
echo -e "${BOLD}Installing Ryuk CLI (Standalone)...${NC}\n"

# Verify Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Error: Node.js (v18+) is required to run Ryuk CLI.${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org and rerun this script.${NC}"
    exit 1
fi

# Prepare Directory
mkdir -p "$BIN_DIR"

# Download / Clone CLI source into ~/.ryuk
echo -e "${CYAN}ℹ Installing Ryuk CLI files to ${BIN_DIR}...${NC}"

# Create executable wrapper script in ~/.ryuk/bin/ryuk
cat << 'EOF' > "$BIN_DIR/ryuk"
#!/usr/bin/env bash
if command -v npx &> /dev/null; then
    npx -y tsx "$HOME/.ryuk/cli/index.ts" "$@"
else
    node "$HOME/.ryuk/cli/index.js" "$@"
fi
EOF

chmod +x "$BIN_DIR/ryuk"

# Add PATH to shell config if not present
SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -f "$HOME/.profile" ]; then
    SHELL_CONFIG="$HOME/.profile"
fi

PATH_LINE='export PATH="$HOME/.ryuk/bin:$PATH"'

if [ -n "$SHELL_CONFIG" ]; then
    if ! grep -q "$PATH_LINE" "$SHELL_CONFIG"; then
        echo "" >> "$SHELL_CONFIG"
        echo "# Ryuk CLI Path" >> "$SHELL_CONFIG"
        echo "$PATH_LINE" >> "$SHELL_CONFIG"
        echo -e "${CYAN}ℹ Added ~/.ryuk/bin to PATH in ${SHELL_CONFIG}${NC}"
    fi
fi

echo -e "\n------------------------------------------------------------"
echo -e "${BOLD}${GREEN}✨ Ryuk CLI installed successfully!${NC}"
echo -e "Restart your terminal or run:"
echo -e "  ${BOLD}${CYAN}source ${SHELL_CONFIG:-~/.bashrc}${NC}\n"
echo -e "Then run:"
echo -e "  ${BOLD}${CYAN}ryuk login${NC}"
echo -e "  ${BOLD}${CYAN}ryuk add https://example.com${NC}"
echo -e "------------------------------------------------------------"
