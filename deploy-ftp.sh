#!/bin/bash

# FTP Deployment Script for EvolveCode
# Usage: ./deploy-ftp.sh

# Configuration - EDIT THESE WITH YOUR CREDENTIALS
FTP_USER="hereisreal"
FTP_PASS="123456Aa"
FTP_HOST="ftp.hereisreal.altervista.org"
REMOTE_DIR="/public_html/evolve-code"

# Colors for outputt
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 EvolveCode FTP Deployment${NC}"
echo "=============================="
echo ""

# Check for required tools
if ! command -v lftp &> /dev/null; then
    echo -e "${RED}❌ lftp is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install lftp"
    echo "  macOS: brew install lftp"
    echo "  Or use deploy-ssh.sh if you have SSH access"
    exit 1
fi

# Check if build exists
if [ ! -d "dist" ]; then
    echo -e "${BLUE}📦 Building project...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed!${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📝 Configuration:${NC}"
echo "  User: $FTP_USER"
echo "  Host: $FTP_HOST"
echo ""

# Create lftp script
cat > /tmp/deploy.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no
set ftp:ssl-force no
set ftp:passive-mode yes
set net:timeout 60
set net:max-retries 2

# Connect
set ftp:ssl-allow no
open -u USER,PASS HOST

# Upload frontend
echo "Uploading frontend files..."
lcd dist
cd REMOTE_DIR
mirror -R

bye
EOF

# Replace placeholders
sed -i "s/USER/$FTP_USER/g" /tmp/deploy.lftp
sed -i "s/PASS/$FTP_PASS/g" /tmp/deploy.lftp
sed -i "s/HOST/$FTP_HOST/g" /tmp/deploy.lftp
sed -i "s|REMOTE_DIR|$REMOTE_DIR|g" /tmp/deploy.lftp

echo -e "${BLUE}📤 Starting upload...${NC}"
lftp -f /tmp/deploy.lftp

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Upload complete!${NC}"
    rm /tmp/deploy.lftp
else
    echo -e "${RED}❌ Upload failed${NC}"
    rm /tmp/deploy.lftp
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Test your app at:"
echo "  https://${FTP_HOST/ftp./}"
