#!/bin/bash
cd /www/wwwroot/Immo_Chat
git reset --hard
git pull origin main
npm install
npm run build
pm2 restart immochat
