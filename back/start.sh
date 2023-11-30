#!bin/bash

npx prisma migrate dev

# npm install pm2@latest -g

npm run start dev
# npm run build

# pm2 start dist/main.js --name backend_api

# pm2 startup systemd
# pm2 save