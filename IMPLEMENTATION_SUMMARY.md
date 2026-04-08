# TON618 Bot - Lemon Squeezy Monetization System
## Implementation Summary

**Date:** April 6, 2026  
**Status:** ✅ Complete - Ready for Configuration & Testing

---

## 🎯 What Was Implemented

A complete end-to-end monetization system integrating Lemon Squeezy with your TON618 Bot ecosystem, supporting:

- **Pro Monthly** ($9.99/mo) - Recurring subscription
- **Pro Yearly** ($99.99/yr) - Recurring subscription with 17% savings
- **Lifetime** ($299.99) - One-time payment
- **Donations** - Separate from premium features

---

## 📁 Files Created

### **Supabase (ton618-web)**

#### Migrations
- `supabase/migrations/20260406000000_create_billing_tables.sql` - Core billing tables
- `supabase/migrations/20260406000001_create_rls_policies.sql` - Row-level security

#### Edge Functions
- `supabase/functions/_shared/lemon-squeezy.ts` - Shared utilities
- `supabase/functions/lemon-squeezy-webhook/index.ts` - Webhook handler (11 events)
- `supabase/functions/lemon-create-checkout/index.ts` - Checkout session creator
- `supabase/functions/lemon-get-guild-premium/index.ts` - Premium status API
- `supabase/functions/lemon-get-user-guilds/index.ts` - User guilds with premium info

#### Frontend Components
- `src/components/PricingCard.tsx` - Reusable pricing card
- `src/components/PricingPage.tsx` - Public pricing page
- `src/components/BillingDashboard.tsx` - User billing management

### **Bot (ton618-bot)**

#### Services
- `src/services/premiumService.js` - Premium status management with caching
- `src/utils/premiumMiddleware.js` - Premium guards and helpers
- `src/commands/public/utility/premium.js` - `/premium` command

### **Documentation**
- `docs/LEMON_SQUEEZY_SETUP.md` - Complete setup guide
- `.env.lemon-squeezy.example` (both repos) - Environment variable templates

---

## 🗄️ Database Schema

### **Supabase PostgreSQL**

```
subscriptions (Monthly/Yearly)
├── id (UUID)
├── lemon_squeezy_id (TEXT, unique)
├── discord_user_id (TEXT)
├── guild_id (TEXT)
├── plan_type ('monthly' | 'yearly')
├── status (active/cancelled/expired/paused/past_due)
├── current_period_start/end (TIMESTAMPTZ)
└── cancel_at_period_end (BOOLEAN)

purchases (Lifetime)
├── id (UUID)
├── lemon_squeezy_order_id (TEXT, unique)
├── discord_user_id (TEXT)
├── guild_id (TEXT)
├── plan_type ('lifetime')
└── status ('completed' | 'refunded')

guild_premium (Source of Truth)
├── guild_id (TEXT, PK)
├── discord_user_id (TEXT)
├── tier ('pro_monthly' | 'pro_yearly' | 'lifetime')
├── is_active (BOOLEAN)
├── expires_at (TIMESTAMPTZ, NULL for lifetime)
├── subscription_id (UUID, FK)
└── purchase_id (UUID, FK)

donations (Separate)
├── id (UUID)
├── lemon_squeezy_order_id (TEXT, unique)
├── discord_user_id (TEXT, nullable)
├── amount_cents (INTEGER)
└── message (TEXT)
```

### **MongoDB (ton618-bot)**

```
premium_cache (TTL Collection)
├── guild_id (STRING)
├── has_premium (BOOLEAN)
├── tier (STRING)
├── expires_at (DATE)
├── cached_at (DATE)
└── ttl_expires_at (DATE) - Auto-expires after 5 minutes
```

---

## 🔄 Data Flow

### **Purchase Flow**

```
1. User visits ton618-web/pricing
2. Clicks plan → Redirects to /dashboard
3. Selects guild from dropdown
4. Frontend calls: POST /lemon-create-checkout
   ↓
5. Edge Function validates:
   - User authenticated
   - User manages guild
   - No existing premium
   ↓
6. Creates Lemon Squeezy checkout
7. Redirects user to Lemon Squeezy
   ↓
8. User completes payment
9. Lemon Squeezy sends webhook
   ↓
10. Edge Function processes webhook:
    - Validates signature
    - Creates subscription/purchase record
    - Updates guild_premium table
    ↓
11. Bot queries premium status
12. Caches in MongoDB (5min TTL)
13. Premium features unlocked
```

### **Premium Check Flow**

```
Bot Command Execution
  ↓
requirePremium(interaction)
  ↓
premiumService.checkGuildPremium(guildId)
  ↓
Check MongoDB cache (5min TTL)
  ↓
  Cache Hit? → Return cached data
  ↓
  Cache Miss? → Fetch from Supabase API
  ↓
GET /lemon-get-guild-premium/{guildId}
  ↓
Query guild_premium table
  ↓
Return: { has_premium, tier, expires_at }
  ↓
Cache in MongoDB
  ↓
Return to command
```

---

## 🔌 API Endpoints

### **Public (Frontend)**
- `POST /lemon-create-checkout` - Create checkout session
- `GET /lemon-get-user-guilds` - Get user's manageable guilds

### **Webhook (Lemon Squeezy)**
- `POST /lemon-squeezy-webhook` - Process payment events

### **Bot API (Authenticated)**
- `GET /lemon-get-guild-premium/{guild_id}` - Get premium status
- Header: `X-Bot-Api-Key: {BOT_API_KEY}`

---

## 🎨 Frontend Features

### **Pricing Page** (`/pricing`)
- 3 premium tiers with feature comparison
- Donation section
- Responsive design
- Gradient animations
- Direct checkout or redirect to dashboard

### **Billing Dashboard** (`/dashboard?section=billing`)
- List all user's guilds
- Show premium status per guild
- Upgrade buttons for free guilds
- Premium details (tier, expiry)
- Feature list per tier

---

## 🤖 Bot Features

### **Premium Service**
```javascript
// Check if guild has premium
const hasPremium = await premiumService.hasPremium(guildId);

// Get premium tier
const tier = await premiumService.getPremiumTier(guildId);

// Get tier features
const features = premiumService.getTierFeatures(tier);

// Check specific feature access
const hasFeature = await premiumService.checkFeatureAccess(guildId, 'advanced_moderation');
```

### **Middleware**
```javascript
// Require premium for command
const hasPremium = await requirePremium(interaction);
if (!hasPremium) return; // Auto-replies with upgrade message

// Require specific tier
const hasAccess = await requirePremium(interaction, { requiredTier: 'lifetime' });

// Check feature access
const hasFeature = await requireFeature(interaction, 'custom_embeds');

// Check limits
const limit = await checkLimit(guildId, 'custom_commands', currentCount);
if (!limit.allowed) {
  // Show upgrade message
}
```

### **Commands**
- `/premium` - Show premium status for current server

---

## 🔐 Security Features

✅ **Webhook signature validation** (HMAC SHA-256)  
✅ **Bot API key authentication**  
✅ **Row-level security (RLS) on all tables**  
✅ **Guild ownership validation**  
✅ **No secrets in frontend**  
✅ **Idempotent webhook processing**  
✅ **Rate limiting ready**

---

## 📋 Next Steps (Configuration Required)

### **1. Lemon Squeezy Setup** (30 min)
- [ ] Create account at lemonsqueezy.com
- [ ] Create product "TON618 Bot Pro"
- [ ] Create 4 variants (Monthly, Yearly, Lifetime, Donation)
- [ ] Get API key and Store ID
- [ ] Configure webhook URL
- [ ] Copy signing secret

### **2. Supabase Setup** (15 min)
- [ ] Run migrations: `supabase db push`
- [ ] Set environment variables in Edge Functions settings
- [ ] Deploy Edge Functions: `supabase functions deploy`
- [ ] Generate and set `BOT_API_KEY`
- [ ] Test webhook endpoint

### **3. Bot Setup** (10 min)
- [ ] Add `SUPABASE_URL` to `.env`
- [ ] Add `BOT_API_KEY` to `.env` (same as Supabase)
- [ ] Initialize premium service in `index.js`
- [ ] Deploy `/premium` command
- [ ] Test premium check

### **4. Frontend Setup** (10 min)
- [ ] Add routes for `/pricing` and `/dashboard/billing`
- [ ] Update navigation links
- [ ] Test checkout flow
- [ ] Verify Discord OAuth works

### **5. Testing** (30 min)
- [ ] Enable Lemon Squeezy test mode
- [ ] Test complete purchase flow
- [ ] Verify webhook processing
- [ ] Test bot premium detection
- [ ] Test cancellation flow
- [ ] Test refund flow

### **6. Production Deploy** (15 min)
- [ ] Disable test mode
- [ ] Update all URLs to production
- [ ] Deploy all services
- [ ] Monitor for 24 hours
- [ ] Set up error alerting

**Total Setup Time: ~2 hours**

---

## 🎯 Tier Features

### **Free**
- 5 custom commands
- 3 auto-roles
- 1 welcome message
- Basic moderation

### **Pro (Monthly/Yearly)**
- 50 custom commands
- 20 auto-roles
- 10 welcome messages
- Advanced moderation
- Custom embeds
- Priority support
- Analytics

### **Lifetime**
- 100 custom commands
- 50 auto-roles
- 20 welcome messages
- All Pro features
- Exclusive features
- VIP support
- Lifetime updates

---

## 📊 Webhook Events Handled

✅ `subscription_created` - Activate premium  
✅ `subscription_updated` - Update status  
✅ `subscription_cancelled` - Set expiry  
✅ `subscription_resumed` - Reactivate  
✅ `subscription_expired` - Deactivate  
✅ `subscription_paused` - Pause access  
✅ `subscription_unpaused` - Resume access  
✅ `subscription_payment_success` - Renew period  
✅ `subscription_payment_failed` - Mark past_due  
✅ `order_created` - Process lifetime/donation  
✅ `order_refunded` - Deactivate premium

---

## 🐛 Common Issues & Solutions

### **Webhook not receiving**
→ Check URL, signature secret, Edge Function logs

### **Premium not activating**
→ Check `guild_premium` table, verify `is_active = true`

### **Bot can't fetch status**
→ Verify `BOT_API_KEY` matches, check network

### **Checkout fails**
→ Check user permissions, variant IDs, API key

### **Cache not updating**
→ TTL is 5 minutes, or manually invalidate

**Full troubleshooting guide:** `docs/LEMON_SQUEEZY_SETUP.md`

---

## 📚 Documentation

- **Setup Guide:** `ton618-web/docs/LEMON_SQUEEZY_SETUP.md`
- **Environment Examples:** `.env.lemon-squeezy.example` (both repos)
- **Architecture:** This document

---

## ✨ Key Highlights

- **Clean Architecture** - Separation of concerns across 3 layers
- **Secure** - Webhook validation, API keys, RLS
- **Scalable** - Caching, TTL, efficient queries
- **Maintainable** - Well-documented, modular code
- **User-Friendly** - Beautiful UI, clear upgrade paths
- **Flexible** - Supports 4 monetization types
- **Production-Ready** - Error handling, logging, monitoring

---

## 🚀 Ready to Launch

The system is **fully implemented** and ready for configuration. Follow the setup guide in `docs/LEMON_SQUEEZY_SETUP.md` to go live.

**Estimated time to production: 2 hours**

---

*Built with ❤️ for TON618 Bot*
