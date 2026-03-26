# 📋 Configuración de Categorías desde Discord

## ✅ NUEVO: Configuración 100% desde Discord

Ahora puedes configurar **todas las propiedades** de las categorías de tickets directamente desde Discord, sin necesidad de editar código.

---

## 🎯 Comandos Disponibles

### 1. Crear Categoría

```
/config category add
  id: soporte_tecnico
  label: Soporte Técnico
  description: Problemas técnicos del servidor
  emoji: 🔧
  priority: high
  discord_category: 1234567890123456789
  ping_roles: 987654321098765432,123456789012345678
  welcome_message: ¡Hola {user}! Un técnico te atenderá pronto.
```

**Parámetros:**
- `id` *(requerido)*: ID único sin espacios (ej: `soporte_tecnico`)
- `label` *(requerido)*: Nombre visible (ej: "Soporte Técnico")
- `description` *(requerido)*: Descripción breve
- `emoji` *(opcional)*: Emoji para el botón (ej: 🔧)
- `priority` *(opcional)*: `low`, `normal`, `high`, `urgent`
- `discord_category` *(opcional)*: ID de categoría Discord donde crear canales
- `ping_roles` *(opcional)*: IDs de roles separados por comas
- `welcome_message` *(opcional)*: Mensaje personalizado (usa `{user}` para mencionar)

---

### 2. Ver Categorías

```
/config category list
```

Muestra todas las categorías configuradas con sus propiedades.

---

### 3. Editar Categoría

```
/config category edit
  id: soporte_tecnico
  label: Nuevo Nombre
  discord_category: 9876543210987654321
  ping_roles: 111222333444555666
  welcome_message: Mensaje actualizado para {user}
```

**Nota:** Solo especifica los campos que quieres cambiar. Dejar un campo vacío lo eliminará.

---

### 4. Activar/Desactivar Categoría

```
/config category toggle
  id: soporte_tecnico
```

Desactiva temporalmente una categoría sin eliminarla.

---

### 5. Eliminar Categoría

```
/config category remove
  id: soporte_tecnico
```

⚠️ Los tickets existentes no se verán afectados.

---

## 📂 Configurar Categoría de Discord

### Paso 1: Crear categoría en Discord

1. Click derecho en el servidor → **Crear Categoría**
2. Nombra la categoría (ej: "📋 TICKETS SOPORTE")

### Paso 2: Obtener el ID

1. Activa **Modo Desarrollador**:
   - Configuración de Usuario → Avanzado → Modo Desarrollador ✅
2. Click derecho en la categoría → **Copiar ID**

### Paso 3: Configurar en el bot

```
/config category edit
  id: soporte_tecnico
  discord_category: 1234567890123456789
```

✅ Los nuevos tickets se crearán dentro de esa categoría de Discord.

---

## 🔔 Configurar Roles a Mencionar

### Obtener IDs de roles

1. Escribe `\@NombreDelRol` en Discord
2. Copia el número que aparece (ej: `<@&987654321098765432>`)
3. Usa solo el número: `987654321098765432`

### Configurar múltiples roles

```
/config category edit
  id: soporte_tecnico
  ping_roles: 987654321098765432,123456789012345678,555666777888999000
```

Separa los IDs con comas (máximo 5 roles).

---

## 💬 Mensaje de Bienvenida Personalizado

### Usar variable {user}

```
/config category edit
  id: soporte_tecnico
  welcome_message: ¡Hola {user}! 👋

Gracias por abrir un ticket de **Soporte Técnico**.
Un miembro del equipo te atenderá en breve.

Por favor, describe tu problema con detalle.
```

La variable `{user}` se reemplazará automáticamente con la mención del usuario.

---

## 📊 Ejemplo Completo

### Crear categoría de Soporte Técnico

```
/config category add
  id: soporte_tecnico
  label: Soporte Técnico
  description: Problemas técnicos del servidor
  emoji: 🔧
  priority: high
  discord_category: 1234567890123456789
  ping_roles: 987654321098765432
  welcome_message: ¡Hola {user}! Un técnico te atenderá pronto. Describe tu problema con detalle.
```

### Resultado

Cuando un usuario abra un ticket:
1. ✅ Canal creado en la categoría Discord `1234567890123456789`
2. ✅ Rol `987654321098765432` mencionado automáticamente
3. ✅ Mensaje personalizado mostrado al usuario
4. ✅ Prioridad configurada como "Alta"

---

## ⚙️ Migración desde config.js

Si ya tienes categorías en `config.js`, puedes:

1. **Crear las mismas categorías desde Discord** con `/config category add`
2. **El bot priorizará** las categorías de la base de datos sobre `config.js`
3. **Opcional:** Eliminar las categorías de `config.js` una vez migradas

---

## ❓ Preguntas Frecuentes

### ¿Puedo tener categorías sin categoría de Discord?

Sí. Deja `discord_category` vacío y los canales se crearán flotando.

### ¿Cuántas categorías puedo crear?

Máximo **25 categorías** por servidor.

### ¿Puedo usar la misma categoría Discord para múltiples tipos de tickets?

Sí. Puedes configurar el mismo `discord_category` en varias categorías.

### ¿Los tickets existentes se mueven automáticamente?

No. Solo los **nuevos tickets** usarán la configuración actualizada.

### ¿Puedo editar el mensaje de bienvenida después?

Sí. Usa `/config category edit` y especifica el nuevo `welcome_message`.

---

## 🚀 Ventajas

✅ **Sin acceso al código**: Administradores pueden configurar todo desde Discord  
✅ **Cambios inmediatos**: No requiere reiniciar el bot  
✅ **Flexible**: Cada categoría puede tener configuración única  
✅ **Organizado**: Canales agrupados en categorías de Discord  
✅ **Personalizable**: Mensajes y menciones específicas por categoría

---

## 📞 Soporte

Si tienes problemas configurando categorías, usa `/config category list` para verificar la configuración actual.
