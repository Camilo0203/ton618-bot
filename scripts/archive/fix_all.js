const fs = require('fs');
const path = require('path');

function fixLocale(lang) {
  const filePath = path.join(__dirname, 'src/locales', `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Custom inject common.options
  const optionsLabel = lang === 'en' ? {
    "user": "user",
    "staff": "staff",
    "reason": "reason",
    "id": "id",
    "duration": "duration",
    "amount": "amount",
    "name": "name",
    "period": "period",
    "title": "title",
    "description": "description",
    "message": "message",
    "channel": "channel",
    "role": "role",
    "value": "value"
  } : {
    "user": "usuario",
    "staff": "staff",
    "reason": "razon",
    "id": "id",
    "duration": "duracion",
    "amount": "monto",
    "name": "nombre",
    "period": "periodo",
    "title": "titulo",
    "description": "descripcion",
    "message": "mensaje",
    "channel": "canal",
    "role": "rol",
    "value": "valor"
  };

  if (!content.includes('"options": {')) {
    content = content.replace('"footer": {', `"footer": {\n      "tickets": "TON618 Tickets"\n    },\n    "options": ${JSON.stringify(optionsLabel, null, 6).replace(/     /g, '    ')},\n    "_placeholder": {`);
    content = content.replace(',\n    "_placeholder": {', '');
  }

  // Remove terminal }; to append
  content = content.trim();
  if (content.endsWith('};')) {
    content = content.slice(0, -2);
  } else if (content.endsWith('}')) {
    content = content.slice(0, -1);
  }

  // Ensure trailing comma for last module
  if (!content.trim().endsWith(',')) {
    content += ',\n';
  }

  const enKeys = {
    config: {
      slash: {
        description: "Premium administration and server configuration console",
        subcommands: {
          status: { description: "Display general system and commercial status" },
          tickets: { description: "Review ticket system operational health" },
          center: { description: "Open the interactive configuration center" }
        }
      },
      category: {
        group_description: "Manage ticket categories and triage rules",
        add_description: "Initialize a new ticket category",
        remove_description: "Permanently delete a category from the server",
        list_description: "List all active ticket categories",
        edit_description: "Update settings for an existing category",
        toggle_description: "Activate or deactivate a category",
        option_id: "Category identifier",
        option_discord_category: "Target Discord category ID",
        option_id_remove: "Category ID to delete",
        option_id_edit: "Category ID to modify",
        option_label: "Display label for users",
        option_description: "Detailed category description",
        option_emoji: "Category emoji",
        option_priority: "Default ticket priority",
        option_discord_category_edit: "New Discord category ID",
        option_ping_roles: "Roles to notify on creation (IDs separated by commas)",
        option_welcome_message: "Custom welcome message for this category",
        option_id_toggle: "Category ID to switch state"
      }
    },
    staff: {
      slash: {
        description: "Exclusive staff management and moderation utilities",
        subcommands: {
          away_on: { description: "Mark yourself as AWAY to stop receiving auto-assignments" },
          away_off: { description: "Clear your AWAY status and resume reception" },
          my_tickets: { description: "List all tickets currently claimed by you" },
          warn_add: { description: "Register a new warning for a member" },
          warn_check: { description: "Review a member's warning history" },
          warn_remove: { description: "Delete a specific warning by ID" }
        },
        options: {
          reason: "Away reason (shown to other staff)",
          user: "Target user",
          warn_reason: "Violation reason for the warning",
          warning_id: "Unique identifier of the warning"
        }
      }
    },
    warn: {
      slash: {
        description: "Member warning management system",
        subcommands: {
          add: { description: "Issue a new warning to a member" },
          check: { description: "View active warnings for a member" },
          remove: { description: "Rescind a warning using its ID" }
        },
        options: {
          user_warn: "User to warn",
          reason: "Reason for the disciplinary action",
          user_inspect: "User to inspect history",
          id: "Warning ID"
        }
      }
    },
    ticket: {
      slash: {
        description: "Main ticket interaction and management system",
        subcommands: {
          open: { description: "Open a new support ticket" },
          close: { description: "Close the current active ticket" },
          reopen: { description: "Reopen a previously closed ticket" },
          claim: { description: "Take responsibility for the current ticket" },
          unclaim: { description: "Release the ticket from your responsibility" },
          assign: { description: "Assign the ticket to another staff member" },
          add: { description: "Add a member to the ticket conversation" },
          remove: { description: "Remove a member from the ticket conversation" },
          rename: { description: "Change the channel name for the ticket" },
          priority: { description: "Update the priority level of the ticket" },
          move: { description: "Move the ticket to another category" },
          transcript: { description: "Generate a HTML transcript of the conversation" },
          brief: { description: "Generate a concise summary of the case" },
          info: { description: "Display detailed metadata about the ticket" },
          history: { description: "Review a user's ticket history" }
        },
        options: {
          close_reason: "Reason for closing the ticket",
          assign_staff: "Staff member to assign",
          add_user: "User to invite",
          remove_user: "User to exclude",
          rename_name: "New channel name",
          priority_level: "New priority level",
          history_user: "User to check (defaults to self)"
        },
        groups: {
          note: {
            description: "Manage internal staff notes for the ticket",
            subcommands: {
              add: { description: "Add a new internal note" },
              list: { description: "List all internal notes for this ticket" },
              clear: { description: "Delete all internal notes" }
            },
            options: {
              note: "Content of the note"
            }
          }
        }
      }
    }
  };

  const esKeys = {
    config: {
      slash: {
        description: "✨ Consola premium de administración y configuración del servidor",
        subcommands: {
          status: { description: "Ver el estado general del sistema y estatus comercial" },
          tickets: { description: "Revisar la salud operativa del sistema de tickets" },
          center: { description: "Abrir el centro de configuración interactivo" }
        }
      },
      category: {
        group_description: "Gestionar categorías de tickets y reglas de triaje",
        add_description: "Añadir una nueva categoría de tickets",
        remove_description: "Eliminar permanentemente una categoría del servidor",
        list_description: "Listar todas las categorías de tickets activas",
        edit_description: "Actualizar ajustes de una categoría existente",
        toggle_description: "Activar o desactivar una categoría",
        option_id: "Identificador de la categoría",
        option_discord_category: "ID de la categoría de Discord de destino",
        option_id_remove: "ID de la categoría a eliminar",
        option_id_edit: "ID de la categoría a modificar",
        option_label: "Etiqueta visible para usuarios",
        option_description: "Descripción detallada de la categoría",
        option_emoji: "Emoji de la categoría",
        option_priority: "Prioridad predeterminada del ticket",
        option_discord_category_edit: "Nuevo ID de categoría de Discord",
        option_ping_roles: "Roles a notificar (IDs separados por comas)",
        option_welcome_message: "Mensaje de bienvenida personalizado",
        option_id_toggle: "ID de la categoría para cambiar estado"
      }
    },
    staff: {
      slash: {
        description: "Utilidades exclusivas de gestión y moderación para staff",
        subcommands: {
          away_on: { description: "Márcate como AUSENTE para dejar de recibir asignaciones" },
          away_off: { description: "Quitar estado ausente y volver a recibir tickets" },
          my_tickets: { description: "Lista todos los tickets reclamados actualmente por ti" },
          warn_add: { description: "Registrar una nueva advertencia para un miembro" },
          warn_check: { description: "Revisar el historial de advertencias de un miembro" },
          warn_remove: { description: "Eliminar una advertencia específica por ID" }
        },
        options: {
          reason: "Razón de ausencia (visible para otros staff)",
          user: "Usuario objetivo",
          warn_reason: "Razón de la infracción para la advertencia",
          warning_id: "Identificador único de la advertencia"
        }
      }
    },
    warn: {
      slash: {
        description: "Sistema de gestión de advertencias a miembros",
        subcommands: {
          add: { description: "Emitir una nueva advertencia a un miembro" },
          check: { description: "Ver advertencias activas de un miembro" },
          remove: { description: "Anular una advertencia usando su ID" }
        },
        options: {
          user_warn: "Usuario a advertir",
          reason: "Razón de la medida disciplinaria",
          user_inspect: "Usuario para revisar historial",
          id: "ID de la advertencia"
        }
      }
    },
    ticket: {
      slash: {
        description: "Sistema principal de gestión e interacción con tickets",
        subcommands: {
          open: { description: "Abrir un nuevo ticket de soporte" },
          close: { description: "Cerrar el ticket activo actual" },
          reopen: { description: "Reabrir un ticket previamente cerrado" },
          claim: { description: "Tomar responsabilidad del ticket actual" },
          unclaim: { description: "Liberar el ticket de tu responsabilidad" },
          assign: { description: "Asignar el ticket a otro miembro del staff" },
          add: { description: "Añadir un miembro a la conversación del ticket" },
          remove: { description: "Remover un miembro de la conversación del ticket" },
          rename: { description: "Cambiar el nombre del canal del ticket" },
          priority: { description: "Actualizar el nivel de prioridad del ticket" },
          move: { description: "Mover el ticket a otra categoría" },
          transcript: { description: "Generar una transcripción HTML de la charla" },
          brief: { description: "Generar un resumen conciso del caso" },
          info: { description: "Mostrar metadatos detallados sobre el ticket" },
          history: { description: "Revisar el historial de tickets de un usuario" }
        },
        options: {
          close_reason: "Razón para cerrar el ticket",
          assign_staff: "Miembro del staff a asignar",
          add_user: "Usuario a invitar",
          remove_user: "Usuario a excluir",
          rename_name: "Nuevo nombre del canal",
          priority_level: "Nuevo nivel de prioridad",
          history_user: "Usuario a revisar (por defecto tú)"
        },
        groups: {
          note: {
            description: "Gestionar notas internas de staff para el ticket",
            subcommands: {
              add: { description: "Añadir una nueva nota interna" },
              list: { description: "Listar todas las notas internas del ticket" },
              clear: { description: "Eliminar todas las notas internas" }
            },
            options: {
              note: "Contenido de la nota"
            }
          }
        }
      }
    }
  };

  const keys = lang === 'en' ? enKeys : esKeys;
  
  for (const [key, value] of Object.entries(keys)) {
    content += `  "${key}": ${JSON.stringify(value, null, 2)},\n`;
  }

  content = content.trim();
  if (content.endsWith(',')) content = content.slice(0, -1);
  content += '\n};';

  fs.writeFileSync(filePath, content);
  console.log(`[FIXED] ${lang}.js`);
}

fixLocale('en');
fixLocale('es');
