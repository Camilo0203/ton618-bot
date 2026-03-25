# 📋 Configuración de Categorías de Tickets

## ⚠️ Requisito Obligatorio

**El sistema de tickets requiere al menos una categoría configurada para funcionar.**

Si intentas crear un panel de tickets sin categorías configuradas, recibirás un error:

```
❌ No hay categorías configuradas

Debes configurar al menos una categoría de tickets en el archivo config.js 
antes de crear el panel.
```

---

## 📝 Cómo Configurar Categorías

Las categorías se configuran en el archivo `config.js` en la raíz del proyecto.

### Ejemplo Básico

```js
module.exports = {
  categories: [
    {
      id: "support",
      label: "Soporte General",
      description: "Ayuda con problemas generales",
      emoji: "🛠️",
      color: 0x5865F2,
      categoryId: null,
      pingRoles: [],
      welcomeMessage: "¡Hola {user}! 👋\n\nGracias por contactar con **Soporte General**.",
      questions: [
        "¿Cuál es tu problema?",
        "¿Desde cuándo ocurre?",
      ],
      priority: "normal",
    }
  ]
};
```

---

## 🔧 Propiedades de una Categoría

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | String | ✅ Sí | Identificador único de la categoría |
| `label` | String | ✅ Sí | Nombre visible de la categoría |
| `description` | String | ✅ Sí | Descripción breve de la categoría |
| `emoji` | String | ❌ No | Emoji que aparece en el menú |
| `color` | Number | ❌ No | Color del embed (formato hexadecimal) |
| `categoryId` | String | ❌ No | ID de categoría de Discord donde crear los canales |
| `pingRoles` | Array | ❌ No | IDs de roles a mencionar al abrir el ticket |
| `welcomeMessage` | String | ❌ No | Mensaje de bienvenida personalizado |
| `questions` | Array | ❌ No | Preguntas del formulario (máximo 5) |
| `priority` | String | ❌ No | Prioridad: `low`, `normal`, `high`, `urgent` |

---

## 📚 Ejemplos de Categorías

### Soporte Técnico

```js
{
  id: "tech_support",
  label: "Soporte Técnico",
  description: "Problemas técnicos con el servidor o bot",
  emoji: "🔧",
  color: 0x3498DB,
  priority: "high",
  questions: [
    "¿Qué problema técnico estás experimentando?",
    "¿Qué pasos has intentado para solucionarlo?",
    "¿Tienes capturas de pantalla del error?",
  ]
}
```

### Reportar Usuario

```js
{
  id: "report_user",
  label: "Reportar Usuario",
  description: "Reporta comportamientos inapropiados",
  emoji: "🚨",
  color: 0xE74C3C,
  priority: "urgent",
  pingRoles: ["123456789012345678"], // ID del rol de moderadores
  questions: [
    "¿Qué usuario deseas reportar? (ID o mención)",
    "¿Qué regla ha violado?",
    "¿Tienes evidencia? (capturas, enlaces, etc.)",
  ]
}
```

### Sugerencias

```js
{
  id: "suggestions",
  label: "Sugerencias",
  description: "Propuestas para mejorar el servidor",
  emoji: "💡",
  color: 0xF1C40F,
  priority: "low",
  questions: [
    "¿Cuál es tu sugerencia?",
    "¿Por qué crees que mejoraría el servidor?",
  ]
}
```

### Pagos y Facturación

```js
{
  id: "billing",
  label: "Pagos y Facturación",
  description: "Problemas con pagos o reembolsos",
  emoji: "💳",
  color: 0x2ECC71,
  priority: "high",
  welcomeMessage: "¡Hola {user}! 💳\n\n⚠️ **Nunca compartas datos bancarios completos.**",
  questions: [
    "¿Qué problema tienes con tu pago?",
    "¿Cuál es tu ID de transacción?",
    "¿Qué método de pago usaste?",
  ]
}
```

---

## 🎨 Colores Recomendados

```js
// Azul (Información)
color: 0x5865F2

// Verde (Éxito)
color: 0x57F287

// Amarillo (Advertencia)
color: 0xFEE75C

// Rojo (Urgente)
color: 0xED4245

// Morado (Premium)
color: 0x9B59B6

// Naranja (Moderación)
color: 0xE67E22
```

---

## ✅ Validaciones del Sistema

El sistema validará automáticamente:

1. **Al crear el panel de tickets:**
   - Debe haber al menos 1 categoría configurada
   - Cada categoría debe tener `id`, `label` y `description`

2. **Al abrir un ticket:**
   - La categoría seleccionada debe existir
   - La categoría debe estar activa (no bloqueada por modo incidente)

3. **Límites:**
   - Máximo 25 categorías por servidor
   - Máximo 5 preguntas por categoría
   - Máximo 100 caracteres por `id`, `label` y `description`

---

## 🚀 Aplicar Cambios

Después de modificar las categorías en `config.js`:

1. **Reinicia el bot** para cargar la nueva configuración
2. **Actualiza el panel** usando `/config setup panel`
3. **Verifica** que las categorías aparezcan correctamente

---

## ❌ Errores Comunes

### "No hay categorías configuradas"

**Causa:** El array `categories` está vacío o no existe.

**Solución:** Añade al menos una categoría en `config.js`:

```js
categories: [
  {
    id: "support",
    label: "Soporte General",
    description: "Ayuda con problemas generales",
    emoji: "🛠️"
  }
]
```

### "Categoría no encontrada"

**Causa:** El `id` de la categoría no coincide con ninguna configurada.

**Solución:** Verifica que el `id` sea único y esté correctamente escrito.

---

## 📞 Soporte

Si tienes problemas configurando las categorías, contacta con el equipo de desarrollo.
