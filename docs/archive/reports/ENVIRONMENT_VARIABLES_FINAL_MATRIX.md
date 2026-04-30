# TON618 — Environment Variables Final Matrix

**Generated:** April 7, 2026  
**Validated against:** Production code (ton618-bot + ton618-web + Supabase Edge Functions)

---

## 1. Square Cloud — ton618-bot

### Core Required (4)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `DISCORD_TOKEN` | ✅ Yes | `MTAxNjc4OTQ1NjEyMzQ1Njc4OQ.GxYzAb.dQw4w9WgXcQ...` (70+ chars) | `index.js`, all Discord API calls | ❌ Bot cannot start | Length ≥59, starts with `MT` or `OT` | From Discord Developer Portal → Bot → Token |
| `MONGO_URI` | ✅ Yes | `mongodb+srv://ton618prod:PASSWORD@cluster0.abc123.mongodb.net` | `src/utils/database/core.js` | ❌ Bot cannot start | Regex: `^mongodb(\+srv)?://` | MongoDB Atlas connection string |
| `OWNER_ID` | ✅ Yes (prod) | `263748526378462378` (18-digit snowflake) | `src/utils/accessControl.js`, `/debug` commands | ⚠️ Developer commands disabled | Regex: `^\d{16,22}$` | Your Discord user ID |
| `BOT_API_KEY` | ✅ Yes (prod) | `a1b2c3d4e5f6...` (64-char hex) | `src/services/premiumService.js` → calls `billing-guild-status` | ❌ Premium features disabled | Length ≥32 | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### Database (3)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `MONGO_DB` | ⚠️ Optional | `ton618` | `src/utils/database/core.js` | Uses default `ton618_bot` | Non-empty string | `ton618` |
| `MONGO_AUTO_INDEXES` | ⚠️ Recommended | `true` | `src/utils/database/core.js` | Indexes not created on first deploy | Boolean | `true` |
| `MONGO_MAX_POOL_SIZE` | ⚠️ Optional | `5` | `src/utils/database/core.js` | Uses default 10 | Integer 1-100 | `5` (for 1024 MB plan) |
| `MONGO_SERVER_SELECTION_TIMEOUT_MS` | ⚠️ Optional | `10000` | `src/utils/database/core.js` | Uses default 10000 | Integer ≥5000 | `10000` |
| `MONGO_CONNECT_TIMEOUT_MS` | ⚠️ Optional | `15000` | `src/utils/database/core.js` | Uses default 15000 | Integer ≥10000 | `15000` |

### Discord Intents (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `MESSAGE_CONTENT_ENABLED` | ⚠️ Optional | `true` | `index.js` → Discord client intents | Message content intent disabled | Boolean | `true` (if intent enabled in Developer Portal) |
| `GUILD_PRESENCES_ENABLED` | ⚠️ Optional | `true` | `index.js` → Discord client intents | Presence intent disabled | Boolean | `true` (if intent enabled in Developer Portal) |

### Supabase Integration (3)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `SUPABASE_URL` | ⚠️ Optional | `https://xyz.supabase.co` | `src/utils/botStatsSync.js`, dashboard bridge | Bot stats sync disabled | Regex: `^https://` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Optional | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `src/utils/botStatsSync.js` | Bot stats sync disabled | Starts with `eyJ`, length ≥100 | From Supabase → Settings → API → service_role |
| `SUPABASE_ANON_KEY` | ⚠️ Optional | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `src/utils/dashboardBridge/sync.js` | Dashboard bridge disabled | Starts with `eyJ`, length ≥100 | From Supabase → Settings → API → anon |

### Premium Service (4)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `PRO_UPGRADE_URL` | ⚠️ Recommended | `https://ton618.app/pricing` | `src/utils/commercial.js`, premium embeds | No upgrade link in embeds | URL format | Your pricing page URL |
| `PREMIUM_CACHE_TTL_MS` | ⚠️ Optional | `300000` | `src/services/premiumService.js` | Uses default 5 min | Integer ≥60000 | `300000` (5 min) |
| `PREMIUM_STALE_CACHE_MS` | ⚠️ Optional | `3600000` | `src/services/premiumService.js` | Uses default 1 hr | Integer ≥600000 | `3600000` (1 hr) |
| `PREMIUM_API_TIMEOUT_MS` | ⚠️ Optional | `10000` | `src/services/premiumService.js` | Uses default 10s | Integer ≥3000 | `10000` |

### Dashboard Bridge (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `DASHBOARD_BRIDGE_INTERVAL_MS` | ⚠️ Optional | `60000` | `src/crons/dashboardSync.js` | Uses default 5 min | Integer ≥30000 | `60000` (1 min) |
| `DASHBOARD_HTTP_TIMEOUT_MS` | ⚠️ Optional | `10000` | `src/utils/dashboardBridge/sync.js` | Uses default 10s | Integer ≥5000 | `10000` |

### Health & Observability (5)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `PORT` | ⚠️ Recommended | `80` | `index.js`, `src/utils/healthServer.js` | Uses default 80 | Integer 1-65535 | `80` (Square Cloud requirement) |
| `SERVER_PORT` | ⚠️ Optional | `80` | `index.js` (fallback for PORT) | Uses PORT or 80 | Integer 1-65535 | `80` |
| `HEALTH_STARTUP_GRACE_MS` | ⚠️ Optional | `90000` | `src/utils/healthServer.js` | Uses default 90s | Integer ≥30000 | `90000` (90s grace period) |
| `ALERT_DISCORD_WEBHOOK` | ⚠️ Optional | `https://discord.com/api/webhooks/123/abc` | `src/utils/alertChecker.js` | Alerts disabled | Webhook URL format | Discord webhook for ops alerts |
| `SENTRY_DSN` | ⚠️ Optional | `https://key@org.ingest.sentry.io/project` | (not yet implemented) | Error tracking disabled | Sentry DSN format | Sentry project DSN |

### Shutdown & Lifecycle (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `SHUTDOWN_DRAIN_TIMEOUT_MS` | ⚠️ Optional | `10000` | `src/utils/shutdownManager.js` | Uses default 10s | Integer ≥5000 | `10000` |
| `SHUTDOWN_FORCE_TIMEOUT_MS` | ⚠️ Optional | `30000` | `src/utils/shutdownManager.js` | Uses default 30s | Integer ≥10000 | `30000` |

### Logging (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `ERROR_LOG_TO_FILE` | ⚠️ Optional | `false` | `src/utils/errorLogger.js` | Uses default false | Boolean | `false` (ephemeral FS on Square Cloud) |
| `ERROR_LOG_DIR` | ⚠️ Optional | `./data/logs` | `src/utils/errorLogger.js` | Uses default `./logs` | Directory path | *(Not used on Square Cloud)* |

### Deployment Metadata (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `NODE_ENV` | ⚠️ Recommended | `production` | `src/utils/env.js` validation mode | Uses default mode | `production` or `development` | `production` |
| `DEPLOY_TAG` | ⚠️ Optional | `v1.2.0` | `/status` command | Shows "unknown" | Semver format | Git tag or version |

---

## 2. Square Cloud — ton618-web

### Core Required (4)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_DISCORD_CLIENT_ID` | ✅ Yes | `123456789012345678` (18-digit snowflake) | `src/config.ts`, Discord OAuth, bot invite links | ❌ OAuth broken, bot invite broken | Regex: `^\d{17,19}$` | Discord Application ID |
| `VITE_SUPABASE_URL` | ✅ Yes | `https://xyz.supabase.co` | `src/config.ts`, all Supabase API calls | ❌ Auth broken, billing broken | Regex: `^https://[a-z0-9-]+\.supabase\.co$` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `src/config.ts`, Supabase client init | ❌ Auth broken, billing broken | Starts with `eyJ`, length ≥100 | From Supabase → Settings → API → anon |
| `VITE_SITE_URL` | ✅ Yes | `https://ton618-web.squareweb.app` | `src/config.ts`, OAuth redirects, canonical URLs | ⚠️ OAuth redirect mismatch | Must be `https://` in production | Production domain |

### Discord OAuth (1)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_DISCORD_PERMISSIONS` | ⚠️ Optional | `8` | `src/config.ts`, bot invite links | Uses default `8` (Administrator) | Integer | `8` or custom permission integer |

### Dashboard & Navigation (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_ENABLE_DASHBOARD` | ⚠️ Optional | `true` | `src/config.ts`, landing page CTA | Dashboard hidden | Boolean | `true` |
| `VITE_DASHBOARD_URL` | ⚠️ Optional | *(empty for internal `/dashboard`)* | `src/config.ts`, dashboard links | Uses internal route `/dashboard` | URL or empty | *(empty)* or external URL |

### Billing (1)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_BILLING_BETA_MODE` | ⚠️ Optional | `false` | `src/config.ts`, billing pages | Uses default `false` | Boolean | `false` (public billing) |

### Branding & Links (7)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_BOT_NAME` | ⚠️ Optional | `TON618` | `src/config.ts`, page titles | Uses default `TON618` | Non-empty string | `TON618` |
| `VITE_SUPPORT_SERVER_URL` | ⚠️ Recommended | `https://discord.gg/abc123` | `src/config.ts`, footer, support CTAs | Support links broken | Discord invite URL | Discord support server invite |
| `VITE_DOCS_URL` | ⚠️ Recommended | `https://docs.ton618.app` | `src/config.ts`, docs links | Docs links broken | URL format | Documentation site URL |
| `VITE_STATUS_URL` | ⚠️ Recommended | `https://status.ton618.app` | `src/config.ts`, status page links | Status links hidden | URL format | Status page URL |
| `VITE_CONTACT_EMAIL` | ⚠️ Recommended | `ops@ton618.app` | `src/config.ts`, enterprise contact | Contact email missing | Email format | Contact email |
| `VITE_GITHUB_URL` | ⚠️ Optional | `https://github.com/org/ton618-web` | `src/config.ts`, footer | GitHub link missing | URL format | GitHub repo URL |
| `VITE_TWITTER_URL` | ⚠️ Optional | `https://x.com/ton618bot` | `src/config.ts`, footer | Twitter link missing | URL format | Twitter/X profile URL |

### Observability (1)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `VITE_SENTRY_DSN` | ⚠️ Optional | `https://key@org.ingest.sentry.io/project` | `src/main.tsx`, error tracking | Error tracking disabled | Sentry DSN format | Sentry project DSN |

### Legacy/Unused (1)

| Variable | Status | Notes |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | ❌ **REMOVE** | Stripe integration removed; Lemon Squeezy used instead |

---

## 3. Supabase Edge Functions / Project Secrets

**Location:** Supabase Dashboard → Project Settings → Edge Functions → Secrets

### Core Required (3)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `SUPABASE_URL` | ✅ Yes | `https://xyz.supabase.co` | All Edge Functions | ❌ Functions cannot init Supabase client | Regex: `^https://[a-z0-9-]+\.supabase\.co$` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | All Edge Functions (admin operations) | ❌ Cannot write to DB | Starts with `eyJ`, length ≥100 | From Supabase → Settings → API → service_role |
| `SUPABASE_ANON_KEY` | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `billing-create-checkout` (user auth) | ❌ User auth broken | Starts with `eyJ`, length ≥100 | From Supabase → Settings → API → anon |

### Bot Integration (1)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `BOT_API_KEY` | ✅ Yes | `a1b2c3d4e5f6...` (64-char hex) | `billing-guild-status` (bot auth) | ❌ Bot cannot fetch premium status | Length ≥32, **must match bot env** | Same value as bot's `BOT_API_KEY` |

### Lemon Squeezy (7)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `LEMON_SQUEEZY_API_KEY` | ✅ Yes | `lmsq_sk_...` | `billing-create-checkout`, `billing-webhook` | ❌ Cannot create checkouts | Starts with `lmsq_` | From Lemon Squeezy → Settings → API |
| `LEMON_SQUEEZY_STORE_ID` | ✅ Yes | `12345` | `billing-create-checkout` | ❌ Cannot create checkouts | Integer | From Lemon Squeezy → Settings → Store ID |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | ✅ Yes | `whsec_...` | `billing-webhook` (signature verification) | ❌ Webhook signature fails | Starts with `whsec_` | From Lemon Squeezy → Settings → Webhooks |
| `LEMON_SQUEEZY_VARIANT_PRO_MONTHLY` | ✅ Yes | `123456` | `billing-create-checkout` | ❌ Pro Monthly checkout broken | Integer | Lemon Squeezy variant ID |
| `LEMON_SQUEEZY_VARIANT_PRO_YEARLY` | ✅ Yes | `123457` | `billing-create-checkout` | ❌ Pro Yearly checkout broken | Integer | Lemon Squeezy variant ID |
| `LEMON_SQUEEZY_VARIANT_LIFETIME` | ✅ Yes | `123458` | `billing-create-checkout` | ❌ Lifetime checkout broken | Integer | Lemon Squeezy variant ID |
| `LEMON_SQUEEZY_VARIANT_DONATE` | ⚠️ Optional | `123459` | `billing-create-checkout` | Donation option hidden | Integer | Lemon Squeezy variant ID |

### Lemon Squeezy Test Mode (1)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `LEMON_SQUEEZY_TEST_MODE` | ⚠️ Optional | `false` | `billing-create-checkout`, `billing-webhook` | Uses default `false` | Boolean | `false` (production) |

### Discord Bot Integration (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `DISCORD_BOT_TOKEN` | ⚠️ Optional | `MTAxNjc4OTQ1NjEyMzQ1Njc4OQ.GxYzAb.dQw4w9WgXcQ...` | `sync-discord-guilds` (fallback for bot guilds) | Bot guild fallback disabled | Length ≥59 | Discord bot token (same as bot's `DISCORD_TOKEN`) |
| `DISCORD_CLIENT_ID` | ⚠️ Optional | `123456789012345678` | `sync-discord-guilds` | Uses client from auth token | Regex: `^\d{17,19}$` | Discord Application ID |

### Site URLs (2)

| Variable | Required | Example | Used In | Impact if Missing | Validation | Production Value |
|---|---|---|---|---|---|---|
| `SITE_URL` | ⚠️ Recommended | `https://ton618-web.squareweb.app` | `billing-create-checkout` (success/cancel redirects) | Uses fallback or breaks redirects | Must be `https://` | Production domain |
| `DASHBOARD_URL` | ⚠️ Optional | `https://ton618-web.squareweb.app/dashboard` | (not currently used) | N/A | URL format | Dashboard URL |

---

## 4. Lemon Squeezy Dashboard / Webhook Config

**Location:** Lemon Squeezy Dashboard → Settings → Webhooks

### Webhook Configuration

| Field | Value | Notes |
|---|---|---|
| **Webhook URL** | `https://YOUR_PROJECT.supabase.co/functions/v1/billing-webhook` | Replace `YOUR_PROJECT` with Supabase project ref |
| **Signing Secret** | *(auto-generated by Lemon Squeezy)* | Copy to Supabase secrets as `LEMON_SQUEEZY_WEBHOOK_SECRET` |
| **Events** | ✅ All events | Or select: `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_payment_success`, `subscription_payment_failed`, `subscription_payment_recovered`, `subscription_payment_refunded` |
| **Test Mode** | ❌ Disabled | Enable only for staging/testing |

### Product Variant IDs

Map these from Lemon Squeezy → Products → Variants:

| Plan | Variant ID Env Var | Example |
|---|---|---|
| Pro Monthly | `LEMON_SQUEEZY_VARIANT_PRO_MONTHLY` | `123456` |
| Pro Yearly | `LEMON_SQUEEZY_VARIANT_PRO_YEARLY` | `123457` |
| Lifetime | `LEMON_SQUEEZY_VARIANT_LIFETIME` | `123458` |
| Donation (optional) | `LEMON_SQUEEZY_VARIANT_DONATE` | `123459` |

---

## 5. Inconsistencies & Cleanup

### ❌ Variables to REMOVE

| Variable | Location | Reason |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | ton618-web | Stripe integration removed; Lemon Squeezy used instead |
| `DISCORD_OWNER_ID` | ton618-bot | Legacy alias for `OWNER_ID` (still supported as fallback) |

### ⚠️ Inconsistent Naming (Aliases)

| Current | Alias | Recommendation |
|---|---|---|
| `OWNER_ID` | `DISCORD_OWNER_ID` | Use `OWNER_ID` only; remove `DISCORD_OWNER_ID` |
| `PORT` | `SERVER_PORT` | Use `PORT` only; `SERVER_PORT` is fallback |

### 🔒 Secrets that MUST NOT be in Frontend

These variables **MUST NEVER** be prefixed with `VITE_`:

- ❌ `DISCORD_TOKEN` (bot token)
- ❌ `BOT_API_KEY` (shared secret)
- ❌ `MONGO_URI` (database connection string)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` (admin key)
- ❌ `LEMON_SQUEEZY_API_KEY` (payment API key)
- ❌ `LEMON_SQUEEZY_WEBHOOK_SECRET` (webhook signature key)

**Current status:** ✅ No secrets exposed in frontend

### 🔄 Duplicate Variables Across Platforms

| Variable | ton618-bot | ton618-web | Supabase | Must Match? |
|---|---|---|---|---|
| `BOT_API_KEY` | ✅ | ❌ | ✅ | ✅ **YES** (bot ↔ Supabase auth) |
| `SUPABASE_URL` | ✅ | ✅ (`VITE_`) | ✅ | ✅ **YES** |
| `SUPABASE_ANON_KEY` | ✅ | ✅ (`VITE_`) | ✅ | ✅ **YES** |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ✅ | ✅ **YES** (bot ↔ Supabase) |
| `DISCORD_TOKEN` | ✅ | ❌ | ⚠️ (`DISCORD_BOT_TOKEN`) | ⚠️ Optional (Supabase fallback) |

---

## 6. Final Unified Naming Recommendations

### Adopt These Standards

1. **Bot secrets:** No prefix (e.g., `DISCORD_TOKEN`, `MONGO_URI`)
2. **Frontend public vars:** `VITE_` prefix (e.g., `VITE_SITE_URL`)
3. **Supabase Edge Functions:** No prefix (e.g., `SUPABASE_URL`, `BOT_API_KEY`)
4. **Boolean flags:** Use `true`/`false` strings, not `1`/`0`
5. **Timeouts:** Always in milliseconds with `_MS` suffix (e.g., `PREMIUM_CACHE_TTL_MS`)
6. **URLs:** Always include protocol (e.g., `https://ton618.app`, not `ton618.app`)

### Deprecate These

- `DISCORD_OWNER_ID` → Use `OWNER_ID`
- `SERVER_PORT` → Use `PORT`
- `VITE_STRIPE_PUBLISHABLE_KEY` → Remove entirely

---

## 7. Validation Commands

### ton618-bot

```bash
# Validate production env
node scripts/validate-env.js --file=.env.production.example --mode=production

# Check for missing required vars
node -e "const {validateEnv}=require('./src/utils/env'); const r=validateEnv(process.env,{mode:'production'}); if(r.errors.length) process.exit(1)"
```

### ton618-web

```bash
# Validate production env
node scripts/validate-env.mjs --file=.env.production.example --mode=production

# Check for VITE_ prefix leaks
grep -r "VITE_.*SECRET\|VITE_.*TOKEN\|VITE_.*KEY" src/ || echo "No secret leaks found"
```

### Supabase Edge Functions

```bash
# List all required secrets
supabase secrets list

# Validate all secrets set
node -e "const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','BOT_API_KEY','LEMON_SQUEEZY_API_KEY','LEMON_SQUEEZY_STORE_ID','LEMON_SQUEEZY_WEBHOOK_SECRET','LEMON_SQUEEZY_VARIANT_PRO_MONTHLY','LEMON_SQUEEZY_VARIANT_PRO_YEARLY','LEMON_SQUEEZY_VARIANT_LIFETIME']; console.log(required.join('\n'))"
```

---

## 8. Copy-Paste Production Config

### Square Cloud — ton618-bot

```env
# Core
DISCORD_TOKEN=YOUR_REAL_BOT_TOKEN_FROM_DISCORD_DEVELOPER_PORTAL
MONGO_URI=mongodb+srv://ton618prod:PASSWORD@cluster0.abc123.mongodb.net
MONGO_DB=ton618
OWNER_ID=YOUR_DISCORD_USER_ID
BOT_API_KEY=GENERATE_WITH_node_-e_console.log_require_crypto_.randomBytes_32_.toString_hex

# Database
MONGO_AUTO_INDEXES=true
MONGO_MAX_POOL_SIZE=5
MONGO_SERVER_SELECTION_TIMEOUT_MS=10000
MONGO_CONNECT_TIMEOUT_MS=15000

# Discord Intents
MESSAGE_CONTENT_ENABLED=true
GUILD_PRESENCES_ENABLED=true

# Supabase Integration
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_FROM_SUPABASE
SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_SUPABASE

# Premium Service
PRO_UPGRADE_URL=https://ton618-web.squareweb.app/pricing
PREMIUM_CACHE_TTL_MS=300000
PREMIUM_STALE_CACHE_MS=3600000
PREMIUM_API_TIMEOUT_MS=10000

# Dashboard Bridge
DASHBOARD_BRIDGE_INTERVAL_MS=60000
DASHBOARD_HTTP_TIMEOUT_MS=10000

# Health & Observability
PORT=80
HEALTH_STARTUP_GRACE_MS=90000
ALERT_DISCORD_WEBHOOK=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
SENTRY_DSN=https://YOUR_SENTRY_KEY@YOUR_ORG.ingest.sentry.io/YOUR_PROJECT

# Shutdown
SHUTDOWN_DRAIN_TIMEOUT_MS=10000
SHUTDOWN_FORCE_TIMEOUT_MS=30000

# Logging
ERROR_LOG_TO_FILE=false

# Deployment
NODE_ENV=production
DEPLOY_TAG=v1.0.0
```

### Square Cloud — ton618-web

```env
# Core
VITE_DISCORD_CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_SUPABASE
VITE_SITE_URL=https://ton618-web.squareweb.app

# Discord OAuth
VITE_DISCORD_PERMISSIONS=8

# Dashboard
VITE_ENABLE_DASHBOARD=true
VITE_DASHBOARD_URL=

# Billing
VITE_BILLING_BETA_MODE=false

# Branding
VITE_BOT_NAME=TON618
VITE_SUPPORT_SERVER_URL=https://discord.gg/YOUR_SUPPORT_SERVER
VITE_DOCS_URL=https://docs.ton618.app
VITE_STATUS_URL=https://status.ton618.app
VITE_CONTACT_EMAIL=ops@ton618.app
VITE_GITHUB_URL=https://github.com/YOUR_ORG/ton618-web
VITE_TWITTER_URL=https://x.com/YOUR_HANDLE

# Observability
VITE_SENTRY_DSN=https://YOUR_SENTRY_KEY@YOUR_ORG.ingest.sentry.io/YOUR_PROJECT
```

### Supabase Edge Functions Secrets

```bash
# Set all secrets at once
supabase secrets set \
  SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \
  SUPABASE_ANON_KEY=YOUR_ANON_KEY \
  BOT_API_KEY=SAME_AS_BOT_BOT_API_KEY \
  LEMON_SQUEEZY_API_KEY=lmsq_sk_YOUR_API_KEY \
  LEMON_SQUEEZY_STORE_ID=YOUR_STORE_ID \
  LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET \
  LEMON_SQUEEZY_VARIANT_PRO_MONTHLY=YOUR_VARIANT_ID \
  LEMON_SQUEEZY_VARIANT_PRO_YEARLY=YOUR_VARIANT_ID \
  LEMON_SQUEEZY_VARIANT_LIFETIME=YOUR_VARIANT_ID \
  LEMON_SQUEEZY_VARIANT_DONATE=YOUR_VARIANT_ID \
  LEMON_SQUEEZY_TEST_MODE=false \
  SITE_URL=https://ton618-web.squareweb.app
```

---

## 9. Critical Validation Checklist

Before deploying to production:

```
□ BOT_API_KEY is identical in ton618-bot and Supabase secrets
□ SUPABASE_URL is identical across all 3 platforms
□ SUPABASE_ANON_KEY is identical in ton618-web (VITE_) and Supabase
□ SUPABASE_SERVICE_ROLE_KEY is identical in ton618-bot and Supabase
□ DISCORD_TOKEN is ≥59 chars and starts with MT or OT
□ MONGO_URI uses mongodb+srv:// protocol
□ OWNER_ID is a valid 16-22 digit Discord snowflake
□ VITE_DISCORD_CLIENT_ID is a valid 17-19 digit Discord snowflake
□ VITE_SITE_URL uses https:// (not http://)
□ All Lemon Squeezy variant IDs are integers
□ LEMON_SQUEEZY_WEBHOOK_SECRET starts with whsec_
□ LEMON_SQUEEZY_API_KEY starts with lmsq_
□ PORT=80 on both Square Cloud apps
□ ERROR_LOG_TO_FILE=false on ton618-bot (ephemeral FS)
□ NODE_ENV=production on ton618-bot
□ No VITE_ variables contain secrets
```

---

**End of Matrix**
