#!/bin/bash

#===============================================================================
# VORTEXIA - Verificar Status dos Serviços
# Uso: bash /var/www/vortexia/check-service.sh
#===============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

APP_NAME="vortexia"
APP_DIR="/var/www/$APP_NAME"

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                  VORTEXIA - STATUS DOS SERVIÇOS                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Status PM2
echo -e "${CYAN}═══ PM2 ═══${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    pm2_status=$(pm2 jlist | grep -o "\"name\":\"$APP_NAME\"[^}]*\"status\":\"[^\"]*\"" | grep -o "\"status\":\"[^\"]*\"" | cut -d'"' -f4)
    if [ "$pm2_status" = "online" ]; then
        echo -e "  ${GREEN}●${NC} Aplicação: ${GREEN}ONLINE${NC}"
    else
        echo -e "  ${RED}●${NC} Aplicação: ${RED}$pm2_status${NC}"
    fi
else
    echo -e "  ${RED}●${NC} Aplicação: ${RED}NÃO ENCONTRADA${NC}"
fi
pm2 list

# Status Firewall
echo ""
echo -e "${CYAN}═══ FIREWALL ═══${NC}"
if ufw status | grep -q "Status: active"; then
    echo -e "  ${GREEN}●${NC} UFW: ${GREEN}ATIVO${NC}"
else
    echo -e "  ${YELLOW}●${NC} UFW: ${YELLOW}INATIVO${NC}"
fi

# Verificar porta 3000
echo ""
echo -e "${CYAN}═══ PORTA 3000 ═══${NC}"
if curl -s --connect-timeout 2 http://localhost:3000 > /dev/null; then
    echo -e "  ${GREEN}●${NC} Porta 3000 (local): ${GREEN}RESPONDENDO${NC}"
else
    echo -e "  ${RED}●${NC} Porta 3000 (local): ${RED}SEM RESPOSTA${NC}"
fi

# Dados
echo ""
echo -e "${CYAN}═══ DADOS ═══${NC}"
if [ -f "$APP_DIR/data/admin-data.json" ]; then
    echo -e "  ${GREEN}●${NC} Arquivo de dados: ${GREEN}EXISTE${NC}"
    echo -e "  ${BLUE}●${NC} Tamanho: $(du -h $APP_DIR/data/admin-data.json | cut -f1)"
else
    echo -e "  ${RED}●${NC} Arquivo de dados: ${RED}NÃO ENCONTRADO${NC}"
fi

# Últimos logs
echo ""
echo -e "${CYAN}═══ ÚLTIMOS LOGS ═══${NC}"
pm2 logs $APP_NAME --lines 10 --nostream 2>/dev/null || echo "  Sem logs disponíveis"

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
