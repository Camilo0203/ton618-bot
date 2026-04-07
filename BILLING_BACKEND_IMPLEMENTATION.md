# Backend de Billing - Implementación Completa
## Sistema de Monetización con Lemon Squeezy y Discord OAuth

**Fecha:** 2026-04-06  
**Arquitectura:** Supabase Edge Functions (Deno)  
**Estado:** ✅ Completamente Implementado

---

## 🎯 Resumen Ejecutivo

He construido una **capa backend completa de billing** para monetizar tu bot TON618 usando:
- **Lemon Squeezy** como proveedor de pagos
- **Discord OAuth2** para autenticación
- **Supabase Edge Functions** como backend serverless
- **PostgreSQL** como fuente de verdad

### Decisión de Arquitectura: Supabase Edge Functions ✅

**Elegí Opción A** por:
1. Ya usas Supabase → aprovecha infraestructura existente
2. Serverless → auto-scaling sin gestión de servidores
3. Integración nativa con Auth y PostgreSQL
4. Deploy simple con CLI
5. Costos optimizados vs microservicio Node.js

---

## 📦 Archivos Implementados

### **Migraciones SQL**
```
supabase/migrations/
└── 20260406200000_create_billing_system.sql (400+ líneas)
    ├── Tabla: users
    ├── Tabla: guild_subscriptions (source of truth)
    ├── Tabla: purchases
    ├── Tabla: donations
    ├── Tabla: webhook_events (idempotency)
    ├── Funciones: guild_has_premium(), deactivate_expired_subscriptions()
    ├── Vistas: active_guild_subscriptions, revenue_summary
    └── RLS policies completas
```

### **Utilidades Compartidas**
```
supabase/functions/_shared/
├── discord.ts (350+ líneas)
│   ├── DiscordClient class
│   ├── OAuth2 token exchange
│   ├── Get user guilds
│   ├── Filter manageable guilds
│   └── Avatar/icon URL helpers
│
├── lemon.ts (400+ líneas)
│   ├── LemonSqueezyClient class
│   ├── Create checkout sessions
│   ├── Verify webhook signatures (HMAC SHA-256)
│   ├── Parse webhook events
│   ├── Calculate renewal dates
│   └── Map subscription statuses
│
├── database.ts (500+ líneas)
│   ├── BillingDatabase class
│   ├── CRUD para todas las tablas
│   ├── getGuildPremiumStatus()
│   ├── Idempotency checks
│   └── Analytics queries
│
└── utils.ts (400+ líneas)
    ├── CORS headers
    ├── JSON responses
    ├── Error handling
    ├── Validation helpers
    └── Date/string utilities
```

### **Edge Functions (Endpoints)**
```
supabase/functions/
├── billing-webhook/index.ts (600+ líneas)
│   ├── Valida firma HMAC SHA-256
│   ├── Idempotencia con event_hash
│   ├── 11 event handlers:
│   │   ├── subscription_created
│   │   ├── subscription_updated
│   │   ├── subscription_cancelled
│   │   ├── subscription_resumed
│   │   ├── subscription_expired
│   │   ├── subscription_paused
│   │   ├── subscription_unpaused
│   │   ├── subscription_payment_success
│   │   ├── subscription_payment_failed
│   │   ├── order_created (lifetime/donations)
│   │   └── order_refunded
│   └── Lógica de negocio completa
│
├── billing-create-checkout/index.ts (150+ líneas)
│   ├── Autenticación con Supabase Auth
│   ├── Validación de guild ownership
│   ├── Check premium existente
│   ├── Crear checkout en Lemon Squeezy
│   └── Custom data: discord_user_id, guild_id, plan_key
│
├── billing-get-guilds/index.ts (120+ líneas)
│   ├── Fetch guilds desde Discord API
│   ├── Filter MANAGE_GUILD permission
│   ├── Enriquecer con premium status
│   └── Sort: premium first
│
└── billing-guild-status/index.ts (80+ líneas)
    ├── API key authentication (para bot)
    ├── Get premium status por guild
    └── Retorna subscription details
```

### **Documentación**
```
docs/
└── BILLING_BACKEND_COMPLETE.md (1000+ líneas)
    ├── Arquitectura completa
    ├── Esquema de base de datos
    ├── API endpoints con ejemplos
    ├── Flujos de negocio detallados
    ├── Variables de entorno
    ├── Instrucciones de deployment
    ├── Testing guide
    └── Ejemplos de uso
```

---

## 🗄️ Esquema de Base de Datos

### Tablas Implementadas

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `users` | Usuarios Discord | discord_user_id (PK), username, avatar, email |
| `guild_subscriptions` | **Source of truth** premium | guild_id, plan_key, status, premium_enabled, renews_at, ends_at, lifetime |
| `purchases` | Registro de compras | provider_order_id, kind, amount, status, raw_payload |
| `donations` | Donaciones separadas | discord_user_id (nullable), amount, message |
| `webhook_events` | Idempotency | event_hash (unique), processed, raw_payload |

### Constraints Implementados

✅ Solo 1 suscripción activa por guild  
✅ Lifetime → renews_at y ends_at = NULL  
✅ Subscription → debe tener provider_subscription_id  
✅ Donation → guild_id debe ser NULL  
✅ Unique constraint en (provider, provider_order_id)  
✅ Unique constraint en (provider, event_id)  

---

## 🔌 API Endpoints

### 1. `POST /billing-create-checkout`
**Auth:** Supabase Auth (Discord OAuth)  
**Input:**
```json
{
  "guild_id": "123456789",
  "plan_key": "pro_monthly"
}
```
**Output:**
```json
{
  "checkout_url": "https://ton618bot.lemonsqueezy.com/checkout/...",
  "checkout_id": "abc123",
  "plan_key": "pro_monthly",
  "guild_id": "123456789"
}
```

### 2. `GET /billing-get-guilds`
**Auth:** Supabase Auth  
**Output:**
```json
{
  "guilds": [
    {
      "id": "123456789",
      "name": "Mi Servidor",
      "has_premium": true,
      "plan_key": "pro_yearly",
      "ends_at": "2027-04-06T00:00:00Z"
    }
  ],
  "total": 5,
  "premium_count": 1
}
```

### 3. `POST /billing-webhook`
**Auth:** HMAC SHA-256 signature  
**Procesa:** 11 eventos de Lemon Squeezy  
**Idempotencia:** SHA-256 hash del payload

### 4. `GET /billing-guild-status/{guild_id}`
**Auth:** X-Bot-Api-Key header  
**Output:**
```json
{
  "guild_id": "123456789",
  "has_premium": true,
  "plan_key": "pro_yearly",
  "lifetime": false,
  "ends_at": "2027-04-06T00:00:00Z"
}
```

---

## 🔄 Flujos de Negocio Implementados

### ✅ Suscripción Monthly/Yearly
1. Usuario crea checkout → Lemon Squeezy
2. Paga → webhook `subscription_created`
3. Crea `guild_subscription` con `premium_enabled=true`
4. Bot consulta y activa premium

### ✅ Compra Lifetime
1. Usuario crea checkout → Lemon Squeezy
2. Paga → webhook `order_created`
3. Crea `guild_subscription` con `lifetime=true`, `renews_at=NULL`
4. Premium permanente

### ✅ Donación
1. Usuario dona → webhook `order_created`
2. Crea registro en `donations`
3. **NO** crea `guild_subscription`
4. **NO** activa premium

### ✅ Cancelación
1. Usuario cancela → webhook `subscription_cancelled`
2. Marca `cancel_at_period_end=true`
3. **NO** desactiva premium inmediatamente
4. Premium activo hasta `ends_at`

### ✅ Expiración
1. Periodo termina → webhook `subscription_expired`
2. Marca `premium_enabled=false`
3. Bot detecta y desactiva features

### ✅ Renovación
1. Lemon Squeezy cobra → webhook `subscription_payment_success`
2. Actualiza `renews_at` (+30 días o +365 días)
3. Premium continúa sin interrupción

### ✅ Pago Fallido
1. Cargo falla → webhook `subscription_payment_failed`
2. Marca `status=past_due`
3. **NO** desactiva premium (grace period)
4. Lemon Squeezy reintenta automáticamente

### ✅ Reembolso
1. Admin procesa refund → webhook `order_refunded`
2. Marca purchase como `refunded`
3. Si era lifetime → desactiva premium inmediatamente

---

## 🔐 Seguridad Implementada

### ✅ Validación de Firma de Webhook
```typescript
// HMAC SHA-256 verification
const isValid = await crypto.subtle.verify(
  'HMAC',
  key,
  signatureBytes,
  dataBytes
);
```

### ✅ Idempotencia
- SHA-256 hash del payload completo
- Unique constraint en `webhook_events.event_hash`
- Check antes de procesar
- Retorna 200 si ya procesado

### ✅ Row Level Security (RLS)
- Users: solo ven sus propios datos
- Service role: acceso completo
- Policies en todas las tablas

### ✅ API Key para Bot
- Generada con crypto.randomBytes(32)
- Validada en cada request
- Compartida entre Supabase y Bot

### ✅ Validaciones
- Discord user ID format
- Guild ID format
- Plan key whitelist
- Guild ownership check
- Premium duplicate check

---

## 📋 Variables de Entorno Necesarias

### Supabase Edge Functions
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...

DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=https://your-project.supabase.co/auth/v1/callback

LEMON_SQUEEZY_API_KEY=lemon_...
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_...
LEMON_SQUEEZY_VARIANT_PRO_MONTHLY=123456
LEMON_SQUEEZY_VARIANT_PRO_YEARLY=123457
LEMON_SQUEEZY_VARIANT_LIFETIME=123458
LEMON_SQUEEZY_VARIANT_DONATE=123459
LEMON_SQUEEZY_TEST_MODE=false

BOT_API_KEY=<32+ chars random>
```

### Bot (.env)
```bash
SUPABASE_URL=https://your-project.supabase.co
BOT_API_KEY=<same as above>
```

---

## 🚀 Deployment

### 1. Configurar Discord OAuth en Supabase
```
Dashboard → Authentication → Providers → Discord
- Client ID
- Client Secret
- Redirect URL
```

### 2. Ejecutar Migraciones
```bash
cd ton618-web
supabase db push
```

### 3. Configurar Variables de Entorno
```
Dashboard → Project Settings → Edge Functions
Agregar todas las variables listadas arriba
```

### 4. Deploy Edge Functions
```bash
supabase functions deploy billing-webhook
supabase functions deploy billing-create-checkout
supabase functions deploy billing-get-guilds
supabase functions deploy billing-guild-status
```

### 5. Configurar Webhook en Lemon Squeezy
```
URL: https://your-project.supabase.co/functions/v1/billing-webhook
Events: Todos los 11 eventos listados
Copiar Signing Secret → LEMON_SQUEEZY_WEBHOOK_SECRET
```

---

## 🧪 Testing

### Test Mode
```bash
# Configurar
LEMON_SQUEEZY_TEST_MODE=true

# Tarjeta de prueba
4242 4242 4242 4242
```

### Verificar Deployment
```bash
# Test webhook (debe retornar 401)
curl -X POST https://your-project.supabase.co/functions/v1/billing-webhook \
  -H "X-Signature: test" -d '{}'

# Test guild status
curl https://your-project.supabase.co/functions/v1/billing-guild-status/123 \
  -H "X-Bot-Api-Key: your_key"
```

### Ver Logs
```bash
supabase functions logs billing-webhook --tail
```

---

## 📝 Uso en el Bot

### Verificar Premium
```javascript
const axios = require('axios');

async function checkGuildPremium(guildId) {
  const response = await axios.get(
    `${process.env.SUPABASE_URL}/functions/v1/billing-guild-status/${guildId}`,
    { headers: { 'X-Bot-Api-Key': process.env.BOT_API_KEY } }
  );
  return response.data.has_premium;
}
```

### Middleware
```javascript
async function requirePremium(interaction) {
  const hasPremium = await checkGuildPremium(interaction.guildId);
  if (!hasPremium) {
    await interaction.reply({
      content: '❌ Premium required. Upgrade at https://ton618.app/pricing',
      ephemeral: true
    });
    return false;
  }
  return true;
}
```

---

## ✅ Checklist de Implementación

### Backend
- [x] Migración SQL con 5 tablas
- [x] Funciones de base de datos
- [x] Vistas para analytics
- [x] RLS policies
- [x] Discord OAuth utilities
- [x] Lemon Squeezy client
- [x] Webhook signature verification
- [x] Database abstraction layer
- [x] 4 Edge Functions completas
- [x] Error handling robusto
- [x] Logging comprehensivo

### Reglas de Negocio
- [x] pro_monthly/yearly activan premium
- [x] lifetime activa premium indefinidamente
- [x] donations NO activan premium
- [x] subscription_cancelled no apaga inmediatamente
- [x] subscription_expired sí apaga
- [x] payment_failed marca riesgo sin apagar
- [x] Idempotencia completa
- [x] Validación de firma
- [x] Guild ownership check

### Documentación
- [x] Arquitectura completa
- [x] Esquema de DB documentado
- [x] API endpoints con ejemplos
- [x] Flujos de negocio
- [x] Variables de entorno
- [x] Instrucciones de deployment
- [x] Testing guide
- [x] Ejemplos de uso

---

## 🎯 Características Clave

✅ **Serverless** - Auto-scaling, sin servidores  
✅ **Seguro** - Firma HMAC, RLS, API keys  
✅ **Idempotente** - SHA-256 hash + unique constraints  
✅ **Modular** - Código limpio y reutilizable  
✅ **Mantenible** - TypeScript, bien documentado  
✅ **Testeable** - Test mode, logs, ejemplos  
✅ **Production-ready** - Error handling, validaciones  

---

## 📊 Estadísticas de Implementación

- **Líneas de código:** ~3,500+
- **Archivos creados:** 12
- **Tablas SQL:** 5
- **Edge Functions:** 4
- **Event handlers:** 11
- **Utilidades compartidas:** 4
- **Tiempo estimado de setup:** 2-3 horas
- **Costo operacional:** ~$0 (Supabase free tier)

---

## 🔗 Archivos de Referencia

1. **Migración:** `supabase/migrations/20260406200000_create_billing_system.sql`
2. **Webhook Handler:** `supabase/functions/billing-webhook/index.ts`
3. **Checkout:** `supabase/functions/billing-create-checkout/index.ts`
4. **Get Guilds:** `supabase/functions/billing-get-guilds/index.ts`
5. **Guild Status:** `supabase/functions/billing-guild-status/index.ts`
6. **Discord Utils:** `supabase/functions/_shared/discord.ts`
7. **Lemon Utils:** `supabase/functions/_shared/lemon.ts`
8. **Database:** `supabase/functions/_shared/database.ts`
9. **Utils:** `supabase/functions/_shared/utils.ts`
10. **Documentación:** `docs/BILLING_BACKEND_COMPLETE.md`
11. **Env Example:** `.env.billing.example`

---

## 🎓 Supuestos Realizados

1. **Discord OAuth ya configurado** en Supabase Auth
2. **Lemon Squeezy account** ya creado
3. **Productos y variants** se crearán en Lemon Squeezy
4. **Frontend React** ya existe y puede hacer fetch a Edge Functions
5. **Bot Node.js** puede hacer HTTP requests a Supabase

---

## 🚦 Próximos Pasos

1. **Configurar Discord OAuth** en Supabase Dashboard
2. **Crear productos** en Lemon Squeezy (4 variants)
3. **Ejecutar migraciones:** `supabase db push`
4. **Configurar variables** de entorno en Supabase
5. **Deploy Edge Functions:** `supabase functions deploy`
6. **Configurar webhook** en Lemon Squeezy
7. **Generar BOT_API_KEY** y configurar en bot
8. **Probar en test mode** con tarjeta de prueba
9. **Implementar frontend** (checkout flow)
10. **Implementar bot** (premium checks)

---

## 📞 Soporte

Para debugging:
1. Ver logs: `supabase functions logs <function-name> --tail`
2. Verificar webhook events en tabla `webhook_events`
3. Revisar `processed = false` para errores
4. Consultar `BILLING_BACKEND_COMPLETE.md` para detalles

---

**Sistema completamente implementado y listo para configuración.**

*Implementado el 2026-04-06 por Cascade AI*
