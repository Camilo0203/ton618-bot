module.exports = {
  poll: {
    embed: {
      active_channel_deleted: "Canal Eliminado",
      active_count_title: "📊 Encuestas Activas ({{count}})",
      active_empty: "No hay encuestas activas en este servidor.",
      active_footer: "Usa /poll end <id> para finalizar una antes de tiempo",
      active_item_votes: "Votos",
      active_title: "📊 Encuestas Activas",
      created_description: "La encuesta ha sido enviada a {{channel}}.",
      created_title: "✅ Encuesta Creada",
      field_created_by: "Creada por",
      field_ends: "Finaliza",
      field_id: "ID de Encuesta",
      field_in: "Tiempo restante",
      field_mode: "Modo de Votación",
      field_options: "Opciones",
      field_question: "Pregunta",
      field_required_role: "Rol Requerido",
      field_total_votes: "Votos Totales",
      footer_ended: "Votación cerrada",
      footer_multiple: "Puedes votar por varias opciones",
      footer_single: "Solo una opción permitida",
      mode_multiple: "Opción Múltiple",
      mode_single: "Opción Única",
      status_anonymous: "Resultados Ocultos",
      status_ended: "Encuesta Finalizada",
      title_ended_prefix: "🏁 Finalizada:",
      title_prefix: "🗳️ Encuesta:",
      vote_plural: "votos",
      vote_singular: "voto"
    },
    errors: {
      manage_messages_required: "Necesitas el permiso 'Gestionar Mensajes' para finalizar encuestas.",
      max_duration: "La encuesta no puede durar más de 30 días.",
      max_options: "Solo puedes tener hasta 10 opciones.",
      max_votes_reached: "Solo puedes votar hasta {{max}} opciones.",
      min_duration: "La encuesta debe durar al menos 1 minuto.",
      min_options: "Necesitas al menos 2 opciones.",
      option_too_long: "Una de las opciones es demasiado larga (máx. 80 caracteres).",
      owner_only: "Owner only",
      poll_not_found: "Encuesta con ID `{{id}}` no encontrada.",
      pro_required: "✨ Esta opción requiere **TON618 Pro**. ¡Mejora para desbloquear funciones avanzadas!",
      role_required: "Debes tener el <@&{{roleId}}> rol para votar.",
      unknown_subcommand: "Subcomando de encuesta desconocido."
    },
    placeholder: "📊 Cargando encuesta...",
    slash: {
      description: "Sistema de encuestas interactivas",
      options: {
        anonymous: "Ocultar resultados hasta el final (Pro)",
        channel: "Canal de destino",
        duration: "Duración (ej: 1h, 30m, 1d)",
        id: "ID de encuesta (últimos 6 caracteres)",
        max_votes: "Máximo de opciones permitidas (Pro)",
        multiple: "Permitir múltiples votos",
        options: "Opciones separadas por |",
        question: "Pregunta de la encuesta",
        required_role: "Requisito para votar (Pro)"
      },
      subcommands: {
        create: {
          description: "Crear una nueva encuesta"
        },
        end: {
          description: "Finalizar una encuesta antes de tiempo"
        },
        list: {
          description: "Ver encuestas activas"
        }
      }
    },
    success: {
      ended: "✅ La encuesta **\"{{question}}\"** ha sido finalizada.",
      vote_active_multiple: "Tus votos actuales: {{opciones}}",
      vote_active_single: "Votaste por: **{{option}}**",
      vote_removed: "Tu voto ha sido removido."
    }
  },
  "poll.errors.owner_only": "Solo el dueño del servidor puede usar esta opción de encuesta."
};
