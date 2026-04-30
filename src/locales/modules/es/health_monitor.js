module.exports = {
  health_monitor: {
    downtime_recovery_description: "El bot volvió a estar activo en **{{guildName}}**.\nTiempo estimado sin heartbeat: **{{minutes}} min**.",
    downtime_recovery_title: "Salud del bot: recuperación de caída",
    error_rate_high_description: "Error rate: **{{errorRatePct}}%** (umbral {{thresholdPct}}%)\nServidor: **{{guildName}}**",
    error_rate_high_title: "Salud del bot: error rate alto",
    field_error_rate: "Error rate",
    field_errors: "Errores",
    field_interactions: "Interacciones ventana",
    field_ping: "Ping",
    ping_high_description: "Ping actual: **{{pingMs}}ms** (umbral {{thresholdMs}}ms)\nServidor: **{{guildName}}**",
    ping_high_title: "Salud del bot: ping alto"
  },
  "health_monitor.downtime_recovery_description": "El bot se recuperó después de una ventana de inactividad.",
  "health_monitor.downtime_recovery_title": "Recuperación detectada",
  "health_monitor.error_rate_high_description": "La tasa reciente de errores de interacción está por encima del umbral configurado.",
  "health_monitor.error_rate_high_title": "Alta tasa de errores detectada",
  "health_monitor.field_error_rate": "Tasa de error",
  "health_monitor.field_errors": "Errores",
  "health_monitor.field_interactions": "Interacciones",
  "health_monitor.field_ping": "Ping",
  "health_monitor.ping_high_description": "La latencia del gateway está por encima del umbral configurado.",
  "health_monitor.ping_high_title": "Latencia alta detectada"
};
