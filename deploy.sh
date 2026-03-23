#!/usr/bin/env bash

set -euo pipefail

echo "Deploying TON618..."

if [ -f package-lock.json ]; then
  echo "Installing dependencies with npm ci..."
  npm ci
else
  echo "package-lock.json not found, using npm install..."
  npm install
fi

echo "Checking runtime versions..."
node -e "console.log('Node.js:', process.version); console.log('discord.js:', require('discord.js/package.json').version)"

echo "Deploy finished."
echo "Start the bot with: npm start"
echo "Sync slash commands with: npm run deploy:compact"
