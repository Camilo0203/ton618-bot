module.exports = {
  interaction: {
    command_disabled: "El comando `/{{commandName}}` está deshabilitado en este servidor.",
    dashboard_refresh: {
      success: "✅ ¡Panel de control actualizado! Las estadísticas se han refrescado con éxito."
    },
    db_unavailable: "Base de datos temporalmente no disponible. Intenta de nuevo en unos segundos.",
    error_generic: "Error generic",
    rate_limit: {
      command: "Límite temporal para `/{{commandName}}`. Espera **{{retryAfterSec}}s** antes de reintentar.",
      global: "Vas demasiado rápido. Espera **{{retryAfterSec}}s** antes de usar otra interacción."
    },
    shutdown: {
      rebooting: "⚠️ El bot se está reiniciando. Por favor intenta en unos segundos."
    },
    tag_delete: {
      cancelled: "❌ Eliminación cancelada.",
      error: "Ocurrió un error al eliminar el tag.",
      success: "✅ El tag **{{name}}** ha sido eliminado."
    },
    unexpected: "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador."
  },
  "interaction.error_generic": "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador.",
  "interaction.shutdown.rebooting": "El bot se está reiniciando para aplicar actualizaciones. Por favor, intenta de nuevo en 15 segundos."
};
