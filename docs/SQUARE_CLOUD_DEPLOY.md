# TON618 Bot — Square Cloud Deployment Guide

## Prerequisites

| Requirement | Value |
|---|---|
| Node.js | ≥ 20 (Square Cloud `VERSION=recommended`) |
| Memory plan | **1024 MB** (heap 400 MB + RSS overhead + discord.js cache) |
| Port | **80** (Square Cloud health check requirement) |
| MongoDB | Atlas M0+ recommended (MongoDB+SRV URI) |
| Supabase | Project URL + Service Role Key (for billing bridge) |

---

## 1. Prepare credentials

Generate a secure `BOT_API_KEY` (required in production and must match the one in Supabase Edge Function secrets):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2. Configure environment variables in Square Cloud

Go to **Square Cloud Dashboard → Your App → Environment Variables** and add every variable from the table below.

### Required

| Variable | Description | Example |
|---|---|---|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal | `MTAx...` (≥70 chars) |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `MONGO_DB` | Database name | `ton618` |
| `OWNER_ID` | Discord snowflake of bot owner | `123456789012345678` |
| `BOT_API_KEY` | 64-char hex shared secret with Supabase | output of command above |
| `SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `PRO_UPGRADE_URL` | URL shown in premium embeds | `https://ton618.app/pricing` |

### Required for dashboard bridge (ton618-web integration)

| Variable | Description |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for bot stats writes) |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `DASHBOARD_BRIDGE_INTERVAL_MS` | Sync interval in ms (recommended: `60000`) |
| `DASHBOARD_HTTP_TIMEOUT_MS` | HTTP timeout in ms (recommended: `10000`) |

### Square Cloud tuning (always set these)

| Variable | Value | Reason |
|---|---|---|
| `PORT` | `80` | Square Cloud health check port |
| `SERVER_PORT` | *(leave unset)* | Avoid overriding the Square Cloud port with a local-only fallback |
| `NODE_ENV` | `production` | Enables strict env validation |
| `MONGO_AUTO_INDEXES` | `true` | Creates MongoDB indexes on first start |
| `MONGO_MAX_POOL_SIZE` | `5` | Limits connections on 1024 MB plan |
| `HEALTH_STARTUP_GRACE_MS` | `90000` | Prevents restart before Discord connects |
| `SHUTDOWN_DRAIN_TIMEOUT_MS` | `10000` | Graceful shutdown drain window |
| `SHUTDOWN_FORCE_TIMEOUT_MS` | `30000` | Hard kill timeout |
| `ERROR_LOG_TO_FILE` | `false` | Filesystem is ephemeral on Square Cloud |

### Optional but recommended

| Variable | Description |
|---|---|
| `ALERT_DISCORD_WEBHOOK` | Discord webhook for operational alerts |
| `SENTRY_DSN` | Sentry project DSN for error tracking |
| `DEPLOY_TAG` | Version tag for `/status` command (e.g., `v1.2.0`) |
| `MESSAGE_CONTENT_ENABLED` | `true` if MESSAGE CONTENT intent is enabled |
| `GUILD_PRESENCES_ENABLED` | `true` if GUILD PRESENCES intent is enabled |
| `PREMIUM_CACHE_TTL_MS` | Premium cache freshness (default: `300000` = 5 min) |
| `PREMIUM_STALE_CACHE_MS` | Stale fallback TTL (default: `3600000` = 1 hr) |

---

## 3. squarecloud.config (committed to repo)

```ini
MAIN=index.js
MEMORY=1024
VERSION=recommended
DISPLAY_NAME=TON618 Ops Console
DESCRIPTION=Discord ops console for staff teams - tickets, SLA, playbooks, incident mode
SUBDOMAIN=ton618
START=npm start
AUTORESTART=true
PORT=80
HEALTHCHECK_PATH=/health
```

> **Memory note:** `npm start` sets `--max-old-space-size=400` (400 MB heap cap).
> Total RSS (heap + native libs + MongoDB driver + discord.js) peaks at ~600–800 MB under load.
> 1024 MB gives a safe ~200 MB headroom.

---

## 4. First deploy checklist

```
□ 1. All env variables configured in Square Cloud dashboard
□ 2. squarecloud.config committed to main branch
□ 3. Discord bot intents enabled in Developer Portal:
      - Server Members Intent  ✅
      - Message Content Intent ✅
      - Presence Intent        ✅ (optional)
□ 4. MongoDB Atlas IP allowlist: Allow all IPs (0.0.0.0/0) for Square Cloud
      OR add Square Cloud egress IPs if known
□ 5. BOT_API_KEY set in BOTH:
      - Square Cloud env vars (for this bot)
      - Supabase Edge Function secrets (for billing-guild-status)
□ 6. Deploy slash commands BEFORE first bot start:
      node scripts/deploy-commands.js --compact
□ 7. Deploy to Square Cloud (push to main or use SQ CLI)
```

---

## 5. Post-deploy smoke test checklist

Run these within 5 minutes of deployment:

```
□ Health endpoint returns 200
  curl https://ton618.squareweb.app/health | jq .status
  Expected: "ok" (or "booting" within first 90s)

□ /ready returns 200 when fully up
  curl https://ton618.squareweb.app/ready
  Expected: {"status":"ok"}

□ Discord bot shows Online in your server

□ /ping command responds (latency < 500ms)

□ /premium status returns correct status
  (requires BOT_API_KEY + SUPABASE_URL configured)

□ Square Cloud logs show no ERROR lines at startup
  Look for:
    [startup:health-server] Health server listo en el puerto 80.
    [startup:mongo-connect] MongoDB conectado correctamente.
    [startup:command-loading] Comandos cargados y validados.
    [startup:discord-login] Login de Discord aceptado; esperando clientReady.

□ env validation passes at startup (no `[startup:env-validation] ERROR` lines)

□ After 90 seconds: /health status is "ok" (booting:false)

□ Send a test slash command in Discord → no 503 errors
```

---

## 6. Verification commands (run locally against production)

```bash
# Check health endpoint
curl -s https://ton618.squareweb.app/health | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.table({status:d.status,mongo:d.mongoConnected,discord:d.discordReady,uptime:d.uptimeSec+'s',booting:d.booting})"

# Validate the local runtime env (.env.local + .env)
npm run env:check

# Validate production rules against your current env
npm run env:check:prod

# Run all tests
node --test tests/*.test.js

# Run production readiness audit
node scripts/audit-production-readiness.js

# Generate build fingerprint (for DEPLOY_TAG tracking)
node scripts/print-build-fingerprint.js
```

---

## 7. MongoDB Atlas setup for Square Cloud

1. **Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`)
   - Square Cloud doesn't publish static egress IPs, so this is required.
2. **Database Access → Create user** with `readWrite` role on `ton618` database only (not admin).
3. **Connection string format:**
   ```
   mongodb+srv://ton618user:PASSWORD@cluster0.xxxxx.mongodb.net/ton618?retryWrites=true&w=majority
   ```
4. Enable MongoDB Atlas backups (M10+ tier recommended for production data).

---

## 8. Residual risks

| Risk | Severity | Mitigation |
|---|---|---|
| Square Cloud ephemeral filesystem | **Medium** | `ERROR_LOG_TO_FILE=false`; use stdout only |
| MongoDB Atlas cold start (M0 free tier) | **Medium** | `serverSelectionTimeoutMS=10000`; upgrade to M2+ for production |
| Discord gateway reconnect loop | **Low** | `AUTORESTART=true` in squarecloud.config; graceful shutdown drains in-flight ops |
| Stale premium cache after plan change | **Low** | 5-min TTL; `premiumService.invalidateCache(guildId)` called on webhook events |
| Supabase billing-guild-status outage | **Low** | 1-hr stale cache fallback; defaults to `has_premium: false` if no cache |
| BOT_API_KEY rotation requires coordinated update | **Low** | Update both Square Cloud env + Supabase secrets simultaneously; brief 401 window during rotation |
| Memory pressure with many guilds | **Low** | `MONGO_MAX_POOL_SIZE=5`; `--max-old-space-size=400`; monitor via `/health` memory field |
| `npm start` not found if node_modules missing | **Critical** | Square Cloud runs `npm ci` automatically before `START` command |
