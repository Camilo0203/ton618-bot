# Modelo de Monetización Completo - TON618 Bot
## Definición Clara de 4 Tipos de Productos

**Fecha:** 2026-04-06  
**Versión:** 2.0  
**Estado:** Especificación Completa

---

## 📋 Tabla de Contenidos

1. [Definición de Productos](#definición-de-productos)
2. [Modelo de Datos](#modelo-de-datos)
3. [Diferencias de Implementación](#diferencias-de-implementación)
4. [Webhook Handling](#webhook-handling)
5. [Entitlement Logic](#entitlement-logic)
6. [UI Logic](#ui-logic)
7. [Bot Logic](#bot-logic)
8. [Edge Cases](#edge-cases)
9. [Analytics & Tracking](#analytics--tracking)

---

## 1. Definición de Productos

### **Product Matrix**

| Plan Key | Billing Type | Kind | Activates Premium | Requires Guild | Renewable | Provider Type |
|----------|-------------|------|-------------------|----------------|-----------|---------------|
| `pro_monthly` | `subscription` | `premium_subscription` | ✅ Yes | ✅ Yes | ✅ Yes | Subscription |
| `pro_yearly` | `subscription` | `premium_subscription` | ✅ Yes | ✅ Yes | ✅ Yes | Subscription |
| `lifetime` | `one_time` | `premium_lifetime` | ✅ Yes | ✅ Yes | ❌ No | Order |
| `donate` | `one_time` | `donation` | ❌ No | ❌ No | ❌ No | Order |

### **Reglas por Producto**

#### **pro_monthly**
```yaml
Type: Subscription
Billing: Monthly recurring
Premium: Enabled while active
Lifecycle:
  - Can be cancelled → grace period until period end
  - Can expire → premium disabled immediately
  - Can fail payment → past_due status, grace period
  - Renews automatically every 30 days
Provider Events:
  - subscription_created
  - subscription_updated
  - subscription_cancelled
  - subscription_expired
  - subscription_payment_success
  - subscription_payment_failed
```

#### **pro_yearly**
```yaml
Type: Subscription
Billing: Yearly recurring
Premium: Enabled while active
Lifecycle:
  - Can be cancelled → grace period until period end
  - Can expire → premium disabled immediately
  - Can fail payment → past_due status, grace period
  - Renews automatically every 365 days
Provider Events:
  - subscription_created
  - subscription_updated
  - subscription_cancelled
  - subscription_expired
  - subscription_payment_success
  - subscription_payment_failed
```

#### **lifetime**
```yaml
Type: One-time purchase
Billing: Single payment
Premium: Enabled indefinitely
Lifecycle:
  - No expiration
  - No renewals
  - Can be refunded → premium revoked
  - Permanent unless refunded
Provider Events:
  - order_created
  - order_refunded
```

#### **donate**
```yaml
Type: One-time purchase
Billing: Single payment
Premium: Does NOT activate
Lifecycle:
  - No expiration
  - No renewals
  - Can be refunded
  - Can be anonymous (no discord_user_id)
Provider Events:
  - order_created
  - order_refunded
```

---

## 2. Modelo de Datos

### **Table: guild_subscriptions**

**Purpose:** Source of truth for premium status per guild

```sql
CREATE TABLE guild_subscriptions (
  id UUID PRIMARY KEY,
  
  -- Guild and Owner
  guild_id TEXT NOT NULL,
  discord_user_id TEXT NOT NULL,
  
  -- Provider
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,  -- NULL for one_time
  provider_order_id TEXT,          -- For one_time purchases
  
  -- Product Classification
  plan_key TEXT NOT NULL CHECK (plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  billing_type TEXT NOT NULL CHECK (billing_type IN ('subscription', 'one_time')),
  kind TEXT NOT NULL CHECK (kind IN ('premium_subscription', 'premium_lifetime')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  premium_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- Lifecycle
  started_at TIMESTAMPTZ DEFAULT NOW(),
  renews_at TIMESTAMPTZ,           -- NULL for lifetime
  ends_at TIMESTAMPTZ,              -- NULL for lifetime
  cancelled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  lifetime BOOLEAN NOT NULL DEFAULT false,
  
  -- Constraints
  CONSTRAINT unique_active_guild_subscription 
    UNIQUE (guild_id, status) 
    WHERE status = 'active' AND premium_enabled = true,
  
  CONSTRAINT lifetime_no_renewal CHECK (
    (lifetime = true AND renews_at IS NULL AND ends_at IS NULL) OR
    (lifetime = false)
  ),
  
  CONSTRAINT subscription_has_provider_id CHECK (
    (billing_type = 'subscription' AND provider_subscription_id IS NOT NULL) OR
    (billing_type = 'one_time' AND provider_order_id IS NOT NULL)
  ),
  
  CONSTRAINT lifetime_is_one_time CHECK (
    (plan_key = 'lifetime' AND billing_type = 'one_time' AND kind = 'premium_lifetime' AND lifetime = true) OR
    (plan_key != 'lifetime')
  )
);
```

**Key Fields:**

- `plan_key`: Identifies the product (`pro_monthly`, `pro_yearly`, `lifetime`)
- `billing_type`: `subscription` or `one_time`
- `kind`: `premium_subscription` or `premium_lifetime`
- `provider_subscription_id`: Only for subscriptions
- `provider_order_id`: Only for one-time purchases
- `lifetime`: Boolean flag, true only for lifetime purchases
- `renews_at`: NULL for lifetime, set for subscriptions
- `ends_at`: NULL for lifetime, set when subscription is cancelled

### **Table: purchases**

**Purpose:** Audit log of ALL transactions (including donations)

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  
  -- Provider
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_order_id TEXT NOT NULL,
  
  -- Customer
  discord_user_id TEXT,  -- NULL for anonymous donations
  guild_id TEXT,         -- NULL for donations
  
  -- Product Classification
  plan_key TEXT NOT NULL CHECK (plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime', 'donate')),
  billing_type TEXT NOT NULL CHECK (billing_type IN ('subscription', 'one_time')),
  kind TEXT NOT NULL CHECK (kind IN ('premium_subscription', 'premium_lifetime', 'donation')),
  
  -- Financial
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed',
  
  -- Constraints
  CONSTRAINT unique_provider_order UNIQUE (provider, provider_order_id),
  
  CONSTRAINT donation_no_guild CHECK (
    (kind = 'donation' AND guild_id IS NULL) OR
    (kind != 'donation' AND guild_id IS NOT NULL)
  ),
  
  CONSTRAINT premium_requires_guild CHECK (
    (kind IN ('premium_subscription', 'premium_lifetime') AND guild_id IS NOT NULL) OR
    (kind = 'donation')
  )
);
```

### **Table: donations**

**Purpose:** Separate tracking for donations with optional message

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  
  -- Provider
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_order_id TEXT NOT NULL,
  
  -- Donor (nullable for anonymous)
  discord_user_id TEXT,
  donor_name TEXT,
  
  -- Financial
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed',
  
  -- Optional message
  message TEXT,
  
  CONSTRAINT unique_donation_order UNIQUE (provider, provider_order_id)
);
```

---

## 3. Diferencias de Implementación

### **Subscription vs One-Time**

| Aspect | Subscription (monthly/yearly) | One-Time (lifetime/donate) |
|--------|------------------------------|---------------------------|
| **Provider ID** | `provider_subscription_id` | `provider_order_id` |
| **Webhook Events** | 8+ events (created, updated, cancelled, expired, payment_success, payment_failed, paused, resumed) | 2 events (order_created, order_refunded) |
| **Renewal** | Automatic via Lemon Squeezy | Never renews |
| **Expiration** | Has `renews_at` and `ends_at` | NULL for both |
| **Cancellation** | Sets `cancel_at_period_end = true`, keeps premium until `ends_at` | N/A (can only refund) |
| **Grace Period** | Yes (until period end) | No |
| **Status Transitions** | active → cancelled → expired | active → (refunded) |

### **Lifetime vs Donate**

| Aspect | Lifetime | Donate |
|--------|----------|--------|
| **Activates Premium** | ✅ Yes | ❌ No |
| **Requires Guild** | ✅ Yes | ❌ No |
| **Stored in** | `guild_subscriptions` + `purchases` | `donations` + `purchases` |
| **Can be Anonymous** | ❌ No (requires login) | ✅ Yes |
| **Refund Effect** | Revokes premium | No effect on premium |
| **Lifetime Flag** | `lifetime = true` | N/A |

---

## 4. Webhook Handling

### **How to Distinguish Products in Webhooks**

#### **Method 1: Event Type**

```javascript
if (eventName.startsWith('subscription_')) {
  // This is a subscription (pro_monthly or pro_yearly)
  const subscriptionId = data.id;
  const planKey = customData.plan_key; // from checkout custom_data
  
} else if (eventName === 'order_created') {
  // This is a one-time purchase (lifetime or donate)
  const orderId = data.id;
  const planKey = customData.plan_key; // from checkout custom_data
  
  if (planKey === 'lifetime') {
    // Handle lifetime purchase
  } else if (planKey === 'donate') {
    // Handle donation
  }
}
```

#### **Method 2: Custom Data**

When creating checkout, we pass:
```javascript
{
  discord_user_id: "123456789",
  guild_id: "987654321",  // NULL for donations
  plan_key: "lifetime"     // or "donate"
}
```

In webhook, we read:
```javascript
const customData = webhookPayload.meta.custom_data;
const planKey = customData.plan_key;
const guildId = customData.guild_id; // NULL for donations
```

### **Webhook Event Mapping**

#### **Subscriptions (pro_monthly, pro_yearly)**

```javascript
// Event: subscription_created
→ Create guild_subscription with:
  - billing_type = 'subscription'
  - kind = 'premium_subscription'
  - provider_subscription_id = subscription.id
  - renews_at = subscription.renews_at
  - premium_enabled = true
  - status = 'active'

// Event: subscription_updated
→ Update guild_subscription:
  - renews_at = subscription.renews_at
  - status = subscription.status

// Event: subscription_cancelled
→ Update guild_subscription:
  - status = 'cancelled'
  - cancel_at_period_end = true
  - ends_at = subscription.ends_at
  - cancelled_at = NOW()
  - premium_enabled = true (still active until ends_at)

// Event: subscription_expired
→ Update guild_subscription:
  - status = 'expired'
  - premium_enabled = false

// Event: subscription_payment_success
→ Update guild_subscription:
  - renews_at = new renewal date
  - status = 'active'
  - premium_enabled = true

// Event: subscription_payment_failed
→ Update guild_subscription:
  - status = 'past_due'
  - premium_enabled = true (grace period)
```

#### **Lifetime**

```javascript
// Event: order_created (plan_key = 'lifetime')
→ Create guild_subscription with:
  - billing_type = 'one_time'
  - kind = 'premium_lifetime'
  - provider_order_id = order.id
  - lifetime = true
  - renews_at = NULL
  - ends_at = NULL
  - premium_enabled = true
  - status = 'active'

// Event: order_refunded (plan_key = 'lifetime')
→ Update guild_subscription:
  - status = 'expired'
  - premium_enabled = false
  - refunded_at = NOW()
```

#### **Donate**

```javascript
// Event: order_created (plan_key = 'donate')
→ Create donation record:
  - discord_user_id = custom_data.discord_user_id (or NULL)
  - amount = order.total
  - status = 'completed'
→ Create purchase record:
  - kind = 'donation'
  - guild_id = NULL
→ DO NOT create guild_subscription

// Event: order_refunded (plan_key = 'donate')
→ Update donation:
  - status = 'refunded'
  - refunded_at = NOW()
→ Update purchase:
  - status = 'refunded'
```

---

## 5. Entitlement Logic

### **Function: guild_has_premium(guild_id)**

```sql
SELECT EXISTS (
  SELECT 1 FROM guild_subscriptions
  WHERE guild_id = $1
    AND premium_enabled = true
    AND status = 'active'
);
```

**Returns:** `true` if guild has ANY active premium (monthly, yearly, or lifetime)

### **Function: get_guild_entitlement(guild_id)**

```sql
SELECT 
  plan_key,
  billing_type,
  kind,
  lifetime,
  renews_at,
  ends_at,
  cancel_at_period_end
FROM guild_subscriptions
WHERE guild_id = $1
  AND premium_enabled = true
  AND status = 'active'
ORDER BY created_at DESC
LIMIT 1;
```

**Returns:** Full entitlement details for the guild

### **Premium Activation Rules**

```
IF plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime'):
  premium_enabled = true
  
IF plan_key = 'donate':
  premium_enabled = false (no guild_subscription created)
```

### **Premium Deactivation Rules**

```
Subscription Expired:
  - Event: subscription_expired
  - Action: premium_enabled = false

Subscription Cancelled (at period end):
  - Event: subscription_cancelled
  - Action: cancel_at_period_end = true, premium_enabled = true
  - Later: When ends_at < NOW(), premium_enabled = false

Lifetime Refunded:
  - Event: order_refunded
  - Action: premium_enabled = false

Payment Failed:
  - Event: subscription_payment_failed
  - Action: status = 'past_due', premium_enabled = true (grace period)
  - Later: If not recovered, subscription_expired → premium_enabled = false
```

---

## 6. UI Logic

### **Pricing Page**

```typescript
const PLANS = [
  {
    key: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$9.99',
    interval: 'month',
    billing_type: 'subscription',
    kind: 'premium_subscription',
    badge: null,
    features: [...]
  },
  {
    key: 'pro_yearly',
    name: 'Pro Yearly',
    price: '$99.99',
    interval: 'year',
    billing_type: 'subscription',
    kind: 'premium_subscription',
    badge: 'BEST VALUE',
    features: [...]
  },
  {
    key: 'lifetime',
    name: 'Lifetime',
    price: '$299.99',
    interval: null,
    billing_type: 'one_time',
    kind: 'premium_lifetime',
    badge: 'UNLIMITED',
    features: [...]
  },
  {
    key: 'donate',
    name: 'Donate',
    price: 'Custom',
    interval: null,
    billing_type: 'one_time',
    kind: 'donation',
    badge: null,
    features: ['Support development', 'No premium features']
  }
];
```

### **Guild Selector Logic**

```typescript
// For premium plans (monthly, yearly, lifetime)
if (plan_key !== 'donate') {
  // Show guild selector
  // Filter guilds with MANAGE_GUILD permission
  // Disable guilds that already have premium
  
  const guilds = await fetchBillingGuilds();
  const availableGuilds = guilds.filter(g => !g.has_premium);
}

// For donations
if (plan_key === 'donate') {
  // Skip guild selector
  // Proceed directly to checkout
  // guild_id will be NULL
}
```

### **Premium Status Display**

```typescript
function PremiumBadge({ guild }) {
  if (!guild.has_premium) return null;
  
  const badge = {
    pro_monthly: { text: 'Pro Monthly', color: 'blue' },
    pro_yearly: { text: 'Pro Yearly', color: 'purple' },
    lifetime: { text: 'Lifetime', color: 'gold' }
  }[guild.plan_key];
  
  return (
    <Badge color={badge.color}>
      {badge.text}
      {guild.lifetime && ' ∞'}
    </Badge>
  );
}
```

### **Subscription Management**

```typescript
function SubscriptionCard({ subscription }) {
  return (
    <Card>
      <h3>{subscription.plan_key.replace('_', ' ')}</h3>
      
      {subscription.billing_type === 'subscription' && (
        <>
          <p>Renews: {subscription.renews_at}</p>
          {subscription.cancel_at_period_end && (
            <Alert>Cancels at: {subscription.ends_at}</Alert>
          )}
          <Button onClick={openCustomerPortal}>Manage Subscription</Button>
        </>
      )}
      
      {subscription.lifetime && (
        <p>✨ Lifetime Access - No expiration</p>
      )}
    </Card>
  );
}
```

---

## 7. Bot Logic

### **Premium Check**

```javascript
const { premiumService } = require('./services/premiumService');

async function checkGuildPremium(guildId) {
  const premium = await premiumService.checkGuildPremium(guildId);
  
  return {
    has_premium: premium.has_premium,
    plan_key: premium.tier,           // 'pro_monthly', 'pro_yearly', 'lifetime'
    lifetime: premium.lifetime,
    expires_at: premium.expires_at,   // NULL for lifetime
  };
}
```

### **Feature Access**

```javascript
async function requirePremium(interaction) {
  const premium = await premiumService.checkGuildPremium(interaction.guildId);
  
  if (!premium.has_premium) {
    await interaction.reply({
      content: '❌ This feature requires premium. Upgrade at https://ton618.app/pricing',
      ephemeral: true
    });
    return false;
  }
  
  return true;
}
```

### **Premium Display**

```javascript
async function showPremiumStatus(interaction) {
  const premium = await premiumService.checkGuildPremium(interaction.guildId);
  
  if (!premium.has_premium) {
    return createFreeEmbed();
  }
  
  const embed = new EmbedBuilder()
    .setTitle('✨ Premium Active')
    .addFields(
      { name: 'Plan', value: premium.tier.replace('_', ' ') },
      { 
        name: 'Status', 
        value: premium.lifetime 
          ? '∞ Lifetime Access' 
          : `Renews: ${premium.expires_at}` 
      }
    );
  
  return embed;
}
```

---

## 8. Edge Cases

### **Edge Case 1: User buys monthly, then lifetime**

**Scenario:**
1. User has active `pro_monthly` subscription
2. User purchases `lifetime`

**Solution:**
```javascript
// In webhook handler for order_created (lifetime)
const existingSubscription = await getActiveGuildSubscription(guildId);

if (existingSubscription) {
  // Deactivate existing subscription
  await updateGuildSubscription(existingSubscription.id, {
    status: 'superseded',
    premium_enabled: false,
    superseded_at: NOW(),
    superseded_by: 'lifetime'
  });
  
  // Cancel the subscription in Lemon Squeezy
  await lemonSqueezy.cancelSubscription(existingSubscription.provider_subscription_id);
}

// Create new lifetime subscription
await createGuildSubscription({
  guild_id: guildId,
  plan_key: 'lifetime',
  billing_type: 'one_time',
  kind: 'premium_lifetime',
  lifetime: true,
  premium_enabled: true
});
```

**Result:** Lifetime replaces monthly, old subscription cancelled

---

### **Edge Case 2: User buys yearly, then changes to monthly**

**Scenario:**
1. User has active `pro_yearly` subscription
2. User wants to switch to `pro_monthly`

**Solution:**
```javascript
// Option A: User cancels yearly and waits for period end
// - Cancel yearly subscription
// - Wait until ends_at
// - Then purchase monthly

// Option B: Immediate switch (requires manual intervention)
// - Contact support
// - Support cancels yearly
// - Support issues prorated credit
// - User purchases monthly

// Recommended: Option A (automatic)
// In UI: Show "Cancel current subscription first" message
```

**Result:** User must cancel current subscription before purchasing new one

---

### **Edge Case 3: User tries to buy premium for different guild**

**Scenario:**
1. User has premium on Guild A
2. User tries to buy premium for Guild B

**Solution:**
```javascript
// In checkout creation
const existingSubscription = await getActiveGuildSubscription(guildId);

if (existingSubscription) {
  return {
    error: 'This guild already has premium',
    existing_plan: existingSubscription.plan_key
  };
}

// Allow purchase for different guild
// Each guild can have its own premium
```

**Result:** Each guild can have independent premium subscriptions

---

### **Edge Case 4: Donation without login**

**Scenario:**
1. User not logged in
2. User clicks "Donate"

**Solution:**
```javascript
// In checkout creation
if (plan_key === 'donate') {
  // Allow checkout without authentication
  const checkoutData = {
    variant_id: DONATE_VARIANT_ID,
    custom_data: {
      plan_key: 'donate',
      discord_user_id: null,  // Anonymous
      guild_id: null
    }
  };
}

// In webhook handler
if (plan_key === 'donate' && !custom_data.discord_user_id) {
  // Create anonymous donation
  await createDonation({
    discord_user_id: null,
    donor_name: 'Anonymous',
    amount: order.total
  });
}
```

**Result:** Anonymous donations are supported

---

### **Edge Case 5: Refund of lifetime**

**Scenario:**
1. User has `lifetime` premium
2. User requests refund

**Solution:**
```javascript
// In webhook handler for order_refunded
if (plan_key === 'lifetime') {
  const subscription = await getGuildSubscriptionByOrderId(order_id);
  
  // Revoke premium immediately
  await updateGuildSubscription(subscription.id, {
    status: 'expired',
    premium_enabled: false,
    refunded_at: NOW()
  });
  
  // Update purchase record
  await updatePurchase(order_id, {
    status: 'refunded',
    refunded_at: NOW()
  });
}
```

**Result:** Premium revoked immediately on refund

---

### **Edge Case 6: Cancellation of yearly with grace period**

**Scenario:**
1. User has `pro_yearly` subscription
2. User cancels subscription
3. Still has 200 days left in period

**Solution:**
```javascript
// In webhook handler for subscription_cancelled
await updateGuildSubscription(subscription_id, {
  status: 'cancelled',
  cancel_at_period_end: true,
  cancelled_at: NOW(),
  ends_at: subscription.ends_at,  // 200 days from now
  premium_enabled: true            // Keep active until ends_at
});

// In bot
const premium = await checkGuildPremium(guildId);
// Returns: has_premium = true (still in grace period)

// After ends_at passes
// Cron job or next check:
if (subscription.ends_at < NOW() && subscription.cancel_at_period_end) {
  await updateGuildSubscription(subscription_id, {
    status: 'expired',
    premium_enabled: false
  });
}
```

**Result:** Premium remains active until period end, then expires

---

## 9. Analytics & Tracking

### **Events to Track**

```typescript
// Checkout Events
track('checkout_started', {
  plan_key: string,
  billing_type: string,
  guild_id: string | null
});

track('checkout_completed', {
  plan_key: string,
  billing_type: string,
  guild_id: string | null,
  amount: number,
  currency: string
});

track('checkout_cancelled', {
  plan_key: string,
  billing_type: string
});

// Subscription Events
track('subscription_activated', {
  plan_key: string,
  guild_id: string
});

track('subscription_cancelled', {
  plan_key: string,
  guild_id: string,
  days_remaining: number
});

track('subscription_renewed', {
  plan_key: string,
  guild_id: string
});

track('subscription_expired', {
  plan_key: string,
  guild_id: string
});

// Lifetime Events
track('lifetime_purchased', {
  guild_id: string,
  amount: number
});

track('lifetime_refunded', {
  guild_id: string,
  days_active: number
});

// Donation Events
track('donation_completed', {
  amount: number,
  anonymous: boolean
});

track('donation_refunded', {
  amount: number
});
```

### **Revenue Queries**

```sql
-- Total revenue by product
SELECT 
  plan_key,
  COUNT(*) as purchases,
  SUM(amount) / 100.0 as revenue_usd
FROM purchases
WHERE status = 'completed'
GROUP BY plan_key;

-- MRR (Monthly Recurring Revenue)
SELECT 
  SUM(CASE 
    WHEN plan_key = 'pro_monthly' THEN amount 
    WHEN plan_key = 'pro_yearly' THEN amount / 12 
    ELSE 0 
  END) / 100.0 as mrr_usd
FROM guild_subscriptions
WHERE billing_type = 'subscription'
  AND status = 'active'
  AND premium_enabled = true;

-- Lifetime value
SELECT SUM(amount) / 100.0 as lifetime_revenue_usd
FROM purchases
WHERE plan_key = 'lifetime'
  AND status = 'completed';

-- Total donations
SELECT SUM(amount) / 100.0 as donations_usd
FROM donations
WHERE status = 'completed';

-- Churn rate (monthly)
SELECT 
  COUNT(*) FILTER (WHERE status = 'expired' AND cancelled_at >= NOW() - INTERVAL '30 days') * 100.0 /
  NULLIF(COUNT(*) FILTER (WHERE status = 'active'), 0) as churn_rate_pct
FROM guild_subscriptions
WHERE billing_type = 'subscription';
```

---

## 🎯 Summary

### **Clear Rules**

✅ **pro_monthly/pro_yearly:** Subscriptions with renewals and grace periods  
✅ **lifetime:** One-time purchase with permanent premium  
✅ **donate:** One-time purchase with NO premium, can be anonymous  

### **Key Distinctions**

| Feature | Subscription | Lifetime | Donate |
|---------|-------------|----------|--------|
| Billing Type | `subscription` | `one_time` | `one_time` |
| Provider ID | `provider_subscription_id` | `provider_order_id` | `provider_order_id` |
| Premium | ✅ Yes | ✅ Yes | ❌ No |
| Renewals | ✅ Yes | ❌ No | ❌ No |
| Expiration | ✅ Yes | ❌ No | ❌ No |
| Grace Period | ✅ Yes | ❌ No | ❌ No |
| Requires Guild | ✅ Yes | ✅ Yes | ❌ No |
| Can be Anonymous | ❌ No | ❌ No | ✅ Yes |

### **Implementation Checklist**

- [x] SQL schema with clear constraints
- [x] Webhook handlers for all events
- [x] Entitlement logic functions
- [x] UI components for each type
- [x] Bot integration with premium checks
- [x] Edge case handling
- [x] Analytics tracking

**All 4 types are now clearly defined with consistent, unambiguous rules.**

---

*Especificación completa - 2026-04-06*
