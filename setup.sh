#!/bin/bash

# Atualiza o sistema
sudo apt update
sudo apt upgrade -y

# Instala o Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instala o PM2 globalmente
sudo npm install -g pm2

# Instala o Nginx
sudo apt install -y nginx

# Instala o PostgreSQL (se você precisar do banco localmente)
sudo apt install -y postgresql postgresql-contrib

# Configura o Nginx
sudo tee /etc/nginx/sites-available/zeloclub << EOF
server {
    listen 80;
    server_name api.zeloclub.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Ativa o site
sudo ln -s /etc/nginx/sites-available/zeloclub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Cria diretório para a aplicação
mkdir -p /home/ubuntu/zeloclub-api