# TON618 Production Deployment Checklist

## Pre-Deployment (1-2 weeks before)

### Environment Setup
- [ ] Create production `.env` file from `.env.production.example`
- [ ] Set `NODE_ENV=production`
- [ ] Configure `DISCORD_TOKEN` (production bot)
- [ ] Configure `MONGO_URI` (MongoDB Atlas production cluster)
- [ ] Set `OWNER_ID` to production owner Discord ID
- [ ] Configure `DEPLOY_TAG` for version tracking
- [ ] Set `ENABLE_JSON_LOGS=true` for structured logging
- [ ] Configure `ERROR_LOG_TO_FILE=true` and `ERROR_LOG_DIR`

### Database Setup
- [ ] Create MongoDB Atlas production cluster
- [ ] Configure IP whitelist for production server
- [ ] Set up database user with appropriate permissions
- [ ] Enable automated backups (daily, 30-day retention)
- [ ] Configure backup alerts
- [ ] Test backup restore procedure
- [ ] Run `npm run db:indexes` to create indexes
- [ ] Document RTO (Recovery Time Objective): 1 hour
- [ ] Document RPO (Recovery Point Objective): 1 hour

### Discord Bot Setup
- [ ] Create production Discord application
- [ ] Enable required intents: Guilds, GuildMembers, GuildMessages, MessageContent
- [ ] Generate bot token
- [ ] Configure OAuth2 redirect URIs (if using dashboard)
- [ ] Add bot to production server(s)
- [ ] Verify bot permissions (Administrator or specific permissions)
- [ ] Test bot can create channels, send messages, manage roles

### Monitoring & Alerting
- [ ] Set up Sentry account and configure `SENTRY_DSN`
- [ ] Set up UptimeRobot monitor for `/health` endpoint
- [ ] Configure Discord webhook for critical alerts: `ALERT_DISCORD_WEBHOOK`
- [ ] Set up log aggregation (Better Stack/Logtail)
- [ ] Configure MongoDB Atlas alerts (CPU, memory, connections)
- [ ] Test all alert channels
- [ ] Document on-call rotation
- [ ] Create incident response contacts list

### Security
- [ ] Rotate all credentials (Discord token, MongoDB password, Supabase keys)
- [ ] Enable 2FA on all service accounts
- [ ] Review and restrict MongoDB user permissions
- [ ] Configure firewall rules on production server
- [ ] Enable HTTPS for health endpoint (if exposed publicly)
- [ ] Review `.gitignore` - ensure `.env` is never committed
- [ ] Audit npm dependencies: `npm audit`
- [ ] Update vulnerable dependencies
- [ ] Set up secrets manager (optional but recommended)

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No critical TODOs/FIXMEs in code
- [ ] Code review completed
- [ ] Environment validation passes: `npm run env:check -- --file=.env.production`
- [ ] Build fingerprint generated: `npm run build:fingerprint`
- [ ] CI/CD pipeline passing

### Dashboard Integration (if using ton618-web)
- [ ] Configure production Supabase project
- [ ] Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
- [ ] Set `DASHBOARD_BRIDGE_INTERVAL_MS=60000`
- [ ] Test dashboard sync
- [ ] Verify OAuth callback works
- [ ] Test ticket actions from dashboard
- [ ] Verify playbook sync

## Deployment Day

### Pre-Deploy Verification
- [ ] Staging environment fully tested
- [ ] All team members notified
- [ ] Rollback plan documented
- [ ] Backup created and verified
- [ ] Maintenance window scheduled (if needed)

### Deploy Steps
1. [ ] SSH into production server
2. [ ] Clone repository: `git clone https://github.com/your-org/ton618-bot.git`
3. [ ] Navigate to directory: `cd ton618-bot`
4. [ ] Checkout production branch: `git checkout main`
5. [ ] Copy production `.env` file
6. [ ] Install dependencies: `npm ci --production`
7. [ ] Verify Node version: `node -v` (should be >= 20)
8. [ ] Deploy slash commands: `npm run deploy:safe:compact`
9. [ ] Start bot with process manager:
   ```bash
   # PM2
   pm2 start index.js --name ton618-bot --max-memory-restart 1G
   pm2 save
   pm2 startup
   
   # Or systemd
   sudo systemctl start ton618-bot
   sudo systemctl enable ton618-bot
   ```
10. [ ] Wait 2 minutes for bot to initialize

### Post-Deploy Verification
- [ ] Bot shows online in Discord
- [ ] Health endpoint returns 200: `curl https://bot.ton618.app/health`
- [ ] Verify fingerprint matches expected version
- [ ] Check `mongoConnected: true` in health response
- [ ] Check `discordReady: true` in health response
- [ ] Test basic command: `/ping` or `/stats`
- [ ] Create test ticket and verify it works
- [ ] Close test ticket and verify transcript
- [ ] Check logs for errors: `pm2 logs ton618-bot --lines 50`
- [ ] Verify cron jobs are running (check logs after 5 minutes)
- [ ] Test dashboard sync (if applicable)
- [ ] Verify SLA alerts are configured
- [ ] Check memory usage is normal (< 300MB initially)

### Smoke Tests
- [ ] Run automated smoke test: `npm run smoke:health https://bot.ton618.app/health`
- [ ] Test ticket creation flow
- [ ] Test ticket claiming
- [ ] Test ticket closing
- [ ] Test SLA tracking
- [ ] Test staff commands
- [ ] Test admin commands
- [ ] Test verification system (if enabled)
- [ ] Test auto-close (set low timeout for test)

## First 24 Hours

### Monitoring
- [ ] Monitor error rate (should be < 1%)
- [ ] Monitor memory usage (should stay < 500MB)
- [ ] Monitor response times (health endpoint < 1s)
- [ ] Check for any error spikes in Sentry
- [ ] Review logs every 2 hours
- [ ] Verify backups are running
- [ ] Check dashboard sync status

### Performance Tuning
- [ ] Review slow queries in MongoDB
- [ ] Check cron job execution times
- [ ] Monitor Discord API rate limits
- [ ] Verify cache hit rates
- [ ] Check connection pool usage

## First Week

### Daily Tasks
- [ ] Review error logs
- [ ] Check SLA compliance
- [ ] Review ticket volume
- [ ] Monitor memory trends
- [ ] Check backup status
- [ ] Review failed mutations (if using dashboard)
- [ ] Check for any user-reported issues

### Weekly Review
- [ ] Review all metrics and trends
- [ ] Analyze most common errors
- [ ] Review SLA breach reasons
- [ ] Check staff response times
- [ ] Review and update documentation
- [ ] Plan any necessary optimizations
- [ ] Update team on performance

## Ongoing Maintenance

### Daily
- [ ] Check health endpoint
- [ ] Review error logs
- [ ] Monitor uptime

### Weekly
- [ ] Review SLA metrics
- [ ] Check memory trends
- [ ] Review failed operations
- [ ] Update dependencies (if needed)

### Monthly
- [ ] Test backup restore
- [ ] Review and rotate credentials
- [ ] Audit access controls
- [ ] Review monitoring costs
- [ ] Update documentation
- [ ] Security audit
- [ ] Performance review

## Rollback Procedure

If deployment fails:

1. [ ] **STOP** - Don't make it worse
2. [ ] Identify the issue
3. [ ] Check if rollback is needed (see disaster-recovery.md)
4. [ ] If yes, execute rollback:
   ```bash
   git checkout <previous-commit>
   npm ci
   npm run deploy:safe:compact
   pm2 restart ton618-bot
   ```
5. [ ] Verify rollback successful
6. [ ] Notify team
7. [ ] Document incident
8. [ ] Plan fix for next deployment

## Emergency Contacts

- **Bot Owner**: [Your Discord/Email]
- **DevOps Lead**: [Contact]
- **MongoDB Support**: support@mongodb.com
- **Discord Developer Support**: https://discord.com/developers/docs
- **Hosting Provider**: [Contact]

## Success Criteria

Deployment is successful when:

- [ ] Bot uptime > 99% for first 24 hours
- [ ] Error rate < 1%
- [ ] All health checks passing
- [ ] No critical errors in logs
- [ ] All cron jobs executing successfully
- [ ] Dashboard sync working (if applicable)
- [ ] SLA tracking operational
- [ ] Backups running successfully
- [ ] Monitoring alerts working
- [ ] No user-reported critical issues

## Post-Deployment Report

After first week, document:

- Total uptime percentage
- Error rate
- Average response time
- Ticket volume
- SLA compliance rate
- Memory usage trends
- Any incidents and resolutions
- Lessons learned
- Action items for improvement

---

**Last Updated**: [Date]
**Reviewed By**: [Name]
**Next Review**: [Date]
