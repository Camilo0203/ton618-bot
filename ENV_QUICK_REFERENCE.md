# Environment Variables — Quick Reference Card

## Critical Secrets (MUST Match Across Platforms)

| Secret | ton618-bot | ton618-web | Supabase | Generate With |
|---|---|---|---|---|
| **BOT_API_KEY** | ✅ | ❌ | ✅ | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| **SUPABASE_URL** | ✅ | ✅ `VITE_` | ✅ | Supabase Dashboard → Settings → API → Project URL |
| **SUPABASE_ANON_KEY** | ✅ | ✅ `VITE_` | ✅ | Supabase Dashboard → Settings → API → Project API keys → anon public |
| **SUPABASE_SERVICE_ROLE_KEY** | ✅ | ❌ | ✅ | Supabase Dashboard → Settings → API → Project API keys → service_role |

## Platform-Specific Minimums

### ton618-bot (4 required)

```env
DISCORD_TOKEN=MTAxNjc4OTQ1NjEyMzQ1Njc4OQ.GxYzAb.dQw4w9WgXcQ...
MONGO_URI=mongodb+srv://ton618prod:PASSWORD@cluster0.abc123.mongodb.net
OWNER_ID=263748526378462378
BOT_API_KEY=a1b2c3d4e5f6789012345678901234567890123456789012345678901234
```

### ton618-web (4 required)

```env
VITE_DISCORD_CLIENT_ID=123456789012345678
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=https://ton618-web.squareweb.app
```

### Supabase Edge Functions (9 required)

```bash
supabase secrets set \
  SUPABASE_URL=https://xyz.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  SUPABASE_ANON_KEY=eyJ... \
  BOT_API_KEY=a1b2c3d4... \
  LEMON_SQUEEZY_API_KEY=lmsq_sk_... \
  LEMON_SQUEEZY_STORE_ID=12345 \
  LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_... \
  LEMON_SQUEEZY_VARIANT_PRO_MONTHLY=123456 \
  LEMON_SQUEEZY_VARIANT_PRO_YEARLY=123457 \
  LEMON_SQUEEZY_VARIANT_LIFETIME=123458
```

## Common Mistakes

| ❌ Wrong | ✅ Correct | Why |
|---|---|---|
| `BOT_API_KEY` different on bot vs Supabase | Same value on both | Bot auth to `billing-guild-status` fails |
| `VITE_SITE_URL=http://ton618.app` | `VITE_SITE_URL=https://ton618.app` | OAuth redirect mismatch |
| `DISCORD_TOKEN` 30 chars | `DISCORD_TOKEN` 70+ chars | Truncated token |
| `OWNER_ID=camilo` | `OWNER_ID=263748526378462378` | Must be Discord snowflake |
| `ERROR_LOG_TO_FILE=true` on Square Cloud | `ERROR_LOG_TO_FILE=false` | Ephemeral filesystem |
| `PORT=3000` on Square Cloud | `PORT=80` | Health check fails |
| `VITE_STRIPE_PUBLISHABLE_KEY` set | *(remove variable)* | Stripe integration removed |

## Validation One-Liners

```bash
# ton618-bot
node scripts/validate-env.js --file=.env.production.example --mode=production

# ton618-web
node scripts/validate-env.mjs --file=.env.production.example --mode=production

# Check BOT_API_KEY matches
echo "Bot: $(grep BOT_API_KEY .env | cut -d= -f2)"
echo "Supabase: $(supabase secrets list | grep BOT_API_KEY)"
```

## Emergency Checklist (Deploy Blocked)

```
□ BOT_API_KEY identical on bot + Supabase?
□ DISCORD_TOKEN ≥59 chars?
□ MONGO_URI starts with mongodb+srv://?
□ VITE_SITE_URL uses https://?
□ PORT=80 on both Square Cloud apps?
□ All Lemon Squeezy variant IDs are integers?
□ LEMON_SQUEEZY_WEBHOOK_SECRET starts with whsec_?
```

## Where to Find Values

| Variable | Location |
|---|---|
| `DISCORD_TOKEN` | Discord Developer Portal → Applications → Bot → Token → Reset Token |
| `DISCORD_CLIENT_ID` | Discord Developer Portal → Applications → General Information → Application ID |
| `OWNER_ID` | Discord → User Settings → Advanced → Enable Developer Mode → Right-click your username → Copy User ID |
| `MONGO_URI` | MongoDB Atlas → Clusters → Connect → Connect your application |
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Project API keys → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → Project API keys → service_role |
| `LEMON_SQUEEZY_API_KEY` | Lemon Squeezy → Settings → API |
| `LEMON_SQUEEZY_STORE_ID` | Lemon Squeezy → Settings → General → Store ID |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy → Settings → Webhooks → Signing secret |
| `LEMON_SQUEEZY_VARIANT_*` | Lemon Squeezy → Products → [Product] → Variants → Variant ID |

## Full Matrix

See `ENVIRONMENT_VARIABLES_FINAL_MATRIX.md` for complete documentation.
