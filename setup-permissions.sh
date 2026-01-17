#!/bin/bash

#===============================================================================
# VORTEXIA - Configurar Permissões dos Scripts
# Uso: bash /var/www/vortexia/setup-permissions.sh
#===============================================================================

APP_DIR="/var/www/vortexia"

echo "Configurando permissões dos scripts..."

chmod +x $APP_DIR/install.sh 2>/dev/null || true
chmod +x $APP_DIR/update.sh 2>/dev/null || true
chmod +x $APP_DIR/check-service.sh 2>/dev/null || true
chmod +x $APP_DIR/setup-permissions.sh 2>/dev/null || true
chmod +x $APP_DIR/fix-all.sh 2>/dev/null || true
chmod +x $APP_DIR/block-port-3000.sh 2>/dev/null || true

echo "Permissões configuradas!"
echo ""
echo "Agora você pode executar os scripts diretamente:"
echo "  ./check-service.sh"
echo "  sudo ./update.sh"
