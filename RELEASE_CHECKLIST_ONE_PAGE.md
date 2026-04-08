# TON618 Production Release — One-Page Checklist

**Date:** __________ | **Tag:** __________ | **Operator:** __________

---

## ✅ Pre-Deploy (15 min)

### Env Validation
```bash
cd ton618-bot && node scripts/validate-env.js --file=.env.production.example --mode=production
cd ton618-web && node scripts/validate-env.mjs --file=.env.production.example --mode=production
```
- [ ] Both pass with 0 errors
- [ ] `BOT_API_KEY` identical (bot + Supabase)
- [ ] `SUPABASE_URL` identical (bot + web + Supabase)
- [ ] `PORT=80` on both apps

### Discord OAuth
- [ ] Redirect URI: `https://PROJECT.supabase.co/auth/v1/callback`
- [ ] Intents enabled: Server Members, Message Content (optional), Presence (optional)

### Supabase
- [ ] Auth → Discord provider configured
- [ ] Site URL: `https://ton618-web.squareweb.app`
- [ ] Migrations applied: `supabase db push`
- [ ] Edge Functions deployed: `supabase functions deploy <name>` (5 functions)
- [ ] Secrets set: `supabase secrets set ...` (12 secrets)

### Lemon Squeezy
- [ ] Webhook URL: `https://PROJECT.supabase.co/functions/v1/billing-webhook`
- [ ] Webhook active, test mode OFF
- [ ] Variant IDs configured in Supabase secrets

### MongoDB Atlas
- [ ] IP allowlist: `0.0.0.0/0`
- [ ] User created with `readWrite` role

---

## 🌐 Deploy ton618-web (10 min)

### Build & Deploy
```bash
cd ton618-web
npm ci && npm run build
# Push to main OR: squarecloud deploy
```
- [ ] Build completes with 0 errors
- [ ] `dist/index.html` exists
- [ ] App status: Running

### Validation
```bash
curl -I https://ton618-web.squareweb.app/
curl -I https://ton618-web.squareweb.app/dashboard
curl -I https://ton618-web.squareweb.app/pricing
```
- [ ] All routes return 200 (not 404)
- [ ] OAuth login works → redirects to `/dashboard`
- [ ] Pricing page loads

---

## 🤖 Deploy ton618-bot (10 min)

### Deploy Commands & Bot
```bash
cd ton618-bot
node scripts/deploy-commands.js --compact
# Push to main OR: squarecloud deploy
```
- [ ] Commands deployed successfully
- [ ] App status: Running
- [ ] Logs show: "✅ Conectado a MongoDB"
- [ ] Logs show: "[HealthServer] Listening on 0.0.0.0:80"
- [ ] Logs show: "✅ Premium service initialized"

### Validation
```bash
curl -s https://ton618-bot.squareweb.app/health | jq .
```
- [ ] `/health` returns `{"status":"ok","mongoConnected":true,"discordReady":true}`
- [ ] Bot shows Online in Discord
- [ ] `/ping` responds
- [ ] `/premium info` responds

---

## 🔍 Post-Deploy Verification (15 min)

### End-to-End Flow
1. **Landing:** Visit `https://ton618-web.squareweb.app`
   - [ ] Page loads in < 2s
2. **Login:** Click "Login with Discord"
   - [ ] OAuth completes → redirects to `/dashboard`
3. **Sync:** Click "Sync Servers"
   - [ ] Guild list populates
4. **Checkout:** Select guild → Upgrade to Pro Monthly
   - [ ] Redirects to Lemon Squeezy checkout
5. **Payment:** Use test card `4242 4242 4242 4242`
   - [ ] Payment succeeds → redirects to `/billing/success`
6. **Webhook:** Check Supabase `webhook_events` table
   - [ ] Event processed (`processed: true`)
7. **Premium (Web):** Refresh dashboard
   - [ ] Guild shows "Pro" badge
8. **Premium (Bot):** In Discord, run `/premium info`
   - [ ] Shows "Pro" status

---

## 🚦 Go / No-Go Decision

**Critical (ALL must pass):**
- [ ] Bot online in Discord
- [ ] Web landing loads
- [ ] OAuth login works
- [ ] Checkout redirects to Lemon Squeezy
- [ ] Webhook processes payment
- [ ] Premium activates in dashboard
- [ ] Premium activates in bot
- [ ] Health endpoints return 200

**Decision:** ☐ **GO** (announce launch) | ☐ **NO-GO** (rollback)

---

## 🔄 Rollback (if needed)

```bash
# Revert code
git revert HEAD && git push origin main

# OR: Square Cloud Dashboard → Deployments → Rollback

# Supabase: Redeploy previous Edge Functions
git checkout <previous-commit>
supabase functions deploy billing-webhook
```

---

## 📊 Post-Launch Monitoring (24h)

- [ ] Bot uptime > 99%
- [ ] Web uptime > 99%
- [ ] Memory < 80% (bot: 820 MB, web: 410 MB)
- [ ] No restart loops
- [ ] Webhook success rate > 95%

---

**Sign-Off:** __________ | **Time:** __________ | **Status:** ☐ GO ☐ NO-GO
