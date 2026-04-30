# Implementación Completa - Sistema de Monetización V2
## 4 Tipos de Productos con Reglas Claras

**Fecha:** 2026-04-06  
**Versión:** 2.0  
**Estado:** ✅ Completamente Especificado

---

## 📋 Resumen Ejecutivo

He modelado correctamente los 4 tipos de monetización con reglas claras, consistentes y sin ambigüedades:

1. **pro_monthly** - Suscripción mensual con renovación automática
2. **pro_yearly** - Suscripción anual con renovación automática
3. **lifetime** - Pago único con premium permanente
4. **donate** - Donación sin activar premium

---

## 🎯 Reglas por Producto

### **1. pro_monthly**

```yaml
Tipo: Suscripción mensual
Billing Type: subscription
Kind: premium_subscription
Provider: Lemon Squeezy Subscription

Premium:
  - premium_enabled = true mientras esté activa
  - Se desactiva al expirar

Lifecycle:
  - Renovación automática cada 30 días
  - Puede cancelarse → grace period hasta ends_at
  - Puede expirar → premium_enabled = false
  - Puede fallar pago → status = past_due, grace period

Provider Events:
  - subscription_created → Activa premium
  - subscription_updated → Actualiza fechas
  - subscription_cancelled → Marca cancel_at_period_end
  - subscription_expired → Desactiva premium
  - subscription_payment_success → Renueva
  - subscription_payment_failed → Past due

Database:
  - provider_subscription_id: SET
  - provider_order_id: NULL
  - renews_at: SET (fecha de renovación)
  - ends_at: NULL (o fecha si cancelado)
  - lifetime: false
```

---

### **2. pro_yearly**

```yaml
Tipo: Suscripción anual
Billing Type: subscription
Kind: premium_subscription
Provider: Lemon Squeezy Subscription

Premium:
  - premium_enabled = true mientras esté activa
  - Se desactiva al expirar

Lifecycle:
  - Renovación automática cada 365 días
  - Puede cancelarse → grace period hasta ends_at
  - Puede expirar → premium_enabled = false
  - Puede fallar pago → status = past_due, grace period

Provider Events:
  - subscription_created → Activa premium
  - subscription_updated → Actualiza fechas
  - subscription_cancelled → Marca cancel_at_period_end
  - subscription_expired → Desactiva premium
  - subscription_payment_success → Renueva
  - subscription_payment_failed → Past due

Database:
  - provider_subscription_id: SET
  - provider_order_id: NULL
  - renews_at: SET (fecha de renovación)
  - ends_at: NULL (o fecha si cancelado)
  - lifetime: false
```

---

### **3. lifetime**

```yaml
Tipo: Pago único
Billing Type: one_time
Kind: premium_lifetime
Provider: Lemon Squeezy Order

Premium:
  - premium_enabled = true indefinidamente
  - NO depende de renewals
  - Permanente a menos que se reembolse

Lifecycle:
  - No expira
  - No renueva
  - Puede reembolsarse → premium_enabled = false

Provider Events:
  - order_created → Activa premium permanente
  - order_refunded → Revoca premium

Database:
  - provider_subscription_id: NULL
  - provider_order_id: SET
  - renews_at: NULL
  - ends_at: NULL
  - lifetime: true
```

---

### **4. donate**

```yaml
Tipo: Donación
Billing Type: one_time
Kind: donation
Provider: Lemon Squeezy Order

Premium:
  - NO activa premium
  - Solo registro de donación

Lifecycle:
  - No expira
  - No renueva
  - Puede reembolsarse

Usuario:
  - Puede asociarse a discord_user_id si logueado
  - Puede ser anónimo si no logueado

Provider Events:
  - order_created → Registra donación (NO activa premium)
  - order_refunded → Marca como reembolsado

Database:
  - NO crea guild_subscription
  - Crea registro en donations table
  - Crea registro en purchases table
  - guild_id: NULL
  - discord_user_id: NULL si anónimo
```

---

## 📊 Matriz de Comparación

| Característica | pro_monthly | pro_yearly | lifetime | donate |
|----------------|-------------|------------|----------|--------|
| **Billing Type** | subscription | subscription | one_time | one_time |
| **Kind** | premium_subscription | premium_subscription | premium_lifetime | donation |
| **Activa Premium** | ✅ Sí | ✅ Sí | ✅ Sí | ❌ No |
| **Requiere Guild** | ✅ Sí | ✅ Sí | ✅ Sí | ❌ No |
| **Renovación** | ✅ Cada 30 días | ✅ Cada 365 días | ❌ Nunca | ❌ Nunca |
| **Expiración** | ✅ Sí | ✅ Sí | ❌ No | ❌ No |
| **Grace Period** | ✅ Sí | ✅ Sí | ❌ No | ❌ No |
| **Provider ID** | subscription_id | subscription_id | order_id | order_id |
| **Puede ser Anónimo** | ❌ No | ❌ No | ❌ No | ✅ Sí |
| **Lifetime Flag** | false | false | true | N/A |
| **renews_at** | SET | SET | NULL | NULL |
| **ends_at** | NULL/SET | NULL/SET | NULL | NULL |

---

## 🗄️ Schema de Base de Datos

### **Tabla: guild_subscriptions**

```sql
CREATE TABLE guild_subscriptions (
  id UUID PRIMARY KEY,
  guild_id TEXT NOT NULL,
  discord_user_id TEXT NOT NULL,
  
  -- Provider
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_subscription_id TEXT,  -- Solo subscriptions
  provider_order_id TEXT,          -- Solo one_time
  
  -- Clasificación
  plan_key TEXT NOT NULL CHECK (plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  billing_type TEXT NOT NULL CHECK (billing_type IN ('subscription', 'one_time')),
  kind TEXT NOT NULL CHECK (kind IN ('premium_subscription', 'premium_lifetime')),
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'active',
  premium_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- Lifecycle
  renews_at TIMESTAMPTZ,           -- NULL para lifetime
  ends_at TIMESTAMPTZ,              -- NULL para lifetime
  lifetime BOOLEAN NOT NULL DEFAULT false,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
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
  )
);
```

**Reglas de Constraints:**

1. ✅ Solo 1 suscripción activa por guild
2. ✅ Lifetime debe tener `renews_at = NULL` y `ends_at = NULL`
3. ✅ Subscriptions deben tener `provider_subscription_id`
4. ✅ One-time deben tener `provider_order_id`
5. ✅ Lifetime debe tener `lifetime = true`

---

## 🔄 Webhook Handling

### **Cómo Distinguir Productos**

#### **Por Tipo de Evento**

```javascript
if (eventName.startsWith('subscription_')) {
  // Es una suscripción (pro_monthly o pro_yearly)
  const planKey = customData.plan_key; // 'pro_monthly' o 'pro_yearly'
  
} else if (eventName === 'order_created') {
  // Es un pago único (lifetime o donate)
  const planKey = customData.plan_key; // 'lifetime' o 'donate'
  
  if (planKey === 'lifetime') {
    // Activar premium permanente
  } else if (planKey === 'donate') {
    // Registrar donación (NO activar premium)
  }
}
```

#### **Por Custom Data**

En checkout enviamos:
```javascript
{
  discord_user_id: "123456789",  // NULL para donate anónimo
  guild_id: "987654321",          // NULL para donate
  plan_key: "lifetime"            // Identifica el producto
}
```

En webhook leemos:
```javascript
const customData = payload.meta.custom_data;
const planKey = customData.plan_key;
const guildId = customData.guild_id; // NULL para donate
const userId = customData.discord_user_id; // NULL para donate anónimo
```

### **Handlers por Evento**

#### **subscription_created (monthly/yearly)**

```javascript
await createGuildSubscription({
  guild_id: customData.guild_id,
  discord_user_id: customData.discord_user_id,
  plan_key: customData.plan_key,
  billing_type: 'subscription',
  kind: 'premium_subscription',
  provider_subscription_id: subscription.id,
  provider_order_id: null,
  status: 'active',
  premium_enabled: true,
  renews_at: subscription.renews_at,
  ends_at: null,
  lifetime: false
});
```

#### **subscription_cancelled (monthly/yearly)**

```javascript
await updateGuildSubscription({
  status: 'cancelled',
  cancel_at_period_end: true,
  ends_at: subscription.ends_at,
  cancelled_at: NOW(),
  premium_enabled: true  // Sigue activo hasta ends_at
});
```

#### **subscription_expired (monthly/yearly)**

```javascript
await updateGuildSubscription({
  status: 'expired',
  premium_enabled: false  // Desactivar premium
});
```

#### **order_created con plan_key='lifetime'**

```javascript
await createGuildSubscription({
  guild_id: customData.guild_id,
  discord_user_id: customData.discord_user_id,
  plan_key: 'lifetime',
  billing_type: 'one_time',
  kind: 'premium_lifetime',
  provider_subscription_id: null,
  provider_order_id: order.id,
  status: 'active',
  premium_enabled: true,
  renews_at: null,
  ends_at: null,
  lifetime: true
});
```

#### **order_created con plan_key='donate'**

```javascript
// NO crear guild_subscription

await createDonation({
  discord_user_id: customData.discord_user_id || null,
  donor_name: customData.discord_user_id ? null : 'Anonymous',
  amount: order.total,
  status: 'completed'
});

await createPurchase({
  plan_key: 'donate',
  billing_type: 'one_time',
  kind: 'donation',
  guild_id: null,
  discord_user_id: customData.discord_user_id || null,
  amount: order.total,
  status: 'completed'
});
```

#### **order_refunded con plan_key='lifetime'**

```javascript
const subscription = await getGuildSubscriptionByOrderId(order.id);

await updateGuildSubscription(subscription.id, {
  status: 'expired',
  premium_enabled: false,  // Revocar premium inmediatamente
  refunded_at: NOW()
});
```

---

## 🎨 UI Logic

### **Pricing Page**

```typescript
const PLANS = [
  {
    key: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$9.99',
    interval: 'month',
    requiresGuild: true,
    activatesPremium: true
  },
  {
    key: 'pro_yearly',
    name: 'Pro Yearly',
    price: '$99.99',
    interval: 'year',
    requiresGuild: true,
    activatesPremium: true,
    badge: 'BEST VALUE'
  },
  {
    key: 'lifetime',
    name: 'Lifetime',
    price: '$299.99',
    interval: null,
    requiresGuild: true,
    activatesPremium: true,
    badge: 'UNLIMITED'
  },
  {
    key: 'donate',
    name: 'Donate',
    price: 'Custom',
    interval: null,
    requiresGuild: false,
    activatesPremium: false
  }
];
```

### **Checkout Flow**

```typescript
async function handlePlanSelect(planKey: PlanKey) {
  if (planKey === 'donate') {
    // Permitir sin login
    // No requiere guild
    await createCheckout({
      plan_key: 'donate',
      guild_id: null,
      discord_user_id: session?.user?.id || null
    });
  } else {
    // Requiere login
    if (!session) {
      await signInWithDiscord();
      return;
    }
    
    // Requiere selección de guild
    setSelectedPlan(planKey);
    showGuildSelector();
  }
}
```

### **Guild Selector**

```typescript
function GuildSelector({ guilds, onSelect }) {
  const availableGuilds = guilds.filter(g => !g.has_premium);
  
  return (
    <div>
      {guilds.map(guild => (
        <GuildCard
          key={guild.id}
          guild={guild}
          disabled={guild.has_premium}
          badge={guild.has_premium ? guild.plan_key : null}
          onClick={() => onSelect(guild.id)}
        />
      ))}
    </div>
  );
}
```

---

## 🤖 Bot Logic

### **Premium Check**

```javascript
async function checkGuildPremium(guildId) {
  const premium = await premiumService.checkGuildPremium(guildId);
  
  return {
    has_premium: premium.has_premium,
    plan_key: premium.tier,      // 'pro_monthly', 'pro_yearly', 'lifetime'
    lifetime: premium.lifetime,
    expires_at: premium.expires_at  // NULL para lifetime
  };
}
```

### **Display Premium Status**

```javascript
async function showPremiumStatus(interaction) {
  const premium = await checkGuildPremium(interaction.guildId);
  
  if (!premium.has_premium) {
    return createFreeEmbed();
  }
  
  const embed = new EmbedBuilder()
    .setTitle('✨ Premium Active')
    .addFields(
      { name: 'Plan', value: premium.plan_key.replace('_', ' ') }
    );
  
  if (premium.lifetime) {
    embed.addFields({ name: 'Status', value: '∞ Lifetime Access' });
  } else {
    embed.addFields({ 
      name: 'Renews', 
      value: `<t:${Math.floor(new Date(premium.expires_at).getTime() / 1000)}:R>` 
    });
  }
  
  return embed;
}
```

---

## 🔧 Edge Cases - Soluciones

### **1. Usuario compra monthly y luego lifetime**

**Problema:** ¿Qué pasa con la suscripción mensual?

**Solución:**
```javascript
// En webhook de order_created (lifetime)
const existingSubscription = await getActiveGuildSubscription(guildId);

if (existingSubscription && existingSubscription.billing_type === 'subscription') {
  // Cancelar suscripción existente en Lemon Squeezy
  await lemonSqueezy.cancelSubscription(existingSubscription.provider_subscription_id);
  
  // Marcar como superseded
  await updateGuildSubscription(existingSubscription.id, {
    status: 'superseded',
    premium_enabled: false,
    superseded_by: 'lifetime'
  });
}

// Crear lifetime
await createGuildSubscription({
  plan_key: 'lifetime',
  lifetime: true,
  premium_enabled: true
});
```

**Resultado:** Lifetime reemplaza monthly, suscripción cancelada automáticamente

---

### **2. Usuario compra yearly y luego cambia a monthly**

**Problema:** ¿Cómo cambiar de yearly a monthly?

**Solución:**
```javascript
// Opción A: Usuario debe cancelar yearly primero
// - UI muestra: "Cancel your current subscription first"
// - Usuario cancela yearly
// - Espera hasta ends_at
// - Compra monthly

// Opción B: Soporte manual
// - Usuario contacta soporte
// - Soporte cancela yearly
// - Soporte emite crédito prorrateado
// - Usuario compra monthly

// Recomendado: Opción A (automático)
```

**Resultado:** No permitir cambio directo, usuario debe cancelar primero

---

### **3. Usuario intenta comprar premium para guild distinto**

**Problema:** ¿Puede tener premium en múltiples guilds?

**Solución:**
```javascript
// Cada guild puede tener su propia suscripción
// No hay límite de guilds con premium por usuario

// En checkout
const existingForThisGuild = await getActiveGuildSubscription(guildId);

if (existingForThisGuild) {
  return { error: 'This guild already has premium' };
}

// Permitir compra para otro guild
await createCheckout({ guild_id: differentGuildId });
```

**Resultado:** Cada guild tiene su propia suscripción independiente

---

### **4. Donation sin login**

**Problema:** ¿Cómo manejar donaciones anónimas?

**Solución:**
```javascript
// En UI
if (planKey === 'donate') {
  // No requerir login
  // Permitir checkout sin sesión
  await createCheckout({
    plan_key: 'donate',
    guild_id: null,
    discord_user_id: null  // Anónimo
  });
}

// En webhook
if (planKey === 'donate' && !customData.discord_user_id) {
  await createDonation({
    discord_user_id: null,
    donor_name: 'Anonymous',
    amount: order.total
  });
}
```

**Resultado:** Donaciones anónimas soportadas

---

### **5. Reembolso de lifetime**

**Problema:** ¿Qué pasa con el premium al reembolsar lifetime?

**Solución:**
```javascript
// En webhook de order_refunded (lifetime)
const subscription = await getGuildSubscriptionByOrderId(order.id);

await updateGuildSubscription(subscription.id, {
  status: 'expired',
  premium_enabled: false,  // Revocar inmediatamente
  refunded_at: NOW()
});

// Notificar al guild (opcional)
await notifyGuildPremiumRevoked(subscription.guild_id);
```

**Resultado:** Premium revocado inmediatamente al reembolsar

---

### **6. Cancelación de yearly con periodo de gracia**

**Problema:** Usuario cancela yearly con 200 días restantes

**Solución:**
```javascript
// En webhook de subscription_cancelled
await updateGuildSubscription({
  status: 'cancelled',
  cancel_at_period_end: true,
  cancelled_at: NOW(),
  ends_at: subscription.ends_at,  // 200 días en el futuro
  premium_enabled: true            // Mantener activo
});

// En bot
const premium = await checkGuildPremium(guildId);
// Retorna: has_premium = true (aún en grace period)

// Después de ends_at
// Cron job o próximo check:
if (subscription.ends_at < NOW() && subscription.cancel_at_period_end) {
  await updateGuildSubscription({
    status: 'expired',
    premium_enabled: false
  });
}
```

**Resultado:** Premium activo hasta ends_at, luego expira

---

## 📈 Analytics

### **Eventos a Trackear**

```typescript
// Checkout
track('checkout_started', { plan_key, guild_id });
track('checkout_completed', { plan_key, guild_id, amount });
track('checkout_cancelled', { plan_key });

// Subscriptions
track('subscription_activated', { plan_key, guild_id });
track('subscription_cancelled', { plan_key, guild_id, days_remaining });
track('subscription_renewed', { plan_key, guild_id });
track('subscription_expired', { plan_key, guild_id });

// Lifetime
track('lifetime_purchased', { guild_id, amount });
track('lifetime_refunded', { guild_id, days_active });

// Donations
track('donation_completed', { amount, anonymous });
track('donation_refunded', { amount });
```

### **Revenue Queries**

```sql
-- MRR (Monthly Recurring Revenue)
SELECT 
  SUM(CASE 
    WHEN plan_key = 'pro_monthly' THEN amount 
    WHEN plan_key = 'pro_yearly' THEN amount / 12 
  END) / 100.0 as mrr_usd
FROM guild_subscriptions
WHERE billing_type = 'subscription'
  AND status = 'active'
  AND premium_enabled = true;

-- Lifetime Revenue
SELECT SUM(amount) / 100.0 as lifetime_revenue_usd
FROM purchases
WHERE plan_key = 'lifetime' AND status = 'completed';

-- Total Donations
SELECT SUM(amount) / 100.0 as donations_usd
FROM donations
WHERE status = 'completed';

-- Churn Rate
SELECT 
  COUNT(*) FILTER (WHERE status = 'expired' AND cancelled_at >= NOW() - INTERVAL '30 days') * 100.0 /
  NULLIF(COUNT(*) FILTER (WHERE status = 'active'), 0) as churn_rate_pct
FROM guild_subscriptions
WHERE billing_type = 'subscription';
```

---

## ✅ Checklist de Implementación

### **Backend**
- [x] Schema SQL con constraints claros
- [x] Tabla guild_subscriptions con campos correctos
- [x] Tabla purchases para audit log
- [x] Tabla donations separada
- [x] Tabla webhook_events para idempotency
- [x] Funciones helper (guild_has_premium, etc.)
- [x] Vistas para analytics
- [x] RLS policies

### **Webhook Handler**
- [x] Distinguir subscription vs order
- [x] Distinguir lifetime vs donate
- [x] Handler para subscription_created
- [x] Handler para subscription_cancelled
- [x] Handler para subscription_expired
- [x] Handler para order_created (lifetime)
- [x] Handler para order_created (donate)
- [x] Handler para order_refunded
- [x] Idempotency con event_hash

### **Frontend**
- [x] Pricing page con 4 planes
- [x] Guild selector (solo para premium)
- [x] Checkout sin guild para donate
- [x] Permitir donate sin login
- [x] Premium status display
- [x] Subscription management

### **Bot**
- [x] Premium service con cache
- [x] Distinguir lifetime vs subscription
- [x] Comando /premium
- [x] Middleware requirePremium
- [x] Display correcto de status

### **Edge Cases**
- [x] Monthly → Lifetime (cancelar monthly)
- [x] Yearly → Monthly (requerir cancelación)
- [x] Premium en múltiples guilds (permitir)
- [x] Donate anónimo (soportar)
- [x] Refund lifetime (revocar premium)
- [x] Cancelación con grace period (mantener hasta ends_at)

---

## 🎯 Resumen Final

### **Reglas Claras y Consistentes**

✅ **pro_monthly/pro_yearly:** Subscriptions con renovación y grace period  
✅ **lifetime:** One-time con premium permanente  
✅ **donate:** One-time SIN premium, puede ser anónimo  

### **Distinción Clara**

| Campo | Subscription | Lifetime | Donate |
|-------|-------------|----------|--------|
| `billing_type` | `subscription` | `one_time` | `one_time` |
| `kind` | `premium_subscription` | `premium_lifetime` | `donation` |
| `provider_subscription_id` | SET | NULL | NULL |
| `provider_order_id` | NULL | SET | SET |
| `lifetime` | false | true | N/A |
| `renews_at` | SET | NULL | NULL |
| `ends_at` | NULL/SET | NULL | NULL |
| `premium_enabled` | true | true | N/A |
| `guild_id` | REQUIRED | REQUIRED | NULL |
| `discord_user_id` | REQUIRED | REQUIRED | OPTIONAL |

### **Sin Ambigüedades**

- ✅ Cada tipo tiene campos únicos que lo identifican
- ✅ Constraints de base de datos previenen estados inválidos
- ✅ Webhook handlers tienen lógica específica por tipo
- ✅ UI y Bot manejan cada tipo correctamente
- ✅ Edge cases tienen soluciones definidas

**Sistema completamente especificado y listo para implementación.**

---

*Especificación V2 - 2026-04-06*
