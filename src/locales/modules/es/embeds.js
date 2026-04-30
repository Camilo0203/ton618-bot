module.exports = {
  embeds: {
    ticket: {
      closed: {
        fields: {
          closed_by: "Cerrado por",
          duration: "Duración",
          messages: "Mensajes",
          reason: "Motivo",
          ticket: "Ticket"
        },
        no_reason: "Sin motivo",
        title: "Ticket cerrado"
      },
      info: {
        fields: {
          assigned_to: "Asignado a",
          category: "Categoría",
          claimed_by: "Reclamado por",
          created: "Creado",
          creator: "Creador",
          duration: "Duración",
          first_response: "Primera respuesta",
          messages: "Mensajes",
          priority: "Prioridad",
          reopens: "Reaperturas",
          status: "Estado",
          subject: "Asunto"
        },
        first_response_value: "{{minutes}} min",
        status_closed: "Cerrado",
        status_open: "Abierto",
        title: "Ticket #{{ticketId}}"
      },
      log: {
        actions: {
          add: "Usuario agregado",
          assign: "Ticket asignado",
          autoclose: "Ticket auto-cerrado",
          claim: "Ticket reclamado",
          close: "Ticket cerrado",
          default: "Acción",
          delete: "Mensaje eliminado",
          edit: "Mensaje editado",
          move: "Categoría cambiada",
          open: "Ticket abierto",
          priority: "Prioridad cambiada",
          rate: "Ticket calificado",
          remove: "Usuario quitado",
          reopen: "Ticket reabierto",
          sla: "Alerta SLA",
          smartping: "Sin respuesta del staff",
          transcript: "Transcripción generada",
          unassign: "Asignación removida",
          unclaim: "Ticket liberado"
        },
        fields: {
          by: "Por",
          category: "Categoría",
          ticket: "Ticket"
        },
        footer: "UID: {{userId}}"
      },
      open: {
        author: "Ticket #{{ticketId}} | {{category}}",
        default_welcome: "¡Hola <@{{userId}}>! Bienvenido a nuestro sistema de soporte. Un miembro del staff te atenderá pronto.",
        footer: "Usa los botones de abajo para gestionar este ticket",
        form_field: "Información del formulario",
        question_fallback: "Pregunta {{index}}",
        summary: "**Resumen de la solicitud:**\n- **Usuario:** <@{{userId}}>\n- **Categoría:** {{category}}\n- **Prioridad:** {{priority}}\n- **Creado:** <t:{{createdAt}}:R>"
      },
      reopened: {
        description: "<@{{userId}}> reabrió este ticket.\nUn miembro del staff retomará la atención pronto.",
        fields: {
          reopens: "Reaperturas"
        },
        title: "Ticket reabierto"
      }
    }
  }
};
