# TON618 Deployment Guide

Bot-first deployment options for production, optimized for low cost.

## Deployment Options Comparison

| Provider | Cost | Pros | Cons | Best For |
|----------|------|------|------|----------|
| **Square Cloud Hobby** | ~$1-3/mo | Discord-focused, easy setup | Limited resources | Small-medium servers |
| **Railway** | Free tier + usage | Auto-deploy from Git, generous free tier | Requires credit card | Development + small prod |
| **Render** | Free tier available | Simple, reliable | Free tier sleeps after inactivity | Testing + small servers |
| **Contabo VPS** | €4-6/mo | Full control, good specs | Manual setup required | Multiple bots or apps |
| **Oracle Cloud Free** | Free forever | Generous specs, always-on | Complex setup, account approval | Cost-conscious production |

## Recommended: Square Cloud (Easiest)

Square Cloud is optimized for Discord bots and offers the simplest deployment.

### Prerequisites
- Square Cloud account
- GitHub repository with your bot code
- MongoDB Atlas connection string

### Setup Steps

1. **Prepare your repository**
   ```bash
   # Ensure you have these files:
   # - package.json
   # - .env.example (for reference)
   # - squarecloud.config (create this)
   ```

2. **Create `squarecloud.config`**
   ```ini
   MAIN=index.js
   MEMORY=512
   VERSION=recommended
   DISPLAY_NAME=TON618 Ops Console
   DESCRIPTION=Discord ops console for staff teams
   SUBDOMAIN=ton618
   START=npm start
   ```

3. **Upload to Square Cloud**
   - Go to https://squarecloud.app/dashboard
   - Click "Upload Application"
   - Upload your bot as ZIP (include all files except `node_modules`)
   - Or connect your GitHub repository

4. **Configure Environment Variables**
   In Square Cloud dashboard, add:
   ```
   DISCORD_TOKEN=your_token
   MONGO_URI=your_mongodb_atlas_uri
   MONGO_DB=ton618
   OWNER_ID=your_discord_id
   COMMANDS_DISABLED_FILES=public/utility/ping.js,public/utility/embed.js,public/utility/perfil.js,public/utility/poll.js,public/utility/suggest.js,admin/config/setup/bienvenida.js,admin/config/setup/despedida.js,admin/config/setup/confesiones.js,admin/config/setup/sugerencias.js
   ```

5. **Deploy**
   - Click "Start Application"
   - Monitor logs for successful startup
   - Test with `/debug status` in Discord

### Square Cloud Tips
- Use "Hobby" plan for small-medium servers (up to 5k members)
- Enable auto-restart on crash
- Monitor RAM usage in dashboard
- Logs are available in real-time

## Alternative: Railway (Free Tier)

Railway offers generous free tier with GitHub integration.

### Setup Steps

1. **Connect GitHub**
   - Go to https://railway.app
   - Sign in with GitHub
   - Create new project from your repository

2. **Configure Build**
   Railway auto-detects Node.js. No special config needed.

3. **Add Environment Variables**
   In Railway dashboard > Variables:
   ```
   DISCORD_TOKEN=your_token
   MONGO_URI=your_mongodb_uri
   MONGO_DB=ton618
   OWNER_ID=your_id
   COMMANDS_DISABLED_FILES=public/utility/ping.js,public/utility/embed.js,public/utility/perfil.js,public/utility/poll.js,public/utility/suggest.js,admin/config/setup/bienvenida.js,admin/config/setup/despedida.js,admin/config/setup/confesiones.js,admin/config/setup/sugerencias.js
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway auto-deploys on git push
   - Monitor deployment logs
   - Check health endpoint

### Railway Tips
- Free tier: $5 credit/month (enough for small bot)
- Auto-deploys on push to main branch
- Built-in metrics and logging
- Easy rollback to previous deployments

## Alternative: VPS with PM2 (Full Control)

For maximum control and running multiple services.

### Prerequisites
- VPS with Ubuntu 20.04+ (Contabo, DigitalOcean, Vultr, etc.)
- SSH access
- Domain (optional)

### Setup Steps

1. **Install Node.js and MongoDB**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install MongoDB (or use MongoDB Atlas)
   # For Atlas, skip this and use cloud connection string
   ```

2. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

3. **Clone and Setup Bot**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/ton618-bot.git
   cd ton618-bot
   
   # Install dependencies
   npm ci --production
   
   # Create .env file
   nano .env
   # (paste your environment variables)
   
   # Deploy commands
   npm run deploy:compact
   ```

4. **Create PM2 Ecosystem File**
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'ton618-bot',
       script: 'index.js',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '512M',
       env: {
         NODE_ENV: 'production'
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
       merge_logs: true
     }]
   };
   ```

5. **Start with PM2**
   ```bash
   # Create logs directory
   mkdir -p logs
   
   # Start bot
   pm2 start ecosystem.config.js
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   # (follow the command it gives you)
   ```

6. **Useful PM2 Commands**
   ```bash
   pm2 status              # Check status
   pm2 logs ton618-bot     # View logs
   pm2 restart ton618-bot  # Restart
   pm2 stop ton618-bot     # Stop
   pm2 monit               # Monitor resources
   ```

## MongoDB Setup (All Platforms)

### Option 1: MongoDB Atlas (Recommended)

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP: `0.0.0.0/0`
4. Get connection string
5. Use in `MONGO_URI` env var

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/ton618?retryWrites=true&w=majority
```

### Option 2: Local MongoDB (VPS only)

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string
MONGO_URI=mongodb://localhost:27017
```

## Environment Variables for Production

Minimal production `.env`:

```env
# Core (Required)
DISCORD_TOKEN=your_discord_bot_token
MONGO_URI=your_mongodb_connection_string
MONGO_DB=ton618
OWNER_ID=your_discord_user_id

# V1 Bot-First (Recommended)
COMMANDS_DISABLED_FILES=public/utility/ping.js,public/utility/embed.js,public/utility/perfil.js,public/utility/poll.js,public/utility/suggest.js,admin/config/setup/bienvenida.js,admin/config/setup/despedida.js,admin/config/setup/confesiones.js,admin/config/setup/sugerencias.js

# Intents (Optional - defaults to true)
MESSAGE_CONTENT_ENABLED=true
GUILD_PRESENCES_ENABLED=true

# Server (Optional - for health checks)
PORT=8080

# Logging (Optional)
ERROR_LOG_TO_FILE=true
ERROR_LOG_DIR=./data/logs

# Deployment (Optional)
NODE_ENV=production
DEPLOY_TAG=v1.0.0
```

## Health Monitoring

All deployment options should monitor the `/health` endpoint.

### Setup Health Check

1. **Get health URL**
   - Square Cloud: `https://your-subdomain.squareweb.app/health`
   - Railway: Check your deployment URL + `/health`
   - VPS: `http://your-ip:8080/health`

2. **Use UptimeRobot (Free)**
   - Go to https://uptimerobot.com
   - Add new monitor
   - Type: HTTP(s)
   - URL: Your health endpoint
   - Interval: 5 minutes
   - Get alerts via Discord webhook or email

3. **Expected Response**
   ```json
   {
     "status": "ok",
     "startedAt": "2024-01-01T00:00:00.000Z",
     "uptimeSec": 3600,
     "mongoConnected": true,
     "discordReady": true,
     "version": "3.0.0",
     "fingerprint": "3.0.0-abc1234"
   }
   ```

## Post-Deployment Checklist

- [ ] Bot is online in Discord
- [ ] `/debug status` works and shows correct version
- [ ] Health endpoint returns `"status": "ok"`
- [ ] Slash commands are deployed
- [ ] MongoDB connection is stable
- [ ] Logs are accessible
- [ ] Auto-restart is configured
- [ ] Health monitoring is active
- [ ] Environment variables are secure (not in public repo)
- [ ] Backup strategy is in place (MongoDB exports)

## Backup Strategy

### MongoDB Backups

**Automated (MongoDB Atlas):**
- Atlas provides automatic backups
- Configure in Atlas dashboard > Backup

**Manual (VPS):**
```bash
# Create backup script
cat > ~/backup-ton618.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db=ton618 --out=/backups/ton618_$DATE
find /backups -name "ton618_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x ~/backup-ton618.sh

# Add to crontab (daily at 3 AM)
crontab -e
# Add: 0 3 * * * /home/youruser/backup-ton618.sh
```

## Scaling Considerations

**When to upgrade:**
- Bot serves 10k+ members
- Response time > 2 seconds
- Memory usage consistently > 80%
- MongoDB operations slow

**Upgrade path:**
1. Start: Square Cloud Hobby or Railway Free
2. Growth: Square Cloud Standard or Railway Pro
3. Scale: Dedicated VPS with PM2 cluster mode
4. Enterprise: Kubernetes with multiple replicas

## Troubleshooting

**Bot keeps restarting:**
- Check MongoDB connection string
- Verify Discord token is valid
- Review error logs
- Ensure enough memory allocated

**Commands not working:**
- Redeploy commands: `npm run deploy:compact`
- Check bot permissions in Discord
- Verify intents are enabled

**High memory usage:**
- Disable unused intents in `.env`
- Clear old logs
- Optimize MongoDB indexes: `npm run db:indexes`

**Slow response:**
- Check MongoDB connection latency
- Review SLA metrics: `/stats sla`
- Consider upgrading hosting tier

## Cost Optimization

**Free tier strategy:**
- MongoDB Atlas: Free tier (512MB)
- Railway: $5/month credit (enough for small bot)
- Total: $0-1/month for small servers

**Budget strategy ($5/month):**
- Square Cloud Hobby: $2-3/month
- MongoDB Atlas: Free tier
- Total: $2-3/month for medium servers

**Production strategy ($10-15/month):**
- Contabo VPS: €4-6/month
- MongoDB Atlas M10: $9/month (optional, can use VPS MongoDB)
- Total: $10-15/month for large servers with full control
