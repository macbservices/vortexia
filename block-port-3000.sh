#!/bin/bash

#===============================================================================
# VORTEXIA - Bloquear Porta 3000 Externamente
# Uso: sudo bash /var/www/vortexia/block-port-3000.sh
#===============================================================================

if [ "$EUID" -ne 0 ]; then
    echo "Execute como root: sudo bash $0"
    exit 1
fi

echo "Bloqueando acesso externo à porta 3000..."

# UFW
ufw deny 3000/tcp 2>/dev/null || true

# iptables
iptables -D INPUT -p tcp --dport 3000 -j DROP 2>/dev/null || true
iptables -A INPUT -p tcp --dport 3000 -j DROP
iptables-save > /etc/iptables.rules

echo "Porta 3000 bloqueada externamente!"
echo "O site continua acessível via Nginx (porta 80/443)"
