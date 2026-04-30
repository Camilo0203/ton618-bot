const fs = require('fs');
const content = fs.readFileSync('src/locales/es.js', 'utf8');
const staffStatsKeys = `  },
  "staff": {
    "slash": {
      "description": "Utilidades de gestión y moderación exclusivas para el staff",
      "subcommands": {
        "away_on": { "description": "Márquese como ausente con una razón opcional" },
        "away_off": { "description": "Limpia tu estado de ausencia y vuelve a estar activo" },
        "my_tickets": { "description": "Revisa tus tickets actualmente reclamados y asignados" },
        "warn_add": { "description": "Aplicar una advertencia formal a un miembro" },
        "warn_check": { "description": "Revisar el historial de advertencias de un miembro" },
        "warn_remove": { "description": "Eliminar una advertencia específica por su ID único" }
      },
      "options": {
        "reason": "Nota que explica tu estado de ausencia",
        "user": "El miembro a inspeccionar o advertir",
        "warn_reason": "Descripción de la infracción",
        "warning_id": "El ID de 6 caracteres de la advertencia"
      }
    },
    "moderation_required": "No tienes permisos suficientes para gestionar las advertencias de los miembros."
  },
  "stats": {
    "slash": {
      "description": "Métricas de tickets de alta fidelidad y análisis de rendimiento",
      "subcommands": {
        "server": { "description": "Vista general operativa de los totales de tickets y tendencias de respuesta" },
        "sla": { "description": "Informe de cumplimiento: tiempo de primera respuesta y densidad de escalamiento" },
        "staff": { "description": "Análisis profundo de la producción individual y la eficiencia de resolución" },
        "leaderboard": { "description": "Clasifica al staff activo por productividad y velocidad de reclamo" },
        "ratings": { "description": "Tendencias de satisfacción del staff basadas en los comentarios de los usuarios" },
        "staff_rating": { "description": "Perfil de calificación visual para un miembro específico del staff" }
      }
    }
  }
};`;

const newContent = content.trim().replace(/\};?$/, staffStatsKeys);
fs.writeFileSync('src/locales/es.js', newContent);
console.log('es.js updated');
