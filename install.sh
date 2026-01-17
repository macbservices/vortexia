#!/bin/bash

#===============================================================================
# VORTEXIA - Script de Instalação Automática para Ubuntu 22.04
# 
# Uso:
#   curl -sL https://raw.githubusercontent.com/macbservices/vortexia/main/install.sh -o install.sh && sudo bash install.sh
#===============================================================================

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variáveis de configuração
APP_NAME="vortexia"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="${REPO_URL:-https://github.com/macbservices/vortexia.git}"
PORT=3000

# Função para exibir banner
show_banner() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                    ║"
    echo "║   ██╗   ██╗ ██████╗ ██████╗ ████████╗███████╗██╗  ██╗██╗ █████╗    ║"
    echo "║   ██║   ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝██║██╔══██╗   ║"
    echo "║   ██║   ██║██║   ██║██████╔╝   ██║   █████╗   ╚███╔╝ ██║███████║   ║"
    echo "║   ╚██╗ ██╔╝██║   ██║██╔══██╗   ██║   ██╔══╝   ██╔██╗ ██║██╔══██║   ║"
    echo "║    ╚████╔╝ ╚██████╔╝██║  ██║   ██║   ███████╗██╔╝ ██╗██║██║  ██║   ║"
    echo "║     ╚═══╝   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ║"
    echo "║                                                                    ║"
    echo "║              INSTALADOR AUTOMÁTICO - UBUNTU 22.04                  ║"
    echo "║                                                                    ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[AVISO]${NC} $1"; }
print_error() { echo -e "${RED}[ERRO]${NC} $1"; }

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "Este script precisa ser executado como root (sudo)"
        exit 1
    fi
}

disable_needrestart() {
    print_status "Desabilitando prompts interativos..."
    if [ -f /etc/needrestart/needrestart.conf ]; then
        sed -i "s/#\$nrconf{restart} = 'i';/\$nrconf{restart} = 'a';/" /etc/needrestart/needrestart.conf
    fi
    # Criar config se não existir
    mkdir -p /etc/needrestart/conf.d
    echo "\$nrconf{restart} = 'a';" > /etc/needrestart/conf.d/no-prompt.conf
    print_success "Prompts desabilitados!"
}

update_system() {
    print_status "Atualizando sistema..."
    apt-get update -y
    apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
    print_success "Sistema atualizado!"
}

install_dependencies() {
    print_status "Instalando dependências..."
    apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" curl wget git ufw nginx
    print_success "Dependências instaladas!"
}

install_nodejs() {
    print_status "Instalando Node.js 20 LTS..."
    apt-get remove -y nodejs npm 2>/dev/null || true
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" nodejs
    print_success "Node.js $(node --version) instalado!"
}

install_pm2() {
    print_status "Instalando PM2..."
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
    print_success "PM2 instalado!"
}

clone_repository() {
    print_status "Clonando repositório..."
    
    if [ -d "$APP_DIR" ]; then
        print_warning "Diretório existente encontrado. Fazendo backup dos dados..."
        if [ -f "$APP_DIR/data/admin-data.json" ]; then
            cp "$APP_DIR/data/admin-data.json" /tmp/admin-data-backup.json
        fi
        pm2 delete $APP_NAME 2>/dev/null || true
        rm -rf $APP_DIR
    fi
    
    mkdir -p /var/www
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
    
    # Restaurar dados se existir backup
    if [ -f "/tmp/admin-data-backup.json" ]; then
        mkdir -p $APP_DIR/data
        cp /tmp/admin-data-backup.json $APP_DIR/data/admin-data.json
        rm /tmp/admin-data-backup.json
        print_success "Dados anteriores restaurados!"
    fi
    
    print_success "Repositório clonado!"
}

install_project() {
    print_status "Instalando dependências do projeto..."
    cd $APP_DIR
    npm install
    
    print_status "Criando build de produção..."
    npm run build
    
    print_status "Configurando diretório de dados..."
    mkdir -p $APP_DIR/data
    
    # Criar arquivo de dados inicial se não existir
    if [ ! -f "$APP_DIR/data/admin-data.json" ]; then
        cat > $APP_DIR/data/admin-data.json << 'EOF'
{
  "settings": {
    "availableSlots": 7,
    "totalSlots": 15,
    "whatsappLink": "https://wa.me/5511999999999"
  },
  "clients": [
    {
      "id": "1",
      "name": "João Silva",
      "status": "active",
      "activationDate": "2024-01-15",
      "nextDueDate": "2024-02-15"
    },
    {
      "id": "2",
      "name": "Maria Santos",
      "status": "active",
      "activationDate": "2024-01-20",
      "nextDueDate": "2024-02-20"
    },
    {
      "id": "3",
      "name": "Pedro Oliveira",
      "status": "inactive",
      "activationDate": "2024-01-10",
      "nextDueDate": "2024-02-10"
    }
  ],
  "isPasswordChanged": false,
  "currentPassword": "admin123"
}
EOF
    fi
    
    chown -R root:root $APP_DIR
    chmod -R 755 $APP_DIR
    chmod 777 $APP_DIR/data
    chmod 666 $APP_DIR/data/admin-data.json
    
    print_success "Projeto instalado!"
}

configure_pm2() {
    print_status "Configurando PM2..."
    cd $APP_DIR
    
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    }
  }]
}
EOF
    
    pm2 delete $APP_NAME 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    
    print_success "PM2 configurado!"
}

configure_nginx() {
    print_status "Configurando Nginx como proxy reverso..."
    
    # Remover configuração padrão
    rm -f /etc/nginx/sites-enabled/default
    
    # Criar configuração do VORTEXIA
    cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF
    
    # Ativar site
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Testar e reiniciar Nginx
    nginx -t && systemctl restart nginx
    systemctl enable nginx
    
    print_success "Nginx configurado!"
}

configure_firewall() {
    print_status "Configurando Firewall..."
    
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    ufw --force enable
    
    print_success "Firewall configurado!"
}

setup_scripts_permissions() {
    print_status "Configurando permissões dos scripts..."
    chmod +x $APP_DIR/*.sh 2>/dev/null || true
    print_success "Permissões configuradas!"
}

show_final_info() {
    SERVER_IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}              INSTALAÇÃO CONCLUÍDA COM SUCESSO!                    ${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${CYAN}Site:${NC} http://$SERVER_IP"
    echo -e "  ${CYAN}Admin:${NC} http://$SERVER_IP/admin"
    echo ""
    echo -e "  ${CYAN}Usuário:${NC} admin"
    echo -e "  ${CYAN}Senha:${NC} admin123"
    echo ""
    echo -e "  ${YELLOW}IMPORTANTE: Altere a senha no primeiro acesso!${NC}"
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                     CLOUDFLARE TUNNEL                              ${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Para configurar o domínio, crie um Cloudflare Tunnel apontando para:"
    echo -e "  ${GREEN}http://localhost:3000${NC} ou ${GREEN}http://localhost:80${NC}"
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                        COMANDOS ÚTEIS                              ${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${GREEN}Ver status:${NC}     pm2 status"
    echo -e "  ${GREEN}Ver logs:${NC}       pm2 logs $APP_NAME"
    echo -e "  ${GREEN}Reiniciar:${NC}      pm2 restart $APP_NAME"
    echo -e "  ${GREEN}Atualizar:${NC}      cd $APP_DIR && sudo bash update.sh"
    echo ""
    echo -e "  ${GREEN}Dados salvos em:${NC} $APP_DIR/data/admin-data.json"
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}                   Obrigado por usar VORTEXIA!                     ${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

main() {
    clear
    show_banner
    check_root
    
    echo ""
    print_status "Iniciando instalação..."
    echo ""
    
    disable_needrestart
    update_system
    install_dependencies
    install_nodejs
    install_pm2
    clone_repository
    install_project
    configure_pm2
    configure_nginx
    configure_firewall
    setup_scripts_permissions
    
    show_final_info
}

main
