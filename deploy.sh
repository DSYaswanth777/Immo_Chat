#!/bin/bash
cd /root/Immo_Chat || exit
git reset --hard
git clean -fd
git pull origin main
npm install
npm run build
pm2 restart immochat
