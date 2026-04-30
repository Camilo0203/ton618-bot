module.exports = {
  resetguild: {
    error: "❌ Ocurrió un error durante el restablecimiento.",
    guild_not_found: "❌ Guild no encontrado con ID: `{{guildId}}`",
    owner_only: "🔒 Este comando está restringido al dueño del bot.",
    reset_description: "La configuración ha sido restablecida para el guild: `{{guildId}}`",
    reset_title: "🗑️ Restablecimiento de Guild Completo",
    slash: {
      description: "Restablecer configuración de un guild específico (Solo owner)",
      options: {
        guild_id: "ID del guild a restablecer (vacío para este guild)",
        preserve_pro: "Preservar estado PRO/premium",
        preserve_tickets: "Preservar tickets activos",
        reason: "Razón del restablecimiento"
      }
    }
  }
};
