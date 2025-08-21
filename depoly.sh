#!/bin/bash
set -e

echo "Pulling latest code..."
git reset --hard origin/main
git clean -fd

echo "Installing dependencies..."
npm install

echo "Building Next.js app..."
npm run build

echo "Restarting PM2 process..."
pm2 restart immochat || pm2 start node --name immochat -- .next/standalone/server.js

echo "Deployment complete!"
pm2 logs immochat --lines 20
