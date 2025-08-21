#!/bin/bash
set -e

echo "Stopping existing PM2 process..."
pm2 delete immochat || true

echo "Pulling latest code..."
git reset --hard origin/main
git clean -fd

echo "Installing dependencies..."
npm install

echo "Building Next.js app..."
npm run build

echo "Starting PM2 process..."
pm2 start npm --name immochat -- run start

echo "Deployment complete!"
pm2 logs immochat --lines 20
