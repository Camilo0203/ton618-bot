const fs = require('fs');
const path = require('path');

function fixLocale(lang) {
  const filePath = path.join(__dirname, 'src/locales', `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8').trim();
  
  // Remove terminal }; or } to append
  if (content.endsWith('};')) {
    content = content.slice(0, -2);
  } else if (content.endsWith('}')) {
    content = content.slice(0, -1);
  }

  // Ensure trailing comma for last module
  content = content.trim();
  if (content.endsWith(',')) {
    content = content.slice(0, -1);
  }
  content += ',\n';

  const enKeys = {
    "stats": {
      "slash": {
        "description": "High-fidelity ticket metrics and performance analytics",
        "subcommands": {
          "server": { "description": "Operational overview of ticket volume and response trends" },
          "sla": { "description": "Compliance report: time-to-first-response and escalation density" },
          "staff": { "description": "Deep dive into individual output and resolution efficiency" },
          "leaderboard": { "description": "Rank active staff by productivity and claiming speed" },
          "ratings": { "description": "Staff satisfaction trends based on user feedback" },
          "staff_rating": { "description": "Visual rating profile for a specific staff member" }
        }
      },
      "server_title": "Server Statistics: {{guild}}",
      "total": "Total Tickets",
      "open": "Open",
      "closed": "Closed",
      "today": "Activity Today",
      "week": "Activity This Week",
      "opened": "Opened",
      "avg_rating": "Avg. Rating",
      "avg_response": "Avg. First Response",
      "avg_close": "Avg. Resolution Time",
      "no_data": "N/A",
      "staff_title": "Staff Profile: {{user}}",
      "closed_tickets": "Tickets Closed",
      "claimed_tickets": "Tickets Claimed",
      "assigned_tickets": "Tickets Assigned",
      "average_rating": "Average Rating",
      "ratings_count": "{{count}} ratings",
      "no_ratings_yet": "No ratings yet",
      "pro_consistent": "Consistent",
      "pro_top_performer": "Top Performer",
      "pro_needs_focus": "Needs Focus",
      "pro_metrics_title": "Pro Performance Intelligence",
      "pro_efficiency": "Resolution Efficiency",
      "pro_rating_quality": "Service Quality",
      "leaderboard_title": "Staff Performance Leaderboard",
      "leaderboard_closed": "closed",
      "leaderboard_claimed": "claimed",
      "leaderboard_empty": "No staff activity recorded yet.",
      "staff_rating_title": "Rating Density: {{user}}",
      "staff_rating_empty": "This staff member has not received any ratings yet.",
      "average_score": "Average Score",
      "total_ratings": "Total Ratings",
      "sla_title": "SLA Compliance Dashboard: {{guild}}",
      "sla_description": "Advanced metrics for response times and escalation management.",
      "sla_threshold": "SLA Threshold",
      "escalation": "Escalation Status",
      "escalation_threshold": "Escalation Threshold",
      "sla_overrides": "SLA Priority Rules",
      "escalation_overrides": "Escalation Rules",
      "open_out_of_sla": "Open Breached",
      "open_escalated": "Currently Escalated",
      "avg_first_response": "Avg. First Response",
      "sla_compliance": "SLA Compliance Rate",
      "tickets_evaluated": "Evaluated Tickets"
    },
    "poll": {
      "slash": {
        "description": "Interactive poll and voting system",
        "subcommands": {
          "create": { "description": "Initialize a new interactive poll" },
          "end": { "description": "Prematurely conclude an active poll" },
          "list": { "description": "Review all currently active polls in the server" }
        },
        "options": {
          "question": "Poll question",
          "options": "Choices separated by | (e.g. Yes | No | Maybe)",
          "duration": "Duration (e.g. 1h, 30m, 2d)",
          "multiple": "Allow multiple choices per member",
          "channel": "Destination channel for the poll",
          "anonymous": "Hide live results until the poll ends (Pro)",
          "required_role": "Limit voting to a specific role (Pro)",
          "max_votes": "Maximum choices per user (Pro)",
          "id": "6-character poll identifier"
        }
      },
      "embed": {
        "created_title": "Poll Created",
        "created_description": "Your poll has been successfully published to {{channel}}.",
        "field_question": "Question",
        "field_options": "Options",
        "field_ends": "Ends At",
        "field_in": "Finishes",
        "field_mode": "Voting Mode",
        "field_id": "Poll ID",
        "mode_multiple": "Multiple Choice",
        "mode_single": "Single Choice",
        "active_title": "Server Active Polls",
        "active_empty": "There are no active polls in this server right now.",
        "active_count_title": "Active Polls ({{count}})",
        "active_footer": "Use /poll end <id> to conclude a poll manually.",
        "active_item_votes": "votes"
      },
      "errors": {
        "pro_required": "✨ **Pro Feature**: Advanced poll options (anonymous, role-restricted, etc.) require a Pro subscription.",
        "min_options": "You must provide at least 2 distinct choices.",
        "max_options": "A maximum of 10 choices is supported per poll.",
        "option_too_long": "Individual choices cannot exceed 80 characters.",
        "min_duration": "The minimum duration is 1 minute.",
        "max_duration": "The maximum duration is 30 days.",
        "poll_not_found": "Could not find an active poll with ID `{{id}}`.",
        "manage_messages_required": "You require 'Manage Messages' permission to end polls manually."
      },
      "success": {
        "ended": "✅ Poll **\"{{question}}\"** has been concluded."
      },
      "placeholder": "Preparing poll content..."
    },
    "staff": {
      "slash": {
        "description": "Staff-only management and moderation utilities",
        "subcommands": {
          "away_on": { "description": "Mark yourself as away with an optional reason" },
          "away_off": { "description": "Clear your away status and return to active" },
          "my_tickets": { "description": "Review your currently claimed and assigned tickets" },
          "warn_add": { "description": "Apply a formal warning to a member" },
          "warn_check": { "description": "Review a member's warning history" },
          "warn_remove": { "description": "Delete a specific warning by its unique ID" }
        },
        "options": {
          "reason": "Note explaining your away status",
          "user": "The member to inspect or warn",
          "warn_reason": "Description of the infraction",
          "warning_id": "The 6-character ID of the warning"
        }
      },
      "moderation_required": "You do not have sufficient permissions to manage member warnings."
    },
    "config": {
      "slash": {
        "description": "Premium administration and server configuration console",
        "subcommands": {
          "status": { "description": "Display general system and commercial status" },
          "tickets": { "description": "Review ticket system operational health" },
          "center": { "description": "Open the interactive configuration center" }
        }
      },
      "category": {
        "group_description": "Manage ticket categories and triage rules",
        "add_description": "Initialize a new ticket category",
        "remove_description": "Permanently delete a category from the server",
        "list_description": "List all active ticket categories",
        "edit_description": "Update settings for an existing category",
        "toggle_description": "Activate or deactivate a category",
        "option_id": "Category identifier",
        "option_discord_category": "Target Discord category ID",
        "option_id_remove": "Category ID to delete",
        "option_id_edit": "Category ID to modify",
        "option_label": "Display label for users",
        "option_description": "Detailed category description",
        "option_emoji": "Category emoji",
        "option_priority": "Default ticket priority",
        "option_discord_category_edit": "New Discord category ID",
        "option_ping_roles": "Roles to notify on creation (IDs separated by commas)",
        "option_welcome_message": "Custom welcome message for this category",
        "option_id_toggle": "Category ID to switch state"
      }
    },
    "ticket": {
      "slash": {
        "description": "Main ticket interaction and management system",
        "subcommands": {
          "open": { "description": "Open a new support ticket" },
          "close": { "description": "Close the current active ticket" },
          "reopen": { "description": "Reopen a previously closed ticket" },
          "claim": { "description": "Take responsibility for the current ticket" },
          "unclaim": { "description": "Release the ticket from your responsibility" },
          "assign": { "description": "Assign the ticket to another staff member" },
          "add": { "description": "Add a member to the ticket conversation" },
          "remove": { "description": "Remove a member from the ticket conversation" },
          "rename": { "description": "Change the channel name for the ticket" },
          "priority": { "description": "Update the priority level of the ticket" },
          "move": { "description": "Move the ticket to another category" },
          "transcript": { "description": "Generate a HTML transcript of the conversation" },
          "brief": { "description": "Generate a concise summary of the case" },
          "info": { "description": "Display detailed metadata about the ticket" },
          "history": { "description": "Review a user's ticket history" }
        },
        "options": {
          "close_reason": "Reason for closing the ticket",
          "assign_staff": "Staff member to assign",
          "add_user": "User to invite",
          "remove_user": "User to exclude",
          "rename_name": "New channel name",
          "priority_level": "New priority level",
          "history_user": "User to check (defaults to self)"
        }
      }
    },
    "center": {
      "general": {
        "title": "TON618 Configuration Center",
        "description": "Interactive console to manage all your server modules and automation rules."
      },
      "sections": {
        "general": "General System",
        "tickets": "Ticket Engine",
        "automod": "AutoMod Rules",
        "verification": "Identity & Security",
        "welcome": "Onboarding",
        "goodbye": "Departure",
        "staff": "Team Ops",
        "commercial": "Plan & Pro Status"
      }
    },
    "tickets": {
      "labels": {
        "panel": "Ticket Panel",
        "panel_status": "Panel Status",
        "logs": "Moderation Logs",
        "transcripts": "Ticket Transcripts",
        "staff": "Support Staff Role",
        "admin": "Bot Admin Role",
        "public_panel_title": "Public Panel Title",
        "public_panel_description": "Public Panel Description",
        "welcome_message": "Ticket Welcome Message",
        "control_embed_title": "Staff Control Title",
        "control_embed_description": "Staff Control Description",
        "public_panel_color": "Panel Color (HEX)",
        "control_embed_color": "Control Color (HEX)",
        "max_per_user": "Concurrent Tickets",
        "global_limit": "Global Server Limit",
        "cooldown": "Creation Cooldown",
        "minimum_days": "Min. Account Age (Days)",
        "simple_help": "Simple Triage Mode",
        "base_sla": "Base SLA Threshold",
        "smart_ping": "Smart Ping Warning",
        "auto_close": "Inactivity Auto-Close",
        "auto_assignment": "Auto-Assignment Engine",
        "online_only": "Only Assign Online Staff",
        "respect_away": "Respect Staff Away Status",
        "sla_escalation": "SLA Escalation Engine",
        "threshold": "Escalation Threshold",
        "channel": "Alert Channel",
        "role": "Escalation Role",
        "sla_overrides": "SLA Priority Rules",
        "escalation_overrides": "Escalation Rules",
        "daily_report": "Daily Performance Report",
        "weekly_report": "Weekly Ops Summary",
        "status": "Operational Status",
        "scope": "Category Scope",
        "message": "Incident Broadcast",
        "configured_categories": "Active Categories"
      },
      "fields": {
        "channels_roles": "Infrastructure & Permissions",
        "commercial_status": "Commercial & Subscription",
        "panel_messaging": "User Experience & Customization",
        "limits_access": "Access Control & Fair Use",
        "sla_automation": "Operational Intelligence & Automation",
        "escalation_reporting": "Incident Reporting & Escalation",
        "incident_mode": "Outage & Incident Mode"
      },
      "panel_status": {
        "not_configured": "🔴 NOT CONFIGURED",
        "published": "🟢 PUBLISHED",
        "pending": "🟡 PENDING"
      },
      "incident": {
        "inactive": "Bot is operating normally",
        "default_message": "We are currently experiencing a high volume of tickets. Response times may be longer than usual."
      },
      "categories": {
        "none": "No categories configured",
        "on": "ON",
        "off": "OFF",
        "pings": "{{count}} pings",
        "more": "...and {{count}} more"
      },
      "footers": {
        "pro": "TON618 Pro | Operational Intelligence Active",
        "free": "TON618 Ops Console | Community Edition"
      }
    }
  };

  const esKeys = {
    "stats": {
      "slash": {
        "description": "Estadísticas de alta fidelidad y métricas de rendimiento",
        "subcommands": {
          "server": { "description": "Vista general del volumen de tickets y tendencias" },
          "sla": { "description": "Informe de cumplimiento: tiempo de respuesta y escalado" },
          "staff": { "description": "Detalle del rendimiento individual y eficiencia" },
          "leaderboard": { "description": "Ranking de staff por productividad y velocidad" },
          "ratings": { "description": "Tendencias de satisfacción basadas en feedback" },
          "staff_rating": { "description": "Perfil visual de valoraciones de un staff específico" }
        }
      },
      "server_title": "Estadísticas del Servidor: {{guild}}",
      "total": "Tickets Totales",
      "open": "Abiertos",
      "closed": "Cerrados",
      "today": "Actividad de Hoy",
      "week": "Actividad de la Semana",
      "opened": "Abiertos",
      "avg_rating": "Valoración Media",
      "avg_response": "Promedio 1ª Respuesta",
      "avg_close": "Promedio Resolución",
      "no_data": "N/D",
      "staff_title": "Perfil de Staff: {{user}}",
      "closed_tickets": "Tickets Cerrados",
      "claimed_tickets": "Tickets Reclamados",
      "assigned_tickets": "Tickets Asignados",
      "average_rating": "Valoración Promedio",
      "ratings_count": "{{count}} valoraciones",
      "no_ratings_yet": "Sin valoraciones aún",
      "pro_consistent": "Consistente",
      "pro_top_performer": "Rendimiento Superior",
      "pro_needs_focus": "Necesita Enfoque",
      "pro_metrics_title": "Inteligencia de Rendimiento Pro",
      "pro_efficiency": "Eficiencia de Resolución",
      "pro_rating_quality": "Calidad de Servicio",
      "leaderboard_title": "Tabla de Clasificación de Staff",
      "leaderboard_closed": "cerrados",
      "leaderboard_claimed": "reclamados",
      "leaderboard_empty": "No hay actividad de staff registrada aún.",
      "staff_rating_title": "Densidad de Valoraciones: {{user}}",
      "staff_rating_empty": "Este miembro del staff no ha recibido valoraciones aún.",
      "average_score": "Puntuación Media",
      "total_ratings": "Total de Valoraciones",
      "sla_title": "Panel de Cumplimiento SLA: {{guild}}",
      "sla_description": "Métricas avanzadas de tiempos de respuesta y gestión de escalado.",
      "sla_threshold": "Umbral SLA",
      "escalation": "Estado de Escalado",
      "escalation_threshold": "Umbral de Escalado",
      "sla_overrides": "Reglas SLA Especiales",
      "escalation_overrides": "Reglas de Escalado",
      "open_out_of_sla": "Abiertos con Incumplimiento",
      "open_escalated": "Actualmente Escalados",
      "avg_first_response": "Promedio 1ª Respuesta",
      "sla_compliance": "Tasa de Cumplimiento SLA",
      "tickets_evaluated": "Tickets Evaluados"
    },
    "poll": {
      "slash": {
        "description": "Sistema interactivo de encuestas y votación",
        "subcommands": {
          "create": { "description": "Iniciar una nueva encuesta interactiva" },
          "end": { "description": "Finalizar prematuramente una encuesta activa" },
          "list": { "description": "Revisar todas las encuestas activas en el servidor" }
        },
        "options": {
          "question": "Pregunta de la encuesta",
          "options": "Opciones separadas por | (ej. Sí | No | Quizás)",
          "duration": "Duración (ej. 1h, 30m, 2d)",
          "multiple": "Permitir varias opciones por miembro",
          "channel": "Canal de destino para la encuesta",
          "anonymous": "Ocultar resultados hasta que termine la encuesta (Pro)",
          "required_role": "Limitar votación a un rol específico (Pro)",
          "max_votes": "Máximo de opciones por usuario (Pro)",
          "id": "Identificador de 6 caracteres de la encuesta"
        }
      },
      "embed": {
        "created_title": "Encuesta Creada",
        "created_description": "Tu encuesta ha sido publicada con éxito en {{channel}}.",
        "field_question": "Pregunta",
        "field_options": "Opciones",
        "field_ends": "Finaliza el",
        "field_in": "Termina en",
        "field_mode": "Modo de Votación",
        "field_id": "ID de Encuesta",
        "mode_multiple": "Selección Múltiple",
        "mode_single": "Selección Única",
        "active_title": "Encuestas Activas en el Servidor",
        "active_empty": "No hay encuestas activas en este servidor ahora mismo.",
        "active_count_title": "Encuestas Activas ({{count}})",
        "active_footer": "Usa /poll end <id> para concluir una encuesta manualmente.",
        "active_item_votes": "votos"
      },
      "errors": {
        "pro_required": "✨ **Función Pro**: Las opciones avanzadas de encuestas requieren una suscripción Pro.",
        "min_options": "Debes proporcionar al menos 2 opciones distintas.",
        "max_options": "Se soporta un máximo de 10 opciones por encuesta.",
        "option_too_long": "Las opciones individuales no pueden exceder los 80 caracteres.",
        "min_duration": "La duración mínima es de 1 minuto.",
        "max_duration": "La duración máxima es de 30 días.",
        "poll_not_found": "No se pudo encontrar una encuesta activa con el ID `{{id}}`.",
        "manage_messages_required": "Necesitas el permiso 'Gestionar Mensajes' para finalizar encuestas manualmente."
      },
      "success": {
        "ended": "✅ La encuesta **\"{{question}}\"** ha sido finalizada."
      },
      "placeholder": "Preparando contenido de la encuesta..."
    },
    "staff": {
      "slash": {
        "description": "Utilidades exclusivas de gestión y moderación para staff",
        "subcommands": {
          "away_on": { "description": "Márcate como AUSENTE para dejar de recibir asignaciones" },
          "away_off": { "description": "Quitar estado ausente y volver a recibir tickets" },
          "my_tickets": { "description": "Lista todos los tickets reclamados actualmente por ti" },
          "warn_add": { "description": "Registrar una nueva advertencia para un miembro" },
          "warn_check": { "description": "Revisar el historial de advertencias de un miembro" },
          "warn_remove": { "description": "Eliminar una advertencia específica por ID" }
        },
        "options": {
          "reason": "Razón de ausencia (visible para otros staff)",
          "user": "Usuario objetivo",
          "warn_reason": "Razón de la infracción para la advertencia",
          "warning_id": "Identificador único de la advertencia"
        }
      },
      "moderation_required": "No tienes suficientes permisos para gestionar las advertencias de los miembros."
    },
    "config": {
      "slash": {
        "description": "✨ Consola premium de administración y configuración del servidor",
        "subcommands": {
          "status": { "description": "Ver el estado general del sistema y estatus comercial" },
          "tickets": { "description": "Revisar la salud operativa del sistema de tickets" },
          "center": { "description": "Abrir el centro de configuración interactivo" }
        }
      },
      "category": {
        "group_description": "Gestionar categorías de tickets y reglas de triaje",
        "add_description": "Añadir una nueva categoría de tickets",
        "remove_description": "Eliminar permanentemente una categoría del servidor",
        "list_description": "Listar todas las categorías de tickets activas",
        "edit_description": "Actualizar ajustes de una categoría existente",
        "toggle_description": "Activar o desactivar una categoría",
        "option_id": "Identificador de la categoría",
        "option_discord_category": "ID de la categoría de Discord de destino",
        "option_id_remove": "ID de la categoría a eliminar",
        "option_id_edit": "ID de la categoría a modificar",
        "option_label": "Etiqueta visible para usuarios",
        "option_description": "Descripción detallada de la categoría",
        "option_emoji": "Emoji de la categoría",
        "option_priority": "Prioridad predeterminada del ticket",
        "option_discord_category_edit": "Nuevo ID de categoría de Discord",
        "option_ping_roles": "Roles a notificar (IDs separados por comas)",
        "option_welcome_message": "Mensaje de bienvenida personalizado",
        "option_id_toggle": "ID de la categoría para cambiar estado"
      }
    },
    "ticket": {
      "slash": {
        "description": "Sistema principal de gestión e interacción con tickets",
        "subcommands": {
          "open": { "description": "Abrir un nuevo ticket de soporte" },
          "close": { "description": "Cerrar el ticket activo actual" },
          "reopen": { "description": "Reabrir un ticket previamente cerrado" },
          "claim": { "description": "Tomar responsabilidad del ticket actual" },
          "unclaim": { "description": "Liberar el ticket de tu responsabilidad" },
          "assign": { "description": "Asignar el ticket a otro miembro del staff" },
          "add": { "description": "Añadir un miembro a la conversación del ticket" },
          "remove": { "description": "Remover un miembro de la conversación del ticket" },
          "rename": { "description": "Cambiar el nombre del canal del ticket" },
          "priority": { "description": "Actualizar el nivel de prioridad del ticket" },
          "move": { "description": "Mover el ticket a otra categoría" },
          "transcript": { "description": "Generar una transcripción HTML de la charla" },
          "brief": { "description": "Generar un resumen conciso del caso" },
          "info": { "description": "Mostrar metadatos detallados sobre el ticket" },
          "history": { "description": "Revisar el historial de tickets de un usuario" }
        },
        "options": {
          "close_reason": "Razón para cerrar el ticket",
          "assign_staff": "Miembro del staff a asignar",
          "add_user": "Usuario a invitar",
          "remove_user": "Usuario a excluir",
          "rename_name": "Nuevo nombre del canal",
          "priority_level": "Nuevo nivel de prioridad",
          "history_user": "Usuario a revisar (por defecto tú)"
        }
      }
    },
    "center": {
      "general": {
        "title": "Centro de Configuración de TON618",
        "description": "Consola interactiva para gestionar tus módulos y reglas de automatización."
      },
      "sections": {
        "general": "Sistema General",
        "tickets": "Motor de Tickets",
        "automod": "Reglas AutoMod",
        "verification": "Identidad y Seguridad",
        "welcome": "Incorporación",
        "goodbye": "Salida",
        "staff": "Operaciones de Equipo",
        "commercial": "Estado de Plan y Pro"
      }
    },
    "tickets": {
      "labels": {
        "panel": "Panel de Tickets",
        "panel_status": "Estado del Panel",
        "logs": "Registros (Logs)",
        "transcripts": "Transcripciones",
        "staff": "Rol de Staff",
        "admin": "Rol de Admin del Bot",
        "public_panel_title": "Título del Panel Público",
        "public_panel_description": "Descripción del Panel Público",
        "welcome_message": "Bienvenida del Ticket",
        "control_embed_title": "Título del Control Staff",
        "control_embed_description": "Descripción del Control Staff",
        "public_panel_color": "Color del Panel (HEX)",
        "control_embed_color": "Color del Control (HEX)",
        "max_per_user": "Tickets Simultáneos",
        "global_limit": "Límite Global del Servidor",
        "cooldown": "Espera de Creación (Cooldown)",
        "minimum_days": "Edad Mín. Cuenta (Días)",
        "simple_help": "Modo Triage Simple",
        "base_sla": "Umbral SLA Base",
        "smart_ping": "Aviso Smart Ping",
        "auto_close": "Cierre Auto. por Inactividad",
        "auto_assignment": "Motor de Auto-Asignación",
        "online_only": "Solo Staff Online",
        "respect_away": "Respetar Estado Ausente",
        "sla_escalation": "Motor de Escalado SLA",
        "threshold": "Umbral de Escalado",
        "channel": "Canal de Alerta",
        "role": "Rol de Escalado",
        "sla_overrides": "Reglas SLA Especiales",
        "escalation_overrides": "Reglas de Escalado",
        "daily_report": "Informe de Rendimiento Diario",
        "weekly_report": "Resumen Ops Semanal",
        "status": "Estado Operativo",
        "scope": "Alcance por Categoría",
        "message": "Mensaje de Incidente",
        "configured_categories": "Categorías Activas"
      },
      "fields": {
        "channels_roles": "Infraestructura y Permisos",
        "commercial_status": "Comercial y Suscripción",
        "panel_messaging": "Experiencia de Usuario y Personalización",
        "limits_access": "Control de Acceso y Uso Justo",
        "sla_automation": "Inteligencia Operativa y Automatización",
        "escalation_reporting": "Reporte de Incidentes y Escalado",
        "incident_mode": "Modo Incidente e Interrupción"
      },
      "panel_status": {
        "not_configured": "🔴 NO CONFIGURADO",
        "published": "🟢 PUBLICADO",
        "pending": "🟡 PENDIENTE"
      },
      "incident": {
        "inactive": "El bot está operando normalmente",
        "default_message": "Actualmente estamos experimentando un alto volumen de tickets. Los tiempos de respuesta pueden ser mayores."
      },
      "categories": {
        "none": "No hay categorías configuradas",
        "on": "ACTIVO",
        "off": "INACTIVO",
        "pings": "{{count}} menciones",
        "more": "...y {{count}} más"
      },
      "footers": {
        "pro": "TON618 Pro | Inteligencia Operativa Activa",
        "free": "TON618 Ops Console | Edición Comunidad"
      }
    }
  };

  const keys = lang === 'en' ? enKeys : esKeys;
  
  // Custom append logic
  let output = content;
  for (const [key, value] of Object.entries(keys)) {
    // If the key already exists as a top-level property, we skip it to avoid duplicates
    // or we could merge them. For now, we skip if it exists.
    if (!output.includes(`  "${key}":`)) {
       output += `  "${key}": ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')},\n`;
    }
  }

  output = output.trim();
  if (output.endsWith(',')) output = output.slice(0, -1);
  output += '\n};';

  fs.writeFileSync(filePath, output);
  console.log(`[FIXED] ${lang}.js`);
}

fixLocale('en');
fixLocale('es');
