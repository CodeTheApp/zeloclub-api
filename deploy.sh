#!/bin/bash

# Configurações
SERVER="ubuntu@52.202.43.166"
KEY="$HOME/.ssh/aws-keys/sua-chave.pem"
APP_DIR="/home/ubuntu/zeloclub-api"

# Build local
echo "Building application..."
npm run build

# Cria arquivo de ambiente
echo "Creating .env file..."
cat > .env << EOF
NODE_ENV=production
DB_HOST=zeloclub-database.cluster-c7u0yqawacad.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=zeloclub
DB_PASS=Zeloclub!2025
DB_NAME=zeloclub-database
JWT_SECRET=a673ab816eb25c200ba34004a554d06a6ea2013612f52d8a6973cc2f6cea5d05
AWS_BUCKET_NAME=zeloclub-public
AWS_REGION=us-east-1
SENDGRID_API_KEY=mlsn.b65516499d0c1013e030c40d767078343c4f38e8edcd77507f5d1bfdc5793547
AWS_ACCESS_KEY_ID=AKIAYRCT2NPCEQHVVQEI
AWS_SECRET_ACCESS_KEY=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
S3_BUCKET_NAME=zeloclub-public
EOF

# Sync arquivos para o servidor
echo "Uploading files..."
rsync -avz -e "ssh -i $KEY" \
    --exclude 'node_modules' \
    --exclude '.git' \
    ./ $SERVER:$APP_DIR/

# Executa comandos remotos
ssh -i $KEY $SERVER << EOF
    cd $APP_DIR
    npm install --production
    npm run migration:run
    pm2 delete zeloclub-api || true
    pm2 start dist/index.js --name zeloclub-api
    pm2 save
EOF

echo "Deploy complete!"