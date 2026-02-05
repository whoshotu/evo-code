#!/bin/bash

# SSH Deployment Script for EvolveCode
# Usage: ./deploy-ssh.sh [user@host]

# Configuration - YOUR DOMAIN
SSH_USER="${1:-hereisreal}"
SSH_HOST="${2:-hereisreal.altervista.org}"
REMOTE_DIR="${3:-/public_html/evolve-code}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 EvolveCode SSH Deployment${NC}"
echo "=============================="
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo -e "${BLUE}📦 Building project...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed!${NC}"
        exit 1
    fi
fi

# Check if backend is configured
if [ ! -f "backend/config/config.php" ]; then
    echo -e "${RED}❌ backend/config/config.php not found!${NC}"
    echo "Please copy backend/config/config.example.php and configure it first."
    exit 1
fi

echo -e "${BLUE}📝 Configuration:${NC}"
echo "  User: $SSH_USER"
echo "  Host: $SSH_HOST"
echo "  Remote Directory: $REMOTE_DIR"
echo ""

# Build rsync exclude list
EXCLUDES="--exclude='.git' --exclude='node_modules' --exclude='*.zip' --exclude='.env' --exclude='deploy-*.sh'"

echo -e "${BLUE}📤 Uploading frontend (dist/)...${NC}"
rsync -avz --progress \
    $EXCLUDES \
    dist/ \
    "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend uploaded successfully${NC}"
else
    echo -e "${RED}❌ Frontend upload failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📤 Uploading backend...${NC}"
rsync -avz --progress \
    $EXCLUDES \
    backend/ \
    "$SSH_USER@$SSH_HOST:$REMOTE_DIR/backend/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend uploaded successfully${NC}"
else
    echo -e "${RED}❌ Backend upload failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Setting permissions...${NC}"
ssh "$SSH_USER@$SSH_HOST" "
    cd $REMOTE_DIR
    chmod 644 backend/config/config.php
    chmod 755 backend/api/ai-proxy.php
    chmod 755 backend/logs/
    echo 'Permissions set'
"

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Test your app at:"
echo "  https://$SSH_HOST"
echo ""
echo "Test API at:"
echo "  https://$SSH_HOST/backend/test.php"
