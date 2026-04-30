# 🔍 AUDITORÍA DEFINITIVA i18n - TON618 Bot

**Fecha:** 30 de marzo de 2026  
**Repositorio:** ton618-bot  
**Alcance:** Sistema completo de internacionalización

---

## 📊 RESUMEN EJECUTIVO

### Estadísticas Globales
- **Claves en `en.js`:** 1,331
- **Claves en `es.js`:** 1,331
- **Claves referenciadas en código:** 1,917
- **Claves faltantes TOTAL:** 711

### Desglose por Prioridad
| Prioridad | Descripción | Cantidad | Estado |
|-----------|-------------|----------|--------|
| **P0** | Rompe UI de slash commands (Discord) | **15** | 🔴 CRÍTICO |
| **P1** | Rompe runtime visible al usuario | **4** | 🟠 URGENTE |
| **P2** | Limpieza menor / interno | 692 | 🟡 Menor |

---

## 🔴 P0 - CRÍTICO (15 claves)
### Estas claves rompen la UI de Discord ahora mismo

### 1. `/config` command - 4 claves
```
config.slash.description
config.slash.subcommands.status.description
config.slash.subcommands.tickets.description
config.slash.subcommands.center.description
```
**Archivo:** `src/commands/admin/config/config.js`  
**Impacto:** El comando `/config` muestra keys literales en Discord

---

### 2. `/staff` command - 11 claves
```
staff.slash.description
staff.slash.subcommands.away_on.description
staff.slash.options.reason
staff.slash.subcommands.away_off.description
staff.slash.subcommands.my_tickets.description
staff.slash.subcommands.warn_add.description
staff.slash.options.user
staff.slash.options.warn_reason
staff.slash.subcommands.warn_check.description
staff.slash.subcommands.warn_remove.description
staff.slash.options.warning_id
```
**Archivo:** `src/commands/staff/moderation/staff.js`  
**Impacto:** El comando `/staff` muestra keys literales en Discord

---

## 🟠 P1 - URGENTE (4 claves)
### Estas claves rompen runtime visible al usuario

### 1. Botones de verificación - 2 claves
```
common.buttons.enter_code
common.buttons.resend_code
```
**Archivo:** `src/handlers/verifHandler.js`  
**Impacto:** Botones del panel de verificación muestran keys literales

---

### 2. Botones de onboarding - 2 claves
```
common.buttons.english
common.buttons.spanish
```
**Archivo:** `src/utils/guildOnboarding.js`  
**Impacto:** Botones de selección de idioma muestran keys literales

---

## 🟡 P2 - MENOR (692 claves)
### Claves internas, helpers, o menos visibles

### Categorías principales afectadas:

#### `/config category` - 19 claves
```
config.category.group_description
config.category.add_description
config.category.option_id
config.category.option_discord_category
config.category.remove_description
config.category.option_id_remove
config.category.list_description
config.category.edit_description
config.category.option_id_edit
config.category.option_label
config.category.option_description
config.category.option_emoji
config.category.option_priority
config.category.option_discord_category_edit
config.category.option_ping_roles
config.category.option_welcome_message
config.category.toggle_description
config.category.option_id_toggle
```
**Archivo:** `src/commands/admin/config/category.js`

---

#### Config Center - ~300 claves
Todas las claves del centro de configuración interactivo:
- `center.general.*` - Panel general
- `center.roles.*` - Gestión de roles
- `center.verify.*` - Verificación
- `center.verify_advanced.*` - Verificación avanzada
- `center.modlogs.*` - Logs de moderación
- `center.system.*` - Sistema
- `center.autoresponses.*` - Auto-respuestas
- `center.blacklist.*` - Lista negra
- `center.welcome.*` - Bienvenida
- `center.goodbye.*` - Despedida
- `center.suggestions.*` - Sugerencias

**Archivos:**
- `src/commands/admin/config/configCenter/actions.js`
- `src/commands/admin/config/configCenter/modals.js`
- `src/commands/admin/config/configCenter/sections.js`

---

#### `/setup automod` - ~30 claves
```
setup.automod.group_description
setup.automod.bootstrap_description
setup.automod.status_description
setup.automod.sync_description
setup.automod.disable_description
setup.automod.channel_alert_description
setup.automod.option_channel
setup.automod.option_clear
setup.automod.exempt_channel_description
setup.automod.option_action
setup.automod.option_target_channel
setup.automod.exempt_role_description
setup.automod.option_target_role
setup.automod.preset_description
setup.automod.option_preset_name
setup.automod.option_enabled
setup.automod.choice_add
setup.automod.choice_remove
setup.automod.choice_reset
setup.automod.preset_spam
setup.automod.preset_invites
setup.automod.preset_scam
setup.automod.preset_all
```
**Archivo:** `src/commands/admin/config/setup/automod.js`

---

#### `/setup general` - ~40 claves
```
setup.general.group_description
setup.general.info_description
setup.general.logs_description
setup.general.option_channel
setup.general.transcripts_description
setup.general.dashboard_description
setup.general.weekly_report_description
setup.general.live_members_description
setup.general.option_voice_channel
setup.general.live_role_description
setup.general.option_role_to_count
setup.general.staff_role_description
setup.general.option_role
setup.general.admin_role_description
setup.general.verify_role_description
setup.general.option_verify_role
setup.general.max_tickets_description
setup.general.option_count
setup.general.global_limit_description
setup.general.cooldown_description
setup.general.option_minutes
setup.general.min_days_description
setup.general.option_days
setup.general.auto_close_description
setup.general.sla_description
setup.general.smart_ping_description
setup.general.dm_open_description
setup.general.option_enabled
setup.general.dm_close_description
setup.general.log_edits_description
```
**Archivo:** `src/commands/admin/config/setup/general.js`

---

#### Tickets - ~150 claves
```
tickets.panel_status.*
tickets.incident.*
tickets.categories.*
tickets.labels.*
tickets.fields.*
tickets.footers.*
```
**Archivo:** `src/commands/admin/config/config.js`

---

#### Common utilities - ~50 claves
```
common.not_set
common.no_limit
common.all_categories
common.not_applicable
common.no_channel
common.default
common.disabled
common.enabled
common.yes
common.no
common.invalid_date
common.no_backups
common.no_recent_activity
common.on
common.off
common.no_reason
common.value.none
```
**Archivos:** Múltiples

---

## 📋 CLAVES FALTANTES COMPLETAS POR ARCHIVO

### `src/commands/admin/config/config.js`
**Total:** ~80 claves relacionadas con status de tickets, configuración y labels

### `src/commands/admin/config/category.js`
**Total:** 19 claves del grupo `/config category`

### `src/commands/admin/config/configCenter/*`
**Total:** ~300 claves del centro de configuración interactivo

### `src/commands/admin/config/setup/automod.js`
**Total:** ~30 claves de automod

### `src/commands/admin/config/setup/general.js`
**Total:** ~40 claves de setup general

### `src/commands/admin/config/setup/tickets.js`
**Total:** ~50 claves de setup tickets

### `src/commands/admin/config/setup/bienvenida.js`
**Total:** ~25 claves de bienvenida

### `src/commands/admin/config/setup/despedida.js`
**Total:** ~20 claves de despedida

### `src/commands/staff/moderation/staff.js`
**Total:** 11 claves P0 del comando `/staff`

### `src/handlers/verifHandler.js`
**Total:** 2 claves P1 de botones de verificación

### `src/utils/guildOnboarding.js`
**Total:** 2 claves P1 de botones de onboarding

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Fase 1 - INMEDIATA (P0)
1. ✅ Agregar las 15 claves P0 a `en.js` y `es.js`
2. ✅ Probar comandos `/config` y `/staff` en Discord
3. ✅ Verificar que las descripciones se muestren correctamente

### Fase 2 - URGENTE (P1)
1. ✅ Agregar las 4 claves P1 de botones
2. ✅ Probar panel de verificación
3. ✅ Probar onboarding de idioma

### Fase 3 - LIMPIEZA (P2)
1. ⚠️ Revisar si todas las 692 claves P2 son realmente necesarias
2. ⚠️ Agregar claves por módulo:
   - Config Center (~300)
   - Tickets (~150)
   - Setup modules (~100)
   - Common utilities (~50)
   - Resto (~92)

---

## 📝 NOTAS IMPORTANTES

### Claves duplicadas o mal formadas detectadas
- Algunas claves contienen caracteres extraños (ej: `\`, `)`, `0`)
- Posibles errores de parsing en regex - revisar manualmente

### Claves que probablemente NO deberían estar en i18n
- `pro`, `free`, `dnd`, `staff`, `setup`, `modal`, `code`, `kick`, etc.
- Estas parecen ser valores de configuración, no traducciones

### Archivos con más referencias faltantes
1. `configCenter/sections.js` - ~200 claves
2. `configCenter/actions.js` - ~100 claves
3. `config.js` - ~80 claves
4. `setup/general.js` - ~40 claves
5. `setup/automod.js` - ~30 claves

---

## ✅ VERIFICACIÓN FINAL

Para verificar que el problema reportado está resuelto:

```bash
# Probar en Discord:
/config status
/config tickets
/config center
/staff away-on
/staff my-tickets
```

**Resultado esperado:** Todas las descripciones deben mostrarse en texto legible, NO como `config.slash.description` o similar.

---

## 📊 ESTADÍSTICAS DE COBERTURA

| Categoría | Claves Existentes | Claves Referenciadas | Cobertura |
|-----------|-------------------|----------------------|-----------|
| **en.js** | 1,331 | 1,917 | 69.4% |
| **es.js** | 1,331 | 1,917 | 69.4% |

**Claves faltantes:** 586 únicas (711 total con duplicados/errores)

---

**Generado por:** Script de auditoría i18n  
**Comando:** `node i18n_audit.js`  
**Reporte completo:** `i18n_audit_report.txt`
