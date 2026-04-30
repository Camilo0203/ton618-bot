module.exports = {
  mod: {
    ban_extra: {
      duration: "*Baneo temporal: {{duration}}*",
      messages_deleted: "*Mensajes eliminados de las últimas {{hours}}h*",
      permanent: "*Baneo permanente*"
    },
    errors: {
      ban_failed: "❌ Error al banear al usuario.",
      bot_hierarchy: "❌ No puedo {{action}} a este usuario porque tiene un rol superior o igual al mío.",
      history_failed: "❌ Error al obtener el historial de moderación.",
      kick_failed: "❌ Error al expulsar al usuario.",
      mute_failed: "❌ Error al silenciar al usuario.",
      no_history: "ℹ️ No se ha encontrado historial de moderación para {{user}}.",
      no_messages: "❌ No se encontraron mensajes que coincidan con los criterios en los últimos 100 mensajes.",
      not_banned: "❌ Este usuario no está baneado en este servidor.",
      not_muted: "❌ Este usuario no está silenciado.",
      purge_failed: "❌ Error al eliminar los mensajes.",
      slowmode_failed: "❌ Error al establecer el modo lento.",
      timeout_failed: "❌ Error al silenciar al usuario.",
      unban_failed: "❌ Error al desbanear al usuario.",
      unmute_failed: "❌ Error al quitar el silencio al usuario.",
      user_hierarchy: "❌ No puedes {{action}} a este usuario porque tiene un rol superior o igual al tuyo."
    },
    history: {
      entry: "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderador:** {{moderator}}\n**Razón:** {{reason}}{{duration}}",
      footer: "Mostrando las {{count}} acciones más recientes",
      title: "🛡️ Historial de Moderación - {{user}}"
    },
    slash: {
      choices: {
        delete_messages: {
          "0": "No eliminar",
          "3600": "Última hora",
          "86400": "Últimas 24 horas",
          "604800": "Últimos 7 días"
        },
        duration: {
          "1d": "1 día",
          "1h": "1 hora",
          "1m": "1 minuto",
          "28d": "28 días",
          "30d": "30 días",
          "6h": "6 horas",
          "7d": "7 días",
          permanent: "Permanente"
        }
      },
      description: "Comandos de moderación avanzada",
      options: {
        amount: "Número de mensajes a eliminar (1-100)",
        channel: "Canal para establecer el modo lento",
        contains: "Solo eliminar mensajes que contengan este texto",
        delete_messages: "Eliminar mensajes de los últimos...",
        duration: "Duración (ej: 1h, 7d, 30d)",
        limit: "Número de acciones a mostrar",
        reason: "Razón de la acción",
        seconds: "Duración del modo lento en segundos (0 para desactivar)",
        user: "El usuario objetivo",
        user_id: "ID de Discord del usuario a desbanear"
      },
      subcommands: {
        ban: {
          description: "Banea a un usuario del servidor"
        },
        history: {
          description: "Ver el historial de moderación de un usuario"
        },
        kick: {
          description: "Expulsa a un usuario del servidor"
        },
        mute: {
          description: "Silencia a un usuario con un rol"
        },
        purge: {
          description: "Elimina múltiples mensajes"
        },
        slowmode: {
          description: "Establece el modo lento para un canal"
        },
        timeout: {
          description: "Silencia a un usuario (nativo de Discord)"
        },
        unban: {
          description: "Desbanea a un usuario"
        },
        unmute: {
          description: "Quita el silencio a un usuario"
        }
      }
    },
    success: {
      banned: "✅ **{{user}}** fue baneado.\n**Razón:** {{reason}}\n{{extra}}",
      kicked: "✅ **{{user}}** fue expulsado.\n**Razón:** {{reason}}",
      muted: "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      purged: "✅ Se han eliminado **{{count}}** mensajes correctamente.",
      slowmode_disabled: "✅ Modo lento desactivado en {{channel}}.",
      slowmode_set: "✅ Modo lento establecido en **{{seconds}}s** en {{channel}}.",
      timeout: "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      unbanned: "✅ **{{user}}** fue desbaneado.\n**Razón:** {{reason}}",
      unmuted: "✅ **{{user}}** ya no está silenciado.\n**Razón:** {{reason}}"
    }
  }
};
