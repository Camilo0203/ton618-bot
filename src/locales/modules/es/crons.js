module.exports = {
  crons: {
    auto_close: {
      archive_warning_error: "Error al archivar advertencia",
      archive_warning_inaccessible: "Advertencia de inaccesibilidad al archivar",
      archive_warning_transcript: "Advertencia de transcripción al archivar",
      embed_desc_auto: "Descripción del embed auto",
      embed_title_auto: "Título del embed auto",
      embed_title_manual: "Título del embed manual",
      event_desc: "Evento desc",
      title: "Ticket cerrado automáticamente",
      warning_desc: "Advertencia desc"
    },
    messageDelete: {
      fields: {
        author: "Autor",
        channel: "Canal",
        content: "Contenido"
      },
      footer: "ID de Mensaje: {{id}}",
      no_text: "*(sin texto)*",
      title: "Mensaje eliminado",
      unknown_author: "Desconocido"
    },
    modlog: {
      ban_title: "🔨 Usuario Baneado",
      edit_title: "✏️ Mensaje Editado",
      fields: {
        after: "Después",
        author: "👤 Autor",
        before: "Antes",
        channel: "📍 Canal",
        executor: "🛡️ Ejecutado por",
        link: "Enlace del Mensaje",
        reason: "Razón",
        user: "👤 Usuario"
      },
      no_reason: "Sin razón especificada",
      unban_title: "✅ Usuario Desbaneado"
    },
    polls: {
      ended_desc: "Ended desc",
      ended_title: "Ended title"
    },
    reminders: {
      field_ago: "Field ago",
      footer: "Recordatorio de TON618",
      title: "Title"
    }
  },
  "crons.auto_close.archive_warning_error": "Ocurrió un error al archivar la transcripción. El canal quedará cerrado pero no se eliminará.",
  "crons.auto_close.archive_warning_inaccessible": "El canal de transcripciones configurado no es accesible. El canal no se eliminará.",
  "crons.auto_close.archive_warning_transcript": "No se pudo generar la transcripción del ticket. El canal quedará cerrado pero no se eliminará.",
  "crons.auto_close.embed_desc_auto": "Este ticket fue cerrado por inactividad y será eliminado en unos segundos.",
  "crons.auto_close.embed_title_auto": "Ticket cerrado automáticamente",
  "crons.auto_close.embed_title_manual": "Ticket cerrado sin borrar canal",
  "crons.auto_close.event_desc": "El ticket #{{ticketId}} fue cerrado por inactividad.",
  "crons.auto_close.warning_desc": "⚠️ <@{{user}}> Este ticket será cerrado automáticamente en ~30 minutos por inactividad.\nResponde para evitar el cierre.",
  "crons.polls.ended_desc": "La encuesta **\"{{question}}\"** ha terminado.",
  "crons.polls.ended_title": "Encuesta Finalizada",
  "crons.reminders.field_ago": "Establecido hace {{time}}",
  "crons.reminders.title": "Recordatorio"
};
