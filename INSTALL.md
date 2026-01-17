# VORTEXIA - Guia de Instalação para Ubuntu 22.04

## Instalação Rápida (Um Comando)

```bash
curl -sL https://raw.githubusercontent.com/macbservices/vortexia/main/install.sh -o install.sh && sudo bash install.sh
```

O script irá:
- Atualizar o sistema
- Instalar Node.js 20, PM2 e Git
- Clonar o repositório
- Instalar dependências e criar build
- Configurar PM2 para auto-start
- Configurar firewall UFW

---

## Requisitos do Servidor

- Ubuntu 22.04
- Mínimo 1GB RAM
- Mínimo 10GB de espaço em disco
- Acesso root (sudo)

---

## Após Instalação

### Verificar Status

```bash
pm2 status
```

Ou:

```bash
bash /var/www/vortexia/check-service.sh
```

### Comandos Úteis

```bash
# Ver logs
pm2 logs vortexia

# Reiniciar
pm2 restart vortexia

# Parar
pm2 stop vortexia
```

### Atualizar o Site

```bash
cd /var/www/vortexia && sudo bash update.sh
```

### Corrigir Problemas

```bash
sudo bash /var/www/vortexia/fix-all.sh
```

---

## Configurar Domínio (Cloudflare Tunnel)

Após a instalação, configure um Cloudflare Tunnel apontando para:

```
http://localhost:3000
```

### Passos:

1. Acesse o painel do Cloudflare
2. Vá em **Zero Trust** > **Access** > **Tunnels**
3. Crie um novo Tunnel
4. Instale o connector na VPS
5. Configure o Public Hostname apontando para `http://localhost:3000`

---

## Painel Administrativo

- **URL:** http://localhost:3000/admin (ou seu domínio/admin)
- **Usuário:** admin
- **Senha:** admin123

**IMPORTANTE:** Altere a senha no primeiro acesso!

---

## Estrutura de Arquivos

```
/var/www/vortexia/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
├── data/
│   └── admin-data.json    # Dados persistentes (senha, config, clientes)
├── .next/                  # Build de produção
├── ecosystem.config.js     # Config PM2
├── install.sh             # Instalação
├── update.sh              # Atualização
├── check-service.sh       # Verificar status
└── fix-all.sh             # Corrigir problemas
```

---

## Dados Persistentes

Os dados são salvos em `/var/www/vortexia/data/admin-data.json`:

- Senha do admin
- Link do WhatsApp
- Quantidade de vagas
- Lista de clientes

Este arquivo é preservado durante atualizações.

---

## Resolução de Problemas

### Site não carrega

```bash
pm2 status
pm2 logs vortexia --lines 50
```

### Erro de permissão

```bash
sudo chown -R www-data:www-data /var/www/vortexia
sudo chmod 666 /var/www/vortexia/data/admin-data.json
```

### Rebuild completo

```bash
sudo bash /var/www/vortexia/fix-all.sh
