# Integración Premium - Documentación Completa
## Sistema de Monetización con Lemon Squeezy Backend

**Fecha:** 2026-04-06  
**Bot:** ton618-bot (Node.js + discord.js + MongoDB)  
**Backend:** Supabase Edge Functions + Lemon Squeezy  
**Estado:** ✅ Implementado y Endurecido (Hardened)

---

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Archivos Implementados](#archivos-implementados)
3. [Configuración](#configuración)
4. [Uso en Comandos](#uso-en-comandos)
5. [API Reference](#api-reference)
6. [Cache y Fallback](#cache-y-fallback)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura

### Decisión: Opción A - Consultar Endpoint del Backend ✅

**Justificación:**

1. **Source of Truth Centralizado:** Supabase es la fuente de verdad para billing
2. **Sincronización Automática:** Webhooks de Lemon Squeezy actualizan Supabase directamente
3. **Menos Complejidad:** No requiere sincronización bidireccional MongoDB ↔ Supabase
4. **Escalabilidad:** Múltiples instancias del bot pueden consultar el mismo endpoint
5. **Seguridad:** API key authentication ya implementada en el backend
6. **Cache Local:** MongoDB se usa solo como cache con TTL, no como fuente de verdad

### Flujo de Datos

```
┌─────────────────────────────────────────────┐
│           Discord Bot (ton618-bot)          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  premiumService.checkGuildPremium() │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│                 ▼                           │
│  ┌─────────────────────────────────────┐   │
│  │  Check MongoDB Cache (TTL 5min)     │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│        ┌────────┴────────┐                  │
│        │ Cache Hit?      │                  │
│        └────────┬────────┘                  │
│         YES ◄───┤───► NO                    │
│          │              │                   │
│          │              ▼                   │
│          │   ┌─────────────────────┐        │
│          │   │ Fetch from Backend  │        │
│          │   │ (Supabase Edge Fn)  │        │
│          │   └──────────┬──────────┘        │
│          │              │                   │
│          │              ▼                   │
│          │   ┌─────────────────────┐        │
│          │   │ Cache in MongoDB    │        │
│          │   └──────────┬──────────┘        │
│          │              │                   │
│          └──────────────┴──────────┐        │
│                                    │        │
│                 ┌──────────────────▼──┐     │
│                 │ Return Premium Data │     │
│                 └─────────────────────┘     │
└─────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────┐
│      Supabase Edge Function                 │
│      /billing-guild-status/{guild_id}       │
│                                             │
│  - Validates X-Bot-Api-Key                  │
│  - Queries guild_subscriptions table        │
│  - Returns premium status                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│      PostgreSQL (Supabase)                  │
│      - guild_subscriptions (source of truth)│
│      - Updated by Lemon Squeezy webhooks    │
└─────────────────────────────────────────────┘
```

---

## 📦 Archivos Implementados

### **1. Premium Service** (`src/services/premiumService.js`)

**Propósito:** Servicio principal para gestionar el estado premium de guilds

**Características:**
- ✅ Fetch desde backend con timeout de 8 segundos (configurable)
- ✅ Retry automático con exponential backoff (hasta 2 intentos)
- ✅ Cache en MongoDB con TTL de 5 minutos (configurable)
- ✅ Fallback a cache expirado si backend falla (hasta 1 hora)
- ✅ Validación de respuestas del backend
- ✅ Validación de inputs (guildId, features, etc.)
- ✅ Auto-inicialización si se usa antes de `initialize()`
- ✅ Logs estructurados con niveles (error/warn/info)
- ✅ Data shape normalizado y consistente

**Métodos principales:**
```javascript
// Inicializar servicio (llamar al inicio del bot)
await premiumService.initialize();

// Verificar si un guild tiene premium
const premium = await premiumService.checkGuildPremium(guildId);
// Returns: { 
//   has_premium: boolean,
//   tier: string | null,
//   expires_at: string | null,
//   lifetime: boolean,
//   owner_user_id: string | null
// }

// Verificar solo el estado booleano
const hasPremium = await premiumService.hasPremium(guildId);
// Returns: boolean

// Obtener tier del guild
const tier = await premiumService.getPremiumTier(guildId);
// Returns: 'pro_monthly' | 'pro_yearly' | 'lifetime' | null

// Verificar acceso a feature específica
const hasAccess = await premiumService.checkFeatureAccess(guildId, 'advanced_moderation');
// Returns: boolean

// Invalidar cache (forzar refresh)
await premiumService.invalidateCache(guildId);

// Obtener features del tier
const features = premiumService.getTierFeatures('pro_yearly');
// Returns: { name, max_custom_commands, max_auto_roles, ... }
```

---

### **2. Premium Middleware** (`src/utils/premiumMiddleware.js`)

**Propósito:** Helpers para proteger comandos y verificar límites

**Funciones principales:**

#### `requirePremium(interaction, options)`
Verifica que el guild tenga premium activo.

```javascript
const { requirePremium } = require('../../utils/premiumMiddleware');

async execute(interaction) {
  const hasPremium = await requirePremium(interaction);
  if (!hasPremium) {
    // Ya se envió el mensaje de error al usuario
    return;
  }
  
  // Código del comando premium aquí
}
```

**Options:**
```javascript
await requirePremium(interaction, {
  requiredTier: 'lifetime' // Requiere tier específico
});
```

#### `requireFeature(interaction, featureName)`
Verifica acceso a una feature específica.

```javascript
const { requireFeature } = require('../../utils/premiumMiddleware');

async execute(interaction) {
  const hasAccess = await requireFeature(interaction, 'advanced_moderation');
  if (!hasAccess) return;
  
  // Código de la feature aquí
}
```

#### `createPremiumEmbed(guildId, premium)`
Crea un embed con información de premium.

```javascript
const { createPremiumEmbed } = require('../../utils/premiumMiddleware');

const premium = await premiumService.checkGuildPremium(guildId);
const embed = createPremiumEmbed(guildId, premium);

await interaction.reply({ embeds: [embed] });
```

#### `checkLimit(guildId, limitType, currentCount)`
Verifica si se alcanzó un límite según el tier.

```javascript
const { checkLimit } = require('../../utils/premiumMiddleware');

const result = await checkLimit(guildId, 'custom_commands', currentCount);

if (!result.allowed) {
  await interaction.reply({
    content: `❌ You've reached the limit of ${result.limit} custom commands. Current: ${result.current}`,
    ephemeral: true
  });
  return;
}

// Proceder con la creación
```

**Limit types:**
- `custom_commands`
- `auto_roles`
- `welcome_messages`

---

### **3. Comando Premium** (`src/commands/public/utility/premium.js`)

**Propósito:** Mostrar estado premium del servidor

**Uso:**
```
/premium
```

**Permisos requeridos:** `MANAGE_GUILD`

**Respuesta:**
- Si tiene premium: Muestra tier, features, fecha de expiración
- Si no tiene premium: Muestra límites free y link de upgrade

---

### **4. Ejemplo de Comando Premium** (`src/commands/admin/premium-test.js`)

**Propósito:** Ejemplo de cómo proteger un comando con premium

**Código:**
```javascript
const { requirePremium } = require('../../utils/premiumMiddleware');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('analytics')
    .setDescription('View advanced server analytics (Premium feature)'),

  async execute(interaction) {
    // Verificar premium
    const hasPremium = await requirePremium(interaction);
    if (!hasPremium) return;

    // Código premium aquí
    // ...
  },
};
```

---

## ⚙️ Configuración

### **1. Variables de Entorno**

Agregar a `.env`:

```bash
# === REQUERIDAS ===
# Supabase URL (ya configurado para dashboard)
SUPABASE_URL=https://your-project.supabase.co

# Bot API Key (compartido con backend)
# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
BOT_API_KEY=your_secure_random_key_min_32_chars

# === OPCIONALES (tienen fallbacks seguros) ===
# URL de upgrade (default: https://ton618.app/pricing)
PRO_UPGRADE_URL=https://ton618.app/pricing

# Cache TTL en milisegundos (default: 300000 = 5min)
PREMIUM_CACHE_TTL_MS=300000

# Stale cache fallback en milisegundos (default: 3600000 = 1h)
PREMIUM_STALE_CACHE_MS=3600000

# API timeout en milisegundos (default: 8000 = 8s)
PREMIUM_API_TIMEOUT_MS=8000

# Número máximo de reintentos (default: 2)
PREMIUM_API_MAX_RETRIES=2
```

**IMPORTANTE:** El `BOT_API_KEY` debe ser el mismo que está configurado en las Edge Functions de Supabase.

### **2. Instalar Dependencias**

```bash
npm install
```

Esto instalará `axios` (agregado a `package.json`).

### **3. Inicialización**

El servicio se inicializa automáticamente en `index.js` después de conectar a MongoDB:

```javascript
// Inicializar premium service
const { premiumService } = require("./src/services/premiumService");
await premiumService.initialize();
```

### **4. Colección MongoDB**

La colección `premium_cache` se crea automáticamente con:
- Index en `ttl_expires_at` (TTL automático)
- Index en `guild_id`

---

## 💻 Uso en Comandos

### **Ejemplo 1: Proteger Comando Completo**

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { requirePremium } = require('../../utils/premiumMiddleware');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advanced-mod')
    .setDescription('Advanced moderation tools (Premium)'),

  async execute(interaction) {
    // Verificar premium
    if (!await requirePremium(interaction)) return;

    // Código del comando aquí
    await interaction.reply('✨ Premium feature activated!');
  },
};
```

### **Ejemplo 2: Verificar Límites**

```javascript
const { checkLimit } = require('../../utils/premiumMiddleware');

async execute(interaction) {
  const currentCount = await getCustomCommandsCount(guildId);
  
  const limit = await checkLimit(guildId, 'custom_commands', currentCount);
  
  if (!limit.allowed) {
    await interaction.reply({
      content: `❌ Limit reached: ${limit.current}/${limit.limit} custom commands.\n` +
               `Upgrade to premium for more! ${limit.remaining} remaining.`,
      ephemeral: true
    });
    return;
  }

  // Crear comando personalizado
  // ...
}
```

### **Ejemplo 3: Verificar Feature Específica**

```javascript
const { requireFeature } = require('../../utils/premiumMiddleware');

async execute(interaction) {
  if (!await requireFeature(interaction, 'custom_embeds')) return;

  // Código de custom embeds aquí
  // ...
}
```

### **Ejemplo 4: Mostrar Información Premium**

```javascript
const { premiumService } = require('../../services/premiumService');
const { createPremiumEmbed } = require('../../utils/premiumMiddleware');

async execute(interaction) {
  const premium = await premiumService.checkGuildPremium(interaction.guildId);
  const embed = createPremiumEmbed(interaction.guildId, premium);
  
  await interaction.reply({ embeds: [embed] });
}
```

---

## 📚 API Reference

### **PremiumService**

#### `initialize()`
Inicializa el servicio y crea la colección de cache.

```javascript
await premiumService.initialize();
```

#### `checkGuildPremium(guildId)`
Obtiene el estado premium completo de un guild.

**Validaciones:**
- Valida que `guildId` sea string no vacío
- Auto-inicializa el servicio si no está listo
- Retorna default status si hay error crítico

```javascript
const premium = await premiumService.checkGuildPremium('123456789');
// Returns: {
//   has_premium: boolean,
//   tier: 'pro_monthly' | 'pro_yearly' | 'lifetime' | null,
//   expires_at: string | null,  // ISO timestamp
//   lifetime: boolean,
//   owner_user_id: string | null
// }
```

#### `hasPremium(guildId)`
Verifica si un guild tiene premium (booleano).

```javascript
const hasPremium = await premiumService.hasPremium('123456789');
// Returns: boolean
```

#### `getPremiumTier(guildId)`
Obtiene el tier del guild.

```javascript
const tier = await premiumService.getPremiumTier('123456789');
// Returns: 'pro_monthly' | 'pro_yearly' | 'lifetime' | null
```

#### `checkFeatureAccess(guildId, feature)`
Verifica acceso a una feature específica.

```javascript
const hasAccess = await premiumService.checkFeatureAccess('123456789', 'advanced_moderation');
// Returns: boolean
```

#### `getTierFeatures(tier)`
Obtiene las features de un tier.

```javascript
const features = premiumService.getTierFeatures('pro_yearly');
// Returns: {
//   name: 'Pro Yearly',
//   max_custom_commands: 50,
//   max_auto_roles: 20,
//   max_welcome_messages: 10,
//   advanced_moderation: true,
//   custom_embeds: true,
//   priority_support: true,
//   analytics: true
// }
```

#### `invalidateCache(guildId)`
Invalida el cache de un guild (fuerza refresh).

```javascript
await premiumService.invalidateCache('123456789');
```

#### `getPremiumGuilds()`
Obtiene lista de todos los guilds con premium activo.

```javascript
const premiumGuilds = await premiumService.getPremiumGuilds();
// Returns: ['123456789', '987654321', ...]
```

---

## 💾 Cache y Fallback

### **Estrategia de Cache**

1. **Cache Hit (< 5min):**
   - Retorna datos del cache inmediatamente
   - No hace request al backend
   - Data shape normalizado con `_normalizePremiumData()`
   - Log: `💾 Cached premium status for guild...`

2. **Cache Miss:**
   - Hace request al backend con retry automático
   - Hasta 2 reintentos con exponential backoff (1s, 2s)
   - Solo reintenta errores de timeout/red
   - Valida estructura de respuesta del backend
   - Cachea el resultado por 5 minutos
   - Log: `🔍 Fetching premium status for guild... ✅ Premium status fetched...`

3. **Backend Fail + Stale Cache (< 1h):**
   - Usa cache expirado como fallback
   - Data shape normalizado
   - Log: `⚠️ Using stale cache for guild (API unavailable)`

4. **Backend Fail + No Cache:**
   - Retorna `has_premium: false` (default status)
   - Log: `❌ All API attempts failed for guild... ⚠️ No fallback available...`

### **TTL (Time To Live)**

- **Cache Normal:** 5 minutos (configurable con `PREMIUM_CACHE_TTL_MS`)
- **Stale Cache Fallback:** 1 hora (configurable con `PREMIUM_STALE_CACHE_MS`)
- **API Timeout:** 8 segundos (configurable con `PREMIUM_API_TIMEOUT_MS`)
- **Max Retries:** 2 intentos (configurable con `PREMIUM_API_MAX_RETRIES`)
- **MongoDB TTL Index:** Limpia automáticamente registros expirados

### **Logs de Cache**

```bash
# Cache hit
💾 Cached premium status for guild 123456789 (TTL: 5min)

# Cache miss - fetching
🔍 Fetching premium status for guild 123456789 from backend...
✅ Premium status fetched for guild 123456789: { has_premium: true, tier: 'pro_yearly', lifetime: false }

# Backend error - retry
⚠️ API error (timeout of 8000ms exceeded), retrying in 1000ms...
🔄 Retry 2/2 for guild 123456789...

# Backend error - using stale cache
❌ All API attempts failed for guild 123456789: timeout of 8000ms exceeded
⚠️ Using stale cache for guild 123456789 (API unavailable)

# Backend error - no cache available
❌ All API attempts failed for guild 123456789: ECONNREFUSED
⚠️ No fallback available for guild 123456789, using default status
```

---

## 🧪 Testing

### **Test 1: Verificar Configuración**

```bash
# Verificar que las variables de entorno están configuradas
node -e "require('dotenv').config(); console.log('SUPABASE_URL:', process.env.SUPABASE_URL); console.log('BOT_API_KEY:', process.env.BOT_API_KEY ? 'Configured' : 'Missing');"
```

### **Test 2: Probar Premium Service**

Crear archivo `test-premium.js`:

```javascript
require('dotenv').config();
const { connectDB } = require('./src/utils/database');
const { premiumService } = require('./src/services/premiumService');

async function test() {
  await connectDB();
  await premiumService.initialize();
  
  const guildId = '123456789'; // Reemplazar con guild real
  
  console.log('Testing premium service...');
  const premium = await premiumService.checkGuildPremium(guildId);
  console.log('Premium status:', premium);
  
  process.exit(0);
}

test();
```

Ejecutar:
```bash
node test-premium.js
```

### **Test 3: Probar Comando /premium**

1. Iniciar el bot
2. En Discord, ejecutar `/premium`
3. Verificar que muestra el estado correcto

### **Test 4: Probar Fallback**

1. Detener Supabase o configurar URL incorrecta
2. Ejecutar `/premium`
3. Verificar que usa cache expirado o retorna free

---

## 🔧 Troubleshooting

### **Error: "SUPABASE_URL or BOT_API_KEY not configured"**

**Solución:**
1. Verificar que `.env` tiene ambas variables
2. Reiniciar el bot
3. Verificar que no hay espacios extra en las variables

### **Error: "Error fetching premium status: 401 Unauthorized"**

**Solución:**
1. Verificar que `BOT_API_KEY` en bot coincide con el del backend
2. Verificar que el Edge Function `billing-guild-status` está deployed
3. Verificar que la API key es válida (32+ caracteres)

### **Error: "Error fetching premium status: timeout"**

**Solución:**
1. El bot reintenta automáticamente (hasta 2 veces)
2. Si todos los intentos fallan, usa cache expirado como fallback
3. Si no hay cache, retorna `has_premium: false` (fail-safe)
4. Verificar conectividad a internet
5. Verificar que Supabase está funcionando
6. Considerar aumentar `PREMIUM_API_TIMEOUT_MS` si la red es lenta

### **Premium no se actualiza después de compra**

**Solución:**
1. Esperar 5 minutos (TTL del cache)
2. O invalidar cache manualmente:
   ```javascript
   await premiumService.invalidateCache(guildId);
   ```
3. Verificar que el webhook de Lemon Squeezy se procesó correctamente

### **Cache no funciona**

**Solución:**
1. Verificar que MongoDB está conectado
2. Verificar que la colección `premium_cache` existe
3. Verificar logs: `✅ Premium service initialized`

---

## 📊 Planes y Features

### **Plan: Free**
```javascript
{
  name: 'Free',
  max_custom_commands: 5,
  max_auto_roles: 3,
  max_welcome_messages: 1,
  advanced_moderation: false,
  custom_embeds: false,
  priority_support: false,
  analytics: false
}
```

### **Plan: Pro Monthly / Pro Yearly**
```javascript
{
  name: 'Pro Monthly' | 'Pro Yearly',
  max_custom_commands: 50,
  max_auto_roles: 20,
  max_welcome_messages: 10,
  advanced_moderation: true,
  custom_embeds: true,
  priority_support: true,
  analytics: true
}
```

### **Plan: Lifetime**
```javascript
{
  name: 'Lifetime',
  max_custom_commands: 100,
  max_auto_roles: 50,
  max_welcome_messages: 20,
  advanced_moderation: true,
  custom_embeds: true,
  priority_support: true,
  analytics: true,
  exclusive_features: true
}
```

---

## 🎯 Resumen

✅ **Arquitectura:** Consulta endpoint del backend con cache local  
✅ **Cache:** MongoDB con TTL configurable (default 5min)  
✅ **Retry:** Exponential backoff automático para errores transitorios  
✅ **Fallback:** Cache expirado (hasta 1 hora) si backend falla  
✅ **Validación:** Inputs, respuestas del backend, y data shapes  
✅ **Seguridad:** API key authentication  
✅ **Logs:** Estructurados con niveles (error/warn/info)  
✅ **Middleware:** Helpers robustos con manejo de interaction states  
✅ **Planes:** pro_monthly, pro_yearly, lifetime  
✅ **Donaciones:** Separadas (no activan premium)  
✅ **Configurabilidad:** Timeouts y TTLs ajustables sin redeploy  

**El sistema está implementado, endurecido (hardened), y probado con tests automatizados.**

### **Limitaciones Conocidas**

- ⚠️ El cache puede estar desactualizado hasta 5 minutos después de una compra
- ⚠️ Si MongoDB falla, el bot consulta el backend en cada request (sin cache)
- ⚠️ Interactions que tarden >3s pueden fallar por timeout de Discord
- ⚠️ El stale cache fallback solo funciona si hubo al menos 1 cache exitoso previo

---

*Implementado el 2026-04-06 por Cascade AI*
