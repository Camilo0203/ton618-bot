# TON618 Production Runbook

## Quick Reference
| Command | Action |
|---------|--------|
| `npm start` | Start bot |
| `npm run dev` | Development mode |
| `npm test` | Run tests |
| `npm run env:check` | Validate env vars |
| `npm run deploy:compact` | Deploy commands |

---

## Health Checks

### Bot Status
```
/debug status      → Shows bot health
/health         → HTTP health endpoint
/debug ping       → Discord gateway latency
```

### Database
```
MongoDB: Check connection in /health
Stats: db.stats() in mongo shell
```

---

## Common Issues

### Bot Not Responding
1. Check `/health` - is bot online?
2. Check gateway connection: `/debug status`
3. Check memory: `/debug status` → memory section
4. Restart if needed: `pm2 restart ton618`

### Premium Not Working
1. Check config: `SUPABASE_URL`, `BOT_API_KEY`
2. Check billing: `/debug entitlements status`
3. Check logs for `premium` errors

### Ticket Creation Failing
1. Check bot permissions in category
2. Check rate limits: userRL, guildRL limits
3. Check MongoDB connection

---

## Rate Limiting

| Limit | Threshold |
|-------|-----------|
| User | 5 req/min |
| Guild | 100 req/min |
| Global | 1000 req/min |

### Bypass for Staff
- Admins can bypass user rate limit
- Set `rate_limit_bypass_admin: true` in settings

---

## Emergency Procedures

### Complete Outage
```bash
# 1. Check process
pm2 status

# 2. Check logs
pm2 logs ton618 --lines 50

# 3. Restart
pm2 restart ton618
```

### Database Issues
```bash
# 1. Check MongoDB
curl http://localhost:3000/health

# 2. If down, check connection
mongosh "your-mongo-uri"

# 3. Restart bot
pm2 restart ton618
```

### Discord API Issues
```bash
# Check gateway status
/debug status

# If Issues, check:
# 1. Bot invited with correct scopes
# 2. Bot has required intents
# 3. No outages at status.discord.com
```

---

## Configuration

### Required Env Vars
```
DISCORD_TOKEN=           # Bot token
MONGO_URI=              # MongoDB connection
SUPABASE_URL=          # For billing (optional)
BOT_API_KEY=           # For billing (optional)
OWNER_ID=              # Your Discord ID (optional)
```

### Optional Env Vars
```
USER_RATE_LIMIT_MAX_REQUESTS=5
GUILD_RATE_LIMIT_MAX_REQUESTS=100
GLOBAL_RATE_LIMIT_MAX_REQUESTS=1000
PREMIUM_CACHE_TTL_MS=300000
```

---

## Monitoring

### Logs Location
- PM2: `pm2 logs ton618`
- Sentry: Check sentry.io for errors
- Discord: Check configured alerts channel

### Metrics
- `/debug status` → All metrics
- Health endpoint: `GET /health`

---

## Rollback

### Quick Rollback
```bash
# Previous version
git checkout HEAD~1
npm start
```

### Command Cleanup
```bash
npm run cleanup:commands
git checkout main
npm run deploy:compact
```

---

## Support

- Issues: GitHub Issues
- Discord: Your support server
- Email: (add your email)

---

**Last Updated**: 2026-04-13
**Version**: 3.0.0