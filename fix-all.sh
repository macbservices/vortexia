#!/bin/bash

#===============================================================================
# VORTEXIA - Corrigir Problemas Comuns
# Uso: sudo bash /var/www/vortexia/fix-all.sh
#===============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

APP_NAME="vortexia"
APP_DIR="/var/www/$APP_NAME"

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                 VORTEXIA - CORREÇÃO DE PROBLEMAS                   ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Execute como root: sudo bash $0${NC}"
    exit 1
fi

# Corrigir permissões
print_status "Corrigindo permissões..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod 666 $APP_DIR/data/admin-data.json
print_success "Permissões corrigidas!"

# Reinstalar dependências
print_status "Reinstalando dependências..."
cd $APP_DIR
rm -rf node_modules
npm install
print_success "Dependências reinstaladas!"

# Rebuild
print_status "Reconstruindo aplicação..."
npm run build
print_success "Build concluído!"

# Reiniciar PM2
print_status "Reiniciando PM2..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
print_success "PM2 reiniciado!"

echo ""
print_success "Todas as correções aplicadas!"
echo ""
echo -e "  ${GREEN}Ver status:${NC} bash $APP_DIR/check-service.sh"
echo ""
