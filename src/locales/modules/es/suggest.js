module.exports = {
  suggest: {
    audit: {
      approved: "Approved",
      rejected: "Rejected",
      status_updated: "Estado actualizado",
      thread_reason: "Thread reasel"
    },
    buttons: {
      approve: "✅ Aprobar",
      reject: "❌ Rechazar",
      staff_note: "Añadir Nota de Staff (Pro)",
      vote_down: "👎 Votar en Contra",
      vote_up: "👍 Votar a Favor"
    },
    cooldown: {
      description: "Debes esperar **{{minutes}} minutos** antes de enviar otra sugerencia.",
      title: "⏱️ Cooldown Activo"
    },
    dm: {
      description: "Tu sugerencia **#{{num}}** en **{{guildName}}** fue revisada.",
      field_suggestion: "📝 Tu sugerencia",
      title_approved: "✅ Tu sugerencia fue Aprobada",
      title_rejected: "❌ Tu sugerencia fue Rechazada"
    },
    embed: {
      author_anonymous: "Anónimo",
      debate_footer: "Usa este hilo para discutir esta sugerencia",
      debate_title: "💬 Debate: Sugerencia #{{num}}",
      field_author: "👤 Autor",
      field_staff_comment: "💬 Comentario del staff",
      field_staff_note: "💬 Nota del Staff",
      field_status: "📋 Estado",
      field_submitted: "📅 Enviada",
      field_votes: "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% aprobación",
      footer_reviewed: "Revisada por {{reviewer}} • {{status}}",
      footer_status: "Estado: {{status}}",
      no_description: "> (Sin descripción)",
      title: "{{emoji}} Sugerencia #{{num}}"
    },
    emoji: {
      approved: "✅",
      pending: "⏳",
      rejected: "❌"
    },
    errors: {
      already_reviewed: "Esta sugerencia ya fue revisada y no admite más votos.",
      already_status: "❌ Esta sugerencia ya fue {{status}}.",
      channel_not_configured: "No se encontró el canal de sugerencias configurado.\nContacta a un administrador.",
      interaction_error: "❌ Interacción no válida.",
      invalid_data: "Debes proporcionar al menos un título o descripción para tu sugerencia.",
      manage_messages_required: "❌ Necesitas permisos de **Gestionar Mensajes** para revisar sugerencias.",
      not_exists: "❌ Esta sugerencia ya no existe.",
      pro_required: "Esta función requiere **TON618 Pro**.",
      processing_error: "❌ Ocurrió un error al procesar la interacción.",
      system_disabled: "El sistema de sugerencias no está activado en este servidor.\nContacta a un administrador para activarlo.",
      vote_error: "❌ Error al registrar tu voto."
    },
    modal: {
      field_description_label: "Descripción detallada",
      field_description_placeholder: "Explica tu idea con más detalle...",
      field_title_label: "Título de la sugerencia",
      field_title_placeholder: "Ej: Añadir un canal de música",
      title: "💡 Nueva Sugerencia"
    },
    placeholder: "⏳ Creando sugerencia...",
    slash: {
      description: "💡 Envía una sugerencia para el servidor"
    },
    status: {
      approved: "✅ Aprobada",
      pending: "⏳ Pendiente",
      rejected: "❌ Rechazada"
    },
    success: {
      auto_thread_created: "Hilo de debate creado automáticamente.",
      staff_note_updated: "Nota de staff actualizada para la sugerencia #{{num}}.",
      status_updated: "✅ Sugerencia **#{{num}}** marcada como **{{status}}**.",
      submitted_description: "Tu sugerencia **#{{num}}** ha sido publicada en {{channel}}.",
      submitted_footer: "¡Gracias por tu aporte!",
      submitted_title: "✅ Sugerencia Enviada",
      vote_registered: "✅ Tu voto ha sido registrado. ({{emoji}})"
    }
  },
  "suggest.audit.approved": "Sugerencia aprobada por {{user}}",
  "suggest.audit.rejected": "Sugerencia rechazada por {{user}}",
  "suggest.audit.status_updated": "Sugerencia {{status}} por {{user}}",
  "suggest.audit.thread_reason": "Hilo de debate para sugerencia #{{num}}"
};
