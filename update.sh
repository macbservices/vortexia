#!/bin/bash

#===============================================================================
# VORTEXIA - Script de Atualização
# Uso: cd /var/www/vortexia && sudo bash update.sh
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
print_warning() { echo -e "${YELLOW}[AVISO]${NC} $1"; }
print_error() { echo -e "${RED}[ERRO]${NC} $1"; }

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    VORTEXIA - ATUALIZAÇÃO                          ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ "$EUID" -ne 0 ]; then
    print_error "Execute como root: sudo bash $0"
    exit 1
fi

cd $APP_DIR

# Backup dos dados
print_status "Fazendo backup dos dados..."
if [ -f "data/admin-data.json" ]; then
    cp data/admin-data.json "data/admin-data-backup-$(date +%Y%m%d_%H%M%S).json"
    print_success "Backup criado!"
fi

# Atualizar código
print_status "Baixando atualizações..."
git fetch origin
git reset --hard origin/main

# Instalar dependências
print_status "Instalando dependências..."
npm install

# Rebuild
print_status "Criando build de produção..."
npm run build

# Restaurar permissões
print_status "Restaurando permissões..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod 666 $APP_DIR/data/admin-data.json

# Reiniciar aplicação
print_status "Reiniciando aplicação..."
pm2 restart $APP_NAME

echo ""
print_success "Atualização concluída!"
echo ""
echo -e "  ${GREEN}Ver logs:${NC} pm2 logs $APP_NAME"
echo -e "  ${GREEN}Ver status:${NC} pm2 status"
echo ""
