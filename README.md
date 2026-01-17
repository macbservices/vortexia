# VORTEXIA

Sistema de streaming IPTV premium com painel administrativo.

## Características

- Interface moderna dark mode com glassmorphism
- Landing page com contador de vagas em tempo real
- Painel administrativo completo
- Persistência de dados local (sem banco externo)
- Execução persistente com PM2
- Auto-start após reinicialização da VPS
- Porta 3000 bloqueada externamente

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Instalação Rápida em VPS

Execute um único comando para instalar tudo automaticamente:

```bash
curl -sL https://raw.githubusercontent.com/macbservices/vortexia/main/install.sh | sudo bash
```

**Com domínio customizado:**

```bash
DOMAIN=seu-dominio.com.br curl -sL https://raw.githubusercontent.com/macbservices/vortexia/main/install.sh | sudo bash
```

Veja [INSTALL.md](INSTALL.md) para mais opções e documentação completa.

## Painel Administrativo

Acesse `/admin` para gerenciar o site:

- Alterar quantidade de vagas
- Alterar link do WhatsApp
- Gerenciar clientes (CRUD completo)

**Credenciais padrão:** admin / admin123

## Comandos Úteis

```bash
# Ver status
bash /var/www/vortexia/check-service.sh

# Ver logs
pm2 logs vortexia

# Reiniciar
pm2 restart vortexia

# Atualizar
sudo bash /var/www/vortexia/update.sh
```

## Estrutura do Projeto

```
vortexia/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Landing page
│   ├── admin/             # Painel administrativo
│   └── api/               # API routes
├── components/            # Componentes React
│   └── landing/           # Componentes da landing
├── lib/                   # Utilitários
│   └── store.ts          # Persistência de dados
├── data/                  # Dados persistentes
│   └── admin-data.json   # Configurações e clientes
├── install.sh            # Instalação automática
├── update.sh             # Atualização
├── check-service.sh      # Verificar status
└── fix-all.sh            # Corrigir problemas
