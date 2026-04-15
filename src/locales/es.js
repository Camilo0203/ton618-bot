module.exports = {
  "access": {
    "admin_required": "Necesitas permisos de administrador para usar este comando.",
    "default": "No tienes permisos para usar este comando.",
    "guild_only": "Este comando solo se puede usar dentro de un servidor.",
    "owner_only": "Este comando es solo para el owner del bot.",
    "staff_required": "Necesitas permisos de staff para usar este comando."
  },
  "alerts": {
    "action_check_business": "Verificar justificación de negocio",
    "action_check_health": "Verificar salud del bot",
    "action_investigate": "Investigar actividad del usuario",
    "action_review_deployments": "Revisar deployments recientes",
    "action_review_permissions": "Revisar permisos de administrador",
    "action_temporary_ban": "Considerar ban temporal si continúa el patrón",
    "action_verify_generator": "Verificar con generador de códigos",
    "action_verify_identity": "Verificar identidad del administrador",
    "security_alert": "Alerta de Seguridad",
    "security_system": "Sistema de Seguridad",
    "test_message": "Esta es una alerta de prueba para verificar que el sistema de notificación de seguridad funciona.",
    "test_recommendation": "Si ves esto, ¡el sistema de alertas está configurado correctamente!"
  },
  "audit": {
    "all": "Todos",
    "category_label": "Categoría",
    "empty": "No se encontraron tickets con esos filtros.",
    "export_title": "📊 Exportación de Auditoría Generada",
    "from_label": "Desde",
    "invalid_from": "Fecha 'desde' inválida. Use AAAA-MM-DD.",
    "invalid_range": "La fecha 'desde' debe ser anterior a 'hasta'.",
    "invalid_to": "Fecha 'hasta' inválida. Use AAAA-MM-DD.",
    "none": "Ninguno",
    "options": {
      "category": "Filtrar por categoría",
      "from": "Fecha de inicio en AAAA-MM-DD",
      "limit": "Cantidad máxima de filas (1-500)",
      "priority": "Filtrar por prioridad",
      "status": "Filtrar por estado del ticket",
      "to": "Fecha de fin en AAAA-MM-DD"
    },
    "priority_label": "Prioridad",
    "rows": "Filas totales",
    "slash": {
      "description": "Auditorías administrativas y exportaciones",
      "subcommands": {
        "tickets": {
          "description": "Exportar tickets a CSV con filtros"
        }
      }
    },
    "status_label": "Estado",
    "title": "Exportación de Auditoría",
    "to_label": "Hasta",
    "unsupported_subcommand": "Subcomando no soportado."
  },
  "automod": {
    "labels": {
      "invites": "Bloqueo de invitaciones",
      "regex": "Filtrado por patrones Regex",
      "scam": "Bloqueo de frases de estafa",
      "spam": "Prevención de Spam"
    }
  },
  "autorole": {
    "choices": {
      "mode_replace": "Reemplazar - Remover roles de nivel anteriores",
      "mode_stack": "Acumular - Mantener todos los roles de nivel anteriores"
    },
    "errors": {
      "add_failed": "❌ Error al agregar rol por reacción. Por favor intenta de nuevo.",
      "join_remove_failed": "❌ Error al remover el rol de entrada. Por favor intenta de nuevo.",
      "join_set_failed": "❌ Error al configurar el rol de entrada. Por favor intenta de nuevo.",
      "level_add_failed": "❌ Error al agregar rol de nivel. Por favor intenta de nuevo.",
      "level_remove_failed": "❌ Error al remover rol de nivel. Por favor intenta de nuevo.",
      "list_failed": "❌ Error al listar auto-roles. Por favor intenta de nuevo.",
      "message_not_found": "❌ Mensaje no encontrado en este canal. Asegúrate de que el ID del mensaje sea correcto.",
      "no_autoroles": "📭 No hay auto-roles configurados aún.",
      "no_level_roles": "📭 No hay roles de nivel configurados.",
      "not_found": "❌ Rol por reacción no encontrado.",
      "panel_failed": "❌ Error al crear el panel. Por favor intenta de nuevo.",
      "remove_failed": "❌ Error al remover rol por reacción. Por favor intenta de nuevo.",
      "role_hierarchy": "❌ No puedo asignar este rol porque es superior o igual a mi rol más alto."
    },
    "list": {
      "join_role": "👋 Rol de Entrada",
      "join_role_value": "Rol: {{role}}\nRetraso: {{delay}}s\nExcluir bots: {{excludeBots}}",
      "level_entry": "**Nivel {{level}}:** <@&{{roleId}}>",
      "level_roles": "📊 Roles de Nivel ({{mode}})",
      "message": "Mensaje",
      "reaction_roles": "⚡ Roles por Reacción",
      "title": "🎭 Configuración de Auto-Roles"
    },
    "options": {
      "autorole_join_set_delay_delay": "Retraso en segundos antes de asignar el rol",
      "autorole_join_set_exclude_bots_exclude_bots": "Excluir bots de recibir el rol",
      "autorole_join_set_role_role": "Rol a asignar cuando los usuarios se unan",
      "autorole_level_add_level_level": "Nivel requerido para recibir el rol",
      "autorole_level_add_role_role": "Rol a asignar en este nivel",
      "autorole_level_mode_mode_mode": "Modo para roles de nivel (acumular o reemplazar)",
      "autorole_level_remove_level_level": "Nivel del cual quitar el rol",
      "autorole_reaction_add_emoji_emoji": "Emoji para reaccionar",
      "autorole_reaction_add_message_id_message_id": "ID del mensaje para agregar rol por reacción",
      "autorole_reaction_add_role_role": "Rol a asignar al reaccionar",
      "autorole_reaction_panel_channel_channel": "Canal donde crear el panel (predeterminado: actual)",
      "autorole_reaction_panel_description_description": "Descripción para el panel",
      "autorole_reaction_panel_title_title": "Título para el panel",
      "autorole_reaction_remove_emoji_emoji": "Emoji a quitar",
      "autorole_reaction_remove_message_id_message_id": "ID del mensaje para quitar rol por reacción"
    },
    "panel": {
      "description": "¡Reacciona a este mensaje para obtener roles!\n\nHaz clic en las reacciones de abajo para alternar tus roles.",
      "footer": "Reacciona para obtener roles • Remueve la reacción para remover el rol",
      "title": "🎭 Selección de Roles"
    },
    "slash": {
      "description": "Configurar asignación automática de roles",
      "groups": {
        "join": "Gestionar roles de entrada",
        "level": "Gestionar roles de nivel",
        "reaction": "Gestionar roles por reacción"
      },
      "subcommands": {
        "join_remove": {
          "description": "Quitar el rol de entrada"
        },
        "join_set": {
          "description": "Configurar un rol para dar cuando los usuarios se unan",
          "options": {
            "delay": "Retraso en segundos antes de asignar (predeterminado: 0)",
            "exclude_bots": "Excluir bots de recibir el rol",
            "role": "Rol a asignar al unirse"
          }
        },
        "level_add": {
          "description": "Añadir una recompensa de rol por nivel",
          "options": {
            "level": "Nivel requerido",
            "role": "Rol a asignar"
          }
        },
        "level_list": {
          "description": "Listar todas las recompensas de rol por nivel"
        },
        "level_mode": {
          "description": "Configurar modo de roles de nivel",
          "options": {
            "mode": "Modo (acumular o reemplazar)"
          }
        },
        "level_remove": {
          "description": "Quitar una recompensa de rol por nivel",
          "options": {
            "level": "Nivel a quitar"
          }
        },
        "list": {
          "description": "Listar todas las configuraciones de auto-roles"
        },
        "reaction_add": {
          "description": "Agregar un rol por reacción a un mensaje",
          "options": {
            "emoji": "Emoji para reaccionar",
            "message_id": "ID del mensaje",
            "role": "Rol a asignar"
          }
        },
        "reaction_panel": {
          "description": "Crear un panel de roles por reacción",
          "options": {
            "channel": "Canal donde publicar el panel"
          }
        },
        "reaction_remove": {
          "description": "Quitar un rol por reacción de un mensaje",
          "options": {
            "emoji": "Emoji a quitar",
            "message_id": "ID del mensaje"
          }
        }
      }
    },
    "success": {
      "join_removed": "✅ Rol de entrada removido.",
      "join_set": "✅ ¡Rol de entrada configurado a {{role}}!\nRetraso: {{delay}} segundos\nExcluir bots: {{excludeBots}}",
      "level_added": "✅ ¡Rol de nivel agregado! Los usuarios que alcancen el nivel {{level}} recibirán {{role}}.",
      "level_removed": "✅ Rol de nivel removido para el nivel {{level}}.",
      "mode_set": "✅ Modo de roles de nivel configurado a **{{mode}}**.",
      "panel_created": "✅ ¡Panel de roles por reacción creado en {{channel}}!\n\nID del mensaje: `{{messageId}}`\n\nUsa `/autorole reaction add` para agregar roles a este panel.",
      "reaction_added": "✅ ¡Rol por reacción agregado! Los usuarios que reaccionen con {{emoji}} recibirán {{role}}.",
      "reaction_removed": "✅ Rol por reacción removido para {{emoji}}."
    }
  },
  "case_brief": {
    "actions": {
      "claim_or_assign": "Reclamar o asignar el ticket a un miembro del staff",
      "closed_no_action": "Ticket cerrado. No requiere acción.",
      "continue_normal": "Continuar atención normal del ticket",
      "near_sla_limit": "Resolver pronto - cerca del límite SLA",
      "review_reopen": "Revisar por qué fue reabierto y resolver definitivamente",
      "urgent_first_response": "🔴 **URGENTE**: Dar primera respuesta al usuario",
      "urgent_priority_resolve": "Resolver con prioridad urgente"
    },
    "closed": "🔒 Cerrado",
    "context_labels": {
      "age": "Edad",
      "assigned": "Asignado",
      "first_response": "1ª respuesta",
      "messages": "Mensajes",
      "pending": "⚠️ Pendiente",
      "reopenings": "Reaperturas",
      "responsible": "Responsable",
      "type": "Tipo",
      "unassigned": "⚠️ Sin asignar"
    },
    "footer": "Case Brief generado automáticamente por TON618",
    "next_action": "Siguiente Acción",
    "no_risk_factors": "Sin factores de riesgo detectados",
    "open": "🟢 Abierto",
    "operational_context": "Contexto Operativo",
    "pro_unlock_description": "Actualiza a **Pro** para desbloquear el Case Brief completo con análisis de riesgo, recomendaciones inteligentes y sugerencias de siguiente acción.",
    "pro_unlock_title": "Análisis de Riesgo y Recomendaciones",
    "recommendations": "Recomendaciones",
    "recommendations_list": {
      "consider_priority": "• Considerar elevar la prioridad con `/ticket priority`",
      "continue_normal": "• Continuar con el flujo normal de resolución",
      "document_resolution": "• Documentar resolución en notas internas",
      "escalate": "• Escalar a supervisor si no se puede resolver pronto",
      "respond_immediately": "• Responder inmediatamente al usuario",
      "review_history": "• Revisar historial con `/ticket history` antes de cerrar",
      "use_claim": "• Usar `/ticket claim` para tomar responsabilidad",
      "verify_user": "• Verificar si el usuario sigue necesitando ayuda"
    },
    "risk_level": "Nivel de Riesgo",
    "risks": {
      "extensive_conversation": "Conversación extensa (>50 mensajes)",
      "high_priority_category": "Categoría de alta prioridad",
      "outside_sla": "Fuera de SLA sin respuesta",
      "reopened_times": "Reabierto {{count}} veces",
      "unassigned_30min": "Sin asignar por más de 30 minutos",
      "urgent_priority": "Prioridad urgente"
    },
    "status": "Estado",
    "title": "📋 Case Brief - Ticket #{{ticketId}}"
  },
  "case_brief.actions.claim_or_assign": "Reclama o asigna este ticket.",
  "case_brief.actions.closed_no_action": "El ticket está cerrado. No se requiere acción.",
  "case_brief.actions.continue_normal": "Continúa con el manejo normal.",
  "case_brief.actions.near_sla_limit": "Responde antes de superar el umbral SLA.",
  "case_brief.actions.review_reopen": "Revisa el historial de reaperturas antes de responder.",
  "case_brief.actions.urgent_first_response": "Envía una primera respuesta de inmediato.",
  "case_brief.actions.urgent_priority_resolve": "Prioriza la resolución de forma urgente.",
  "case_brief.closed": "Cerrado",
  "case_brief.context_labels.age": "Antigüedad",
  "case_brief.context_labels.assigned": "Asignado",
  "case_brief.context_labels.first_response": "Primera respuesta",
  "case_brief.context_labels.messages": "Mensajes",
  "case_brief.context_labels.pending": "Pendiente",
  "case_brief.context_labels.reopenings": "Reaperturas",
  "case_brief.context_labels.responsible": "Responsable",
  "case_brief.context_labels.type": "Tipo",
  "case_brief.context_labels.unassigned": "Sin asignar",
  "case_brief.footer": "Resumen operativo del caso",
  "case_brief.next_action": "Siguiente acción",
  "case_brief.no_risk_factors": "No se detectaron factores de riesgo importantes.",
  "case_brief.open": "Abierto",
  "case_brief.operational_context": "Contexto operativo",
  "case_brief.pro_unlock_description": "Actualiza a Pro para desbloquear el resumen avanzado del caso.",
  "case_brief.pro_unlock_title": "Función Pro",
  "case_brief.recommendations": "Recomendaciones",
  "case_brief.recommendations_list.consider_priority": "Considera elevar la prioridad.",
  "case_brief.recommendations_list.continue_normal": "Continúa con el flujo estándar.",
  "case_brief.recommendations_list.document_resolution": "Documenta claramente la resolución final.",
  "case_brief.recommendations_list.escalate": "Escala al siguiente nivel de soporte.",
  "case_brief.recommendations_list.respond_immediately": "Responde de inmediato.",
  "case_brief.recommendations_list.review_history": "Revisa el historial previo de conversación.",
  "case_brief.recommendations_list.use_claim": "Usa claim o asigna propiedad.",
  "case_brief.recommendations_list.verify_user": "Verifica la última solicitud y expectativa del usuario.",
  "case_brief.risk_level": "Nivel de riesgo",
  "case_brief.risks.extensive_conversation": "Historial de conversación extenso",
  "case_brief.risks.high_priority_category": "Categoría de alta prioridad",
  "case_brief.risks.outside_sla": "Fuera del umbral SLA",
  "case_brief.risks.reopened_times": "Reabierto múltiples veces",
  "case_brief.risks.unassigned_30min": "Sin asignar por más de 30 minutos",
  "case_brief.risks.urgent_priority": "Prioridad urgente seleccionada",
  "case_brief.status": "Estado",
  "case_brief.title": "Resumen del Caso",
  "center": {
    "access": {
      "admin_only": "Admin only",
      "owner_only": "Owner only"
    },
    "actions": {
      "action_canceled": "Action canceled",
      "action_confirmed": "Action confirmed",
      "cancel": "Cancel",
      "clear_admin": "Clear admin",
      "clear_autorole": "Clear autorole",
      "clear_staff": "Clear staff",
      "clear_unverified": "Clear unverified",
      "clear_verified": "Clear verified",
      "clear_verify": "Clear verify",
      "confirm": "Confirmar",
      "confirm_fallback": "Confirmar fallback",
      "confirm_prompt": "Confirmar prompt",
      "export_with_id": "Exportar con ID",
      "export_without_id": "Exportar sin ID",
      "invalid_action_autoresponses": "Acción inválida para auto-respuestas",
      "invalid_action_blacklist": "Acción inválida para lista negra",
      "invalid_critical_action": "Acción crítica inválida",
      "maintenance_off": "Mantenimiento desactivado",
      "maintenance_on": "Mantenimiento activado",
      "no_backups_for_rollback": "No hay respaldos para rollback",
      "panel_published": "Panel publicado",
      "recent_backups": "Respaldos recientes",
      "rollback_latest": "Rollback al más reciente",
      "set_panel_channel_first": "Configura el canal del panel primero",
      "verification_panel_refreshed": "Panel de verificación actualizado"
    },
    "autoresponses": {
      "behavior_button": "Actualizar Comportamiento",
      "behavior_modal_title": "Actualizar Comportamiento de Auto-Respuesta",
      "behavior_saved": "Auto-response behavior actualizado exitosamente.",
      "button_create": "Crear Respuesta",
      "create_modal_content": "Contenido de Respuesta",
      "create_modal_title": "Crear Auto-Respuesta",
      "create_modal_trigger": "Palabra Disparadora",
      "current_behavior_label": "Comportamiento Actual",
      "delete_button": "Eliminar Respuesta"
    },
    "blacklist": {
      "no_reason": "Sin razón"
    },
    "general": {
      "description": "Consola interactiva para gestionar todos tus módulos y reglas de automatización.",
      "title": "Centro de Configuración TON618"
    },
    "modals": {
      "antiraid_title": "Antiraid título",
      "automation_title": "Automation título",
      "autoresponse_add_title": "Autoresponse add título",
      "autoresponse_delete_title": "Autoresponse delete título",
      "autoresponse_title": "Autoresponse título",
      "autoresponse_toggle_title": "Autoresponse toggle título",
      "blacklist_add_title": "Blacklist add título",
      "blacklist_check_title": "Blacklist check título",
      "blacklist_remove_title": "Blacklist remove título",
      "blacklist_title": "Blacklist título",
      "command_rate_limit_title": "Command rate limit título",
      "field_action": "Field action",
      "field_answer": "Field answer",
      "field_auto_close": "Field auto close",
      "field_backup_id": "Field backup id",
      "field_banner": "Field banner",
      "field_bypass_admin": "Field bypass admin",
      "field_cmd_max": "Field cmd max",
      "field_cmd_window": "Field cmd window",
      "field_color": "Field color",
      "field_cooldown": "Field cooldown",
      "field_description": "Field description",
      "field_exact_trigger": "Field exact trigger",
      "field_footer": "Field pie de página",
      "field_global_limit": "Field global limit",
      "field_image": "Field image",
      "field_joins": "Field joins",
      "field_json": "Field json",
      "field_max_actions": "Field max actions",
      "field_message": "Field message",
      "field_min_days": "Field min días",
      "field_question": "Field question",
      "field_reason": "Field reason",
      "field_reason_clear": "Field reason clear",
      "field_response": "Field response",
      "field_seconds": "Field seconds",
      "field_sla": "Field sla",
      "field_smart_ping": "Field smart ping",
      "field_title": "Field título",
      "field_transcript_channel": "Field transcript channel",
      "field_trigger": "Field trigger",
      "field_user_id": "Field user id",
      "field_weekly_report_channel": "Field weekly report channel",
      "field_window": "Field window",
      "goodbye_text_title": "Goodbye text título",
      "import_title": "Import título",
      "limits_title": "Limits título",
      "maintenance_reason_title": "Maintenance reason título",
      "rate_limit_title": "Rate limit título",
      "rollback_title": "Rollback título",
      "verify_panel_title": "Verify panel título",
      "verify_question_title": "Verify question título",
      "welcome_text_title": "Welcome text título"
    },
    "responses": {
      "antiraid_updated": "Antiraid updated",
      "auto_response_saved": "Auto response saved",
      "automation_updated": "Automation updated",
      "backup_id_required": "Backup id required",
      "backup_not_found": "Backup not found",
      "blacklist_entry": "Blacklist entry",
      "blacklist_not_found": "Blacklist not found",
      "cannot_block_self": "Cannot block self",
      "command_rate_limit_updated": "Command rate limit updated",
      "goodbye_channel_missing": "Goodbye channel missing",
      "goodbye_default_message": "Goodbye default message",
      "goodbye_default_title": "Goodbye default título",
      "goodbye_test_suffix": "Goodbye test suffix",
      "goodbye_text_updated": "Goodbye text updated",
      "import_payload_required": "Import payload required",
      "import_success": "Import éxito",
      "invalid_antiraid_action": "Invalid antiraid action",
      "invalid_banner": "Invalid banner",
      "invalid_color": "Invalid color",
      "invalid_image": "Invalid image",
      "invalid_json": "Invalid json",
      "invalid_transcript_channel_id": "Invalid transcript channel id",
      "invalid_user_id": "Invalid user id",
      "invalid_weekly_report_channel_id": "Invalid weekly report channel id",
      "limits_updated": "Limits updated",
      "maintenance_reason_updated": "Maintenance reason updated",
      "question_answer_required": "Question answer required",
      "rate_limit_updated": "Rate limit updated",
      "rollback_applied": "Rollback applied",
      "set_goodbye_channel_first": "Set goodbye channel first",
      "set_welcome_channel_first": "Set welcome channel first",
      "test_sent": "Test sent",
      "trigger_and_response_required": "Trigger and response required",
      "trigger_deleted": "Trigger deleted",
      "trigger_missing": "Trigger missing",
      "trigger_required": "Trigger required",
      "trigger_state": "Trigger state",
      "unsupported_modal": "Unsupported modal",
      "user_blocked": "Usuario blocked",
      "user_not_blacklisted": "Usuario not blacklisted",
      "user_removed": "Usuario removido",
      "verification_panel_updated": "Verification panel updated",
      "verification_question_updated": "Verification question updated",
      "welcome_channel_missing": "Welcome channel missing",
      "welcome_default_message": "Welcome default message",
      "welcome_default_title": "Welcome default título",
      "welcome_test_suffix": "Welcome test suffix",
      "welcome_text_updated": "Welcome text updated"
    },
    "sections": {
      "automod": "Reglas de AutoMod",
      "commercial": "Plan y Estado Pro",
      "general": "Sistema General",
      "goodbye": "Despedida",
      "staff": "Operaciones de Equipo",
      "tickets": "Motor de Tickets",
      "verification": "Identidad y Seguridad",
      "welcome": "Bienvenida"
    },
    "verify": {
      "stats_failed": "Stats failed",
      "stats_kicked": "Stats kicked",
      "stats_recent": "Stats recent",
      "stats_title": "Stats título",
      "stats_total": "Stats total",
      "stats_verified": "Stats verified"
    }
  },
  "center.access.admin_only": "Solo los administradores pueden usar esta acción.",
  "center.access.owner_only": "Solo el propietario de este panel puede usar esta acción.",
  "center.actions.action_canceled": "Acción cancelada.",
  "center.actions.action_confirmed": "Acción confirmada.",
  "center.actions.cancel": "Cancelar",
  "center.actions.clear_admin": "Quitar rol de admin",
  "center.actions.clear_autorole": "Quitar autorole",
  "center.actions.clear_staff": "Quitar rol de staff",
  "center.actions.clear_unverified": "Quitar rol sin verificar",
  "center.actions.clear_verified": "Quitar rol verificado",
  "center.actions.clear_verify": "Quitar rol de verify",
  "center.actions.confirm": "Confirmar",
  "center.actions.confirm_fallback": "Acción crítica",
  "center.actions.confirm_prompt": "¿Seguro que quieres ejecutar: {{action}}?",
  "center.actions.export_with_id": "Configuración exportada. ID del respaldo: `{{id}}`.",
  "center.actions.export_without_id": "Configuración exportada correctamente.",
  "center.actions.invalid_action_autoresponses": "Acción de autorespuestas no soportada.",
  "center.actions.invalid_action_blacklist": "Acción de blacklist no soportada.",
  "center.actions.invalid_critical_action": "Esa acción crítica ya no es válida.",
  "center.actions.maintenance_off": "Modo mantenimiento desactivado.",
  "center.actions.maintenance_on": "Modo mantenimiento activado.",
  "center.actions.no_backups_for_rollback": "No hay respaldos disponibles para revertir.",
  "center.actions.panel_published": "Panel de verificación publicado correctamente.",
  "center.actions.recent_backups": "Respaldos recientes: {{list}}",
  "center.actions.rollback_latest": "Revertir último respaldo",
  "center.actions.set_panel_channel_first": "Configura primero el canal del panel de verificación.",
  "center.actions.verification_panel_refreshed": "Panel de verificación actualizado.",
  "center.blacklist.no_reason": "Sin razón proporcionada.",
  "center.modals.antiraid_title": "Anti-raid",
  "center.modals.automation_title": "Automatización",
  "center.modals.autoresponse_add_title": "Agregar Auto Respuesta",
  "center.modals.autoresponse_delete_title": "Eliminar Auto Respuesta",
  "center.modals.autoresponse_title": "Auto Respuesta",
  "center.modals.autoresponse_toggle_title": "Cambiar Estado de Auto Respuesta",
  "center.modals.blacklist_add_title": "Bloquear Usuario",
  "center.modals.blacklist_check_title": "Revisar Entrada de Blacklist",
  "center.modals.blacklist_remove_title": "Eliminar Entrada de Blacklist",
  "center.modals.blacklist_title": "Blacklist",
  "center.modals.command_rate_limit_title": "Rate Limits de Comandos",
  "center.modals.field_action": "Acción",
  "center.modals.field_answer": "Respuesta",
  "center.modals.field_auto_close": "Minutos de auto-cierre",
  "center.modals.field_backup_id": "ID del respaldo",
  "center.modals.field_banner": "URL del banner",
  "center.modals.field_bypass_admin": "Omitir admins (true/false)",
  "center.modals.field_cmd_max": "Máximo de comandos",
  "center.modals.field_cmd_window": "Ventana de comandos en segundos",
  "center.modals.field_color": "Color",
  "center.modals.field_cooldown": "Cooldown (minutos)",
  "center.modals.field_description": "Descripción",
  "center.modals.field_exact_trigger": "Trigger exacto",
  "center.modals.field_footer": "Pie",
  "center.modals.field_global_limit": "Límite global de tickets",
  "center.modals.field_image": "URL de imagen",
  "center.modals.field_joins": "Umbral de entradas",
  "center.modals.field_json": "Payload JSON",
  "center.modals.field_max_actions": "Máximo de acciones",
  "center.modals.field_message": "Mensaje",
  "center.modals.field_min_days": "Días mínimos de cuenta",
  "center.modals.field_question": "Pregunta",
  "center.modals.field_reason": "Razón",
  "center.modals.field_reason_clear": "Razón o CLEAR",
  "center.modals.field_response": "Respuesta",
  "center.modals.field_seconds": "Ventana en segundos",
  "center.modals.field_sla": "Minutos de aviso SLA",
  "center.modals.field_smart_ping": "Minutos de smart ping",
  "center.modals.field_title": "Título",
  "center.modals.field_transcript_channel": "ID del canal de transcripciones",
  "center.modals.field_trigger": "Trigger",
  "center.modals.field_user_id": "ID del usuario",
  "center.modals.field_weekly_report_channel": "ID del canal de reporte semanal",
  "center.modals.field_window": "Ventana en segundos",
  "center.modals.goodbye_text_title": "Texto de Despedida",
  "center.modals.import_title": "Importar Configuración",
  "center.modals.limits_title": "Límites",
  "center.modals.maintenance_reason_title": "Razón de Mantenimiento",
  "center.modals.rate_limit_title": "Rate Limits de Interacción",
  "center.modals.rollback_title": "Revertir Configuración",
  "center.modals.verify_panel_title": "Panel de Verificación",
  "center.modals.verify_question_title": "Pregunta de Verificación",
  "center.modals.welcome_text_title": "Texto de Bienvenida",
  "center.responses.antiraid_updated": "Ajustes de anti-raid actualizados.",
  "center.responses.auto_response_saved": "Auto respuesta guardada.",
  "center.responses.automation_updated": "Ajustes de automatización actualizados correctamente.",
  "center.responses.backup_id_required": "Proporciona un ID de respaldo.",
  "center.responses.backup_not_found": "No se encontró el respaldo.",
  "center.responses.blacklist_entry": "Entrada de blacklist para `{{userId}}`: {{reason}}",
  "center.responses.blacklist_not_found": "No se encontró entrada de blacklist para ese usuario.",
  "center.responses.cannot_block_self": "No puedes bloquearte a ti mismo.",
  "center.responses.command_rate_limit_updated": "Rate limits de comandos actualizados.",
  "center.responses.goodbye_channel_missing": "El canal de despedida configurado falta o no es accesible.",
  "center.responses.goodbye_default_message": "{{user}} ha salido del servidor.",
  "center.responses.goodbye_default_title": "Despedida de {{guild}}",
  "center.responses.goodbye_test_suffix": "Este es un mensaje de despedida de prueba.",
  "center.responses.goodbye_text_updated": "Texto de despedida actualizado correctamente.",
  "center.responses.import_payload_required": "Pega un payload JSON para importar.",
  "center.responses.import_success": "Configuración importada correctamente.",
  "center.responses.invalid_antiraid_action": "Acción de anti-raid inválida.",
  "center.responses.invalid_banner": "La URL del banner debe comenzar con `http://` o `https://`.",
  "center.responses.invalid_color": "El color debe ser un código hexadecimal válido de 6 dígitos.",
  "center.responses.invalid_image": "La URL de imagen debe comenzar con `http://` o `https://`.",
  "center.responses.invalid_json": "El JSON proporcionado es inválido.",
  "center.responses.invalid_transcript_channel_id": "El ID del canal de transcripciones es inválido.",
  "center.responses.invalid_user_id": "El ID del usuario es inválido.",
  "center.responses.invalid_weekly_report_channel_id": "El ID del canal de reporte semanal es inválido.",
  "center.responses.limits_updated": "Límites actualizados correctamente.",
  "center.responses.maintenance_reason_updated": "Razón de mantenimiento actualizada.",
  "center.responses.question_answer_required": "Pregunta y respuesta son obligatorias.",
  "center.responses.rate_limit_updated": "Rate limits de interacción actualizados.",
  "center.responses.rollback_applied": "Rollback aplicado correctamente.",
  "center.responses.set_goodbye_channel_first": "Configura primero un canal de despedida.",
  "center.responses.set_welcome_channel_first": "Configura primero un canal de bienvenida.",
  "center.responses.test_sent": "Mensaje de prueba enviado a {{channel}}.",
  "center.responses.trigger_and_response_required": "Trigger y respuesta son obligatorios.",
  "center.responses.trigger_deleted": "Trigger eliminado.",
  "center.responses.trigger_missing": "No se encontró ese trigger.",
  "center.responses.trigger_required": "El trigger es obligatorio.",
  "center.responses.trigger_state": "El trigger `{{trigger}}` ahora está **{{state}}**.",
  "center.responses.unsupported_modal": "Modal no soportado.",
  "center.responses.user_blocked": "Usuario bloqueado correctamente.",
  "center.responses.user_not_blacklisted": "Ese usuario no está en la blacklist.",
  "center.responses.user_removed": "Usuario eliminado de la blacklist.",
  "center.responses.verification_panel_updated": "Panel de verificación actualizado correctamente.",
  "center.responses.verification_question_updated": "Pregunta de verificación actualizada.",
  "center.responses.welcome_channel_missing": "El canal de bienvenida configurado falta o no es accesible.",
  "center.responses.welcome_default_message": "Nos alegra tenerte aquí, {{user}}.",
  "center.responses.welcome_default_title": "¡Bienvenido a {{guild}}!",
  "center.responses.welcome_test_suffix": "Este es un mensaje de bienvenida de prueba.",
  "center.responses.welcome_text_updated": "Texto de bienvenida actualizado correctamente.",
  "center.verify.stats_failed": "Fallidos",
  "center.verify.stats_kicked": "Expulsados",
  "center.verify.stats_recent": "Actividad reciente",
  "center.verify.stats_title": "Estadísticas de Verificación",
  "center.verify.stats_total": "Total",
  "center.verify.stats_verified": "Verificados",
  "commands": {
    "audit_disabled": "Auditoría deshabilitado"
  },
  "commands.audit_disabled": "Comando deshabilitado",
  "commercial": {
    "lines": {
      "current_plan": "Plan actual: `{{plan}}`",
      "plan_expires": "Expira el plan: {{value}}",
      "plan_note": "Nota del plan: {{note}}",
      "plan_source": "Origen del plan: `{{source}}`",
      "status_expired": "Estado del plan: `expirado -> funcionando como free`",
      "stored_plan": "Plan guardado: `{{plan}}`",
      "supporter": "Supporter: {{value}}",
      "supporter_expires": "Supporter expira: `{{date}}`"
    },
    "pro_required": {
      "button_label": "Comprar Pro | Soporte",
      "current_plan": "Plan actual",
      "description": "**{{feature}}** es una función exclusiva del plan Pro.\nSi deseas utilizar esta función PRO, ve a nuestro servidor de Soporte y crea un ticket de compra. ¡También puedes donarnos para apoyar el proyecto si quieres!",
      "footer": "TON618 Commercial Services",
      "supporter": "Supporter",
      "title": "Pro requerido",
      "upgrade_cta": "Únete al Servidor de Soporte para adquirir el plan",
      "upgrade_label": "🚀 Obtener Pro"
    },
    "values": {
      "enabled": "Activado",
      "inactive": "Inactivo",
      "never": "Nunca",
      "unknown": "desconocido"
    }
  },
  "common": {
    "all": "Todos",
    "buttons": {
      "english": "Inglés",
      "enter_code": "Ingresar Código",
      "resend_code": "Reenviar Código",
      "spanish": "Español"
    },
    "closed": "Cerrado",
    "currency": {
      "coins": "monedas"
    },
    "details": "Detalles",
    "disabled": "Desactivado",
    "enabled": "Activado",
    "errors": {
      "bot_missing_permissions": "El bot no tiene los siguientes permisos para realizar esta acción: {{permissions}}."
    },
    "footer": {
      "tickets": "Tickets de TON618"
    },
    "invalid_date": "Invalid date",
    "labels": {
      "assigned_to": "Asignado a",
      "category": "Categoría",
      "channel": "Canal",
      "created": "Creado",
      "error": "Error",
      "last_updated": "Last updated",
      "mode": "Modo",
      "notes": "Notas",
      "onboarding_status": "Onboarding estado",
      "panel_message": "Mensaje del Panel",
      "priority": "Prioridad",
      "reason": "Razón",
      "status": "Estado",
      "ticket_id": "ID de Ticket",
      "unverified_role": "Rol No Verificado",
      "user": "Usuario",
      "verified_role": "Rol Verificado",
      "warnings": "Advertencias"
    },
    "language": {
      "en": "Inglés",
      "es": "Español"
    },
    "no": "No",
    "no_backups": "No backups",
    "no_reason": "Sin razón",
    "no_recent_activity": "No recent activity",
    "none": "Ninguno",
    "off": "Apagado",
    "on": "Encendido",
    "open": "Abierto",
    "quick_actions": "Acciones rápidas",
    "recommendations": "Recomendaciones",
    "setup_hint": {
      "run_setup": "Usa `/setup wizard` para comenzar a configurar el bot."
    },
    "state": {
      "disabled": "Deshabilitado",
      "enabled": "Habilitado"
    },
    "time": {
      "minutes_plural": "Minutes plural"
    },
    "units": {
      "days_short": "Days short",
      "hours_short": "Hours short",
      "minutes_short": "Minutes short",
      "weeks_short": "Weeks short"
    },
    "value": {
      "no_data": "Sin datos"
    },
    "yes": "Sí"
  },
  "common.invalid_date": "Fecha inválida.",
  "common.labels.last_updated": "Última actualización",
  "common.labels.onboarding_status": "Estado del onboarding",
  "common.labels.reason": "Razón",
  "common.no_backups": "No hay respaldos disponibles.",
  "common.no_recent_activity": "No hay actividad reciente.",
  "common.time.minutes_plural": "{{count}} minutos",
  "common.units.days_short": "d",
  "common.units.hours_short": "h",
  "common.units.minutes_short": "m",
  "common.units.weeks_short": "sem",
  "config": {
    "category": {
      "add_description": "Inicializar una nueva categoría de tickets",
      "add_success_description": "Add éxito description",
      "add_title": "Add título",
      "add_verification_failed": "Add verification failed",
      "add_verification_success": "Add verification éxito",
      "admin_only": "Admin only",
      "edit_description": "Actualizar ajustes de una categoría existente",
      "edit_discord_line": "Edit discord line",
      "edit_emoji_line": "Edit emoji line",
      "edit_ping_line": "Edit ping line",
      "edit_success_message": "Edit éxito message",
      "edit_title": "Edit título",
      "edit_welcome_line": "Edit welcome line",
      "error_generic": "Error generic",
      "error_no_category": "Error no categoría",
      "error_no_fields": "Error no fields",
      "error_not_found": "Error not found",
      "error_remove_failed": "Error remove failed",
      "footer": "Footer",
      "footer_free": "Footer free",
      "group_description": "Gestionar categorías de tickets y reglas de triaje",
      "list_description": "Listar todas las categorías de tickets activas",
      "list_description_empty": "List description vacío",
      "list_description_empty_free": "List description vacío free",
      "list_extras_discord": "List extras discord",
      "list_extras_ping_roles": "List extras ping roles",
      "list_extras_welcome": "List extras welcome",
      "list_pro_note": "List pro nota",
      "list_status_disabled": "List estado deshabilitado",
      "list_status_enabled": "List estado habilitado",
      "list_title": "List título",
      "list_title_empty": "List título vacío",
      "option_description": "Descripción detallada de la categoría",
      "option_discord_category": "ID de la categoría de Discord de destino",
      "option_discord_category_edit": "Nuevo ID de categoría de Discord",
      "option_emoji": "Emoji de la categoría",
      "option_id": "Identificador de la categoría",
      "option_id_edit": "ID de la categoría a modificar",
      "option_id_remove": "ID de la categoría a eliminar",
      "option_id_toggle": "ID de la categoría para cambiar estado",
      "option_label": "Etiqueta visible para usuarios",
      "option_ping_roles": "Roles a notificar (IDs separados por comas)",
      "option_priority": "Prioridad de ticket predeterminada",
      "option_welcome_message": "Mensaje de bienvenida personalizado",
      "remove_description": "Eliminar permanentemente una categoría del servidor",
      "remove_success_message": "Remove éxito message",
      "remove_title": "Remove título",
      "toggle_description": "Activar o desactivar una categoría",
      "toggle_description_disabled": "Toggle description deshabilitado",
      "toggle_description_enabled": "Toggle description habilitado",
      "toggle_title_disabled": "Toggle título deshabilitado",
      "toggle_title_enabled": "Toggle título habilitado"
    },
    "slash": {
      "description": "Consola premium de administración y configuración del servidor",
      "subcommands": {
        "center": {
          "description": "Abrir el centro de configuración interactivo"
        },
        "status": {
          "description": "Ver el estado general del sistema y estado comercial"
        },
        "tickets": {
          "description": "Revisar la salud operativa del sistema de tickets"
        }
      }
    }
  },
  "config.category.add_success_description": "Se creó la categoría `{{categoryId}}` como **{{label}}**. {{verification}}",
  "config.category.add_title": "Categoría Creada",
  "config.category.add_verification_failed": "Las verificaciones requieren atención.",
  "config.category.add_verification_success": "Las verificaciones pasaron correctamente.",
  "config.category.admin_only": "Solo los administradores pueden gestionar categorías de tickets.",
  "config.category.edit_discord_line": "Categoría de Discord: {{discordCategory}}",
  "config.category.edit_emoji_line": "Emoji: {{emoji}}",
  "config.category.edit_ping_line": "Roles de ping: {{count}}",
  "config.category.edit_success_message": "Se actualizó **{{label}}**.\nEstado: {{status}}\n{{emojiLine}}{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}",
  "config.category.edit_title": "Categoría Actualizada",
  "config.category.edit_welcome_line": "Mensaje de bienvenida personalizado activado",
  "config.category.error_generic": "Ocurrió un problema al actualizar las categorías. {{message}}",
  "config.category.error_no_category": "La categoría `{{categoryId}}` no existe.",
  "config.category.error_no_fields": "Proporciona al menos un campo para actualizar.",
  "config.category.error_not_found": "No se encontró la categoría `{{categoryId}}`.",
  "config.category.error_remove_failed": "No se pudo eliminar la categoría seleccionada.",
  "config.category.footer": "Controles de Categorías TON618",
  "config.category.footer_free": "TON618 Edición Comunitaria",
  "config.category.list_description_empty": "Aún no hay categorías de tickets configuradas.",
  "config.category.list_description_empty_free": "Aún no hay categorías de tickets configuradas. Pro desbloquea enrutamiento avanzado por categorías.",
  "config.category.list_extras_discord": "Categoría de Discord enlazada",
  "config.category.list_extras_ping_roles": "{{count}} rol(es) de ping",
  "config.category.list_extras_welcome": "Mensaje de bienvenida personalizado",
  "config.category.list_pro_note": "Actualiza a Pro para reglas avanzadas de categorías, prioridades y enrutamiento.",
  "config.category.list_status_disabled": "Desactivada",
  "config.category.list_status_enabled": "Activada",
  "config.category.list_title": "Categorías Configuradas: {{count}}",
  "config.category.list_title_empty": "No Hay Categorías Configuradas",
  "config.category.remove_success_message": "Se eliminó la categoría `{{categoryId}}` (**{{label}}**).",
  "config.category.remove_title": "Categoría Eliminada",
  "config.category.toggle_description_disabled": "**{{label}}** ahora está desactivada.",
  "config.category.toggle_description_enabled": "**{{label}}** ahora está activada.",
  "config.category.toggle_title_disabled": "Categoría Desactivada",
  "config.category.toggle_title_enabled": "Categoría Activada",
  "crons": {
    "auto_close": {
      "archive_warning_error": "Archivar warning error",
      "archive_warning_inaccessible": "Archivar warning inaccessible",
      "archive_warning_transcript": "Archivar warning transcript",
      "embed_desc_auto": "Embed desc auto",
      "embed_title_auto": "Embed título auto",
      "embed_title_manual": "Embed título manual",
      "event_desc": "Evento desc",
      "title": "Ticket cerrado automáticamente",
      "warning_desc": "Advertencia desc"
    },
    "messageDelete": {
      "fields": {
        "author": "Autor",
        "channel": "Canal",
        "content": "Contenido"
      },
      "footer": "ID de Mensaje: {{id}}",
      "no_text": "*(sin texto)*",
      "title": "Mensaje eliminado",
      "unknown_author": "Desconocido"
    },
    "modlog": {
      "ban_title": "🔨 Usuario Baneado",
      "edit_title": "✏️ Mensaje Editado",
      "fields": {
        "after": "Después",
        "author": "👤 Autor",
        "before": "Antes",
        "channel": "📍 Canal",
        "executor": "🛡️ Ejecutado por",
        "link": "Enlace del Mensaje",
        "reason": "Razón",
        "user": "👤 Usuario"
      },
      "no_reason": "Sin razón especificada",
      "unban_title": "✅ Usuario Desbaneado"
    },
    "polls": {
      "ended_desc": "Ended desc",
      "ended_title": "Ended title"
    },
    "reminders": {
      "field_ago": "Field ago",
      "footer": "Recordatorio de TON618",
      "title": "Title"
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
  "crons.reminders.title": "Recordatorio",
  "daily_sla_report": {
    "avg_first_response": "Prom. Primera Respuesta",
    "closed_24h": "Cerrados (24h)",
    "no_closures": "No se registraron cierres en las últimas 24h.",
    "no_data": "Sin datos",
    "no_sla_threshold": "Sin umbral SLA",
    "open_escalated": "Escalados",
    "open_out_of_sla": "Fuera de SLA",
    "opened_24h": "Abiertos (24h)",
    "sla_compliance": "Cumplimiento SLA",
    "title": "Reporte Diario de SLA",
    "top_staff": "Top Staff (Cierres)",
    "window": "Ventana de monitoreo: {{from}} a {{to}}"
  },
  "daily_sla_report.avg_first_response": "Promedio de primera respuesta",
  "daily_sla_report.closed_24h": "Cerrados (24h)",
  "daily_sla_report.no_closures": "No hubo tickets cerrados en esta ventana.",
  "daily_sla_report.no_data": "Aún no hay datos suficientes para construir el reporte SLA.",
  "daily_sla_report.no_sla_threshold": "No hay umbral SLA configurado.",
  "daily_sla_report.open_escalated": "Abiertos escalados",
  "daily_sla_report.open_out_of_sla": "Abiertos fuera de SLA",
  "daily_sla_report.opened_24h": "Abiertos (24h)",
  "daily_sla_report.sla_compliance": "Cumplimiento SLA",
  "daily_sla_report.title": "Reporte Diario SLA",
  "daily_sla_report.top_staff": "Top staff",
  "daily_sla_report.window": "Ventana",
  "dashboard": {
    "all_active": "Todo el equipo está activo ✅",
    "auto_update": "🔄 Actualización automática cada 30s",
    "away_staff": "💤 Staff Ausente",
    "closed_today": "🔴 Cerrados Hoy",
    "description": "📡 *Este panel se actualiza en tiempo real*",
    "global_stats": "📈 Estadísticas Globales",
    "no_data": "Aún no hay datos",
    "no_recent_activity": "Sin actividad reciente registrada.",
    "observability": "📡 Observabilidad",
    "open_tickets": "🟢 Tickets Abiertos",
    "opened_today": "📅 Abiertos Hoy",
    "title": "📊 Centro de Control y Estadísticas",
    "top_staff": "🏆 Top Staff",
    "total_tickets": "📊 Total de Tickets",
    "update_button": "Actualizar Panel"
  },
  "debug": {
    "access_denied": "No tienes permisos para usar comandos de debug.",
    "description": {
      "automod": "Conteo en vivo, solo para owner, de reglas de AutoMod gestionadas por TON618 en las guilds conectadas.",
      "cache": "Discord.js gestiona la cache automaticamente.",
      "health": "Snapshot de la ventana activa mas el ultimo heartbeat persistido.",
      "voice": "Las colas de musica se gestionan por guild."
    },
    "field": {
      "api_ping": "Ping de API",
      "cached_channels": "Canales en cache",
      "cached_users": "Usuarios en cache",
      "channels": "Canales",
      "deploy": "Deploy",
      "external": "External",
      "guild_coverage": "Cobertura por Guild",
      "guilds": "Guilds",
      "guilds_attention": "Guilds que requieren atención",
      "guilds_live_rules": "Guilds con reglas vivas de TON618",
      "heap_total": "Heap total",
      "heap_used": "Heap usado",
      "heartbeat": "Heartbeat",
      "interaction_window": "Ventana de interacciones",
      "progress": "Progreso",
      "quick_state": "Estado rapido",
      "rss": "RSS",
      "top_errors": "Errores principales",
      "uptime": "Tiempo activo",
      "users": "Usuarios"
    },
    "no_connected_guilds": "No hay guilds conectadas.",
    "options": {
      "debug_entitlements_set-plan_expires_in_days_expires_in_days": "Duración opcional en días para Pro",
      "debug_entitlements_set-plan_guild_id_guild_id": "ID del servidor objetivo",
      "debug_entitlements_set-plan_note_note": "Nota interna opcional",
      "debug_entitlements_set-plan_tier_tier": "Nivel de plan",
      "debug_entitlements_set-supporter_active_active": "Activar o desactivar reconocimiento de supporter",
      "debug_entitlements_set-supporter_expires_in_days_expires_in_days": "Duración opcional en días para estado de supporter",
      "debug_entitlements_set-supporter_guild_id_guild_id": "ID del servidor objetivo",
      "debug_entitlements_set-supporter_note_note": "Nota interna opcional",
      "debug_entitlements_status_guild_id_guild_id": "ID del servidor objetivo"
    },
    "slash": {
      "description": "Herramientas de diagnóstico y derechos solo para el propietario",
      "subcommands": {
        "automod_badge": {
          "description": "Ver progreso de insignia de AutoMod en vivo en todos los servidores"
        },
        "cache": {
          "description": "Ver tamaños de caché del bot"
        },
        "entitlements_set_plan": {
          "description": "Establecer un plan de servidor manualmente"
        },
        "entitlements_set_supporter": {
          "description": "Activar o desactivar reconocimiento de supporter"
        },
        "entitlements_status": {
          "description": "Inspeccionar el plan efectivo y estado de supporter para un servidor"
        },
        "guilds": {
          "description": "Listar servidores conectados"
        },
        "health": {
          "description": "Ver estado de salud y latido en vivo"
        },
        "memory": {
          "description": "Ver uso de memoria del proceso"
        },
        "status": {
          "description": "Ver estado del bot e información de despliegue"
        },
        "voice": {
          "description": "Ver estado del subsistema de música"
        }
      }
    },
    "title": {
      "automod": "Progreso del Badge de AutoMod",
      "cache": "Estado de Cache",
      "entitlements": "Entitlements de la Guild",
      "guilds": "Guilds Conectadas",
      "health": "Salud del Bot",
      "memory": "Uso de Memoria",
      "plan_updated": "Plan Actualizado",
      "status": "Estado del Bot",
      "supporter_updated": "Supporter Actualizado",
      "voice": "Subsistema de Musica"
    },
    "unknown_subcommand": "Subcomando desconocido.",
    "value": {
      "app_flag_present": "Flag de la app presente: {{value}}",
      "automod_enabled": "AutoMod activado: `{{count}}`",
      "error_rate": "Tasa de error: **{{state}}** ({{value}}%, umbral {{threshold}}%)",
      "failed_partial_sync": "Sync fallida o parcial: `{{count}}`",
      "heartbeat": "Ultima vez visto: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      "high": "ALTO",
      "interaction_totals": "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      "managed_rules": "Reglas gestionadas: `{{count}}`",
      "missing_permissions": "Permisos faltantes: `{{count}}`",
      "no": "No",
      "ok": "OK",
      "ping_state": "Ping: **{{state}}** ({{value}}ms, umbral {{threshold}}ms)",
      "remaining_to_goal": "Restantes para {{goal}}: `{{count}}`",
      "yes": "Si"
    }
  },
  "economy": {
    "buy": {
      "crate_win": "Crate win",
      "error": "Error",
      "insufficient_funds": "Insufficient funds",
      "not_found": "Not found",
      "success": "Success"
    },
    "daily": {
      "already_claimed": "Already reclamado",
      "error": "Error",
      "success": "Success"
    },
    "deposit": {
      "error": "Error",
      "insufficient": "Insufficient",
      "success": "Success"
    },
    "items": {
      "background": {
        "description": "Fondo personalizado para profile",
        "name": "🖼️ Background"
      },
      "badge": {
        "description": "Insignia en tu perfil",
        "name": "🏅 Insignia"
      },
      "boost_daily": {
        "description": "2x recompensas diarias por 7 días",
        "name": "💰 Daily Boost"
      },
      "boost_xp": {
        "description": "2x XP por 1 día",
        "name": "⚡ XP Boost"
      },
      "color": {
        "description": "Color personalizado en embed",
        "name": "🎨 Color de nombre"
      },
      "crate_common": {
        "description": "Suerte de 50-200 monedas",
        "name": "📦 Caja Común"
      },
      "crate_epic": {
        "description": "Suerte de 500-1500 monedas",
        "name": "💜 Caja Épica"
      },
      "crate_legendary": {
        "description": "Suerte de 1500-5000 monedas",
        "name": "🔥 Caja Legendaria"
      },
      "crate_rare": {
        "description": "Suerte de 200-500 monedas",
        "name": "✨ Caja Rara"
      },
      "role_premium": {
        "description": "Rol Premium por 30 días",
        "name": "💎 Rol Premium"
      },
      "role_staff": {
        "description": "Rol Staff temporal",
        "name": "👔 Rol Staff"
      },
      "role_vip": {
        "description": "Rol VIP por 30 días",
        "name": "🎖️ Rol VIP"
      },
      "ticket": {
        "description": "Un ticket adicional",
        "name": "🎫 Ticket Extra"
      }
    },
    "transfer": {
      "error": "Error",
      "insufficient": "Insufficient",
      "self_transfer": "Self transfer",
      "success": "Success"
    },
    "withdraw": {
      "error": "Error",
      "insufficient": "Insufficient",
      "success": "Success"
    },
    "work": {
      "cooldown": "Enfriamiento",
      "error": "Error",
      "no_job": "No job",
      "success": "Success"
    }
  },
  "economy.buy.crate_win": "¡Ganaste {{reward}} monedas de la caja!",
  "economy.buy.error": "Error al procesar la compra.",
  "economy.buy.insufficient_funds": "Necesitas {{price}} monedas. Tienes {{wallet}}.",
  "economy.buy.not_found": "El item no existe en la tienda.",
  "economy.buy.success": "¡Compraste {{name}}!",
  "economy.daily.already_claimed": "Ya reclamaste tus monedas diarias hoy.",
  "economy.daily.error": "Error al reclamar diario.",
  "economy.daily.success": "¡Reclamaste {{reward}} monedas! (Racha: {{streak}})",
  "economy.deposit.error": "Error al depositar.",
  "economy.deposit.insufficient": "No tienes suficientes monedas en tu wallet.",
  "economy.deposit.success": "Has depositado {{amount}} monedas.",
  "economy.transfer.error": "Error al transferir.",
  "economy.transfer.insufficient": "No tienes suficientes monedas.",
  "economy.transfer.self_transfer": "No puedes transferirte monedas a ti mismo.",
  "economy.transfer.success": "Has transferido {{amount}} monedas a {{user}}.",
  "economy.withdraw.error": "Error al retirar.",
  "economy.withdraw.insufficient": "No tienes suficientes monedas en el banco.",
  "economy.withdraw.success": "Has retirado {{amount}} monedas.",
  "economy.work.cooldown": "Espera {{remaining}} minutos para trabajar de nuevo.",
  "economy.work.error": "Error al trabajar.",
  "economy.work.no_job": "No tienes un trabajo. Usa `/work set` para conseguir uno.",
  "economy.work.success": "¡Trabajaste como **{{job}}** y ganaste {{amount}} monedas!",
  "embed": {
    "announcement_prefix": "📢 ",
    "errors": {
      "channel_not_found": "Canal de destino no encontrado.",
      "form_expired": "La sesión del formulario caducó. Por favor, reinicia el comando.",
      "invalid_color": "Formato de color HEX inválido.",
      "invalid_image_url": "La URL de la imagen debe comenzar con http/https.",
      "invalid_thumbnail_url": "La URL de la miniatura debe comenzar con http/https.",
      "message_not_found": "Mensaje no encontrado en este canal.",
      "no_embeds": "Ese mensaje no contiene ningún embed.",
      "not_bot_message": "Ese mensaje no fue enviado por el bot.",
      "pro_required": "✨ Las plantillas de embed requieren **TON618 Pro**. ¡Mejora para guardar y reutilizar diseños!",
      "template_exists": "Ya existe una plantilla con el nombre `{{name}}`.",
      "template_not_found": "Plantilla `{{name}}` no encontrada."
    },
    "footer": {
      "announcement": "Anuncio Oficial de {{guildName}}",
      "sent_by": "Enviado por {{username}}"
    },
    "modal": {
      "create_title": "✨ Crear Embed",
      "edit_title": "✏️ Editar Embed",
      "field_color_label": "Color HEX sin #",
      "field_description_label": "Descripción",
      "field_description_placeholder": "Escribe el contenido del embed aquí...",
      "field_extra_fallback_name": "Campo",
      "field_extra_label": "Campos extra (nombre|valor|inline)",
      "field_extra_placeholder": "Nombre del Campo|Valor del Campo|true\nOtro Campo|Otro valor|false",
      "field_title_label": "Título (dejar en blanco para ninguno)"
    },
    "slash": {
      "description": "✨ Constructor de embeds personalizados",
      "options": {
        "author": "Nombre del autor",
        "author_icon": "URL del icono del autor",
        "channel": "Canal de destino",
        "color": "Color HEX",
        "description": "Descripción",
        "footer": "Texto del pie de página",
        "image": "URL de la imagen",
        "mention": "Mención al enviar",
        "message_id": "ID del mensaje",
        "template_name": "Nombre de la plantilla",
        "text": "Contenido del anuncio",
        "thumbnail": "URL de la miniatura",
        "timestamp": "Mostrar fecha/hora",
        "title": "Título"
      },
      "subcommands": {
        "announcement": {
          "description": "Plantilla de anuncio profesional"
        },
        "create": {
          "description": "Crear y enviar un embed"
        },
        "edit": {
          "description": "Editar un embed existente"
        },
        "quick": {
          "description": "Enviar un embed rápido simple"
        },
        "template": {
          "delete": {
            "description": "Eliminar una plantilla existente"
          },
          "description": "✨ Gestionar plantillas de embed (Pro)",
          "list": {
            "description": "Listar todas las plantillas del servidor"
          },
          "load": {
            "description": "Cargar y enviar una plantilla"
          },
          "save": {
            "description": "Guardar la configuración actual como plantilla"
          }
        }
      }
    },
    "success": {
      "announcement_sent": "📢 Anuncio emitido en {{channel}}.",
      "edited": "✅ Embed editado exitosamente.",
      "sent": "✅ Embed enviado a {{channel}}.",
      "template_deleted": "✅ Plantilla **{{name}}** eliminada.",
      "template_saved": "✅ Plantilla **{{name}}** guardada exitosamente."
    },
    "templates": {
      "footer": "Total: {{count}}/50 plantillas",
      "list_title": "Plantillas de Embed - {{guildName}}",
      "no_templates": "No hay plantillas guardadas en este servidor. Usa `/embed template save` para crear una."
    }
  },
  "embeds": {
    "ticket": {
      "closed": {
        "fields": {
          "closed_by": "Cerrado por",
          "duration": "Duración",
          "messages": "Mensajes",
          "reason": "Motivo",
          "ticket": "Ticket"
        },
        "no_reason": "Sin motivo",
        "title": "Ticket cerrado"
      },
      "info": {
        "fields": {
          "assigned_to": "Asignado a",
          "category": "Categoría",
          "claimed_by": "Reclamado por",
          "created": "Creado",
          "creator": "Creador",
          "duration": "Duración",
          "first_response": "Primera respuesta",
          "messages": "Mensajes",
          "priority": "Prioridad",
          "reopens": "Reaperturas",
          "status": "Estado",
          "subject": "Asunto"
        },
        "first_response_value": "{{minutes}} min",
        "status_closed": "Cerrado",
        "status_open": "Abierto",
        "title": "Ticket #{{ticketId}}"
      },
      "log": {
        "actions": {
          "add": "Usuario agregado",
          "assign": "Ticket asignado",
          "autoclose": "Ticket auto-cerrado",
          "claim": "Ticket reclamado",
          "close": "Ticket cerrado",
          "default": "Acción",
          "delete": "Mensaje eliminado",
          "edit": "Mensaje editado",
          "move": "Categoría cambiada",
          "open": "Ticket abierto",
          "priority": "Prioridad cambiada",
          "rate": "Ticket calificado",
          "remove": "Usuario quitado",
          "reopen": "Ticket reabierto",
          "sla": "Alerta SLA",
          "smartping": "Sin respuesta del staff",
          "transcript": "Transcripción generada",
          "unassign": "Asignación removida",
          "unclaim": "Ticket liberado"
        },
        "fields": {
          "by": "Por",
          "category": "Categoría",
          "ticket": "Ticket"
        },
        "footer": "UID: {{userId}}"
      },
      "open": {
        "author": "Ticket #{{ticketId}} | {{category}}",
        "default_welcome": "¡Hola <@{{userId}}>! Bienvenido a nuestro sistema de soporte. Un miembro del staff te atenderá pronto.",
        "footer": "Usa los botones de abajo para gestionar este ticket",
        "form_field": "Información del formulario",
        "question_fallback": "Pregunta {{index}}",
        "summary": "**Resumen de la solicitud:**\n- **Usuario:** <@{{userId}}>\n- **Categoría:** {{category}}\n- **Prioridad:** {{priority}}\n- **Creado:** <t:{{createdAt}}:R>"
      },
      "reopened": {
        "description": "<@{{userId}}> reabrió este ticket.\nUn miembro del staff retomará la atención pronto.",
        "fields": {
          "reopens": "Reaperturas"
        },
        "title": "Ticket reabierto"
      }
    }
  },
  "errors": {
    "invalid_language_selection": "Esta selección de idioma ya no es válida. Usa `/setup language` para configurarlo manualmente.",
    "language_permission": "Solo un administrador del servidor puede elegir el idioma de esta guild.",
    "language_save_failed": "No pude guardar el idioma del servidor. TON618 mantendrá inglés hasta que la configuración se complete correctamente."
  },
  "events": {
    "guildMemberAdd": {
      "anti_raid": {
        "action_alert": "Solo alertar",
        "action_kick": "Expulsar automáticamente",
        "description": "Se detectaron **{{recentJoins}} entradas** en **{{seconds}}s**.\nÚltima entrada: **{{memberTag}}**",
        "fields": {
          "action": "Acción",
          "threshold": "Umbral"
        },
        "title": "Anti-raid activado"
      },
      "dm": {
        "fields": {
          "verification_required": "Verificación requerida",
          "verification_value": "Ve a {{channel}} para verificarte y acceder al servidor."
        },
        "title": "Bienvenido a {{guild}}"
      },
      "modlog": {
        "fields": {
          "account_created": "Cuenta creada",
          "member_count": "Miembro #",
          "user": "Usuario"
        },
        "footer": "ID: {{id}}",
        "title": "Miembro entró"
      },
      "welcome": {
        "default_title": "¡Bienvenido!",
        "fields": {
          "member_count": "Miembro #",
          "user": "Usuario"
        }
      }
    },
    "guildMemberRemove": {
      "goodbye": {
        "default_message": "Lamentamos ver partir a **{user}**. Esperamos verte pronto otra vez.",
        "default_title": "¡Adiós!",
        "fields": {
          "remaining_members": "Miembros restantes",
          "user": "Usuario"
        },
        "remaining_members_value": "{{count}} miembros"
      },
      "modlog": {
        "fields": {
          "joined_at": "Se unió",
          "remaining_members": "Miembros restantes",
          "roles": "Roles",
          "user": "Usuario"
        },
        "footer": "ID: {{id}}",
        "no_roles": "Ninguno",
        "title": "Miembro salió",
        "unknown_join": "Desconocido"
      }
    },
    "guildMemberUpdate": {
      "footer": "ID: {{id}}",
      "nickname": {
        "fields": {
          "after": "Después",
          "before": "Antes",
          "executor": "Ejecutado por",
          "user": "Usuario"
        },
        "title": "Apodo actualizado"
      },
      "roles": {
        "fields": {
          "added": "Roles agregados",
          "executor": "Ejecutado por",
          "removed": "Roles quitados",
          "user": "Usuario"
        },
        "title": "Roles actualizados"
      },
      "unknown_executor": "Desconocido"
    },
    "messageDelete": {
      "fields": {
        "author": "Autor",
        "channel": "Canal",
        "content": "Contenido"
      },
      "footer": "ID del mensaje: {{id}}",
      "no_text": "*(sin texto)*",
      "title": "Mensaje eliminado",
      "unknown_author": "Desconocido"
    },
    "modlog": {
      "ban_title": "Ban título",
      "edit_empty": "Edit vacío",
      "edit_title": "Edit título",
      "fields": {
        "after": "Después",
        "author": "Autor",
        "before": "Antes",
        "channel": "Canal",
        "executor": "Executor",
        "link": "Enlace",
        "reason": "Razón",
        "user": "Usuario"
      },
      "goto_message": "Goto message",
      "no_reason": "No reason",
      "unban_title": "Unban título",
      "unknown_executor": "Desconocido executor"
    }
  },
  "events.guildMemberAdd.anti_raid.action_alert": "Solo alertar",
  "events.guildMemberAdd.anti_raid.action_kick": "Expulsar automáticamente",
  "events.guildMemberAdd.anti_raid.description": "{{user}} entró mientras las protecciones anti-raid estaban activas.",
  "events.guildMemberAdd.anti_raid.fields.action": "Acción",
  "events.guildMemberAdd.anti_raid.fields.threshold": "Umbral",
  "events.guildMemberAdd.anti_raid.title": "Anti-raid activado",
  "events.guildMemberAdd.dm.fields.verification_required": "Verificación requerida",
  "events.guildMemberAdd.dm.fields.verification_value": "Completa la verificación para desbloquear el servidor.",
  "events.guildMemberAdd.dm.title": "Bienvenido a {{guild}}",
  "events.guildMemberAdd.modlog.fields.account_created": "Cuenta creada",
  "events.guildMemberAdd.modlog.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.modlog.fields.user": "Usuario",
  "events.guildMemberAdd.modlog.footer": "Evento de entrada registrado",
  "events.guildMemberAdd.modlog.title": "Miembro Unido",
  "events.guildMemberAdd.welcome.default_title": "¡Bienvenido, {{user}}!",
  "events.guildMemberAdd.welcome.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.welcome.fields.user": "Usuario",
  "events.guildMemberRemove.goodbye.default_message": "Esperamos verte nuevamente pronto.",
  "events.guildMemberRemove.goodbye.default_title": "Adiós, {{user}}",
  "events.guildMemberRemove.goodbye.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.goodbye.fields.user": "Usuario",
  "events.guildMemberRemove.goodbye.remaining_members_value": "{{count}} miembros restantes",
  "events.guildMemberRemove.modlog.fields.joined_at": "Se unió el",
  "events.guildMemberRemove.modlog.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.modlog.fields.roles": "Roles",
  "events.guildMemberRemove.modlog.fields.user": "Usuario",
  "events.guildMemberRemove.modlog.footer": "Evento de salida registrado",
  "events.guildMemberRemove.modlog.no_roles": "Sin roles",
  "events.guildMemberRemove.modlog.title": "Miembro Salió",
  "events.guildMemberRemove.modlog.unknown_join": "Fecha de entrada desconocida",
  "events.guildMemberUpdate.footer": "Actualización de miembro registrada",
  "events.guildMemberUpdate.nickname.fields.after": "Después",
  "events.guildMemberUpdate.nickname.fields.before": "Antes",
  "events.guildMemberUpdate.nickname.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.nickname.fields.user": "Usuario",
  "events.guildMemberUpdate.nickname.title": "Apodo Actualizado",
  "events.guildMemberUpdate.roles.fields.added": "Roles agregados",
  "events.guildMemberUpdate.roles.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.roles.fields.removed": "Roles removidos",
  "events.guildMemberUpdate.roles.fields.user": "Usuario",
  "events.guildMemberUpdate.roles.title": "Roles Actualizados",
  "events.guildMemberUpdate.unknown_executor": "Ejecutor desconocido",
  "events.messageDelete.fields.author": "Autor",
  "events.messageDelete.fields.channel": "Canal",
  "events.messageDelete.fields.content": "Contenido",
  "events.messageDelete.footer": "ID del mensaje: {{id}}",
  "events.messageDelete.no_text": "Sin contenido de texto.",
  "events.messageDelete.title": "Mensaje Eliminado",
  "events.messageDelete.unknown_author": "Autor desconocido",
  "events.modlog.ban_title": "🔨 Usuario Baneado",
  "events.modlog.edit_empty": "(vacío)",
  "events.modlog.edit_title": "✏️ Mensaje Editado",
  "events.modlog.fields.after": "📝 Después",
  "events.modlog.fields.author": "👤 Autor",
  "events.modlog.fields.before": "📝 Antes",
  "events.modlog.fields.channel": "📍 Canal",
  "events.modlog.fields.executor": "🛡️ Ejecutado por",
  "events.modlog.fields.link": "🔗 Enlace",
  "events.modlog.fields.reason": "📋 Razón",
  "events.modlog.fields.user": "👤 Usuario",
  "events.modlog.goto_message": "Ir al mensaje",
  "events.modlog.no_reason": "Sin razón especificada",
  "events.modlog.unban_title": "✅ Usuario Desbaneado",
  "events.modlog.unknown_executor": "Desconocido",
  "general": {
    "dashboard": {
      "author": "Autor"
    }
  },
  "general.dashboard.author": "Configuración General | {{guild}}",
  "giveaway": {
    "choices": {
      "requirement_account_age": "Antigüedad de cuenta",
      "requirement_level": "Nivel",
      "requirement_none": "Ninguno",
      "requirement_role": "Rol"
    },
    "embed": {
      "click_participant": "¡Haz clic en el botón de abajo para participar!",
      "ends": "Finaliza",
      "hosted_by": "Organizado por",
      "participate_label": "Participar",
      "prize": "Premio",
      "requirements": "Requisitos",
      "reroll_announcement": "¡Nuevo(s) ganador(es): {{winners}}! Ganaste **{{prize}}**!",
      "status_cancelled": "Cancelado",
      "status_ended": "Estado",
      "status_no_participants": "Finalizado (Sin participantes)",
      "title": "🎉 Sorteo",
      "winners": "Ganadores",
      "winners_announcement": "¡Felicidades {{winners}}! Ganaste **{{prize}}**!"
    },
    "errors": {
      "already_ended": "Este sorteo ya ha finalizado.",
      "cancel_failed": "Error al cancelar el sorteo.",
      "create_failed": "Error al crear el sorteo.",
      "end_failed": "Error al finalizar el sorteo.",
      "no_active": "No active",
      "no_participants": "No se encontraron participantes válidos para este sorteo.",
      "not_found": "Sorteo no encontrado.",
      "reroll_failed": "Error al re-sortear los ganadores."
    },
    "requirements": {
      "account_age": "La cuenta debe tener al menos {{days}} días",
      "level": "Debe ser al menos nivel: {{level}}",
      "role": "Debe tener el rol: {{role}}"
    },
    "slash": {
      "description": "Gestionar sorteos en el servidor",
      "options": {
        "bonus_role": "Rol para oportunidades extra (Pro)",
        "bonus_weight": "Peso para el rol de bono (Pro)",
        "channel": "Canal donde publicar el sorteo",
        "description": "Detalles adicionales del sorteo",
        "duration": "Duración (ej: 30s, 5m, 2h, 1d, 1w)",
        "emoji": "Emoji personalizado para reaccionar",
        "message_id": "ID del mensaje del sorteo",
        "min_account_age": "Antigüedad mínima de la cuenta en días (Pro)",
        "prize": "El premio a sortear",
        "required_role_2": "Requisito de rol adicional (Pro)",
        "requirement_type": "Tipo de requisito para entrar",
        "requirement_value": "Valor para el requisito",
        "winners": "Número de ganadores (1-20)"
      },
      "subcommands": {
        "cancel": {
          "description": "Cancelar un sorteo activo sin ganadores"
        },
        "create": {
          "description": "Crear un nuevo sorteo"
        },
        "end": {
          "description": "Finalizar un sorteo activo antes de tiempo"
        },
        "list": {
          "description": "Listar todos los sorteos activos"
        },
        "reroll": {
          "description": "Elegir nuevos ganadores para un sorteo finalizado"
        }
      }
    },
    "success": {
      "cancelled": "✅ El sorteo ha sido cancelado.",
      "created": "✅ ¡Sorteo creado en {{channel}}! [[Ir al Mensaje]]({{url}})",
      "ended": "✅ Sorteo finalizado. Ganadores: {{winners}}",
      "requirement_bonus": "[PRO] Oportunidades extra para <@&{{roleId}}> (x{{weight}})",
      "requirement_role_2": "También debe tener: <@&{{roleId}}>",
      "rerolled": "✅ ¡Re-sorteado! Nuevos ganadores: {{winners}}"
    }
  },
  "giveaway.embed.click_participant": "¡Haz clic en el botón de abajo para participar!",
  "giveaway.embed.ends": "Finaliza",
  "giveaway.embed.hosted_by": "Organizado por",
  "giveaway.embed.participate_label": "Participar",
  "giveaway.embed.prize": "Premio",
  "giveaway.embed.reroll_announcement": "¡Nuevos ganadores: {{winners}}! Felicidades, ganaron **{{prize}}**!",
  "giveaway.embed.status_cancelled": "Sorteo cancelado.",
  "giveaway.embed.status_ended": "Sorteo Finalizado",
  "giveaway.embed.status_no_participants": "No hubo participantes válidos.",
  "giveaway.embed.winners": "Ganadores",
  "giveaway.embed.winners_announcement": "¡Felicidades {{winners}}! Ganaste **{{prize}}**!",
  "giveaway.errors.already_ended": "Este sorteo ya ha finalizado.",
  "giveaway.errors.cancel_failed": "Error al cancelar el sorteo.",
  "giveaway.errors.create_failed": "Error al crear el sorteo.",
  "giveaway.errors.end_failed": "Error al finalizar el sorteo.",
  "giveaway.errors.no_active": "No hay sorteos activos.",
  "giveaway.errors.no_participants": "No se unieron participantes al sorteo.",
  "giveaway.errors.not_found": "Sorteo no encontrado.",
  "giveaway.errors.reroll_failed": "Error al realizar el reroll.",
  "giveaway.requirements.account_age": "Antigüedad mínima: {{days}} días",
  "giveaway.requirements.level": "Nivel Requerido: {{level}}",
  "giveaway.requirements.role": "Rol Requerido: {{role}}",
  "giveaway.success.cancelled": "Sorteo cancelado correctamente.",
  "giveaway.success.created": "¡Sorteo creado en {{channel}}! [Ir al mensaje]({{url}})",
  "giveaway.success.ended": "¡Sorteo finalizado! Ganadores: {{winners}}",
  "giveaway.success.rerolled": "¡Reroll completado! Nuevos ganadores: {{winners}}",
  "goodbye": {
    "invalid_color": "Invalid color",
    "test_channel_missing": "Test channel missing",
    "test_requires_channel": "Test requires channel"
  },
  "goodbye.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos como `ED4245`.",
  "goodbye.test_channel_missing": "El canal de despedida configurado ya no existe o no es accesible.",
  "goodbye.test_requires_channel": "Configura un canal de despedida antes de enviar un mensaje de prueba.",
  "health_monitor": {
    "downtime_recovery_description": "El bot volvió a estar activo en **{{guildName}}**.\nTiempo estimado sin heartbeat: **{{minutes}} min**.",
    "downtime_recovery_title": "Salud del bot: recuperación de caída",
    "error_rate_high_description": "Error rate: **{{errorRatePct}}%** (umbral {{thresholdPct}}%)\nServidor: **{{guildName}}**",
    "error_rate_high_title": "Salud del bot: error rate alto",
    "field_error_rate": "Error rate",
    "field_errors": "Errores",
    "field_interactions": "Interacciones ventana",
    "field_ping": "Ping",
    "ping_high_description": "Ping actual: **{{pingMs}}ms** (umbral {{thresholdMs}}ms)\nServidor: **{{guildName}}**",
    "ping_high_title": "Salud del bot: ping alto"
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
  "health_monitor.ping_high_title": "Latencia alta detectada",
  "help": {
    "embed": {
      "access_label": "Acceso",
      "and_word": "And word",
      "categories": {
        "admin": "Administración",
        "config": "Config",
        "economy": "Economía",
        "fun": "Diversión",
        "general": "General",
        "giveaway": "Sorteos",
        "level": "Niveles",
        "member": "Miembro",
        "moderation": "Moderación",
        "mods": "Moderación",
        "other": "Otro",
        "owner": "Propietario",
        "public": "Comandos Públicos",
        "staff": "Staff",
        "system": "Sistema",
        "ticket": "Tickets",
        "tickets": "Tickets",
        "utility": "Utilidad"
      },
      "category_desc": "Category desc",
      "category_footer": "Category pie de página",
      "category_label": "Categoría",
      "category_title": "Category título",
      "command_desc": "Command desc",
      "command_footer": "Command pie de página",
      "command_help": "Command help",
      "command_not_found": "Command not found",
      "command_not_found_desc": "Command not found desc",
      "command_overviews": "Vista General de Comandos",
      "command_plural": "Command plural",
      "command_singular": "Command singular",
      "continued_suffix": "Continued suffix",
      "denied_default": "Denied default",
      "denied_owner": "Denied owner",
      "denied_staff": "Denied staff",
      "description": "Aquí está la lista de comandos disponibles para esta categoría.",
      "expired_placeholder": "Expirado placeholder",
      "field_entries": "Field entries",
      "focused_match": "Focused match",
      "footer": "Solicitado por {{user}}",
      "home_categories": "Home categories",
      "home_desc": "Home desc",
      "home_footer": "Home pie de página",
      "home_overview": "Home vista general",
      "home_overview_value": "Home vista general value",
      "home_quick_start": "Home quick start",
      "home_title": "Home título",
      "home_visibility": "Home visibility",
      "home_visibility_value": "Home visibility value",
      "no_commands_in_category": "No commands in categoría",
      "no_description": "No description",
      "optional_label": "Optional label",
      "overview_prefix": "Overview prefix",
      "overviews": {
        "audit": "Exporta datos de tickets y prepara revisiones administrativas sin modificar los registros activos.",
        "config": "Revisa la configuración activa del servidor, los ajustes de tickets y abre el centro de control administrativo interactivo.",
        "debug": "Ejecuta diagnósticos exclusivos del propietario sobre tiempo activo, estado, cachés, conectividad con servidores y permisos comerciales.",
        "embed": "Crea, edita y publica embeds personalizados de Discord para anuncios o actualizaciones estructuradas.",
        "help": "Explora el centro de ayuda interactivo y consulta solo los comandos que tienes disponibles en este servidor.",
        "modlogs": "Controla la entrega de registros de moderación, el canal de almacenamiento y la cobertura de eventos.",
        "ping": "Comprueba la latencia del bot, el tiempo activo y los contadores de ejecución exclusivos del propietario.",
        "poll": "Crea encuestas interactivas para el servidor, revisa las activas y ciérralas antes de tiempo cuando sea necesario.",
        "profile": "Revisa la progresión de los miembros, el balance de economía y clasificaciones rápidas.",
        "setup": "Configura tickets, automatizaciones, flujos de incorporación y disponibilidad de comandos para este servidor.",
        "staff": "Gestiona la disponibilidad del staff, la carga de trabajo activa y accesos rápidos a avisos desde un solo comando.",
        "stats": "Revisa métricas globales de tickets, rendimiento del SLA, actividad del staff y tendencias de satisfacción.",
        "suggest": "Abre el flujo de sugerencias para que los miembros envíen ideas para el servidor.",
        "ticket": "Gestiona todo el ciclo de vida de los tickets, las notas internas, las transcripciones y las acciones activas de los playbooks.",
        "verify": "Gestiona la verificación, la protección anti-raid, los mensajes de confirmación y la actividad de verificación.",
        "warn": "Aplica, revisa y elimina advertencias, incluidas las acciones automáticas asociadas al número de advertencias."
      },
      "owner_only_menu": "Owner only menu",
      "page_label": "Page label",
      "quick_start": "Guía de Inicio Rápido",
      "quick_start_notes": {
        "config_status": "Revisa de un vistazo la configuración activa.",
        "debug_status": "Inspecciona diagnósticos de despliegue y ejecución exclusivos del propietario del bot.",
        "help_base": "Explora los comandos disponibles para ti en este servidor.",
        "modlogs_info": "Comprueba si el registro de moderación está configurado y operativo.",
        "setup_wizard": "Aplica una configuración inicial guiada para un nuevo servidor de soporte.",
        "staff_my_tickets": "Revisa tu carga activa de tickets antes de asumir más trabajo.",
        "stats_sla": "Revisa el rendimiento del SLA y la presión de escalado.",
        "ticket_claim": "Asume el ticket actual para que el equipo sepa que tú lo estás atendiendo.",
        "ticket_note_add": "Deja una nota interna de relevo para facilitar el seguimiento posterior.",
        "ticket_open": "Abre un nuevo ticket de soporte e inicia el flujo de atención.",
        "verify_panel": "Actualiza el panel de verificación después de cambios de seguridad o de incorporación."
      },
      "required_label": "Required label",
      "select_home": "Select home",
      "select_placeholder": "Select placeholder",
      "simple_help_note": "Simple help nota",
      "title": "Centro de Ayuda - {{category}}",
      "usage_overrides": "Ejemplos de Uso",
      "usages": {
        "audit_tickets": "Exporta datos de tickets a un archivo CSV mediante filtros opcionales de estado, prioridad, categoría, fecha y límite de filas.",
        "config_center": "Abre el centro de configuración interactivo para que los administradores revisen y ajusten la configuración activa desde Discord.",
        "config_status": "Revisa de un vistazo la configuración actual del servidor, incluidos los canales clave, los roles, el modo de ayuda y el estado comercial.",
        "config_tickets": "Abre un resumen completo de operaciones de tickets con límites, ajustes de SLA, automatización y cobertura por categorías.",
        "debug_entitlements_set_plan": "Cambia manualmente el plan comercial de un servidor y su expiración opcional para pruebas o soporte.",
        "debug_entitlements_set_supporter": "Activa o desactiva el estado de supporter para un servidor y, si es necesario, define una expiración.",
        "debug_entitlements_status": "Inspecciona el plan comercial efectivo y el estado de supporter de un servidor concreto.",
        "embed_anuncio": "Envía un embed de anuncio preformateado para noticias del servidor o actualizaciones de alta visibilidad.",
        "embed_crear": "Abre un formulario interactivo para componer y enviar un embed totalmente personalizado.",
        "embed_editar": "Edita un mensaje embed existente que el bot haya enviado con anterioridad.",
        "embed_rapido": "Envía un embed rápido con título y descripción sin abrir el constructor completo.",
        "help_base": "Abre el centro de ayuda interactivo y explora solo los comandos que puedes usar en este servidor.",
        "ping": "Ping",
        "poll_crear": "Crea una encuesta interactiva con hasta 10 opciones, programación y voto múltiple opcional.",
        "poll_finalizar": "Cierra una encuesta activa antes de tiempo usando su ID corto.",
        "poll_lista": "Lista las encuestas que siguen activas en este servidor.",
        "profile_top": "Muestra las clasificaciones rápidas de nivel y economía de este servidor.",
        "profile_ver": "Abre tu perfil, o el de otro miembro, con información de nivel y economía.",
        "setup_commands_panel": "Abre un panel de control interactivo para habilitar, deshabilitar y revisar comandos sin escribir los nombres manualmente.",
        "setup_wizard": "Aplica una configuración base guiada para un servidor de soporte, incluido el dashboard, los canales clave, los roles, el plan, los valores predeterminados de SLA y la publicación opcional del panel.",
        "staffops": "Staffops",
        "stats_ratings": "Ordena al staff por valoraciones de tickets en el período seleccionado.",
        "stats_staff_rating": "Abre el perfil detallado de valoraciones de un miembro del staff.",
        "suggest_base": "Abre el modal de sugerencias y envía una nueva idea para el servidor.",
        "ticket_brief": "Abre el resumen operativo del ticket actual para que el staff revise rápidamente el contexto, las recomendaciones y los siguientes pasos.",
        "ticket_history": "Muestra el historial de tickets de un miembro, incluidos tickets abiertos y casos cerrados recientemente.",
        "ticket_info": "Revisa el contexto del ticket actual, su estado y un resumen operativo detallado.",
        "ticket_note_add": "Guarda una nota interna del staff en el ticket actual para relevos y seguimiento posterior.",
        "ticket_note_clear": "Elimina todas las notas internas del ticket actual. Solo administradores.",
        "ticket_note_list": "Lista las notas internas que el staff ya guardó en el ticket actual.",
        "ticket_open": "Abre un nuevo privado de soporte y entra en el flujo de tickets del servidor.",
        "ticket_playbook_apply_macro": "Publica directamente en la conversación del ticket la macro sugerida por un playbook.",
        "ticket_playbook_confirm": "Aprueba una acción recomendada por el playbook para que el flujo del ticket pueda avanzar con ella.",
        "ticket_playbook_disable": "Desactiva un playbook activo para este servidor.",
        "ticket_playbook_dismiss": "Descarta una recomendación que no sea adecuada para el ticket actual.",
        "ticket_playbook_enable": "Activa un playbook para este servidor para que sus recomendaciones puedan usarse en tickets.",
        "ticket_playbook_list": "Muestra los playbooks activos y las recomendaciones disponibles actualmente para el ticket en curso.",
        "verify_info": "Revisa la configuración actual de verificación, los roles, los canales, el estado anti-raid y los ajustes de confirmación.",
        "verify_panel": "Envía el panel de verificación al canal configurado o actualiza el panel existente después de cambiar ajustes.",
        "verify_stats": "Muestra la actividad reciente de verificación y los totales de miembros verificados, fallidos y expulsados."
      },
      "visible_commands_label": "Visible commands label",
      "visible_entries_label": "Visible entries label",
      "visible_entry_plural": "Visible entry plural",
      "visible_entry_singular": "Visible entry singular"
    }
  },
  "help.embed.and_word": "y",
  "help.embed.categories.admin": "Administrador",
  "help.embed.categories.config": "Configuración",
  "help.embed.categories.fun": "Comunidad y Diversión",
  "help.embed.categories.general": "General",
  "help.embed.categories.member": "Miembro Regular",
  "help.embed.categories.moderation": "Moderación",
  "help.embed.categories.other": "Otros",
  "help.embed.categories.owner": "Propietario",
  "help.embed.categories.public": "Público",
  "help.embed.categories.staff": "Miembro del Staff",
  "help.embed.categories.system": "Sistema e Interno",
  "help.embed.categories.tickets": "Tickets",
  "help.embed.categories.utility": "Utilidad",
  "help.embed.category_desc": "Documentación detallada para este grupo de comandos.",
  "help.embed.category_footer": "Sistema TON618 • {{guild}}",
  "help.embed.category_title": "Comandos de {{category}}",
  "help.embed.command_desc": "**Resumen:** {{summary}}\n**Categoría:** {{category}}\n**Acceso:** `{{access}}`{{focus}}",
  "help.embed.command_footer": "Manual TON618 • {{guild}}",
  "help.embed.command_help": "Comando: /{{command}}",
  "help.embed.command_not_found": "Comando no encontrado",
  "help.embed.command_not_found_desc": "No se pudo encontrar ningún comando que coincida con `{{command}}`.",
  "help.embed.command_plural": "comandos",
  "help.embed.command_singular": "comando",
  "help.embed.continued_suffix": " (cont.)",
  "help.embed.denied_default": "No tienes permiso para ver este panel de ayuda.",
  "help.embed.denied_owner": "Este panel de ayuda está restringido al propietario del bot.",
  "help.embed.denied_staff": "Este panel de ayuda está restringido a miembros del staff.",
  "help.embed.expired_placeholder": "Sesión expirada — usa /help de nuevo",
  "help.embed.field_entries": "Usos",
  "help.embed.focused_match": "Coincidencia: `{{usage}}`",
  "help.embed.home_categories": "Categorías Disponibles",
  "help.embed.home_desc": "Bienvenido al centro de ayuda de **{{guild}}**. Selecciona una categoría abajo para explorar los comandos.",
  "help.embed.home_footer": "Seguridad y Soporte TON618 • {{guild}}",
  "help.embed.home_overview": "Resumen del Sistema",
  "help.embed.home_overview_value": "Gestión avanzada de tickets, soporte multi-idioma y herramientas de utilidad para servidores Pro.",
  "help.embed.home_quick_start": "Sugerencias de Inicio Rápido",
  "help.embed.home_title": "Centro de Ayuda TON618",
  "help.embed.home_visibility": "Tu Acceso",
  "help.embed.home_visibility_value": "Nivel: **{{access}}**\nDisponible: **{{commands}}** comandos en **{{categories}}** categorías.\n{{simple_help}}",
  "help.embed.no_commands_in_category": "No hay comandos disponibles en esta categoría.",
  "help.embed.no_description": "Sin descripción proporcionada.",
  "help.embed.optional_label": "Opcional",
  "help.embed.overview_prefix": "Resumen",
  "help.embed.overviews.ping": "Revisa la latencia, uptime y estado de caché del bot.",
  "help.embed.owner_only_menu": "Solo el usuario que abrió este panel puede navegarlo.",
  "help.embed.page_label": "Página",
  "help.embed.quick_start_notes.config_status": "Verificar configuración del servidor",
  "help.embed.quick_start_notes.debug_status": "Verificar estado del bot",
  "help.embed.quick_start_notes.help_base": "Volver a este menú",
  "help.embed.quick_start_notes.modlogs_info": "Consultar historial de moderación",
  "help.embed.quick_start_notes.setup_wizard": "Lanzar asistente de configuración",
  "help.embed.quick_start_notes.staff_my_tickets": "Ver tus tickets asignados",
  "help.embed.quick_start_notes.stats_sla": "Ver reportes de SLA de tickets",
  "help.embed.quick_start_notes.ticket_claim": "Tomar control de un ticket",
  "help.embed.quick_start_notes.ticket_note_add": "Añadir nota interna de staff",
  "help.embed.quick_start_notes.ticket_open": "Abrir un ticket de soporte",
  "help.embed.quick_start_notes.verify_panel": "Desplegar sistema de verificación",
  "help.embed.required_label": "Requerido",
  "help.embed.select_home": "Inicio",
  "help.embed.select_placeholder": "Seleccionar una categoría",
  "help.embed.simple_help_note": "*(Nota: Algunos comandos avanzados están ocultos debido al modo Ayuda Simple)*",
  "help.embed.usages.ping": "/ping",
  "help.embed.usages.staffops": "/staff my-tickets",
  "help.embed.visible_commands_label": "Comandos Interactivos",
  "help.embed.visible_entries_label": "Usos Únicos",
  "help.embed.visible_entry_plural": "usos",
  "help.embed.visible_entry_singular": "uso",
  "interaction": {
    "command_disabled": "El comando `/{{commandName}}` está deshabilitado en este servidor.",
    "dashboard_refresh": {
      "success": "✅ ¡Panel de control actualizado! Las estadísticas se han refrescado con éxito."
    },
    "db_unavailable": "Base de datos temporalmente no disponible. Intenta de nuevo en unos segundos.",
    "error_generic": "Error generic",
    "rate_limit": {
      "command": "Límite temporal para `/{{commandName}}`. Espera **{{retryAfterSec}}s** antes de reintentar.",
      "global": "Vas demasiado rápido. Espera **{{retryAfterSec}}s** antes de usar otra interacción."
    },
    "shutdown": {
      "rebooting": "⚠️ El bot se está reiniciando. Por favor intenta en unos segundos."
    },
    "tag_delete": {
      "cancelled": "❌ Eliminación cancelada.",
      "error": "Ocurrió un error al eliminar el tag.",
      "success": "✅ El tag **{{name}}** ha sido eliminado."
    },
    "unexpected": "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador."
  },
  "interaction.error_generic": "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador.",
  "interaction.shutdown.rebooting": "El bot se está reiniciando para aplicar actualizaciones. Por favor, intenta de nuevo en 15 segundos.",
  "leaderboard": {
    "claimed": "reclamados",
    "closed": "cerrados",
    "no_data": "Aún no hay datos de staff.",
    "title": "🏆 Leaderboard de Staff"
  },
  "leveling": {
    "embed": {
      "field_level_name": "Field level name",
      "field_progress_name": "Field progress name",
      "field_total_xp_name": "Field total xp name",
      "footer": "¡Mantente activo para subir de nivel!",
      "level": "Nivel",
      "messages": "Mensajes",
      "progress": "Progreso",
      "title": "Title",
      "total_xp": "XP Total"
    },
    "errors": {
      "disabled": "❌ El sistema de niveles está desactivado en este servidor.",
      "invalid_page": "❌ Página inválida. La página máxima es {{max}}.",
      "no_data": "❌ No se encontraron datos para este servidor.",
      "no_rank": "❌ Aún no tienes una posición. ¡Envía algunos mensajes!",
      "user_not_found": "❌ Usuario no encontrado."
    },
    "leaderboard": {
      "empty": "Empty",
      "footer": "Página {{page}}/{{total}} • {{users}} usuarios en total",
      "stats": "Nivel: {{level}} | XP: {{xp}}",
      "title": "Tabla de Clasificación del Servidor",
      "unknown_user": "Usuario Desconocido"
    },
    "rank": {
      "description": "Tu posición actual es {{rank}} con nivel {{level}} y {{xp}} XP.",
      "footer": "Footer",
      "no_xp": "No xp",
      "title": "Title"
    },
    "slash": {
      "description": "Sistema interactivo de niveles de niveles",
      "options": {
        "page": "Número de página a ver",
        "user": "El usuario objetivo"
      },
      "subcommands": {
        "leaderboard": {
          "description": "View the server leaderboard"
        },
        "rank": {
          "description": "View your rank on the leaderboard"
        },
        "view": {
          "description": "View your level or another user's level"
        }
      }
    },
    "status_disabled": "Status deshabilitado",
    "user_not_found": "Usuario not found"
  },
  "leveling.embed.field_level_name": "Nivel",
  "leveling.embed.field_progress_name": "Progreso",
  "leveling.embed.field_total_xp_name": "XP Total",
  "leveling.embed.title": "Perfil de Nivel: {{user}}",
  "leveling.leaderboard.empty": "Aún no hay datos disponibles para la tabla de clasificación.",
  "leveling.rank.footer": "Sigue hablando para ganar más XP.",
  "leveling.rank.no_xp": "Todavía no hay XP registrada.",
  "leveling.rank.title": "Rango de {{user}}",
  "leveling.status_disabled": "El sistema de niveles está desactivado en este servidor.",
  "leveling.user_not_found": "No se pudo encontrar a ese usuario.",
  "menuActions": {
    "config": {
      "admin_only": "Solo los administradores pueden usar la configuración rápida.",
      "description": "Usa `/config center` para abrir el panel interactivo de control.\nSi necesitas algo más completo, usa `/setup`.",
      "title": "Configuración rápida"
    },
    "help": {
      "description": "Comandos clave:\n- `/menu`\n- `/fun`\n- `/ticket open`\n- `/perfil ver`\n- `/staff my-tickets` (staff)\n- `/config status` (admin)\n- `/help`",
      "title": "Ayuda rápida"
    },
    "profile": {
      "description": "Usa `/perfil ver` para ver tu perfil.\nUsa `/perfil top` para ver el ranking rápido.",
      "title": "Perfil"
    }
  },
  "mod": {
    "ban_extra": {
      "duration": "*Baneo temporal: {{duration}}*",
      "messages_deleted": "*Mensajes eliminados de las últimas {{hours}}h*",
      "permanent": "*Baneo permanente*"
    },
    "errors": {
      "ban_failed": "❌ Error al banear al usuario.",
      "bot_hierarchy": "❌ No puedo {{action}} a este usuario porque tiene un rol superior o igual al mío.",
      "history_failed": "❌ Error al obtener el historial de moderación.",
      "kick_failed": "❌ Error al expulsar al usuario.",
      "mute_failed": "❌ Error al silenciar al usuario.",
      "no_history": "ℹ️ No se ha encontrado historial de moderación para {{user}}.",
      "no_messages": "❌ No se encontraron mensajes que coincidan con los criterios en los últimos 100 mensajes.",
      "not_banned": "❌ Este usuario no está baneado en este servidor.",
      "not_muted": "❌ Este usuario no está silenciado.",
      "purge_failed": "❌ Error al eliminar los mensajes.",
      "slowmode_failed": "❌ Error al establecer el modo lento.",
      "timeout_failed": "❌ Error al silenciar al usuario.",
      "unban_failed": "❌ Error al desbanear al usuario.",
      "unmute_failed": "❌ Error al quitar el silencio al usuario.",
      "user_hierarchy": "❌ No puedes {{action}} a este usuario porque tiene un rol superior o igual al tuyo."
    },
    "history": {
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderador:** {{moderator}}\n**Razón:** {{reason}}{{duration}}",
      "footer": "Mostrando las {{count}} acciones más recientes",
      "title": "🛡️ Historial de Moderación - {{user}}"
    },
    "slash": {
      "choices": {
        "delete_messages": {
          "0": "No eliminar",
          "3600": "Última hora",
          "86400": "Últimas 24 horas",
          "604800": "Últimos 7 días"
        },
        "duration": {
          "1d": "1 día",
          "1h": "1 hora",
          "1m": "1 minuto",
          "28d": "28 días",
          "30d": "30 días",
          "6h": "6 horas",
          "7d": "7 días",
          "permanent": "Permanente"
        }
      },
      "description": "Comandos de moderación avanzada",
      "options": {
        "amount": "Número de mensajes a eliminar (1-100)",
        "channel": "Canal para establecer el modo lento",
        "contains": "Solo eliminar mensajes que contengan este texto",
        "delete_messages": "Eliminar mensajes de los últimos...",
        "duration": "Duración (ej: 1h, 7d, 30d)",
        "limit": "Número de acciones a mostrar",
        "reason": "Razón de la acción",
        "seconds": "Duración del modo lento en segundos (0 para desactivar)",
        "user": "El usuario objetivo",
        "user_id": "ID de Discord del usuario a desbanear"
      },
      "subcommands": {
        "ban": {
          "description": "Banea a un usuario del servidor"
        },
        "history": {
          "description": "Ver el historial de moderación de un usuario"
        },
        "kick": {
          "description": "Expulsa a un usuario del servidor"
        },
        "mute": {
          "description": "Silencia a un usuario con un rol"
        },
        "purge": {
          "description": "Elimina múltiples mensajes"
        },
        "slowmode": {
          "description": "Establece el modo lento para un canal"
        },
        "timeout": {
          "description": "Silencia a un usuario (nativo de Discord)"
        },
        "unban": {
          "description": "Desbanea a un usuario"
        },
        "unmute": {
          "description": "Quita el silencio a un usuario"
        }
      }
    },
    "success": {
      "banned": "✅ **{{user}}** fue baneado.\n**Razón:** {{reason}}\n{{extra}}",
      "kicked": "✅ **{{user}}** fue expulsado.\n**Razón:** {{reason}}",
      "muted": "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      "purged": "✅ Se han eliminado **{{count}}** mensajes correctamente.",
      "slowmode_disabled": "✅ Modo lento desactivado en {{channel}}.",
      "slowmode_set": "✅ Modo lento establecido en **{{seconds}}s** en {{channel}}.",
      "timeout": "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      "unbanned": "✅ **{{user}}** fue desbaneado.\n**Razón:** {{reason}}",
      "unmuted": "✅ **{{user}}** ya no está silenciado.\n**Razón:** {{reason}}"
    }
  },
  "modals": {
    "suggest": {
      "success_msg": "Success msg"
    },
    "tags": {
      "error_empty": "Error vacío",
      "error_exists": "Error exists",
      "error_failed": "Error failed",
      "footer": "Footer",
      "success_desc": "Success desc",
      "success_title": "Success título"
    }
  },
  "modals.suggest.success_msg": "Tu sugerencia ha sido enviada exitosamente.",
  "modals.tags.error_empty": "El contenido no puede estar vacío.",
  "modals.tags.error_exists": "Ya existe una etiqueta con ese nombre.",
  "modals.tags.error_failed": "Ocurrió un error al crear la etiqueta.",
  "modals.tags.footer": "Creado por {{user}}",
  "modals.tags.success_desc": "La etiqueta **{{name}}** ha sido creada exitosamente.",
  "modals.tags.success_title": "Etiqueta Creada",
  "modlogs": {
    "events": {
      "bans": "Baneos",
      "joins": "Entradas de miembros",
      "kicks": "Expulsiones",
      "leaves": "Salidas de miembros",
      "message_delete": "Mensajes eliminados",
      "message_edit": "Mensajes editados",
      "nickname": "Cambios de apodo",
      "role_add": "Roles agregados",
      "role_remove": "Roles quitados",
      "unbans": "Desbaneos"
    },
    "fields": {
      "channel": "Canal",
      "status": "Estado"
    },
    "options": {
      "modlogs_channel_channel_channel": "Canal de texto para registros de moderación",
      "modlogs_config_enabled_enabled": "Si ese tipo de evento debe registrarse",
      "modlogs_config_event_event": "Tipo de evento a configurar",
      "modlogs_enabled_enabled_enabled": "Si la función permanece habilitada",
      "modlogs_setup_channel_channel": "Canal de texto para registros de moderación"
    },
    "responses": {
      "channel_required": "Define primero un canal de modlogs antes de activar el sistema.",
      "channel_updated": "Canal de modlogs actualizado a {{channel}}.",
      "enabled_state": "Los modlogs ahora están **{{state}}**.",
      "event_state": "El registro de **{{event}}** ahora está **{{state}}**.",
      "info_title": "Configuración de modlogs",
      "setup_description": "Los logs de moderación ahora se enviarán a {{channel}}.",
      "setup_title": "Modlogs configurados"
    },
    "slash": {
      "choices": {
        "bans": "Baneos",
        "joins": "Entradas de miembros",
        "kicks": "Expulsiones",
        "leaves": "Salidas de miembros",
        "message_delete": "Mensajes eliminados",
        "message_edit": "Mensajes editados",
        "nickname": "Cambios de apodo",
        "role_add": "Roles agregados",
        "role_remove": "Roles quitados",
        "unbans": "Desbaneos"
      },
      "description": "Configura los logs de moderación",
      "options": {
        "channel": "Canal de texto para logs de moderación",
        "enabled": "Si la función debe quedar activa",
        "event": "Tipo de evento que quieres configurar",
        "event_enabled": "Si ese tipo de evento debe registrarse"
      },
      "subcommands": {
        "channel": {
          "description": "Cambia el canal de modlogs"
        },
        "config": {
          "description": "Activa o desactiva un tipo de evento registrado"
        },
        "enabled": {
          "description": "Activa o desactiva el sistema de modlogs"
        },
        "info": {
          "description": "Muestra la configuración actual de modlogs"
        },
        "setup": {
          "description": "Activa los modlogs y define el canal principal"
        }
      }
    }
  },
  "observability": {
    "interactions": "Interacciones",
    "scope_errors": "Errores por scope",
    "top_error": "Top error",
    "window": "Ventana"
  },
  "onboarding": {
    "body": "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    "buttons": {
      "documentation": "Documentación",
      "support_server": "Servidor de Soporte"
    },
    "confirm_description": "TON618 ahora operará en **{{label}}** dentro de este servidor.",
    "confirm_title": "Idioma del servidor actualizado",
    "delivery_failed": "TON618 se ha unido al servidor, pero no he podido entregar el selector de idioma ni en un canal público ni por mensaje directo.",
    "description": "Elige el idioma principal para este servidor / Please choose the primary language for this server.",
    "dm_fallback_intro": "No he podido publicar el mensaje de bienvenida en un canal con permisos de escritura, por lo que te lo envío por aquí.",
    "dm_fallback_subject": "Configuración de idioma de TON618",
    "embed": {
      "description": "Gracias por agregar **{{brand}}** a tu servidor.\n\nSoy tu solución todo-en-uno de gestión Discord, diseñado para ayudarte con:\n\n{{ticketIcon}} **Tickets de Soporte** — Sistema de tickets optimizado con seguimiento SLA\n{{moderationIcon}} **Moderación** — AutoMod, gestión de casos y advertencias\n{{giveawayIcon}} **Sorteos** — Gestión justa y transparente de sorteos\n{{statsIcon}} **Analíticas** — Estadísticas e insights del servidor\n{{settingsIcon}} **Configuración** — Configuración fácil con comandos /setup\n\n**Inicio Rápido:** Usa `/quickstart` para ver tu progreso de configuración\n**Configuración Completa:** Usa `/setup wizard` para configuración de tickets\n\n**Primero, por favor selecciona tu idioma preferido:**",
      "features": {
        "analytics": "Analíticas",
        "analytics_description": "Estadísticas e insights del servidor",
        "configuration": "Configuración",
        "configuration_description": "Configuración fácil con comandos /setup",
        "giveaways": "Sorteos",
        "giveaways_description": "Gestión justa y transparente de sorteos",
        "moderation": "Moderación",
        "moderation_description": "AutoMod, gestión de casos y advertencias",
        "quick_start": "Inicio Rápido",
        "quickstart_command": "Usa `/quickstart` para ver tu progreso de configuración",
        "setup_wizard_command": "Usa `/setup wizard` para configuración de tickets",
        "support_tickets": "Tickets de Soporte",
        "tickets_description": "Sistema de tickets optimizado con seguimiento SLA"
      },
      "full_setup": "Configuración Completa",
      "quick_start": "Inicio Rápido",
      "select_language": "**Primero, por favor selecciona tu idioma preferido:**",
      "subtitle": "Soy tu solución todo-en-uno de gestión Discord",
      "thanks": "Gracias por agregar {{brand}} a tu servidor",
      "title": "Bienvenido a {{brand}}"
    },
    "footer": "Si no se selecciona un idioma, TON618 usará español por defecto.",
    "posted_description": "Se ha enviado el selector de idioma para este servidor. TON618 utilizará el español hasta que un administrador elija un idioma.",
    "posted_title": "Onboarding de idioma enviado",
    "title": "Bienvenido a TON618 / Welcome to TON618"
  },
  "ping": {
    "description": "Ver latencia y estadísticas del bot",
    "field": {
      "channels": "Canales",
      "guilds": "Servidores",
      "latency": "Latencia del bot",
      "uptime": "Tiempo activo",
      "users": "Usuarios"
    },
    "title": "PONG!"
  },
  "poll": {
    "embed": {
      "active_channel_deleted": "Canal Eliminado",
      "active_count_title": "📊 Encuestas Activas ({{count}})",
      "active_empty": "No hay encuestas activas en este servidor.",
      "active_footer": "Usa /poll end <id> para finalizar una antes de tiempo",
      "active_item_votes": "Votos",
      "active_title": "📊 Encuestas Activas",
      "created_description": "La encuesta ha sido enviada a {{channel}}.",
      "created_title": "✅ Encuesta Creada",
      "field_created_by": "Creada por",
      "field_ends": "Finaliza",
      "field_id": "ID de Encuesta",
      "field_in": "Tiempo restante",
      "field_mode": "Modo de Votación",
      "field_options": "Opciones",
      "field_question": "Pregunta",
      "field_required_role": "Rol Requerido",
      "field_total_votes": "Votos Totales",
      "footer_ended": "Votación cerrada",
      "footer_multiple": "Puedes votar por varias opciones",
      "footer_single": "Solo una opción permitida",
      "mode_multiple": "Opción Múltiple",
      "mode_single": "Opción Única",
      "status_anonymous": "Resultados Ocultos",
      "status_ended": "Encuesta Finalizada",
      "title_ended_prefix": "🏁 Finalizada:",
      "title_prefix": "🗳️ Encuesta:",
      "vote_plural": "votos",
      "vote_singular": "voto"
    },
    "errors": {
      "manage_messages_required": "Necesitas el permiso 'Gestionar Mensajes' para finalizar encuestas.",
      "max_duration": "La encuesta no puede durar más de 30 días.",
      "max_options": "Solo puedes tener hasta 10 opciones.",
      "max_votes_reached": "Solo puedes votar hasta {{max}} opciones.",
      "min_duration": "La encuesta debe durar al menos 1 minuto.",
      "min_options": "Necesitas al menos 2 opciones.",
      "option_too_long": "Una de las opciones es demasiado larga (máx. 80 caracteres).",
      "owner_only": "Owner only",
      "poll_not_found": "Encuesta con ID `{{id}}` no encontrada.",
      "pro_required": "✨ Esta opción requiere **TON618 Pro**. ¡Mejora para desbloquear funciones avanzadas!",
      "role_required": "Debes tener el <@&{{roleId}}> rol para votar.",
      "unknown_subcommand": "Subcomando de encuesta desconocido."
    },
    "placeholder": "📊 Cargando encuesta...",
    "slash": {
      "description": "Sistema de encuestas interactivas",
      "options": {
        "anonymous": "Ocultar resultados hasta el final (Pro)",
        "channel": "Canal de destino",
        "duration": "Duración (ej: 1h, 30m, 1d)",
        "id": "ID de encuesta (últimos 6 caracteres)",
        "max_votes": "Máximo de opciones permitidas (Pro)",
        "multiple": "Permitir múltiples votos",
        "options": "Opciones separadas por |",
        "question": "Pregunta de la encuesta",
        "required_role": "Requisito para votar (Pro)"
      },
      "subcommands": {
        "create": {
          "description": "Crear una nueva encuesta"
        },
        "end": {
          "description": "Finalizar una encuesta antes de tiempo"
        },
        "list": {
          "description": "Ver encuestas activas"
        }
      }
    },
    "success": {
      "ended": "✅ La encuesta **\"{{question}}\"** ha sido finalizada.",
      "vote_active_multiple": "Tus votos actuales: {{opciones}}",
      "vote_active_single": "Votaste por: **{{option}}**",
      "vote_removed": "Tu voto ha sido removido."
    }
  },
  "poll.errors.owner_only": "Solo el dueño del servidor puede usar esta opción de encuesta.",
  "premium": {
    "active": "Activo",
    "error_fetching": "No pude obtener la información de tu membresía. Inténtalo de nuevo más tarde.",
    "error_generic": "Ocurrió un error al procesar tu solicitud.",
    "expires_at": "Vence el",
    "expires_in": "📅 Vence en **{{days}} días**.",
    "expires_soon": "⚠️ **¡Vence en {{days}} días!** No olvides renovar.",
    "expires_tomorrow": "🚨 **¡Vence mañana!** Renueva urgentemente.",
    "expires_week": "⏰ Vence en **{{days}} días**. Prepárate para renovar.",
    "free_plan": "ℹ️ Estás usando el plan FREE. Actualiza a PRO para desbloquear funciones avanzadas.",
    "guild_only": "Este comando solo funciona en servidores.",
    "owner_only": "Solo el dueño del servidor puede usar este comando.",
    "plan_label": "Plan",
    "pro_active": "✅ Tienes una membresía PRO activa con acceso a todas las funciones premium.",
    "slash": {
      "description": "Ver el estado de tu membresía premium",
      "status": "Ver cuánto tiempo te queda de membresía premium"
    },
    "redeem": {
      "code_expired": "Este código ha expirado. Por favor contacta a soporte para obtener un nuevo código.",
      "code_not_found": "El código que ingresaste no fue encontrado. Por favor verifica e intenta de nuevo.",
      "code_used": "Este código ya ha sido canjeado. Cada código solo puede usarse una vez.",
      "days": "{{days}} días",
      "duration_label": "Duración",
      "error_title": "❌ Canje Fallido",
      "expires_at": "📅 Tu acceso PRO expira el {{date}}.",
      "extended": "🔄 ¡Tu membresía PRO existente ha sido extendida!",
      "generic_error": "Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.",
      "guild_only": "Este comando solo funciona en servidores.",
      "invalid_code": "El código que ingresaste es inválido.",
      "lifetime": "De por vida",
      "lifetime_access": "🌟 ¡Tienes acceso PRO **de por vida**!",
      "owner_only": "Solo el dueño del servidor puede canjear códigos PRO.",
      "processing_error": "Hubo un error procesando tu canje. Por favor intenta de nuevo o contacta a soporte.",
      "server_label": "Servidor",
      "success_description": "Tu código `{{code}}` ha sido canjeado exitosamente.\n\n¡Ahora tienes acceso **{{plan}}** a todas las funciones premium!",
      "success_title": "✅ ¡PRO Activado Exitosamente!"
    },
    "reminder": {
      "description_1": "⏰ **URGENTE**: Tu membresía PRO para **{{guildName}}** vence **mañana**.\n\nRenueva inmediatamente o perderás el acceso a todas las funciones premium.",
      "description_3": "Tu membresía PRO para **{{guildName}}** vencerá en **3 días**.\n\n¡No pierdas el acceso a funciones premium! Renueva antes de que sea tarde.",
      "description_7": "Tu membresía PRO para **{{guildName}}** vencerá en **7 días**.\n\nRenueva ahora para mantener todas las funciones premium activas.",
      "field_days_remaining": "Días restantes",
      "field_plan": "Plan",
      "field_server": "Servidor",
      "footer": "TON618 - Sistema de Membresías",
      "title_1": "🚨 Tu membresía PRO vence mañana",
      "title_3": "⚠️ Tu membresía PRO vence en 3 días",
      "title_7": "⏰ Tu membresía PRO vence en 7 días"
    },
    "slash": {
      "code_option": "Tu código de canje PRO (formato: XXXX-XXXX-XXXX)",
      "description": "Ver el estado de tu membresía premium",
      "redeem_description": "Canjea un código PRO para activar funciones premium",
      "status": "Ver cuánto tiempo te queda de membresía premium"
    },
    "source_label": "Origen",
    "started_at": "Iniciado",
    "status_label": "Estado",
    "status_title": "Estado de tu Membresía",
    "supporter_active": "✅ Activo",
    "supporter_status": "Estado Supporter",
    "time_remaining": "Tiempo restante",
    "upgrade_cta": "Obtener Pro — abre un ticket en nuestro servidor de soporte",
    "upgrade_label": "🚀 Obtener Pro"
  },
  "premium.reminder.field_plan": "Plan",
  "proadmin": {
    "assigned_to": "👤 Asignado A",
    "available_codes": "✅ Disponible ({{cantidad}})",
    "available_codes_stat": "✅ Disponible",
    "codes_label": "🎫 Códigos",
    "days": "{{días}} días",
    "dm_description": "Aquí está tu código PRO exclusivo de canje:\n\n**Código:** `{{code}}`\n**Duración:** {{duración}}\n\nUsa este código en tu servidor con `/pro redeem` para activar características PRO!",
    "dm_failed": "❌ Fallido",
    "dm_footer": "TON618 - Membresía Premium",
    "dm_sent": "📨 MD Enviado",
    "dm_title": "🎉 ¡Tu Código PRO está Listo!",
    "error_title": "❌ Error",
    "expired_codes": "⏰ Expirado",
    "generate_error": "Hubo un error generando los códigos. Por favor intenta de nuevo.",
    "generate_success_description": "Aquí están tus nuevos códigos PRO con **{{duración}}** duración:",
    "generate_success_title": "✅ Generado {{cantidad}} Código(s)",
    "generated_by": "🤖 Generado Por",
    "how_to_redeem": "Cómo Canjear",
    "lifetime": "Vitalicio",
    "list_error": "Hubo un error listando los códigos. Por favor intenta de nuevo.",
    "list_title": "📋 Inventario de Códigos PRO",
    "no_codes": "No hay códigos disponibles",
    "none": "Ninguno",
    "redeem_instructions": "1. Ve a tu servidor de Discord\n2. Ejecuta `/pro redeem`\n3. Ingresa tu código: `{{code}}`",
    "redeemed_codes": "🎟️ Canjeados Recientemente ({{cantidad}})",
    "redeemed_codes_stat": "🎟️ Canjeados",
    "slash": {
      "description": "Generar y gestionar códigos de canje PRO (solo Servidor de Soporte)",
      "generate_description": "Generar nuevos códigos de canje PRO",
      "list_description": "Listar códigos disponibles y canjeados",
      "stats_description": "Ver estadísticas de códigos"
    },
    "slash_options": {
      "count": "Número de códigos a generar (1-20)",
      "duration": "Duración de la membresía PRO",
      "for_user": "Opcional: Usuario al que asignar el código (envía MD)",
      "notes": "Notas opcionales sobre estos códigos"
    },
    "stats_error": "Hubo un error obteniendo estadísticas. Por favor intenta de nuevo.",
    "stats_title": "📊 Estadísticas de Códigos PRO",
    "total_codes": "🎫 Total Códigos",
    "valid_until": "⏰ Válido Hasta"
  },
  "profile": {
    "embed": {
      "coins_format": "{{amount}} monedas",
      "field_bank": "Banco",
      "field_level": "Nivel",
      "field_rank": "Rango",
      "field_total": "Total Neto",
      "field_total_xp": "XP Total",
      "field_wallet": "Cartera",
      "level_format": "Nivel {{level}}",
      "no_data": "Sin participantes aún.",
      "page_format": "Página {{current}} de {{total}}",
      "title": "Perfil de {{username}}",
      "top_economy": "💰 Miembros más Ricos",
      "top_levels": "📊 Top Niveles",
      "top_title": "🏆 Tabla de Clasificación",
      "user_fallback": "Usuario #{{id}}"
    },
    "slash": {
      "description": "Perfil simple: nivel + economía",
      "options": {
        "user": "Usuario objetivo a inspeccionar"
      },
      "subcommands": {
        "top": {
          "description": "Ver tabla de clasificación"
        },
        "view": {
          "description": "Ver un perfil"
        }
      }
    }
  },
  "resetall": {
    "collections_cleared": "📁 Colecciones a limpiar: {{count}}",
    "collections_cleared_count": "📁 Colecciones limpiadas: {{count}}",
    "confirmation_code": "🔑 Código de Confirmación",
    "confirmation_value": "Para ejecutar, usa `/resetall execute` con el código: `{{code}}`",
    "documents_deleted": "📄 Documentos estimados: {{count}}",
    "documents_deleted_count": "🗑️ Total de documentos eliminados: {{count}}",
    "errors": "❌ Errores: {{count}}",
    "executing_desc": "Eliminando todas las configuraciones de guilds...",
    "executing_title": "🗑️ Ejecutando Restablecimiento Masivo...",
    "guilds_affected": "🏠 Guilds afectados: {{count}}",
    "invalid_code": "❌ Código de confirmación inválido. Obtén el código correcto de `/resetall preview`.",
    "no_code": "❌ Este comando requiere un código de confirmación de `/resetall preview`.",
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "preview_description": "Esto eliminará los siguientes datos de TODOS los guilds:",
    "preview_title": "🗑️ Vista Previa de Restablecimiento Masivo",
    "slash": {
      "description": "Restablecer TODAS las configuraciones de guilds (Solo owner)",
      "options": {
        "confirm_code": "Código de confirmación (se proporcionará)"
      },
      "subcommands": {
        "execute": {
          "description": "Ejecutar el restablecimiento completo con código de confirmación"
        },
        "preview": {
          "description": "Vista previa de lo que se eliminará sin ejecutar"
        }
      }
    },
    "success_description": "Todas las configuraciones de guilds han sido restablecidas.",
    "success_title": "✅ Restablecimiento Masivo Completo",
    "warning": "⚠️ ADVERTENCIA",
    "warning_value": "Esta acción es DESTRUCTIVA y NO PUEDE deshacerse. Todas las configuraciones de guilds serán eliminadas permanentemente."
  },
  "resetguild": {
    "error": "❌ Ocurrió un error durante el restablecimiento.",
    "guild_not_found": "❌ Guild no encontrado con ID: `{{guildId}}`",
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "reset_description": "La configuración ha sido restablecida para el guild: `{{guildId}}`",
    "reset_title": "🗑️ Restablecimiento de Guild Completo",
    "slash": {
      "description": "Restablecer configuración de un guild específico (Solo owner)",
      "options": {
        "guild_id": "ID del guild a restablecer (vacío para este guild)",
        "preserve_pro": "Preservar estado PRO/premium",
        "preserve_tickets": "Preservar tickets activos",
        "reason": "Razón del restablecimiento"
      }
    }
  },
  "security": {
    "alert_acknowledged": "✅ Alerta Reconocida",
    "alert_not_found": "❌ Alerta no encontrada o ya reconocida.",
    "alerts_count": "📊 {{count}} alertas en memoria",
    "alerts_title": "🔒 Alertas de Seguridad",
    "channel_configured": "✅ Configurado",
    "channel_not_set": "❌ No configurado",
    "check_clean": "✅ No se detectaron problemas de seguridad.",
    "check_title": "🔒 Verificación Manual de Seguridad Completa",
    "check_triggered": "⚠️ **¡{{count}} alerta(s) de seguridad activada(s)!**\nUsa `/security alerts` para ver detalles.",
    "db_connected": "✅ MongoDB conectado",
    "db_disconnected": "❌ MongoDB desconectado",
    "encryption_active": "Tus datos sensibles se están encriptando automáticamente con AES-256-GCM.",
    "encryption_disabled": "❌ Deshabilitado",
    "encryption_enabled": "✅ Habilitado",
    "encryption_inactive": "⚠️ La encriptación NO está habilitada. Los datos sensibles se almacenan en texto plano.\n\nEjecuta `/security encryption generate_key:true` para generar una clave.",
    "encryption_title": "🔐 Estado de Encriptación",
    "high_severity": "🔴 {{count}} alta severidad",
    "indexes_created": "Índices: ✅ Creados",
    "indexes_failed": "Índices: ❌ Fallidos",
    "key_configured": "✅ Sí",
    "key_generated_desc": "Se ha generado una nueva clave de encriptación de 256 bits.\n\n**Agrega esto a tu archivo .env:**\n```\nENCRYPTION_KEY={{key}}\n```",
    "key_generated_title": "🔐 Nueva Clave de Encriptación Generada",
    "key_invalid": "(❌ Muy corta)",
    "key_not_configured": "❌ No",
    "key_valid": "(✅ Válida)",
    "key_warning": "⚠️ Importante",
    "key_warning_value": "• Mantén esta clave SECRETA y en un administrador de contraseñas\n• Si la pierdes, los datos encriptados NO pueden recuperarse\n• Cambiar la clave hará que los datos encriptados existentes sean ilegibles",
    "no_alerts": "No se encontraron alertas de seguridad.",
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "scheduler_failed": "Scheduler: ❌ Fallido",
    "scheduler_running": "✅ Scheduler ejecutándose",
    "scheduler_started": "Scheduler: ✅ Iniciado",
    "scheduler_stopped": "❌ Scheduler detenido",
    "setup_complete": "🔒 Configuración de Seguridad Completa",
    "slash": {
      "description": "Monitoreo de seguridad y alertas (Solo owner)",
      "options": {
        "alert_id": "ID de alerta a reconocer",
        "generate_key": "Generar nueva clave de encriptación",
        "indexes": "Crear índices MongoDB",
        "limit": "Número de alertas a mostrar (máx 25)",
        "scheduler": "Iniciar scheduler de seguridad",
        "severity": "Filtrar por severidad"
      },
      "subcommands": {
        "acknowledge": {
          "description": "Reconocer una alerta"
        },
        "alerts": {
          "description": "Ver alertas de seguridad recientes"
        },
        "check": {
          "description": "Ejecutar verificación manual de seguridad"
        },
        "encryption": {
          "description": "Ver estado de encriptación y generar claves"
        },
        "setup": {
          "description": "Configurar sistema de seguridad (índices, scheduler)"
        },
        "status": {
          "description": "Ver estado del sistema de seguridad"
        },
        "test": {
          "description": "Probar notificaciones de alertas Discord"
        }
      }
    },
    "status_running": "✅ Ejecutándose",
    "status_stopped": "❌ Detenido",
    "status_title": "🔒 Estado del Sistema de Seguridad",
    "test_description": "Se ha enviado una alerta de seguridad de prueba a tu canal/webhook de Discord configurado.",
    "test_failed": "❌ Fallo al enviar alerta de prueba. Verifica que SECURITY_ALERTS_WEBHOOK_URL o SECURITY_ALERTS_CHANNEL_ID estén configurados en tu archivo .env.",
    "test_sent": "✅ Alerta de Prueba Enviada",
    "webhook_configured": "✅ Configurado",
    "webhook_not_set": "❌ No configurado"
  },
  "serverstats": {
    "activity": {
      "footer": "Período: {{period}}",
      "messages": "💬 Mensajes",
      "messages_value": "**Total:** {{total}}\n**Prom/Día:** {{avgPerDay}}",
      "peak_hour": "⏰ Hora Pico",
      "peak_hour_value": "**{{hour}}:00 - {{hourEnd}}:00** con {{messages}} mensajes",
      "title": "📊 Estadísticas de Actividad - {{period}}",
      "top_channels": "🔥 Top Canales",
      "top_channels_value": "{{num}}. <#{{channelId}}> - {{count}} msgs",
      "top_users": "⭐ Usuarios Más Activos",
      "top_users_value": "{{num}}. <@{{userId}}> - {{count}} msgs"
    },
    "channels": {
      "channel_entry": "**{{num}}.** <#{{channelId}}>\n└ {{count}} mensajes",
      "entry": "**{{index}}.** {{channel}}\n└ {{messages}} mensajes",
      "footer": "Período: {{period}} | Top 10 canales",
      "title": "📝 Actividad de Canales - {{period}}"
    },
    "choices": {
      "period_all": "Todo el Tiempo",
      "period_day": "Hoy",
      "period_month": "Este Mes",
      "period_week": "Esta Semana"
    },
    "errors": {
      "activity_failed": "❌ Error al obtener estadísticas de actividad. Por favor intenta de nuevo.",
      "channels_failed": "❌ Error al obtener estadísticas de canales. Por favor intenta de nuevo.",
      "growth_failed": "❌ Error al obtener estadísticas de crecimiento. Por favor intenta de nuevo.",
      "members_failed": "❌ Error al obtener estadísticas de miembros. Por favor intenta de nuevo.",
      "no_activity": "📊 No hay datos de actividad de canales disponibles aún.",
      "no_data": "📊 No hay suficientes datos aún. Las estadísticas de {{type}} estarán disponibles después de algunos días de seguimiento.",
      "overview_failed": "❌ Error al obtener la vista general del servidor. Por favor intenta de nuevo.",
      "roles_failed": "❌ Error al obtener estadísticas de roles. Por favor intenta de nuevo.",
      "support_failed": "❌ Error al obtener estadísticas de soporte. Por favor intenta de nuevo."
    },
    "growth": {
      "30day": "📊 Crecimiento de 30 Días",
      "30day_value": "**Cambio Total:** {{change}}\n**Porcentaje:** {{percent}}%\n**Inicio:** {{start}}\n**Actual:** {{current}}",
      "footer": "Basado en los últimos 30 días de datos",
      "stats_30d": "📊 30 Días Crecimiento",
      "stats_30d_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      "title": "📈 Estadísticas de Crecimiento del Servidor",
      "trend": "📅 Tendencia Reciente",
      "trend_value": "**Crecimiento Diario Prom:** {{avgDaily}}\n**Proyectado (30d):** {{projected}}"
    },
    "members": {
      "current": "📈 Estadísticas Actuales",
      "current_stats": "📈 Estadísticas Actuales",
      "current_stats_value": "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      "current_value": "**Total de Miembros:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}",
      "footer": "Período: {{period}}",
      "growth": "📊 Crecimiento",
      "growth_value": "**Cambio:** {{change}}\n**Porcentaje:** {{percent}}%",
      "new_members": "🆕 Nuevos Miembros",
      "new_members_value": "**Se unieron:** {{joined}}\n**Promedio/Día:** {{avgPerDay}}",
      "period_footer": "Período: {{period}}",
      "title": "👥 Estadísticas de Miembros - {{period}}"
    },
    "options": {
      "serverstats_activity_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_channels_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_growth_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_members_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_support_period_period": "Período de tiempo para ver estadísticas"
    },
    "overview": {
      "boosts": "🚀 Boosts",
      "boosts_value": "**Cantidad:** {{count}}\n**Boosters:** {{boosters}}",
      "channels": "📝 Canales",
      "channels_value": "**Total:** {{total}}\n**Texto:** {{text}}\n**Voz:** {{voice}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Estáticos:** {{static}}\n**Animados:** {{animated}}",
      "footer": "ID del Servidor: {{id}}",
      "info": "ℹ️ Info del Servidor",
      "info_value": "**Dueño:** {{owner}}\n**Creado:** {{created}}\n**Nivel de Boost:** {{boostLevel}}",
      "members": "👥 Miembros",
      "members_value": "**Total:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}\n**En línea:** {{online}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Más alto:** {{highest}}",
      "title": "📊 {{server}} - Vista General del Servidor"
    },
    "periods": {
      "all": "Todo el Tiempo",
      "day": "Hoy",
      "month": "Este Mes",
      "week": "Esta Semana"
    },
    "roles": {
      "entry": "**{{index}}.** {{role}}\n└ {{count}} miembros ({{percent}}%)",
      "footer": "Total de roles: {{total}} | Mostrando top 15",
      "role_entry": "**{{num}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      "title": "🎭 Distribución de Roles"
    },
    "slash": {
      "description": "Ver estadísticas del servidor",
      "subcommands": {
        "activity": {
          "description": "Ver estadísticas de actividad",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        },
        "channels": {
          "description": "Ver estadísticas de actividad de canales",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        },
        "growth": {
          "description": "Ver estadísticas de crecimiento del servidor"
        },
        "members": {
          "description": "Ver estadísticas de miembros",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        },
        "overview": {
          "description": "Ver vista general del servidor"
        },
        "roles": {
          "description": "Ver estadísticas de distribución de roles"
        },
        "support": {
          "description": "Ver estadísticas de tickets de soporte",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        }
      }
    },
    "support": {
      "footer": "Período: {{period}}",
      "response_times": "⏱️ Tiempos de Respuesta",
      "response_times_value": "**Respuesta Prom:** {{avgResponse}}\n**Resolución Prom:** {{avgResolution}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Abiertos:** {{open}}\n**Cerrados:** {{closed}}",
      "times": "⏱️ Tiempos de Respuesta",
      "times_value": "**Promedio Respuesta:** {{avgResponse}}\n**Promedio Resolución:** {{avgResolution}}",
      "title": "🎫 Estadísticas de Soporte - {{period}}",
      "top_staff": "⭐ Top Staff (Todo el Tiempo)",
      "top_staff_value": "{{num}}. <@{{userId}}> - {{count}} tickets"
    }
  },
  "setup": {
    "automod": {
      "alert_channel": "Alert channel",
      "alert_not_configured": "Alert not configured",
      "bootstrap_created": "Bootstrap created",
      "bootstrap_description": "Crear reglas iniciales de AutoMod",
      "bootstrap_no_new": "Bootstrap no new",
      "channel_alert_description": "Establecer o limpiar el canal de alertas de AutoMod",
      "choice_add": "Agregar",
      "choice_preset_all": "Todos los presets",
      "choice_preset_invites": "Invitaciones",
      "choice_preset_scam": "Enlaces de estafa",
      "choice_preset_spam": "Spam",
      "choice_remove": "Eliminar",
      "choice_reset": "Reiniciar",
      "disable_description": "Eliminar todas las reglas gestionadas de AutoMod",
      "disable_no_rules": "Disable no rules",
      "disable_partial": "Disable partial",
      "disable_removed": "Disable removido",
      "error_max_exempt_channels": "Error max exempt channels",
      "error_max_exempt_roles": "Error max exempt roles",
      "error_no_active_presets": "Error no active presets",
      "error_no_presets": "Error no presets",
      "error_not_enabled": "Error not habilitado",
      "error_provide_channel_or_clear": "Error provide channel or clear",
      "error_provide_channel_or_reset": "Error provide channel or reset",
      "error_provide_role_or_reset": "Error provide role or reset",
      "error_unknown_action": "Error unknown action",
      "error_unknown_preset": "Error unknown preset",
      "exempt_channel_description": "Gestionar canales exentos",
      "exempt_channels": "Exempt channels",
      "exempt_role_description": "Gestionar roles exentos",
      "exempt_roles": "Exempt roles",
      "fetch_error": "Fetch error",
      "fetch_error_generic": "Fetch error generic",
      "field_alerts_exemptions": "Field alerts exemptions",
      "field_managed_rules": "Field managed rules",
      "field_permissions": "Field permissions",
      "field_sync_state": "Field sync state",
      "group_description": "Configurar reglas y exenciones de AutoMod",
      "hint_bootstrap": "Hint bootstrap",
      "hint_disable": "Hint disable",
      "hint_sync": "Hint sync",
      "info_already_exempt_channel": "Info already exempt channel",
      "info_already_exempt_role": "Info already exempt role",
      "last_sync": "Last sync",
      "live_count": "Live cantidad",
      "never": "Never",
      "no_presets": "No presets",
      "no_sync_recorded": "No sync recorded",
      "none": "None",
      "option_action": "Acción a realizar",
      "option_channel": "Canal para recibir alertas de AutoMod",
      "option_clear": "Limpiar el canal de alertas",
      "option_enabled": "Activar o desactivar este preset",
      "option_preset_name": "Nombre del preset",
      "option_target_channel": "Canal a exentar",
      "option_target_role": "Rol a exentar",
      "permission_failure": "Permission failure",
      "permission_failure_generic": "Permission failure generic",
      "permissions_ok": "Permisos ok",
      "preset_all": "Todos los presets",
      "preset_description": "Activar o desactivar un preset de AutoMod",
      "preset_invites": "Invitaciones",
      "preset_scam": "Enlaces de estafa",
      "preset_spam": "Spam",
      "presets_none": "Presets none",
      "rule_live": "Rule live",
      "rule_missing": "Rule missing",
      "status_description": "Ver estado de configuración de AutoMod",
      "status_disabled": "Status deshabilitado",
      "status_enabled": "Status habilitado",
      "status_title": "Status título",
      "stored_rule_ids": "Stored rule ids",
      "success_alert_cleared": "Success alert cleared",
      "success_alert_set": "Success alert set",
      "success_exempt_channels_updated": "Success exempt channels updated",
      "success_exempt_roles_updated": "Success exempt roles updated",
      "success_presets_updated": "Success presets updated",
      "sync_description": "Sincronizar reglas de AutoMod con configuración actual",
      "sync_result": "Sync result",
      "sync_summary": "Sync summary",
      "sync_summary_line": "Sync summary line"
    },
    "commands": {
      "already_disabled": "El comando `/{{command}}` ya estaba deshabilitado.",
      "already_enabled": "El comando `/{{command}}` ya estaba habilitado.",
      "audit_affected": "Comando afectado: `/{{command}}`",
      "audit_after": "Después",
      "audit_before": "Antes",
      "audit_disabled": "Comando deshabilitado",
      "audit_enabled": "Comando habilitado",
      "audit_executed_by": "Ejecutado por",
      "audit_global": "Se aplicó un cambio global de comandos.",
      "audit_reset": "Comandos reiniciados",
      "audit_server": "Servidor",
      "audit_updated": "Actualización de comandos",
      "candidate_description_disable": "Deshabilitar comando",
      "candidate_description_enable": "Habilitar comando",
      "candidate_description_status": "Ver estado actual",
      "disable_description": "Desactiva un comando en este servidor",
      "disable_setup_forbidden": "No puedes deshabilitar `/setup`, o podrías bloquear tu acceso a la configuración.",
      "disabled_success": "Comando `/{{command}}` deshabilitado para este servidor.",
      "enable_description": "Vuelve a activar un comando previamente desactivado",
      "enabled_success": "Comando `/{{command}}` habilitado de nuevo.",
      "format_more": "- ... y {{count}} más",
      "group_description": "Gestiona qué comandos están disponibles en este servidor",
      "hidden_suffix": " (+{{count}} ocultos)",
      "list_description": "Lista los comandos actualmente desactivados en este servidor",
      "list_embed_title": "Comandos del servidor",
      "list_footer": "Disponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      "list_heading": "Comandos deshabilitados ({{count}}):",
      "list_none": "No hay comandos deshabilitados en este servidor.\nDisponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      "missing_command_name": "Debes proporcionar un nombre de comando válido.",
      "mode_disable": "Deshabilitar",
      "mode_enable": "Habilitar",
      "mode_status": "Estado",
      "no_candidates_description": "Cambia de acción para ver más opciones",
      "no_candidates_label": "No hay comandos disponibles",
      "option_disable_description": "Bloquea un comando en este servidor",
      "option_disable_label": "Deshabilitar comando",
      "option_enable_description": "Restaura un comando previamente deshabilitado",
      "option_enable_label": "Habilitar comando",
      "option_list_description": "Muestra el resumen de comandos deshabilitados",
      "option_list_label": "Listar deshabilitados",
      "option_reset_description": "Vuelve a habilitar todos los comandos deshabilitados",
      "option_reset_label": "Reiniciar todo",
      "option_status_description": "Comprueba si un comando está habilitado",
      "option_status_label": "Estado del comando",
      "panel_description": "Abre el panel de control interactivo de comandos",
      "panel_notice": "Usa los menús de abajo para gestionar comandos sin escribir nombres manualmente.",
      "panel_title": "Control de comandos del servidor",
      "placeholder_action": "Selecciona una acción",
      "placeholder_target": "Comando para {{action}}",
      "reset_description": "Vuelve a activar todos los comandos desactivados",
      "reset_done": "Se reactivaron **{{count}}** comando(s).",
      "reset_noop": "No había comandos deshabilitados. No hay nada que reiniciar.",
      "status_description": "Comprueba un comando o ve el resumen actual",
      "status_embed_title": "Estado del comando",
      "status_result": "Estado de `/{{command}}`: **{{state}}**.\nComandos deshabilitados actualmente: **{{count}}**.",
      "summary_available": "Disponibles: **{{count}}**",
      "summary_candidates": "Candidatos en el menú: **{{visible}}**{{hiddenText}}",
      "summary_current_mode": "Modo actual: **{{mode}}**",
      "summary_disabled": "Deshabilitados: **{{count}}**",
      "summary_result": "Resultado: {{notice}}",
      "unknown_command": "El comando `/{{command}}` no existe en este bot."
    },
    "confessions": {
      "configure_description": "Establece el canal y el rol utilizados para las confesiones",
      "group_description": "Configura las confesiones anónimas"
    },
    "general": {
      "admin_role_description": "Establecer el rol de administrador del bot",
      "auto_close_description": "Configurar el cierre automático de tickets inactivos",
      "cooldown_description": "Establecer el tiempo de espera entre la creación de tickets",
      "dashboard_description": "Establecer el canal del panel de control de tickets",
      "dm_close_description": "Configurar el mensaje directo (DM) enviado al cerrar un ticket",
      "dm_open_description": "Configurar el mensaje directo (DM) enviado al abrir un ticket",
      "global_limit_description": "Establecer el límite global de tickets abiertos en el servidor",
      "group_description": "Configurar los ajustes operacionales del servidor",
      "info_description": "Ver configuración actual del servidor",
      "language_description": "Revisar o actualizar el idioma del bot para este servidor",
      "language_label_en": "Inglés",
      "language_label_es": "Español",
      "language_set": "Idioma del bot configurado: **{{label}}**.",
      "live_members_description": "Establecer el canal de voz para el contador de miembros en vivo",
      "live_role_description": "Establecer el canal de voz para el contador de roles específicos en vivo",
      "log_deletes_description": "Configurar el registro de eliminaciones de mensajes en los canales de tickets",
      "log_edits_description": "Configurar el registro de ediciones de mensajes en los canales de tickets",
      "logs_description": "Establecer el canal para logs de moderación",
      "max_tickets_description": "Establecer el máximo de tickets simultáneos por usuario",
      "min_days_description": "Establecer la antigüedad mínima de la cuenta (en días) para abrir tickets",
      "option_channel": "Canal de texto",
      "option_count": "Cantidad numérica",
      "option_days": "Días de antigüedad",
      "option_enabled": "Activar o desactivar",
      "option_language_value": "Idioma a usar para las respuestas visibles del bot",
      "option_minutes": "Minutos de espera",
      "option_role": "Rol de servidor",
      "option_role_to_count": "Rol que se desea contabilizar",
      "option_verify_role": "Rol de verificación (dejar vacío para desactivar)",
      "option_voice_channel": "Canal de voz",
      "sla_description": "Configurar los umbrales de advertencia y escalado de SLA",
      "smart_ping_description": "Configurar los ajustes del sistema de aviso inteligente (Smart Ping)",
      "staff_role_description": "Establecer el rol de personal de soporte (Staff)",
      "transcripts_description": "Establecer el canal para las transcripciones de los tickets",
      "verify_role_description": "Establecer el rol de usuario verificado",
      "weekly_report_description": "Establecer el canal para los reportes semanales de actividad"
    },
    "goodbye": {
      "avatar_description": "Muestra u oculta el avatar del miembro que sale",
      "avatar_state": "Avatar del miembro en mensajes de despedida: **{{state}}**.",
      "channel_description": "Establece el canal utilizado para los mensajes de despedida",
      "channel_set": "Canal de despedida configurado en {{channel}}.",
      "color_description": "Establece el color del embed de despedida (hex)",
      "color_updated": "Color de despedida actualizado a **#{{hex}}**.",
      "enabled_description": "Activa o desactiva los mensajes de despedida",
      "enabled_state": "Los mensajes de despedida ahora están **{{state}}**.",
      "footer_description": "Actualiza el pie de página del embed de despedida",
      "footer_updated": "Footer de despedida actualizado.",
      "group_description": "Configura los mensajes de despedida",
      "hidden": "Oculto",
      "invalid_color": "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      "message_description": "Actualiza el mensaje de despedida",
      "message_updated": "Mensaje de despedida actualizado.\nVariables disponibles: {{vars}}",
      "test_channel_missing": "No se encontró el canal de despedida configurado.",
      "test_default_message": "**{user}** salió del servidor.",
      "test_default_title": "Hasta luego",
      "test_description": "Envía un mensaje de despedida de prueba",
      "test_field_remaining_members": "Miembros restantes",
      "test_field_roles": "Roles",
      "test_field_user": "Usuario",
      "test_field_user_id": "ID de usuario",
      "test_requires_channel": "Configura primero un canal de despedida con `/setup goodbye channel`.",
      "test_roles_value": "Solo payload de prueba",
      "test_sent": "Mensaje de prueba de despedida enviado a {{channel}}.",
      "title_description": "Actualiza el título del embed de despedida",
      "title_updated": "Título de despedida actualizado a **{{text}}**.",
      "visible": "Visible"
    },
    "language": {
      "audit_reason_manual": "Cambio manual de idioma",
      "audit_reason_onboarding": "Selección de idioma durante el onboarding",
      "current_value": "TON618 está operando actualmente en **{{label}}**.",
      "description": "Revisa o actualiza el idioma operativo que TON618 utiliza en este servidor.",
      "fallback_note": "Los servidores sin una selección explícita continuarán usando inglés hasta que un administrador configure un nuevo idioma.",
      "onboarding_completed": "Completado",
      "onboarding_pending": "Pendiente",
      "title": "Idioma del servidor",
      "updated_value": "Idioma cambiado a **{{label}}**. TON618 utilizará este idioma para todas las respuestas visibles en este servidor."
    },
    "options": {
      "setup_automod_channel-alert_channel_channel": "Define el canal para recibir alertas del sistema AutoMod",
      "setup_automod_channel-alert_clear_clear": "Permite limpiar el canal de alertas actualmente configurado",
      "setup_automod_exempt-channel_action_action": "Acción a realizar en el canal seleccionado",
      "setup_automod_exempt-channel_channel_channel": "Selecciona el canal que deseas exentar de AutoMod",
      "setup_automod_exempt-role_action_action": "Acción a realizar en el rol seleccionado",
      "setup_automod_exempt-role_role_role": "Selecciona el rol que deseas exentar de AutoMod",
      "setup_automod_preset_enabled_enabled": "Si deseas activar o desactivar este preset de protección",
      "setup_automod_preset_name_name": "Nombre descriptivo del preset de protección",
      "setup_commands_disable_command_command": "Nombre del comando que deseas deshabilitar (sin /)",
      "setup_commands_enable_command_command": "Nombre del comando que deseas habilitar de nuevo (sin /)",
      "setup_commands_status_command_command": "Nombre del comando que deseas consultar (sin /)",
      "setup_confessions_configure_channel_channel": "Define el canal donde se publicarán las confesiones",
      "setup_confessions_configure_role_role": "Define el rol requerido para poder utilizar las confesiones",
      "setup_general_admin-role_role_role": "Selecciona el rol para la administración del bot",
      "setup_general_auto-close_minutes_minutes": "Minutos de inactividad antes del cierre automático del ticket",
      "setup_general_cooldown_minutes_minutes": "Tiempo de espera (en minutos) entre la creación de tickets",
      "setup_general_dashboard_channel_channel": "Selecciona el canal para el panel de control (Dashboard)",
      "setup_general_dm-close_enabled_enabled": "Si se debe enviar un mensaje directo al usuario al cerrar un ticket",
      "setup_general_dm-open_enabled_enabled": "Si se debe enviar un mensaje directo al usuario al abrir un ticket",
      "setup_general_global-limit_count_count": "Número máximo de tickets abiertos permitidos en el servidor",
      "setup_general_language_value_value": "Idioma que utilizará el bot para las respuestas visibles en este servidor",
      "setup_general_live-members_channel_channel": "Selecciona el canal de voz para el contador de miembros",
      "setup_general_live-role_channel_channel": "Selecciona el canal de voz para el contador de roles",
      "setup_general_live-role_role_role": "Selecciona el rol que deseas contabilizar",
      "setup_general_log-deletes_enabled_enabled": "Si se deben registrar las eliminaciones de mensajes en los canales de tickets",
      "setup_general_log-edits_enabled_enabled": "Si se deben registrar las ediciones de mensajes en los canales de tickets",
      "setup_general_logs_channel_channel": "Selecciona el canal de texto para los registros (Logs)",
      "setup_general_max-tickets_count_count": "Número máximo de tickets permitidos por usuario",
      "setup_general_min-days_days_days": "Días de antigüedad mínima requeridos para la cuenta del usuario",
      "setup_general_sla_minutes_minutes": "Minutos antes de activar la alerta de cumplimiento de SLA",
      "setup_general_smart-ping_minutes_minutes": "Minutos antes de realizar un aviso (Smart Ping) de recordatorio",
      "setup_general_staff-role_role_role": "Selecciona el rol para el personal de soporte (Staff)",
      "setup_general_transcripts_channel_channel": "Selecciona el canal para las transcripciones",
      "setup_general_verify-role_role_role": "Selecciona el rol para usuarios verificados (dejar vacío para desactivar)",
      "setup_general_weekly-report_channel_channel": "Selecciona el canal para los reportes semanales",
      "setup_goodbye_avatar_show_show": "Determina si se debe mostrar el avatar del usuario en el mensaje",
      "setup_goodbye_channel_channel_channel": "Define el canal donde se enviarán los mensajes de despedida",
      "setup_goodbye_color_hex_hex": "Define el color hexadecimal del embed (sin incluir #)",
      "setup_goodbye_enabled_enabled_enabled": "Si los mensajes de despedida deben mantenerse habilitados",
      "setup_goodbye_footer_text_text": "Define el texto del pie de página del embed de despedida",
      "setup_goodbye_message_text_text": "Define el contenido del mensaje de despedida",
      "setup_goodbye_title_text_text": "Define el título que tendrá el embed de despedida",
      "setup_language_value_value": "Idioma que utilizará el bot para las respuestas visibles en este servidor",
      "setup_suggestions_channel_channel_channel": "Define el canal donde se publicarán las sugerencias",
      "setup_suggestions_enabled_enabled_enabled": "Si el sistema de sugerencias debe mantenerse habilitado",
      "setup_tickets_auto-assignment_active_active": "Si la asignación automática de personal debe estar activa",
      "setup_tickets_auto-assignment_require-online_require-online": "Si solo el personal en línea puede recibir asignaciones",
      "setup_tickets_auto-assignment_respect-away_respect-away": "Si el sistema debe respetar el estado ausente (Away/DND) del personal",
      "setup_tickets_control-embed_color_color": "Define el color del embed de control del ticket (formato Hex)",
      "setup_tickets_control-embed_description_description": "Define el contenido del embed de control del ticket",
      "setup_tickets_control-embed_footer_footer": "Define el texto del pie de página del embed de control del ticket",
      "setup_tickets_control-embed_reset_reset": "Permite restablecer el embed de control al valor predeterminado",
      "setup_tickets_control-embed_title_title": "Define el título que tendrá el embed de control del ticket",
      "setup_tickets_daily-report_active_active": "Si se deben generar reportes diarios de actividad",
      "setup_tickets_daily-report_channel_channel": "Canal donde se publicará el reporte diario de actividad",
      "setup_tickets_incident_active_active": "Si el modo de incidente (pausa de creación) debe estar activo",
      "setup_tickets_incident_categories_categories": "IDs de categorías afectadas por el modo incidente (separados por comas)",
      "setup_tickets_incident_message_message": "Mensaje personalizado que verán los usuarios durante el modo incidente",
      "setup_tickets_panel-style_color_color": "Define el color del embed del panel de creación (formato Hex)",
      "setup_tickets_panel-style_description_description": "Define el contenido descriptivo del embed del panel de creación",
      "setup_tickets_panel-style_footer_footer": "Define el texto del pie de página del embed del panel de creación",
      "setup_tickets_panel-style_reset_reset": "Permite restablecer el estilo del panel al valor predeterminado",
      "setup_tickets_panel-style_title_title": "Define el título que tendrá el embed del panel de creación",
      "setup_tickets_sla-rule_category_category": "Categoría sobre la cual se aplicará esta regla",
      "setup_tickets_sla-rule_minutes_minutes": "Umbral de minutos para la aplicación de esta regla",
      "setup_tickets_sla-rule_priority_priority": "Prioridad sobre la cual se aplicará esta regla",
      "setup_tickets_sla-rule_type_type": "Tipo de regla SLA que deseas configurar",
      "setup_tickets_sla_escalation-channel_escalation-channel": "Canal donde se publicarán las alertas de escalada de SLA",
      "setup_tickets_sla_escalation-enabled_escalation-enabled": "Determina si el sistema de escalado está activo",
      "setup_tickets_sla_escalation-minutes_escalation-minutes": "Umbral de minutos antes de proceder al escalado de SLA",
      "setup_tickets_sla_escalation-role_escalation-role": "Rol al que se le notificará (mención) durante la escalada",
      "setup_tickets_sla_warning-minutes_warning-minutes": "Umbral de minutos antes de la advertencia base de SLA",
      "setup_tickets_welcome-message_message_message": "Contenido del mensaje de bienvenida para tickets nuevos",
      "setup_tickets_welcome-message_reset_reset": "Permite restablecer el mensaje de bienvenida al valor predeterminado",
      "setup_welcome_autorole_role_role": "Selecciona el rol para asignación automática (dejar vacío para deshabilitar)",
      "setup_welcome_avatar_show_show": "Determina si se debe mostrar el avatar del usuario en el mensaje",
      "setup_welcome_banner_url_url": "URL de la imagen de banner (debe comenzar con https://)",
      "setup_welcome_channel_channel_channel": "Define el canal donde se enviarán los mensajes de bienvenida",
      "setup_welcome_color_hex_hex": "Define el color hexadecimal del embed (sin incluir #)",
      "setup_welcome_dm_enabled_enabled": "Si se debe enviar un mensaje directo de bienvenida al unirse",
      "setup_welcome_dm_message_message": "Diseño del MD de bienvenida. Variables: `{mention}` `{usuario}` `{tag}` `{server}` `{cantidad}` `{id}`",
      "setup_welcome_enabled_enabled_enabled": "Si los mensajes de bienvenida deben mantenerse habilitados",
      "setup_welcome_footer_text_text": "Define el texto del pie de página del embed de bienvenida",
      "setup_welcome_message_text_text": "Define el contenido del mensaje de bienvenida",
      "setup_welcome_title_text_text": "Define el título que tendrá el embed de bienvenida",
      "setup_wizard_admin_admin": "Define el rol para el administrador del bot (opcional)",
      "setup_wizard_dashboard_dashboard": "Define el canal principal para el panel de control de tickets",
      "setup_wizard_logs_logs": "Define el canal para los registros de tickets (opcional)",
      "setup_wizard_plan_plan": "Selecciona el plan inicial de operación del servidor",
      "setup_wizard_publish-panel_publish-panel": "Si el panel de creación de tickets debe publicarse inmediatamente",
      "setup_wizard_sla-escalation-minutes_sla-escalation-minutes": "Umbral de minutos antes de la escalada base de SLA",
      "setup_wizard_sla-warning-minutes_sla-warning-minutes": "Umbral de minutos antes de la primera advertencia base de SLA",
      "setup_wizard_staff_staff": "Define el rol para el personal de soporte (Staff - opcional)",
      "setup_wizard_transcripts_transcripts": "Define el canal para las transcripciones de tickets (opcional)"
    },
    "panel": {
      "action_applied": "Acción aplicada.",
      "admin_only": "Solo los administradores pueden usar este panel.",
      "default_action_failed": "No se pudo aplicar la acción.",
      "default_reset_failed": "No se pudo completar el reinicio.",
      "error_prefix": "Error: {{message}}",
      "invalid_action": "Acción inválida.",
      "invalid_command": "No se seleccionó un comando válido.",
      "owner_only": "Solo la persona que abrió este panel puede usarlo.",
      "reset_applied": "Reinicio aplicado."
    },
    "slash": {
      "choices": {
        "english": "Inglés",
        "spanish": "Español"
      },
      "description": "Configura los ajustes operativos del servidor",
      "groups": {
        "automod": {
          "alert_channel": "Canal de alertas: {{channel}}",
          "alert_not_configured": "No configurado",
          "bootstrap_created": "Se crearon {{count}} regla{{plural}} de AutoMod de TON618.",
          "bootstrap_no_new": "No se necesitaron nuevas reglas de AutoMod de TON618.",
          "choices": {
            "add": "Agregar",
            "preset_all": "Todos los presets",
            "preset_invites": "Invitaciones",
            "preset_scam": "Enlaces de estafa",
            "preset_spam": "Spam",
            "remove": "Eliminar",
            "reset": "Reiniciar"
          },
          "description": "Configurar reglas y exenciones de AutoMod",
          "disable_no_rules": "No había reglas de AutoMod gestionadas por TON618.",
          "disable_partial": "Se eliminaron {{removed}} regla{{removedPlural}}, se preservaron {{preserved}} debido a errores.",
          "disable_removed": "Se eliminaron {{count}} regla{{plural}} de AutoMod gestionadas por TON618.",
          "error_max_exempt_channels": "AutoMod solo soporta hasta 50 canales exentos por servidor.",
          "error_max_exempt_roles": "AutoMod solo soporta hasta 20 roles exentos por servidor.",
          "error_no_active_presets": "No hay presets de AutoMod activos. Reactiva un preset o usa `/setup automod disable`.",
          "error_no_presets": "No hay presets de AutoMod activos. Activa al menos un preset antes de inicializar.",
          "error_not_enabled": "AutoMod aún no está activado para este servidor. Ejecuta `/setup automod bootstrap` primero.",
          "error_provide_channel_or_clear": "Proporciona `channel`, o establece `clear: true`.",
          "error_provide_channel_or_reset": "Proporciona `channel`, o usa `action: reset`.",
          "error_provide_role_or_reset": "Proporciona `role`, o usa `action: reset`.",
          "error_unknown_action": "Acción desconocida. Usa add, remove o reset.",
          "error_unknown_preset": "Selección de preset desconocida.",
          "exempt_channels": "Canales exentos: {{channels}}",
          "exempt_roles": "Roles exentos: {{roles}}",
          "fetch_error": "Se omitió {{action}}: {{message}}",
          "fetch_error_generic": "No se pudieron inspeccionar las reglas de AutoMod.",
          "field_alerts_exemptions": "Alertas y Exenciones",
          "field_managed_rules": "Reglas Gestionadas",
          "field_permissions": "Permisos",
          "field_sync_state": "Estado de Sincronización",
          "hint_bootstrap": "Ejecuta `/setup automod bootstrap` cuando estés listo para crear las reglas gestionadas.",
          "hint_disable": "Usa `/setup automod disable` para eliminar las reglas existentes, o reactiva un preset antes de sincronizar.",
          "hint_sync": "Ejecuta `/setup automod sync` para aplicar este cambio a Discord.",
          "info_already_exempt_channel": "{{channel}} ya está exento.",
          "info_already_exempt_role": "{{role}} ya está exento.",
          "last_sync": "Última sincronización: {{timestamp}}",
          "live_count": "Conteo en vivo: `{{live}}/{{desired}}`",
          "never": "Nunca",
          "no_presets": "No hay presets de AutoMod seleccionados.",
          "no_sync_recorded": "No se ha registrado ninguna sincronización aún.",
          "none": "Ninguno",
          "options": {
            "action": "Acción a realizar",
            "channel": "Canal para recibir alertas de AutoMod",
            "clear": "Limpiar el canal de alertas",
            "enabled": "Activar o desactivar este preset",
            "preset_name": "Nombre del preset",
            "target_channel": "Canal a exentar",
            "target_role": "Rol a exentar"
          },
          "permission_failure": "Se omitió {{action}}: faltan {{permissions}}.",
          "permission_failure_generic": "Se omitió {{action}}: falló la verificación de permisos.",
          "permissions_ok": "Todos los permisos requeridos están presentes",
          "presets_none": "No hay presets seleccionados",
          "rule_live": "activa",
          "rule_missing": "faltante",
          "status_disabled": "La gestión de AutoMod de TON618 está desactivada para este servidor.",
          "status_enabled": "La gestión de AutoMod de TON618 está activada para este servidor.",
          "status_title": "Estado de AutoMod - {{guildName}}",
          "stored_rule_ids": "IDs de reglas almacenadas: `{{count}}`",
          "subcommands": {
            "bootstrap": {
              "description": "Crear reglas iniciales de AutoMod"
            },
            "channel-alert": {
              "description": "Establecer o limpiar el canal de alertas de AutoMod"
            },
            "disable": {
              "description": "Eliminar todas las reglas gestionadas de AutoMod"
            },
            "exempt-channel": {
              "description": "Gestionar canales exentos"
            },
            "exempt-role": {
              "description": "Gestionar roles exentos"
            },
            "preset": {
              "description": "Activar o desactivar un preset de AutoMod"
            },
            "status": {
              "description": "Ver estado de configuración de AutoMod"
            },
            "sync": {
              "description": "Sincronizar reglas de AutoMod con configuración actual"
            }
          },
          "success_alert_cleared": "Canal de alertas de AutoMod eliminado.\n{{hint}}",
          "success_alert_set": "Canal de alertas de AutoMod establecido en {{channel}}.\n{{hint}}",
          "success_exempt_channels_updated": "Canales exentos de AutoMod actualizados. Total: `{{count}}`.\n{{hint}}",
          "success_exempt_roles_updated": "Roles exentos de AutoMod actualizados. Total: `{{count}}`.\n{{hint}}",
          "success_presets_updated": "Presets de AutoMod actualizados: {{summary}}.\n{{followUp}}",
          "sync_result": "Resultado: `{{status}}`",
          "sync_summary": "Resumen: {{summary}}",
          "sync_summary_line": "Se actualizaron {{updated}} regla{{updatedPlural}}, se recrearon {{created}} regla{{createdPlural}} faltante{{createdPlural}}, se eliminaron {{removed}} regla{{removedPlural}} obsoleta{{removedPlural}}."
        },
        "commands": {
          "description": "Gestiona qué comandos están disponibles en este servidor",
          "options": {
            "command_optional": "Nombre del comando sin `/` (opcional)",
            "command_required": "Nombre del comando sin `/`"
          },
          "subcommands": {
            "disable": {
              "description": "Deshabilita un comando en este servidor"
            },
            "enable": {
              "description": "Vuelve a habilitar un comando deshabilitado"
            },
            "list": {
              "description": "Lista los comandos deshabilitados en este servidor"
            },
            "panel": {
              "description": "Abre el panel interactivo de control de comandos"
            },
            "reset": {
              "description": "Vuelve a habilitar todos los comandos deshabilitados"
            },
            "status": {
              "description": "Consulta un comando o revisa el resumen actual"
            }
          }
        },
        "goodbye": {
          "description": "Configura los mensajes de despedida",
          "options": {
            "channel": "Canal de despedida",
            "enabled": "Si los mensajes de despedida deben seguir activos",
            "footer_text": "Texto del footer",
            "hex": "Color hex sin `#`",
            "show": "Mostrar el avatar del miembro",
            "text": "Contenido del mensaje",
            "title_text": "Título del embed"
          },
          "subcommands": {
            "avatar": {
              "description": "Muestra u oculta el avatar del miembro que sale"
            },
            "channel": {
              "description": "Define el canal para los mensajes de despedida"
            },
            "color": {
              "description": "Define el color del embed de despedida (hex)"
            },
            "enabled": {
              "description": "Activa o desactiva los mensajes de despedida"
            },
            "footer": {
              "description": "Actualiza el footer del embed de despedida"
            },
            "message": {
              "description": "Actualiza el mensaje de despedida. Variables: {{vars}}"
            },
            "test": {
              "description": "Envía un mensaje de despedida de prueba"
            },
            "title": {
              "description": "Actualiza el título del embed de despedida"
            }
          }
        },
        "tickets": {
          "choices": {
            "mode_least_active": "Menos activo",
            "mode_random": "Aleatorio",
            "mode_round_robin": "Round robin",
            "sla_escalation": "Escalada",
            "sla_warning": "Advertencia",
            "style_buttons": "Botones",
            "style_select": "Menú desplegable"
          },
          "description": "Configurar ajustes del sistema de tickets",
          "options": {
            "color": "Color del embed (hex)",
            "control_description": "Descripción del embed de control",
            "control_footer": "Pie del embed de control",
            "control_title": "Título del embed de control",
            "enabled": "Activar o desactivar",
            "escalation_channel": "Canal para alertas de escalado",
            "escalation_enabled": "Activar escalado",
            "escalation_minutes": "Minutos antes del escalado",
            "escalation_role": "Rol a mencionar en escalado",
            "mode": "Modo de asignación",
            "require_online": "Requerir estado en línea",
            "reset": "Restablecer a predeterminado",
            "rule_minutes": "Umbral de minutos",
            "rule_type": "Tipo de regla",
            "style": "Estilo del panel",
            "target_category": "Categoría objetivo",
            "target_priority": "Prioridad objetivo",
            "warning_minutes": "Minutos antes de advertencia SLA",
            "welcome_message": "Contenido del mensaje de bienvenida"
          },
          "playbook": {
            "apply_macro_description": "Directly apply the suggested macro from a recommendation",
            "catalog_empty": "No playbooks found",
            "confirm_description": "Confirmar and apply a suggested recommendation",
            "disable_description": "Deshabilitar a specific playbook para this guild",
            "dismiss_description": "Descartar a suggested recommendation",
            "enable_description": "Habilitar un specific playbook para this guild",
            "errors": {
              "admin_only": "Only bot admins can enable or disable playbooks.",
              "macro_missing": "The suggested macro was not found in the current workspace.",
              "macro_staff_only": "Only staff can apply suggested macros.",
              "no_macro": "The selected recommendation has no suggested macro.",
              "not_found": "No pending recommendation matches that identifier.",
              "playbook_not_found": "That playbook was not found in the operational catalog.",
              "recommendation_staff_only": "Only staff can manage playbook recommendations.",
              "staff_only": "Only staff can review operational playbooks.",
              "ticket_only": "This command must be used inside a ticket channel.",
              "unknown_subcommand": "Unknown playbook subcommand."
            },
            "event_applied_title": "Suggested macro applied",
            "event_confirmed_title": "Recomendación confirmed from Discord",
            "event_description": "{{user}} marked recommendation {{id}} as {{status}}.",
            "event_dismissed_title": "Recomendación dismissed from Discord",
            "event_macro_description": "{{user}} posted macro {{label}} from an operational recommendation.",
            "field_catalog": "Catálogo",
            "field_current_plan": "Plan Actual",
            "field_enabled_count": "Enabled",
            "field_enabled_playbooks": "Playbooks Habilitados",
            "field_pending_recommendations": "Recomendaciones Pendientes",
            "group_description": "Review and manage operational playbooks",
            "list_description": "Listar todos playbooks and active recommendations",
            "list_description_generic": "You can manage playbooks from any channel, but live recommendations only appear when the command is run inside a ticket.",
            "list_title": "Server Operational Playbooks",
            "live_description": "Operational snapshot for the current ticket with recommendations ready to confirm, dismiss, or apply.",
            "live_footer": "Use /ticket playbook confirm, dismiss, or apply-macro to act on them.",
            "live_title": "Live Playbooks - Ticket #{{id}}",
            "macro_internal_note": "Playbook suggested internal note:\n{{content}}",
            "option_playbook": "Playbook ID from the catalog",
            "option_recommendation": "Recomendación ID or Playbook ID",
            "playbooks_empty": "No enabled playbooks",
            "recommendations_empty": "No pending recommendations for this ticket.",
            "success_confirmed": "✅ Recomendación `{{id}}` was confirmed.",
            "success_disabled": "✅ `{{label}}` is now disabled for this guild.",
            "success_dismissed": "✅ Recomendación `{{id}}` was dismissed.",
            "success_enabled": "✅ `{{label}}` is now enabled for this guild.",
            "success_enabled_locked": "✅ `{{label}}` is marked as enabled, but it will stay locked until the guild upgrades from the current plan (`{{plan}}`).",
            "success_macro_applied": "✅ Macro `{{label}}` posted and recommendation applied."
          },
          "subcommands": {
            "auto-assignment": {
              "description": "Configurar comportamiento de asignación automática"
            },
            "control-embed": {
              "description": "Personalizar el embed de control del ticket"
            },
            "panel": {
              "description": "Publicar o actualizar el panel de tickets"
            },
            "panel-style": {
              "description": "Establecer el estilo del panel de tickets"
            },
            "sla": {
              "description": "Configurar advertencia y escalado de SLA"
            },
            "sla-rule": {
              "description": "Agregar o actualizar una regla SLA por prioridad o categoría"
            },
            "welcome-message": {
              "description": "Establecer mensaje de bienvenida personalizado para nuevos tickets"
            }
          }
        },
        "welcome": {
          "description": "Configura los mensajes de bienvenida y el onboarding",
          "options": {
            "channel": "Canal de bienvenida",
            "dm_enabled": "Si los DMs de bienvenida deben seguir activos",
            "dm_message": "Contenido del DM. Variables: {{vars}}",
            "enabled": "Si los mensajes de bienvenida deben seguir activos",
            "footer_text": "Texto del footer",
            "hex": "Color hex sin `#`",
            "role": "Rol que se asignará al entrar (vacío para desactivar)",
            "show": "Mostrar el avatar del miembro",
            "text": "Contenido del mensaje",
            "title_text": "Título del embed",
            "url": "URL de imagen que empiece por `https://`"
          },
          "subcommands": {
            "autorole": {
              "description": "Define el rol que se asigna automáticamente al entrar"
            },
            "avatar": {
              "description": "Muestra u oculta el avatar del nuevo miembro"
            },
            "banner": {
              "description": "Configura o elimina la imagen de banner"
            },
            "channel": {
              "description": "Define el canal para los mensajes de bienvenida"
            },
            "color": {
              "description": "Define el color del embed de bienvenida (hex)"
            },
            "dm": {
              "description": "Configura el mensaje directo de bienvenida"
            },
            "enabled": {
              "description": "Activa o desactiva los mensajes de bienvenida"
            },
            "footer": {
              "description": "Actualiza el footer del embed de bienvenida"
            },
            "message": {
              "description": "Actualiza el mensaje de bienvenida. Variables: {{vars}}"
            },
            "test": {
              "description": "Envía un mensaje de bienvenida de prueba"
            },
            "title": {
              "description": "Actualiza el título del embed de bienvenida"
            }
          }
        }
      },
      "options": {
        "language_value": "Idioma para las respuestas visibles del bot"
      },
      "subcommands": {
        "language": {
          "description": "Revisa o actualiza el idioma del bot para este servidor"
        }
      }
    },
    "suggestions": {
      "channel_description": "Establece el canal utilizado para las sugerencias",
      "enabled_description": "Activa o desactiva las sugerencias",
      "group_description": "Configura el sistema de sugerencias"
    },
    "tickets": {
      "auto_assignment_description": "Configurar comportamiento de asignación automática",
      "choice_mode_least_active": "Menos activo",
      "choice_mode_random": "Aleatorio",
      "choice_mode_round_robin": "Round robin",
      "choice_sla_escalation": "Escalado",
      "choice_sla_warning": "Advertencia",
      "choice_style_buttons": "Botones",
      "choice_style_select": "Menú de selección",
      "control_embed_description": "Personalizar el embed de control del ticket",
      "daily_report_description": "Configurar reportes diarios de tickets",
      "group_description": "Configurar ajustes del sistema de tickets",
      "incident_description": "Activar o desactivar modo incidente",
      "option_active": "Activar o desactivar",
      "option_categories": "Categorías afectadas (IDs separados por comas)",
      "option_color": "Color del embed (hex)",
      "option_control_description": "Descripción del embed de control",
      "option_control_footer": "Pie del embed de control",
      "option_control_title": "Título del embed de control",
      "option_enabled": "Activar o desactivar",
      "option_escalation_channel": "Canal para alertas de escalado",
      "option_escalation_enabled": "Activar escalado",
      "option_escalation_minutes": "Minutos antes del escalado",
      "option_escalation_role": "Rol a mencionar en escalado",
      "option_incident_message": "Mensaje de incidente personalizado",
      "option_mode": "Modo de asignación",
      "option_panel_channel": "Canal para publicar el panel de tickets (opcional, usa el configurado o actual si no se especifica)",
      "option_panel_description": "Descripción del embed del panel",
      "option_panel_footer": "Pie del embed del panel",
      "option_panel_title": "Título del embed del panel",
      "option_report_channel": "Canal para reportes diarios",
      "option_require_online": "Requerir estado en línea",
      "option_reset": "Restablecer a predeterminado",
      "option_respect_away": "Respetar estado ausente",
      "option_rule_minutes": "Umbral de minutos",
      "option_rule_type": "Tipo de regla",
      "option_style": "Estilo del panel",
      "option_target_category": "Categoría objetivo",
      "option_target_priority": "Prioridad objetivo",
      "option_warning_minutes": "Minutos antes de advertencia SLA",
      "option_welcome_message": "Contenido del mensaje de bienvenida",
      "panel_description": "Publicar o actualizar el panel de tickets",
      "panel_style_description": "Establecer el estilo del panel de tickets",
      "sla_description": "Configurar advertencia y escalado de SLA",
      "sla_rule_description": "Agregar o actualizar una regla SLA por prioridad o categoría",
      "welcome_message_description": "Establecer mensaje de bienvenida personalizado para nuevos tickets"
    },
    "welcome": {
      "autorole_description": "Establece el rol asignado automáticamente al unirse",
      "autorole_disabled": "Auto-rol desactivado.",
      "autorole_set": "Auto-rol configurado: {{role}}",
      "avatar_description": "Muestra u oculta el avatar del nuevo miembro",
      "avatar_state": "Avatar del miembro en mensajes de bienvenida: **{{state}}**.",
      "banner_configured": "Banner de bienvenida configurado.",
      "banner_description": "Establece o borra la imagen del banner de bienvenida",
      "banner_removed": "Banner de bienvenida eliminado.",
      "channel_description": "Establece el canal utilizado para los mensajes de bienvenida",
      "channel_set": "Canal de bienvenida configurado en {{channel}}.",
      "color_description": "Establece el color del embed de bienvenida (hex)",
      "color_updated": "Color de bienvenida actualizado a **#{{hex}}**.",
      "dm_description": "Configura el mensaje directo de bienvenida",
      "dm_message_note": "\nTambién se actualizó el cuerpo del DM.",
      "dm_state": "El DM de bienvenida ahora está **{{state}}**.{{messageNote}}",
      "enabled_description": "Activa o desactiva los mensajes de bienvenida",
      "enabled_state": "Los mensajes de bienvenida ahora están **{{state}}**.",
      "footer_description": "Actualiza el pie de página del embed de bienvenida",
      "footer_updated": "Footer de bienvenida actualizado.",
      "group_description": "Configura los mensajes de bienvenida y avisos de incorporación",
      "hidden": "Oculto",
      "invalid_color": "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      "invalid_url": "La URL debe comenzar con `https://`.",
      "message_description": "Actualiza el mensaje de bienvenida",
      "message_updated": "Mensaje de bienvenida actualizado.\nVariables disponibles: {{vars}}",
      "test_channel_missing": "No se encontró el canal de bienvenida configurado.",
      "test_default_message": "¡Bienvenido {mention}!",
      "test_default_title": "¡Bienvenido!",
      "test_description": "Envía un mensaje de bienvenida de prueba",
      "test_field_account_created": "Cuenta creada",
      "test_field_member_count": "Cantidad de miembros",
      "test_field_user": "Usuario",
      "test_message_suffix": "*(mensaje de prueba)*",
      "test_requires_channel": "Configura primero un canal de bienvenida con `/setup welcome channel`.",
      "test_sent": "Mensaje de prueba de bienvenida enviado a {{channel}}.",
      "title_description": "Actualiza el título del embed de bienvenida",
      "title_updated": "Título de bienvenida actualizado a **{{text}}**.",
      "visible": "Visible"
    },
    "wizard": {
      "description": "Iniciar el asistente de configuración rápida del servidor",
      "option_admin": "Rol asignado a los administradores del bot",
      "option_dashboard": "Canal para el panel de control (Dashboard) de tickets",
      "option_logs": "Canal para los registros (Logs) de actividad de tickets",
      "option_plan": "Plan de operación inicial del servidor",
      "option_publish_panel": "Publicar el panel de creación de tickets inmediatamente",
      "option_sla_escalation": "Minutos de espera antes de proceder con la escalada de SLA",
      "option_sla_warning": "Minutos de espera antes de la primera advertencia de SLA",
      "option_staff": "Rol asignado al personal de soporte (Staff)",
      "option_transcripts": "Canal para el almacenamiento de transcripciones de tickets"
    }
  },
  "setup.automod.alert_channel": "Canal de alertas: {{channel}}",
  "setup.automod.alert_not_configured": "No hay canal de alertas configurado.",
  "setup.automod.bootstrap_created": "Se crearon {{count}} regla{{plural}} gestionada{{plural}} de AutoMod.",
  "setup.automod.bootstrap_no_new": "No se crearon reglas gestionadas nuevas de AutoMod.",
  "setup.automod.disable_no_rules": "No había reglas gestionadas de AutoMod para eliminar.",
  "setup.automod.disable_partial": "Se eliminaron {{removed}} regla{{removedPlural}}, pero se conservaron {{preserved}} IDs de reglas vinculadas.",
  "setup.automod.disable_removed": "Se eliminaron {{count}} regla{{plural}} gestionada{{plural}} de AutoMod.",
  "setup.automod.error_max_exempt_channels": "Alcanzaste el máximo de canales exentos.",
  "setup.automod.error_max_exempt_roles": "Alcanzaste el máximo de roles exentos.",
  "setup.automod.error_no_active_presets": "No hay presets activos para sincronizar.",
  "setup.automod.error_no_presets": "Selecciona al menos un preset antes de ejecutar esta acción.",
  "setup.automod.error_not_enabled": "Activa AutoMod primero antes de sincronizar reglas gestionadas.",
  "setup.automod.error_provide_channel_or_clear": "Proporciona un canal de alertas o usa `clear` para quitarlo.",
  "setup.automod.error_provide_channel_or_reset": "Proporciona un canal o elige reset/clear.",
  "setup.automod.error_provide_role_or_reset": "Proporciona un rol o elige reset/clear.",
  "setup.automod.error_unknown_action": "Acción de AutoMod desconocida.",
  "setup.automod.error_unknown_preset": "Preset de AutoMod desconocido.",
  "setup.automod.exempt_channels": "Canales exentos: {{channels}}",
  "setup.automod.exempt_roles": "Roles exentos: {{roles}}",
  "setup.automod.fetch_error": "No se pudo {{action}} el estado de AutoMod: {{message}}",
  "setup.automod.fetch_error_generic": "No se pudo obtener el estado de AutoMod desde Discord.",
  "setup.automod.field_alerts_exemptions": "Alertas y Exenciones",
  "setup.automod.field_managed_rules": "Reglas Gestionadas",
  "setup.automod.field_permissions": "Permisos",
  "setup.automod.field_sync_state": "Estado de Sincronización",
  "setup.automod.hint_bootstrap": "Ejecuta `/setup automod bootstrap` para crear por primera vez las reglas gestionadas de AutoMod.",
  "setup.automod.hint_disable": "Ejecuta `/setup automod disable` si quieres eliminar las reglas gestionadas de Discord.",
  "setup.automod.hint_sync": "Ejecuta `/setup automod sync` para aplicar los cambios más recientes de presets.",
  "setup.automod.info_already_exempt_channel": "{{channel}} ya está exento de AutoMod.",
  "setup.automod.info_already_exempt_role": "{{role}} ya está exento de AutoMod.",
  "setup.automod.last_sync": "Última sincronización: {{timestamp}}",
  "setup.automod.live_count": "Reglas gestionadas activas: {{live}} / {{desired}}",
  "setup.automod.never": "Nunca",
  "setup.automod.no_presets": "No hay presets seleccionados.",
  "setup.automod.no_sync_recorded": "Aún no se ha registrado ninguna sincronización.",
  "setup.automod.none": "Ninguno",
  "setup.automod.permission_failure": "No puedo {{action}} porque me faltan estos permisos: {{permissions}}.",
  "setup.automod.permission_failure_generic": "No puedo completar `{{action}}` porque faltan permisos requeridos de AutoMod.",
  "setup.automod.permissions_ok": "Todos los permisos requeridos están disponibles.",
  "setup.automod.presets_none": "No hay presets activados.",
  "setup.automod.rule_live": "Activa",
  "setup.automod.rule_missing": "Faltante",
  "setup.automod.status_disabled": "Desactivado",
  "setup.automod.status_enabled": "Activado",
  "setup.automod.status_title": "Estado de AutoMod para {{guildName}}",
  "setup.automod.stored_rule_ids": "IDs de reglas guardadas: {{count}}",
  "setup.automod.success_alert_cleared": "Canal de alertas de AutoMod eliminado. {{hint}}",
  "setup.automod.success_alert_set": "Las alertas de AutoMod ahora se enviarán a {{channel}}. {{hint}}",
  "setup.automod.success_exempt_channels_updated": "Canales exentos actualizados. Total actual: {{count}}. {{hint}}",
  "setup.automod.success_exempt_roles_updated": "Roles exentos actualizados. Total actual: {{count}}. {{hint}}",
  "setup.automod.success_presets_updated": "Presets de AutoMod actualizados: {{summary}} {{followUp}}",
  "setup.automod.sync_result": "Último resultado: {{status}}",
  "setup.automod.sync_summary": "Resumen: {{summary}}",
  "setup.automod.sync_summary_line": "Creadas {{created}}, actualizadas {{updated}}, eliminadas {{removed}}, sin cambios {{unchanged}}.",
  "sla_alerts": {
    "category": "Categoría",
    "description": "El ticket <#{{channelId}}> **#{{ticketId}}** lleva **{{time}}** sin respuesta del staff.",
    "hours_minutes": "{{h}}h {{m}}m",
    "minutes_plural": "{{count}} minutos",
    "sla_limit": "Límite SLA",
    "title": "Alerta SLA - Sin respuesta del staff",
    "user": "Usuario"
  },
  "sla_alerts.category": "Categoría",
  "sla_alerts.description": "El ticket <#{{channelId}}> **#{{ticketId}}** lleva **{{time}}** esperando respuesta del staff.",
  "sla_alerts.hours_minutes": "{{hours}}h {{minutes}}m",
  "sla_alerts.minutes_plural": "{{count}} minutos",
  "sla_alerts.sla_limit": "Límite SLA",
  "sla_alerts.title": "Advertencia SLA",
  "sla_alerts.user": "Usuario",
  "sla_escalation": {
    "category": "Categoría",
    "description": "El ticket <#{{channelId}}> **#{{ticketId}}** superó el umbral de escalado (**{{limit}} min**) sin respuesta del staff.",
    "title": "Escalado SLA - Atención requerida",
    "user": "Usuario"
  },
  "sla_escalation.category": "Categoría",
  "sla_escalation.description": "El ticket <#{{channelId}}> **#{{ticketId}}** superó el umbral de escalado (**{{limit}} min**) sin respuesta del staff.",
  "sla_escalation.title": "SLA Escalado",
  "sla_escalation.user": "Usuario",
  "smart_ping": {
    "category": "Categoría",
    "description": "Este ticket lleva más de **{{time}}** sin respuesta del staff.",
    "hours_plural": "{{count}} hora(s)",
    "title": "Smart Ping - Atención necesaria",
    "user": "Usuario"
  },
  "smart_ping.category": "Categoría",
  "smart_ping.description": "Este ticket lleva más de **{{time}}** sin respuesta del staff.",
  "smart_ping.hours_plural": "{{count}} horas",
  "smart_ping.title": "Smart Ping",
  "smart_ping.user": "Usuario",
  "staff": {
    "away_off": "Away off",
    "away_on_description": "Away on description",
    "away_on_footer": "Away on pie de página",
    "away_on_title": "Away on título",
    "moderation_required": "No tienes permisos suficientes para gestionar las advertencias de los miembros.",
    "my_tickets_empty": "My tickets vacío",
    "my_tickets_title": "My tickets título",
    "only_staff": "Only staff",
    "ownership_assigned": "Ownership asignado",
    "ownership_claimed": "Ownership reclamado",
    "ownership_watching": "Ownership watching",
    "slash": {
      "description": "Utilidades de gestión y moderación exclusivas para el personal",
      "options": {
        "reason": "Nota que explica tu estado de ausencia",
        "user": "El miembro a inspeccionar o advertir",
        "warn_reason": "Descripción de la infracción",
        "warning_id": "El ID de 6 caracteres de la advertencia"
      },
      "subcommands": {
        "away_off": {
          "description": "Limpia tu estado de ausencia y vuelve a estar activo"
        },
        "away_on": {
          "description": "Márcate como ausente con una razón opcional"
        },
        "my_tickets": {
          "description": "Revisa tus tickets actualmente reclamados y asignados"
        },
        "warn_add": {
          "description": "Aplicar una advertencia formal a un miembro"
        },
        "warn_check": {
          "description": "Revisar el historial de advertencias de un miembro"
        },
        "warn_remove": {
          "description": "Eliminar una advertencia específica por su ID único"
        }
      }
    },
    "staff_no_data_description": "No statistics found for <@{{userId}}>.",
    "staff_no_data_title": "No Staff Data"
  },
  "staff.away_off": "Estado de ausencia eliminado. Ya vuelves a estar activo.",
  "staff.away_on_description": "Ahora apareces como ausente.{{reasonText}}",
  "staff.away_on_footer": "Recuerda desactivar el modo ausente cuando regreses.",
  "staff.away_on_title": "Estado de ausencia activado",
  "staff.my_tickets_empty": "No tienes tickets reclamados ni asignados en este momento.",
  "staff.my_tickets_title": "Tus Tickets ({{count}})",
  "staff.only_staff": "Solo los miembros del staff pueden usar este comando.",
  "staff.ownership_assigned": "Asignado a ti",
  "staff.ownership_claimed": "Reclamado por ti",
  "staff.ownership_watching": "Observando",
  "staff_rating": {
    "average": "⭐ Promedio",
    "distribution": "📈 Distribución",
    "leaderboard_title": "🏆 Leaderboard de Staff — Calificaciones",
    "max": "🎯 Máximo posible",
    "no_ratings": "Aún no hay calificaciones registradas.\n\nLas calificaciones aparecen cuando los usuarios califican tickets cerrados.",
    "no_ratings_profile": "Este miembro del staff aún no tiene calificaciones registradas.",
    "profile_title": "📊 Calificaciones de {{username}}",
    "star_empty": "☆ vacía",
    "star_full": "⭐ estrella completa",
    "star_half": "✨ media",
    "total_ratings": "📊 Total calificaciones",
    "trend_average": "⚠️ Regular",
    "trend_excellent": "🔥 Excelente",
    "trend_good": "✅ Bueno",
    "trend_needs_improve": "❌ Necesita mejorar"
  },
  "stats": {
    "assigned_tickets": "Tickets Asignados",
    "average_rating": "Calificación Promedio",
    "average_score": "Puntuación Promedio",
    "avg_close": "Promedio de Resolución",
    "avg_first_response": "Promedio 1ra Respuesta",
    "avg_rating": "Calificación Promedio",
    "avg_response": "Promedio 1ra Respuesta",
    "claimed_tickets": "Tickets Reclamados",
    "closed": "Cerrados",
    "closed_tickets": "Tickets Cerrados",
    "escalation": "Estado de Escalamiento",
    "escalation_overrides": "Reglas de Escalamiento",
    "escalation_threshold": "Umbral de Escalamiento",
    "fallback_staff": "Fallback staff",
    "fallback_user": "Fallback user",
    "leaderboard_claimed": "reclamados",
    "leaderboard_closed": "cerrados",
    "leaderboard_empty": "Sin actividad de staff registrada aún.",
    "leaderboard_title": "Tabla de Rendimiento del Staff",
    "no_data": "N/A",
    "no_ratings_yet": "Sin calificaciones aún",
    "no_sla_threshold": "No sla threshold",
    "not_configured": "Not configured",
    "open": "Abiertos",
    "open_escalated": "Escalados Actualmente",
    "open_out_of_sla": "Abiertos Incumplidos",
    "opened": "Abiertos",
    "period_all": "Período all",
    "period_month": "Período month",
    "period_week": "Período week",
    "pro_consistent": "Consistente",
    "pro_efficiency": "Eficiencia de Resolución",
    "pro_metrics_title": "Inteligencia de Rendimiento Pro",
    "pro_needs_focus": "Necesita Enfoque",
    "pro_rating_quality": "Calidad de Servicio",
    "pro_top_performer": "Alto Rendimiento",
    "ratings_count": "{{count}} calificaciones",
    "ratings_empty": "Ratings vacío",
    "ratings_title": "Ratings título",
    "server_title": "Estadísticas del Servidor: {{guild}}",
    "sla_compliance": "Tasa de Cumplimiento SLA",
    "sla_description": "Métricas avanzadas para tiempos de respuesta y gestión de escalamientos.",
    "sla_overrides": "Reglas de Prioridad SLA",
    "sla_threshold": "Umbral SLA",
    "sla_title": "Panel de Cumplimiento SLA: {{guild}}",
    "slash": {
      "description": "Métricas de tickets de alta fidelidad y análisis de rendimiento",
      "subcommands": {
        "leaderboard": {
          "description": "Clasifica al staff activo por productividad y velocidad de reclamo"
        },
        "ratings": {
          "description": "Tendencias de satisfacción del staff basadas en los comentarios de los usuarios"
        },
        "server": {
          "description": "Vista general operativa de los totales de tickets y tendencias de respuesta"
        },
        "sla": {
          "description": "Informe de cumplimiento: tiempo de primera respuesta y densidad de escalamiento"
        },
        "staff": {
          "description": "Análisis profundo de la producción individual y la eficiencia de resolución"
        },
        "staff_rating": {
          "description": "Perfil de calificación visual para un miembro específico del staff"
        }
      }
    },
    "staff_no_data_description": "Staff sin datos description",
    "staff_no_data_title": "Staff sin datos título",
    "staff_rating_empty": "Este miembro del staff no ha recibido calificaciones aún.",
    "staff_rating_title": "Densidad de Calificación: {{user}}",
    "staff_title": "Perfil de Staff: {{user}}",
    "tickets_evaluated": "Tickets Evaluados",
    "today": "Actividad Hoy",
    "total": "Total de Tickets",
    "total_ratings": "Total de Calificaciones",
    "week": "Actividad esta Semana"
  },
  "stats.fallback_staff": "Staff #{{suffix}}",
  "stats.fallback_user": "Usuario #{{suffix}}",
  "stats.no_sla_threshold": "Sin umbral configurado",
  "stats.not_configured": "No configurado",
  "stats.period_all": "Todo el tiempo",
  "stats.period_month": "Último mes",
  "stats.period_week": "Última semana",
  "stats.ratings_empty": "No hay valoraciones disponibles.",
  "stats.ratings_title": "Valoraciones de satisfacción del staff",
  "stats.staff_no_data_description": "Este miembro del staff todavía no tiene actividad suficiente para generar un perfil.",
  "stats.staff_no_data_title": "Aún no hay datos del staff",
  "status": {
    "commercial": "Comercial"
  },
  "suggest": {
    "audit": {
      "approved": "Approved",
      "rejected": "Rejected",
      "status_updated": "Estado actualizado",
      "thread_reason": "Thread reasel"
    },
    "buttons": {
      "approve": "✅ Aprobar",
      "reject": "❌ Rechazar",
      "staff_note": "Añadir Nota de Staff (Pro)",
      "vote_down": "👎 Votar en Contra",
      "vote_up": "👍 Votar a Favor"
    },
    "cooldown": {
      "description": "Debes esperar **{{minutes}} minutos** antes de enviar otra sugerencia.",
      "title": "⏱️ Cooldown Activo"
    },
    "dm": {
      "description": "Tu sugerencia **#{{num}}** en **{{guildName}}** fue revisada.",
      "field_suggestion": "📝 Tu sugerencia",
      "title_approved": "✅ Tu sugerencia fue Aprobada",
      "title_rejected": "❌ Tu sugerencia fue Rechazada"
    },
    "embed": {
      "author_anonymous": "Anónimo",
      "debate_footer": "Usa este hilo para discutir esta sugerencia",
      "debate_title": "💬 Debate: Sugerencia #{{num}}",
      "field_author": "👤 Autor",
      "field_staff_comment": "💬 Comentario del staff",
      "field_staff_note": "💬 Nota del Staff",
      "field_status": "📋 Estado",
      "field_submitted": "📅 Enviada",
      "field_votes": "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% aprobación",
      "footer_reviewed": "Revisada por {{reviewer}} • {{status}}",
      "footer_status": "Estado: {{status}}",
      "no_description": "> (Sin descripción)",
      "title": "{{emoji}} Sugerencia #{{num}}"
    },
    "emoji": {
      "approved": "✅",
      "pending": "⏳",
      "rejected": "❌"
    },
    "errors": {
      "already_reviewed": "Esta sugerencia ya fue revisada y no admite más votos.",
      "already_status": "❌ Esta sugerencia ya fue {{status}}.",
      "channel_not_configured": "No se encontró el canal de sugerencias configurado.\nContacta a un administrador.",
      "interaction_error": "❌ Interacción no válida.",
      "invalid_data": "Debes proporcionar al menos un título o descripción para tu sugerencia.",
      "manage_messages_required": "❌ Necesitas permisos de **Gestionar Mensajes** para revisar sugerencias.",
      "not_exists": "❌ Esta sugerencia ya no existe.",
      "pro_required": "Esta función requiere **TON618 Pro**.",
      "processing_error": "❌ Ocurrió un error al procesar la interacción.",
      "system_disabled": "El sistema de sugerencias no está activado en este servidor.\nContacta a un administrador para activarlo.",
      "vote_error": "❌ Error al registrar tu voto."
    },
    "modal": {
      "field_description_label": "Descripción detallada",
      "field_description_placeholder": "Explica tu idea con más detalle...",
      "field_title_label": "Título de la sugerencia",
      "field_title_placeholder": "Ej: Añadir un canal de música",
      "title": "💡 Nueva Sugerencia"
    },
    "placeholder": "⏳ Creando sugerencia...",
    "slash": {
      "description": "💡 Envía una sugerencia para el servidor"
    },
    "status": {
      "approved": "✅ Aprobada",
      "pending": "⏳ Pendiente",
      "rejected": "❌ Rechazada"
    },
    "success": {
      "auto_thread_created": "Hilo de debate creado automáticamente.",
      "staff_note_updated": "Nota de staff actualizada para la sugerencia #{{num}}.",
      "status_updated": "✅ Sugerencia **#{{num}}** marcada como **{{status}}**.",
      "submitted_description": "Tu sugerencia **#{{num}}** ha sido publicada en {{channel}}.",
      "submitted_footer": "¡Gracias por tu aporte!",
      "submitted_title": "✅ Sugerencia Enviada",
      "vote_registered": "✅ Tu voto ha sido registrado. ({{emoji}})"
    }
  },
  "suggest.audit.approved": "Sugerencia aprobada por {{user}}",
  "suggest.audit.rejected": "Sugerencia rechazada por {{user}}",
  "suggest.audit.status_updated": "Sugerencia {{status}} por {{user}}",
  "suggest.audit.thread_reason": "Hilo de debate para sugerencia #{{num}}",
  "support_server": {
    "restricted": "❌ Este comando solo está disponible en el servidor de soporte oficial."
  },
  "support_server.restricted": "Este comando solo está disponible en el servidor de soporte oficial.",
  "ticket": {
    "categories": {
      "support": { "label": "Soporte", "description": "Ayuda con problemas técnicos y consultas generales" },
      "billing": { "label": "Facturación", "description": "Pagos, suscripciones y problemas con tu cuenta" },
      "report": { "label": "Reportar", "description": "Reportar usuarios, contenido o comportamientos" },
      "partnership": { "label": "Partner", "description": "Propuestas de colaboración y partnership" },
      "staff": { "label": "Staff", "description": "Aplicar al equipo del servidor" },
      "bug": { "label": "Reporte de bug", "description": "Reportar errores o problemas técnicos" },
      "other": { "label": "Otro", "description": "Cualquier otra consulta" }
    },
    "auto_reply": {
      "footer": "──────────────────────────────────\n⚡ **Prioridad Ultra-Rápida** (0.4s) | 💪 [Sé un héroe, apoya el proyecto](https://ton618.com/pro)",
      "footer_free": "──────────────────────────────────\n🎫 Sistema de tickets por TON618",
      "prefix": "🛡️ **TON618 PRO** | `Soporte Verificado` — *\"{{trigger}}\"*",
      "priority_badge": "🚨 **[PRIORIDAD URGENTE DETECTADA]**",
      "priority_note": "⚠️ **Nota de Inteligencia:** Se ha acelerado la revisión manual debido a la naturaleza crítica de este ticket.",
      "pro_badge": "🛡️ SOPORTE VERIFICADO PRO",
      "pro_footer_small": "Impulsado por TON618 Pro — La excelencia en soporte.",
      "sentiment_angry": "😡 Enfado / Urgencia Crítica",
      "sentiment_calm": "😊 Calma (Estándar)",
      "sentiment_label": "🎭 Sentimiento del Usuario",
      "suggestion_label": "💡 Sugerencia Pro",
      "urgency_keywords": [
        "urgente",
        "emergencia",
        "ayuda",
        "error",
        "fallo",
        "no funciona",
        "pago",
        "problema",
        "hack",
        "robo",
        "asap",
        "auxilio"
      ]
    },
    "buttons": {
      "claim": "Reclamar",
      "claimed": "Reclamado",
      "close": "Cerrar",
      "reopen": "Reabrir",
      "transcript": "Transcripción"
    },
    "categories": {
      "support": {
        "label": "Soporte General",
        "description": "Ayuda con problemas generales",
        "welcome": "¡Hola {user}! 🛠️\n\nGracias por contactar con **Soporte General**.\nUn miembro del equipo te ayudará en breve.\n\n> Por favor describe tu problema con tantos detalles como sea posible."
      },
      "billing": {
        "label": "Facturación",
        "description": "Pagos, facturas o reembolsos",
        "welcome": "¡Hola {user}! 💳\n\nHas abierto un ticket de **Facturación**.\n\n> Nunca compartas información bancaria completa o datos de tarjetas."
      },
      "report": {
        "label": "Reportar Usuario",
        "description": "Reportar comportamiento inapropiado",
        "welcome": "¡Hola {user}! 🚨\n\nHas abierto un **Reporte de Usuario**.\nEl equipo de moderación lo revisará lo antes posible.\n\n> Por favor incluye cualquier evidencia útil como capturas de pantalla o enlaces a mensajes."
      },
      "partnership": {
        "label": "Asociaciones",
        "description": "Solicitudes de colaboración o asociación",
        "welcome": "¡Hola {user}! 🤝\n\nHas abierto un ticket de **Asociaciones**.\nPor favor comparte detalles sobre tu servidor, marca o proyecto."
      },
      "staff": {
        "label": "Solicitud Staff",
        "description": "Solicita unirte al equipo",
        "welcome": "¡Hola {user}! ⭐\n\nHas abierto una **Solicitud de Staff**.\nPor favor responde honestamente y con suficientes detalles para su revisión."
      },
      "bug": {
        "label": "Reportar Bug",
        "description": "Reportar un error o flujo roto",
        "welcome": "¡Hola {user}! 🐛\n\nHas abierto un **Reporte de Bug**.\nPor favor describe el problema claramente para que podamos reproducirlo."
      }
    },
    "close_button": {
      "already_closed": "Este ticket ya está cerrado.",
      "auto_close_failed": "No pude cerrar el ticket automáticamente. Inténtalo de nuevo o avisa a un administrador.",
      "bot_member_missing": "No pude verificar mis permisos en este servidor.",
      "close_note_event_description": "{{userTag}} agregó una nota interna antes de cerrar el ticket #{{ticketId}}.",
      "close_note_event_title": "Nota de cierre agregada",
      "missing_manage_channels": "Necesito el permiso `Manage Channels` para cerrar tickets.",
      "modal_error": "Ocurrió un error al procesar el cierre del ticket. Inténtalo de nuevo más tarde.",
      "modal_title": "Cerrar ticket #{{ticketId}}",
      "notes_label": "Notas internas",
      "notes_placeholder": "Notas extra solo para staff...",
      "open_form_error": "Ocurrió un error al abrir el formulario de cierre. Inténtalo otra vez.",
      "permission_denied_description": "Solo el staff puede cerrar tickets.",
      "permission_denied_title": "Permiso denegado",
      "processing_description": "Iniciando el flujo de cierre y generación de transcripción...",
      "processing_title": "Procesando cierre",
      "reason_label": "Motivo de cierre",
      "reason_placeholder": "Ejemplo: resuelto, duplicado, solicitud completada..."
    },
    "command": {
      "channel_renamed": "Canal renombrado a **{{name}}**",
      "closed_priority_denied": "No puedes cambiar la prioridad de un ticket cerrado.",
      "history_empty": "<@{{userId}}> no tiene tickets en este servidor.",
      "history_open_now": "Abiertos ahora",
      "history_recently_closed": "Cerrados recientemente",
      "history_summary": "Resumen",
      "history_summary_value": "Total: **{{total}}** | Abiertos: **{{open}}** | Cerrados: **{{closed}}**",
      "history_title": "Historial de tickets de {{user}}",
      "move_select_description": "Selecciona la categoría a la que quieres mover este ticket:",
      "move_select_placeholder": "Selecciona la nueva categoría...",
      "no_other_categories": "No hay otras categorias disponibles.",
      "no_rating": "Sin calificacion",
      "not_ticket_channel": "Este no es un canal de ticket.",
      "note_added_event_description": "{{userTag}} agrego una nota interna al ticket #{{ticketId}}.",
      "note_added_footer": "Por {{userTag}} · {{count}}/{{max}}",
      "note_added_title": "Nota interna agregada",
      "note_limit_reached": "Se alcanzo el limite de notas del ticket (**{{max}}** notas maximas por ticket). Usa `/ticket note clear` si necesitas limpiarlas.",
      "notes_cleared": "Se limpiaron todas las notas del ticket.",
      "notes_cleared_event_description": "{{userTag}} limpio las notas internas del ticket #{{ticketId}}.",
      "notes_empty": "Todavia no hay notas en este ticket.",
      "notes_list_title": "Notas del ticket — #{{ticketId}} ({{count}}/{{max}})",
      "notes_title": "Notas del ticket",
      "only_admin_clear_notes": "Solo los administradores pueden limpiar todas las notas del ticket.",
      "only_staff_add": "Solo el staff puede agregar usuarios al ticket.",
      "only_staff_assign": "Solo el staff puede asignar tickets.",
      "only_staff_brief": "Solo el staff puede ver el case brief.",
      "only_staff_claim": "Solo el staff puede reclamar tickets.",
      "only_staff_close": "Solo el staff puede cerrar tickets.",
      "only_staff_info": "Solo el staff puede ver los detalles del ticket.",
      "only_staff_move": "Solo el staff puede mover tickets.",
      "only_staff_notes": "Solo el staff puede ver o agregar notas.",
      "only_staff_other_history": "Solo el staff puede ver el historial de otro usuario.",
      "only_staff_priority": "Solo el staff puede cambiar la prioridad del ticket.",
      "only_staff_remove": "Solo el staff puede quitar usuarios del ticket.",
      "only_staff_rename": "Solo el staff puede renombrar tickets.",
      "only_staff_reopen": "Solo el staff puede reabrir tickets.",
      "only_staff_transcript": "Solo el staff puede generar transcripciones.",
      "priority_event_description": "{{userTag}} cambio la prioridad del ticket #{{ticketId}} a {{label}}.",
      "priority_event_title": "Prioridad actualizada",
      "priority_updated": "Prioridad actualizada a **{{label}}**",
      "release_denied": "No tienes permiso para liberar este ticket.",
      "rename_event_description": "{{userTag}} renombro el ticket #{{ticketId}} a {{name}}.",
      "rename_event_title": "Canal renombrado",
      "transcript_failed": "No se pudo generar la transcripcion.",
      "transcript_generated": "Transcripcion generada.",
      "unknown_subcommand": "Subcomando de ticket desconocido.",
      "valid_channel_name": "Proporciona un nombre de canal valido."
    },
    "create_errors": {
      "duplicate_number": "Hubo un conflicto interno al numerar el ticket. Inténtalo de nuevo.",
      "generic": "Ocurrió un error al crear el ticket. Verifica mis permisos o contacta a un administrador.",
      "missing_permissions": "No tengo permisos suficientes para crear o preparar el canal del ticket.",
      "reserve_number": "No pude reservar un número interno para el ticket. Inténtalo de nuevo en unos segundos."
    },
    "create_flow": {
      "auto_escalation_applied": "Pro: Escalamiento Inteligente aplicado (Prioridad: Urgente)",
      "blacklisted": "Estás en blacklist.\n**Motivo:** {{reason}}",
      "category_not_found": "Categoría no encontrada.",
      "control_panel_failed": "No se pudo enviar el panel de control.",
      "cooldown": "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.",
      "created_success_description": "Tu ticket ha sido creado: <#{{channelId}}> | **#{{ticketId}}**\n\nVe al canal para continuar tu solicitud.{{warningText}}",
      "created_success_title": "Ticket creado correctamente",
      "dm_created_description": "Tu ticket **#{{ticketId}}** ha sido creado en **{{guild}}**.\nCanal: <#{{channelId}}>\n\nTe avisaremos cuando el staff responda.",
      "dm_created_title": "Ticket creado",
      "duplicate_request": "Ya se está procesando una solicitud de creación de ticket para ti. Espera unos segundos.",
      "general_category": "General",
      "global_limit": "Este servidor alcanzó el límite global de **{{limit}}** tickets abiertos. Espera a que se libere espacio.",
      "invalid_form": "El formulario no es válido. Amplía la primera respuesta.",
      "min_days_required": "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.",
      "missing_permissions": "No tengo los permisos necesarios para crear tickets.\n\nPermisos requeridos: Manage Channels, View Channel, Send Messages, Manage Roles.",
      "pending_ratings_description": "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      "pending_ratings_footer": "TON618 Tickets - Sistema de calificación",
      "pending_ratings_title": "Calificaciones de tickets pendientes",
      "question_fallback": "Pregunta {{index}}",
      "resend_ratings_button": "Reenviar solicitudes de calificación",
      "self_permissions_error": "No pude verificar mis permisos en este servidor.",
      "submitted_form": "Formulario enviado",
      "system_not_configured_description": "El sistema de tickets no está configurado correctamente.\n\n**Problema:** no hay categorías de tickets configuradas.\n\n**Solución:** un administrador debe crear categorías con:\n`/config category add`\n\nContacta al equipo de administración del servidor para resolver este problema.",
      "system_not_configured_footer": "TON618 Tickets - Error de configuración",
      "system_not_configured_title": "Sistema de tickets no configurado",
      "user_limit": "Ya tienes **{{openCount}}/{{maxPerUser}}** tickets abiertos{{suffix}}",
      "verify_role_required": "Necesitas el rol <@&{{roleId}}> para abrir tickets.",
      "welcome_message_failed": "No se pudo enviar el mensaje de bienvenida."
    },
    "defaults": {
      "control_panel_description": "Este es el panel de control del ticket **{ticket}**.\nUsa los controles de abajo para gestionarlo.",
      "control_panel_footer": "{guild} • TON618 Tickets",
      "control_panel_title": "Panel de Control del Ticket",
      "public_panel_description": "Abre un ticket privado seleccionando la categoría que mejor encaje con tu solicitud.",
      "public_panel_footer": "{guild} • Soporte profesional",
      "public_panel_title": "¿Necesitas ayuda? Estamos aquí para ti.",
      "welcome_message": "Hola {user}, tu ticket **{ticket}** ha sido creado. Comparte todos los detalles posibles."
    },
    "error_label": "Error",
    "events": {
      "assigned_dashboard": "Ticket asignado desde dashboard",
      "assigned_dashboard_desc": "{{actor}} se asignó el ticket #{{id}}.",
      "claimed": "Ticket reclamado",
      "claimed_dashboard": "Ticket reclamado desde dashboard",
      "claimed_dashboard_desc": "{{actor}} reclamó el ticket #{{id}} desde la dashboard.",
      "claimed_desc": "{{actor}} tomó este ticket desde la dashboard.",
      "closed": "Ticket cerrado",
      "closed_dashboard": "Ticket cerrado desde dashboard",
      "closed_dashboard_desc": "{{actor}} cerró el ticket #{{id}} desde la dashboard.",
      "closed_desc": "{{actor}} cerró este ticket desde la dashboard.\nMotivo: {{reason}}",
      "footer_bridge": "TON618 · Inbox operativa",
      "internal_note": "Nota interna agregada",
      "internal_note_desc": "{{actor}} agregó una nota interna desde la dashboard.",
      "macro_sent": "Macro enviada",
      "macro_sent_desc": "{{actor}} envió la macro {{macro}} desde la dashboard.",
      "no_details": "Sin detalles adicionales.",
      "priority_updated": "Prioridad actualizada",
      "priority_updated_desc": "{{actor}} cambió la prioridad del ticket #{{id}} a {{priority}}.",
      "recommendation_confirmed": "Recomendación confirmada",
      "recommendation_confirmed_desc": "{{actor}} confirmó una recomendación operativa desde la dashboard.",
      "recommendation_discarded": "Recomendación descartada",
      "recommendation_discarded_desc": "{{actor}} descartó una recomendación operativa desde la dashboard.",
      "released_dashboard": "Ticket liberado desde dashboard",
      "released_dashboard_desc": "{{actor}} liberó el ticket #{{id}} desde la dashboard.",
      "reopened": "Ticket reabierto",
      "reopened_dashboard": "Ticket reabierto desde dashboard",
      "reopened_dashboard_desc": "{{actor}} reabrió el ticket #{{id}} desde la dashboard.",
      "reopened_desc": "{{actor}} reabrió este ticket desde la dashboard.",
      "reply_sent": "Respuesta enviada",
      "reply_sent_desc": "{{actor}} respondió al cliente desde la dashboard.",
      "reply_sent_title": "Respuesta desde la dashboard",
      "status_attending": "En Atención",
      "status_searching": "Buscando Staff",
      "status_updated": "Estado operativo actualizado",
      "status_updated_desc": "{{actor}} cambió el estado del ticket #{{id}} a {{status}}.",
      "tag_added": "Tag agregado",
      "tag_added_desc": "{{actor}} agregó el tag {{tag}} desde la dashboard.",
      "tag_removed": "Tag removido",
      "tag_removed_desc": "{{actor}} removió el tag {{tag}} desde la dashboard.",
      "unassigned": "Asignación removida",
      "unassigned_desc": "{{actor}} removió la asignación del ticket #{{id}}."
    },
    "faq": {
      "description": "Aquí están las respuestas más comunes que la gente necesita antes de abrir un ticket. Revisarlas rápido puede ahorrarte tiempo de espera.",
      "footer": "¿Sigues necesitando ayuda? Elige una categoría en el menú desplegable para abrir un ticket.",
      "load_failed": "No pudimos cargar la FAQ ahora mismo. Inténtalo de nuevo más tarde.",
      "q1_answer": "Ve a nuestra tienda oficial, o abre un ticket en la categoría **Ventas** si necesitas ayuda paso a paso.",
      "q1_question": "¿Cómo compro un producto o membresía?",
      "q2_answer": "Abre un ticket de **Soporte / Facturación** e incluye tu comprobante de pago más el ID de transacción para que el equipo lo revise.",
      "q2_question": "¿Cómo solicito un reembolso?",
      "q3_answer": "Para que un reporte sea válido, incluye capturas o videos claros y explica la situación en un ticket de **Reportes**.",
      "q3_question": "Quiero reportar a un usuario",
      "q4_answer": "Las solicitudes de partnership se gestionan por tickets de **Partnership**. Asegúrate de cumplir primero los requisitos mínimos.",
      "q4_question": "Quiero aplicar para una partnership",
      "title": "Preguntas frecuentes"
    },
    "field_assigned_to": "Asignado a",
    "field_category": "Categoría",
    "field_priority": "Prioridad",
    "footer": "TON618 Tickets",
    "labels": {
      "assigned": "Asignado",
      "category": "Categoría",
      "claimed": "Reclamado",
      "priority": "Prioridad",
      "status": "Estado"
    },
    "lifecycle": {
      "assign": {
        "assign_permissions_error": "Hubo un error al dar permisos al miembro del staff asignado: {{error}}",
        "bot_denied": "No puedes asignar el ticket a un bot.",
        "closed_ticket": "No puedes asignar un ticket cerrado.",
        "creator_denied": "No puedes asignar el ticket al usuario que lo creó.",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos.",
        "dm_description": "Se te asignó el ticket **#{{ticketId}}** en **{{guild}}**.\n\n**{{categoryLabel}}:** {{category}}\n**Usuario:** <@{{userId}}>\n**Canal:** [Ir al ticket]({{channelLink}})\n\nPor favor revísalo lo antes posible.",
        "dm_line": "\n\nSe notificó al miembro del staff por DM.",
        "dm_title": "Ticket asignado",
        "dm_warning": "No se pudo notificar al miembro del staff por DM (DMs desactivados).",
        "event_description": "{{userTag}} asignó el ticket #{{ticketId}} a {{staffTag}}.",
        "invalid_assignee": "Solo puedes asignar el ticket a miembros del staff (rol de soporte o administrador).",
        "log_assigned_by": "Asignado por",
        "log_assigned_to": "Asignado a",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para asignar tickets.",
        "result_description": "El ticket **#{{ticketId}}** fue asignado a <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        "result_title": "Ticket asignado",
        "staff_member_missing": "No pude encontrar a ese miembro del staff en este servidor.",
        "staff_only": "Solo el staff puede asignar tickets.",
        "verify_permissions": "No pude verificar mis permisos en este servidor."
      },
      "claim": {
        "already_claimed_other": "Ya fue reclamado por <@{{userId}}>. Usa `/ticket unclaim` primero.",
        "already_claimed_self": "Ya reclamaste este ticket.",
        "claimed_during_request": "Este ticket fue reclamado por <@{{userId}}> mientras se procesaba tu solicitud.",
        "closed_ticket": "No puedes reclamar un ticket cerrado.",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos. Intenta de nuevo.",
        "dm_description": "Tu ticket **#{{ticketId}}** en **{{guild}}** ya tiene un miembro del staff asignado.\n\n**Staff asignado:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Canal:** [Ir al ticket]({{channelLink}})\n\nUsa el enlace de arriba para entrar directamente al ticket y continuar la conversación.",
        "dm_line": "\n\nSe notificó al usuario por DM.",
        "dm_title": "Tu ticket ya está siendo atendido",
        "event_description": "{{userTag}} reclamó el ticket #{{ticketId}}.",
        "log_claimed_by": "Reclamado por",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para reclamar este ticket.",
        "result_description": "Reclamaste el ticket **#{{ticketId}}** correctamente.{{dmLine}}{{warningBlock}}",
        "result_title": "Ticket reclamado",
        "staff_only": "Solo el staff puede reclamar tickets.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "warning_dm": "No se pudo notificar al usuario por DM (DMs desactivados).",
        "warning_permissions": "Tus permisos no pudieron actualizarse completamente."
      },
      "close": {
        "already_closed": "Este ticket ya esta cerrado.",
        "already_closed_during_request": "Este ticket ya fue cerrado mientras se procesaba tu solicitud.",
        "database_error": "Hubo un error al cerrar el ticket en la base de datos. Intenta de nuevo.",
        "delete_reason": "Ticket cerrado",
        "dm_field_category": "Categoría",
        "dm_field_closed": "Fecha de cierre",
        "dm_field_duration": "Duración total",
        "dm_field_handled_by": "Atendido por",
        "dm_field_messages": "Mensajes",
        "dm_field_opened": "Fecha de apertura",
        "dm_field_reason": "Razón de cierre",
        "dm_field_ticket": "Ticket",
        "dm_field_transcript": "Transcripcion en linea",
        "dm_footer": "Gracias por confiar en nuestro soporte - TON618 Tickets",
        "dm_no_reason": "No se proporciono una razón",
        "dm_receipt_description": "Gracias por contactar con nuestro equipo de soporte. Aqui tienes un resumen de tu ticket.",
        "dm_receipt_title": "Recibo de soporte",
        "dm_transcript_link": "Ver transcripcion completa",
        "dm_warning_description": "No se pudo enviar el mensaje de cierre por DM a <@{{userId}}>.\n\n**Posible causa:** el usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n**Ticket:** #{{ticketId}}",
        "dm_warning_title": "Aviso: DM no enviado",
        "dm_warning_transcript": "Transcripcion disponible",
        "dm_warning_unavailable": "No disponible",
        "event_description": "{{userTag}} cerro el ticket #{{ticketId}}.",
        "event_title": "Ticket cerrado",
        "log_duration": "Duración",
        "log_reason": "Razón",
        "log_transcript": "Transcripcion",
        "log_unavailable": "No disponible",
        "log_user": "Usuario",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para cerrar este ticket.",
        "result_closed_description": "El ticket ya fue cerrado, pero el canal permanecera disponible hasta que la transcripcion pueda archivarse de forma segura.",
        "result_closed_title": "Ticket cerrado",
        "result_closing_description": "Este ticket se eliminara en **{{seconds}} segundos**.\n\n{{dmStatus}}",
        "result_closing_title": "Cerrando ticket",
        "result_dm_failed": "No se pudo notificar al usuario por DM.",
        "result_dm_sent": "Se envio un resumen al usuario por mensaje directo.",
        "transcript_channel_missing": "No hay un canal de transcripciones configurado. El canal permanecera cerrado y no se eliminara automaticamente.",
        "transcript_channel_unavailable": "El canal de transcripciones configurado no existe o no es accesible. El canal no se eliminara automaticamente.",
        "transcript_closed_unavailable": "No disponible",
        "transcript_closed_unknown": "Desconocido",
        "transcript_embed_title": "Transcripcion de ticket",
        "transcript_field_closed": "Cerrado",
        "transcript_field_duration": "Duración",
        "transcript_field_messages": "Mensajes",
        "transcript_field_rating": "Calificacion",
        "transcript_field_staff": "Staff",
        "transcript_field_user": "Usuario",
        "transcript_generate_error": "Ocurrio un error al generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        "transcript_generate_failed": "No se pudo generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        "transcript_rating_none": "Sin calificar",
        "transcript_send_failed": "No se pudo enviar la transcripcion al canal configurado. El canal no se eliminara automaticamente.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "warning_channel_not_deleted": "El canal no se eliminara automaticamente hasta que la transcripcion quede archivada de forma segura.",
        "warning_dm_failed": "No se pudo enviar DM al usuario."
      },
      "members": {
        "add": {
          "bot_denied": "No puedes agregar bots al ticket.",
          "closed_ticket": "No puedes agregar usuarios a un ticket cerrado.",
          "creator_denied": "Ese usuario ya es el creador del ticket.",
          "event_description": "{{userTag}} agregó a {{targetTag}} al ticket #{{ticketId}}.",
          "event_title": "Usuario agregado",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para agregar usuarios.",
          "permissions_error": "Hubo un error al dar permisos al usuario: {{error}}",
          "result_description": "<@{{userId}}> fue agregado al ticket y ahora puede ver el canal.",
          "result_title": "Usuario agregado",
          "verify_permissions": "No pude verificar mis permisos en este servidor."
        },
        "move": {
          "already_in_category": "El ticket ya esta en esta categoría.",
          "category_not_found": "Categoría no encontrada.",
          "closed_ticket": "No puedes mover un ticket cerrado.",
          "database_error": "Hubo un error al actualizar la categoría del ticket en la base de datos.",
          "event_description": "{{userTag}} movió el ticket #{{ticketId}} de {{from}} a {{to}}.",
          "event_title": "Categoría actualizada",
          "log_new": "Nueva",
          "log_previous": "Anterior",
          "log_priority": "Prioridad actualizada",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para mover tickets.",
          "result_description": "Ticket movido de **{{from}}** -> **{{to}}**\n\n**Nueva prioridad:** {{priority}}",
          "result_title": "Categoría cambiada",
          "verify_permissions": "No pude verificar mis permisos en este servidor."
        },
        "remove": {
          "admin_role_denied": "No puedes quitar el rol de administrador del ticket.",
          "bot_denied": "No puedes quitar al bot del ticket.",
          "closed_ticket": "No puedes quitar usuarios de un ticket cerrado.",
          "creator_denied": "No puedes quitar al creador del ticket.",
          "event_description": "{{userTag}} quitó a {{targetTag}} del ticket #{{ticketId}}.",
          "event_title": "Usuario quitado",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para quitar usuarios.",
          "permissions_error": "Hubo un error al quitar permisos al usuario: {{error}}",
          "result_description": "<@{{userId}}> fue quitado del ticket y ya no puede verlo.",
          "result_title": "Usuario quitado",
          "support_role_denied": "No puedes quitar el rol de soporte del ticket.",
          "verify_permissions": "No pude verificar mis permisos en este servidor."
        }
      },
      "reopen": {
        "already_open": "Este ticket ya esta abierto.",
        "database_error": "Hubo un error al reabrir el ticket en la base de datos.",
        "dm_description": "Tu ticket **#{{ticketId}}** en **{{guild}}** fue reabierto por {{staff}}.\n\n**Canal:** [Ir al ticket]({{channelLink}})\n\nYa puedes volver al canal y continuar la conversacion.",
        "dm_line": "\nSe notifico al usuario por DM.",
        "dm_title": "Ticket reabierto",
        "dm_warning": "No se pudo notificar al usuario por DM (puede tener los DMs desactivados).",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para reabrir este ticket.",
        "reopened_during_request": "Este ticket ya fue reabierto mientras se procesaba tu solicitud.",
        "result_description": "El ticket **#{{ticketId}}** fue reabierto correctamente.\n\n**Total de reaperturas:** {{count}}{{dmLine}}{{warningLine}}",
        "result_title": "Ticket reabierto",
        "user_missing": "No pude encontrar al usuario que creó este ticket.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "warning_line": "\n\nAviso: {{warning}}"
      },
      "unclaim": {
        "closed_ticket": "No puedes liberar un ticket cerrado.",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos.",
        "denied": "Solo quien reclamo el ticket o un administrador puede liberarlo.",
        "event_description": "{{userTag}} liberó el ticket #{{ticketId}}.",
        "log_previous_claimer": "Anteriormente reclamado por",
        "log_released_by": "Liberado por",
        "not_claimed": "Este ticket no esta reclamado.",
        "result_description": "El ticket fue liberado. Cualquier miembro del staff puede reclamarlo ahora.{{warningLine}}",
        "result_title": "Ticket liberado",
        "warning_permissions": "Algunos permisos no pudieron restaurarse completamente."
      }
    },
    "maintenance": {
      "description": "El sistema de tickets está temporalmente desactivado.\n\n**Motivo:** {{reason}}\n\nPor favor vuelve más tarde.",
      "scheduled": "Mantenimiento programado",
      "title": "Sistema en mantenimiento"
    },
    "modal": {
      "category_unavailable": "Esta categoría de ticket ya no está disponible. Vuelve a empezar.",
      "default_question": "¿Cómo podemos ayudarte?",
      "first_answer_short": "Tu primera respuesta es demasiado corta. Agrega más contexto antes de crear el ticket.",
      "placeholder_answer": "Escribe tu respuesta aquí...",
      "placeholder_detailed": "Describe tu problema con el mayor detalle posible..."
    },
    "questions": {
      "billing": {
        "0": "¿Cuál es el problema de facturación?",
        "1": "¿Cuál es tu ID de transacción o factura?",
        "2": "¿Qué método de pago usaste?"
      },
      "bug": {
        "0": "¿Qué salió mal?",
        "1": "¿Cómo podemos reproducirlo?",
        "2": "¿Qué dispositivo, navegador o plataforma estás usando?"
      },
      "other": {
        "0": "¿Cómo podemos ayudarte hoy?"
      },
      "partnership": {
        "0": "¿De qué trata tu servidor o proyecto?",
        "1": "¿Qué tan grande es tu comunidad?",
        "2": "¿Qué tipo de partnership estás proponiendo?"
      },
      "report": {
        "0": "¿A quién estás reportando?",
        "1": "¿Qué pasó?",
        "2": "¿Tienes evidencia para compartir?"
      },
      "staff": {
        "0": "¿Cuál es tu edad y experiencia en moderación/soporte?",
        "1": "¿Por qué quieres unirte al equipo?",
        "2": "¿Cuántas horas por semana estás disponible?",
        "3": "¿Cuál es tu zona horaria?"
      },
      "support": {
        "0": "¿Qué problema estás enfrentando?",
        "1": "¿Cuándo empezó a ocurrir?",
        "2": "¿Qué has intentado hasta ahora?"
      }
    },
    "move_select": {
      "move_failed": "No pude mover el ticket en este momento. Inténtalo de nuevo más tarde."
    },
    "options": {
      "ticket_add_user_user": "Usuario para agregar al ticket",
      "ticket_assign_staff_staff": "Miembro del personal que será responsable del ticket",
      "ticket_close_reason_reason": "Razón para cerrar el ticket",
      "ticket_history_user_user": "Miembro cuyo historial de tickets deseas inspeccionar",
      "ticket_note_add_note_note": "Contenido de la nota interna",
      "ticket_playbook_apply-macro_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_confirm_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_disable_playbook_playbook": "Nombre del playbook",
      "ticket_playbook_dismiss_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_enable_playbook_playbook": "Nombre del playbook",
      "ticket_priority_level_level": "Nuevo nivel de prioridad",
      "ticket_remove_user_user": "Usuario para eliminar del ticket",
      "ticket_rename_name_name": "Nuevo nombre del canal"
    },
    "categories": {
      "support.label": "Soporte",
      "billing.label": "Facturación",
      "report.label": "Reportar",
      "partnership.label": "Partner",
      "staff.label": "Staff",
      "bug.label": "Reporte de bug",
      "other.label": "Otro",
      "support.description": "Ayuda con problemas técnicos, consultas generales",
      "billing.description": "Pagos, suscripciones y problemas con tu cuenta",
      "report.description": "Reportar usuarios, contenido o comportamientos",
      "partnership.description": "Propuestas de colaboración y partnership",
      "staff.description": "Aplicar al equipo del servidor",
      "bug.description": "Reportar errores o problemas técnicos",
      "other.description": "Cualquier otra consulta",
      "support.welcome": "Gracias por abrir un ticket de soporte. Un miembro del equipo te atenderá pronto. Por favor describe tu problema con detalle.",
      "billing.welcome": "Gracias por contactar a soporte de facturación. Un miembro del equipo te atenderá lo antes posible.",
      "report.welcome": "Gracias por reportar. Nuestro equipo de moderación revisará tu reporte.",
      "partnership.welcome": "Gracias por tu interés en colaborar. Un miembro del equipo te contactará.",
      "staff.welcome": "Gracias por tu interés en nuestro equipo. Un líder te contactará.",
      "bug.welcome": "Gracias por reportar el error. Lo revisaremos lo antes posible.",
      "other.welcome": "Gracias por contactar. Un miembro del equipo te atenderá."
    },
    "panel": {
      "categories_cta": "Elige una opción del menú de abajo para empezar.",
      "categories_heading": "Elige una categoría",
"default_category": "Soporte General",
      "default_description": "Ayuda con temas generales",
      "faq_button": "FAQ",
      "queue_name": "📊 Cola actual",
      "queue_value": "🎫 Actualmente tenemos `{{openTicketCount}}` ticket(s) activo(s)\n⏱️ Te responderemos lo antes posible",
      "title": "🎫 Centro de Soporte",
      "description": "👋 **¡Bienvenido al sistema de tickets!**\n\nSelecciona la categoría que mejor describa tu problema:\n\n📋 **Antes de abrir un ticket:**\n• Lee las reglas del servidor\n• Revisa el FAQ o canales de anuncios\n• Sé específico e incluye detalles útiles\n\n⏰ **Tiempo de respuesta:** Generalmente menos de 24h\n💬 **¿Necesitas ayuda?** Usa el panel de abajo 👇",
      "footer": "🎫 TON618 Tickets v3.0 • Soporte rápido",
      "author_name": "🎫 Centro de Soporte",
      "categories_cta": "👇 **Selecciona una categoría** para crear tu ticket",
      "no_categories_title": "⚠️ No hay categorías configuradas",
      "no_categories_description": "No hay categorías de tickets disponibles. Un administrador debe configurar al menos una categoría."
    },
    "picker": {
      "access_denied_description": "No puedes crear tickets ahora mismo.\n**Motivo:** {{reason}}",
      "access_denied_footer": "Si crees que esto es un error, contacta a un administrador.",
      "access_denied_title": "Acceso denegado",
      "category_missing": "Esa categoría no se encontró o no está disponible ahora mismo. Elige otra opción.",
      "cooldown": "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.\n\nEste cooldown ayuda al equipo a gestionar mejor las solicitudes entrantes.",
      "limit_reached_description": "Ya tienes **{{openCount}}/{{maxTickets}}** tickets abiertos.\n\n**Tus tickets activos:**\n{{ticketList}}\n\nCierra uno de tus tickets actuales antes de abrir uno nuevo.",
      "limit_reached_title": "Límite de tickets alcanzado",
      "min_days": "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.\n\nTiempo actual en el servidor: **{{currentDays}} día(s)**",
      "no_categories": "No hay categorías de tickets configuradas para este servidor.",
      "pending_ratings_description": "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      "pending_ratings_footer": "TON618 Tickets - Sistema de calificación",
      "pending_ratings_title": "Calificaciones de tickets pendientes",
      "processing_error": "Ocurrió un error mientras se preparaba el formulario del ticket. Intenta de nuevo más tarde.",
      "resend_ratings_button": "Reenviar solicitudes de calificación",
      "select_description": "👇 **Selecciona la categoría** que mejor describa tu problema\n\nCada categoría enruta tu solicitud al equipo correcto para ayudarte más rápido.",
      "select_placeholder": "🎫 Elige una categoría...",
      "select_title": "🎫 Crear nuevo ticket"
    },
    "playbook": {
      "apply_macro_description": "Aplicar una macro de playbook manualmente",
      "confirm_description": "Confirmar y aplicar una recomendación de playbook",
      "disable_description": "Desactivar un playbook para este servidor",
      "dismiss_description": "Descartar una recomendación de playbook",
      "enable_description": "Activar un playbook para este servidor",
      "group_description": "Gestionar recomendaciones de playbook",
      "list_description": "Listar recomendaciones activas de playbook",
      "option_playbook": "Nombre del playbook",
      "option_recommendation": "ID de recomendación"
    },
    "priority": {
      "high": "Alta",
      "low": "Baja",
      "normal": "Normal",
      "urgent": "Urgente"
    },
    "quick_actions": {
      "placeholder": "Acciones rápidas de staff...",
      "priority_high": "Prioridad: Alta",
      "priority_low": "Prioridad: Baja",
      "priority_normal": "Prioridad: Normal",
      "priority_urgent": "Prioridad: Urgente",
      "status_pending": "Estado: Esperando al usuario",
      "status_review": "Estado: En revisión",
      "status_wait": "Estado: Esperando al staff"
    },
    "quick_feedback": {
      "add_staff_prompt": "Menciona al miembro del staff que quieres agregar a este ticket.",
      "closed": "Las acciones rápidas no están disponibles en tickets cerrados.",
      "not_found": "No se encontró la información del ticket.",
      "only_staff": "Solo el staff puede usar estas acciones.",
      "priority_event_description": "{{userTag}} actualizó la prioridad del ticket #{{ticketId}} a {{priority}} desde acciones rápidas.",
      "priority_event_title": "Prioridad actualizada",
      "priority_updated": "La prioridad del ticket se actualizó a **{{label}}** por <@{{userId}}>.",
      "processing_error": "Ocurrió un error mientras se procesaba esta acción.",
      "unknown_action": "Acción desconocida.",
      "workflow_event_description": "{{userTag}} actualizó el estado operativo del ticket #{{ticketId}} a {{status}} desde acciones rápidas.",
      "workflow_event_title": "Estado operativo actualizado",
      "workflow_updated": "El estado del ticket se actualizó a **{{label}}** por <@{{userId}}>."
    },
    "rating": {
      "already_recorded_description": "Ya calificaste este ticket con **{{rating}} estrella(s)**.",
      "already_recorded_processing": "Este ticket fue calificado mientras se procesaba tu respuesta.",
      "already_recorded_title": "Calificación ya registrada",
      "event_description": "{{userTag}} calificó el ticket #{{ticketId}} con {{rating}}/5.",
      "event_title": "Calificación recibida",
      "invalid_identifier_description": "El identificador de esta solicitud de calificación no es válido.",
      "invalid_identifier_title": "No se pudo guardar tu calificación",
      "invalid_value_description": "Selecciona una puntuación entre 1 y 5 estrellas.",
      "invalid_value_title": "Calificación inválida",
      "not_found_description": "No pude encontrar el ticket vinculado a esta solicitud de calificación.",
      "not_found_title": "Ticket no encontrado",
      "prompt_category_fallback": "General",
      "prompt_description": "Hola <@{{userId}}>, tu ticket **#{{ticketId}}** ha sido cerrado.\n\n**Calificación obligatoria:** debes calificar este ticket antes de abrir nuevos tickets en el futuro.\n\nTu feedback nos ayuda a mejorar el servicio y mantener una experiencia de soporte sólida.",
      "prompt_footer": "Tu opinión nos importa",
      "prompt_option_1_description": "El soporte no cumplió mis expectativas",
      "prompt_option_1_label": "1 estrella",
      "prompt_option_2_description": "El soporte fue aceptable pero necesita mejorar",
      "prompt_option_2_label": "2 estrellas",
      "prompt_option_3_description": "El soporte fue sólido y aceptable",
      "prompt_option_3_label": "3 estrellas",
      "prompt_option_4_description": "El soporte fue muy profesional",
      "prompt_option_4_label": "4 estrellas",
      "prompt_option_5_description": "El soporte superó mis expectativas",
      "prompt_option_5_label": "5 estrellas",
      "prompt_placeholder": "Selecciona una calificación...",
      "prompt_staff_label": "Miembro del staff",
      "prompt_title": "Califica el soporte que recibiste",
      "resend_clear": "**Todo al día.**\n\nYa no tienes calificaciones de tickets pendientes.\nPuedes abrir un nuevo ticket cuando lo necesites.",
      "resend_error": "Ocurrió un error al reenviar las solicitudes de calificación. Inténtalo de nuevo más tarde.",
      "resend_failed": "**No se pudieron reenviar las solicitudes de calificación**\n\nAsegúrate de tener los DMs abiertos e inténtalo otra vez.",
      "resend_partial_warning": "Aviso: no se pudieron reenviar {{failCount}} solicitud(es).",
      "resend_sent": "**Solicitudes de calificación reenviadas**\n\nReenviamos **{{successCount}}** solicitud(es) de calificación a tus DMs.\n\n**Revisa tus DMs** para calificar los tickets pendientes.{{warning}}",
      "resend_wrong_user": "Este botón solo puede usarlo el usuario correspondiente.",
      "save_failed_description": "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
      "save_failed_title": "No se pudo guardar tu calificación",
      "thanks_description": "Calificaste la experiencia de soporte con **{{rating}} estrella(s)**.\n\nTu feedback se registró correctamente y nos ayuda a mejorar el servicio.",
      "thanks_title": "Gracias por tu calificación",
      "unavailable_description": "Solo el creador de este ticket puede enviar esta calificación.",
      "unavailable_title": "Calificación no disponible"
    },
    "slash": {
      "choices": {
        "priority": {
          "high": "Alta",
          "low": "Baja",
          "normal": "Normal",
          "urgent": "Urgente"
        },
        "categories": {
          "support": {
            "label": "Soporte General",
            "description": "Ayuda con problemas generales",
            "welcome": "¡Hola {user}! 🛠️\n\nGracias por contactar **Soporte General**.\nUn miembro del equipo te ayudará pronto.\n\n> Por favor describe tu problema con el mayor detalle posible."
          },
          "billing": {
            "label": "Facturación",
            "description": "Pagos, facturas o reembolsos",
            "welcome": "¡Hola {user}! 💳\n\nAbriste un ticket de **Facturación**.\n\n> Nunca compartas datos bancarios completos."
          },
          "report": {
            "label": "Reportar Usuario",
            "description": "Reportar comportamiento inapropiado",
            "welcome": "¡Hola {user}! 🚨\n\nAbriste un **Reporte de Usuario**.\nEl equipo de moderación lo revisará lo antes posible.\n\n> Incluye cualquier evidencia útil como capturas de pantalla o enlaces."
          },
          "partnership": {
            "label": "Partnerships",
            "description": "Solicitudes de colaboración o alianza",
            "welcome": "¡Hola {user}! 🤝\n\nAbriste un ticket de **Partnerships**.\nComparte detalles sobre tu servidor, marca o proyecto."
          },
          "staff": {
            "label": "Aplicación Staff",
            "description": "Aplica para unirte al equipo",
            "welcome": "¡Hola {user}! ⭐\n\nAbriste una **Aplicación de Staff**.\nResponde honestamente y con suficiente detalle."
          },
          "bug": {
            "label": "Reportar Bug",
            "description": "Reporta un error o flujo roto",
            "welcome": "¡Hola {user}! 🐛\n\nAbriste un **Reporte de Bug**.\nDescribe el problema claramente para que podamos reproducirlo."
          },
          "other": {
            "label": "Otro",
            "description": "Cualquier otra cosa",
            "welcome": "¡Hola {user}! 📩\n\nAbriste un ticket.\nEl equipo te ayudará pronto."
          }
        },
        "panel": {
          "title": "🎫 Centro de Soporte",
          "description": "Bienvenido al sistema de tickets.\nElige la categoría que mejor coincida con tu solicitud.\n\n**📋 Antes de abrir un ticket:**\n▸ Lee las reglas del servidor\n▸ Revisa el FAQ o canales de anuncios\n▸ Sé específico e incluye detalles útiles\n\n**⏰ Tiempo de respuesta esperado:** generalmente menos de 24h",
          "footer": "TON618 Tickets v3.0 • Construido para soporte rápido"
        },
        "priorities": {
          "low": "🟢 Baja",
          "normal": "🔵 Normal",
          "high": "🟡 Alta",
          "urgent": "🔴 Urgente"
        }
      },
      "description": "Gestiona tickets de soporte",
      "groups": {
        "note": {
          "description": "Gestiona las notas internas del ticket",
          "options": {
            "note": "Contenido de la nota interna"
          },
          "subcommands": {
            "add": {
              "description": "Agrega una nota interna a este ticket"
            },
            "clear": {
              "description": "Limpia todas las notas internas de este ticket"
            },
            "list": {
              "description": "Lista las notas internas de este ticket"
            }
          }
        }
      },
      "options": {
        "add_user": "Usuario que se agregará al ticket",
        "assign_staff": "Miembro del staff que tendrá el ticket",
        "close_reason": "Motivo para cerrar el ticket",
        "history_user": "Miembro cuyo historial quieres revisar",
        "priority_level": "Nuevo nivel de prioridad",
        "remove_user": "Usuario que se quitará del ticket",
        "rename_name": "Nuevo nombre del canal"
      },
      "subcommands": {
        "add": {
          "description": "Agrega un usuario al ticket actual"
        },
        "assign": {
          "description": "Asigna el ticket actual a un miembro del staff"
        },
        "brief": {
          "description": "Genera el resumen del caso para este ticket"
        },
        "claim": {
          "description": "Reclama el ticket actual"
        },
        "close": {
          "description": "Cierra el ticket actual"
        },
        "history": {
          "description": "Muestra el historial de tickets de un miembro"
        },
        "info": {
          "description": "Muestra los detalles del ticket"
        },
        "move": {
          "description": "Mueve el ticket a otra categoría"
        },
        "open": {
          "description": "Abre un ticket nuevo"
        },
        "priority": {
          "description": "Cambia la prioridad del ticket"
        },
        "remove": {
          "description": "Quita un usuario del ticket actual"
        },
        "rename": {
          "description": "Renombra el canal del ticket actual"
        },
        "reopen": {
          "description": "Reabre el ticket actual"
        },
        "transcript": {
          "description": "Genera la transcripción del ticket"
        },
        "unclaim": {
          "description": "Libera el ticket actual"
        }
      }
    },
    "transcript_button": {
      "error": "Hubo un error al generar la transcripción. Por favor, inténtalo de nuevo más tarde.",
      "intro": "Aquí está la transcripción manual de este ticket:",
      "not_ticket": "No pude generar la transcripción porque este canal ya no está registrado como un ticket.",
      "unavailable_now": "No pude generar la transcripción del ticket en este momento."
    },
    "workflow": {
      "assigned": "Asignado",
      "closed": "Cerrado",
      "open": "Abierto",
      "triage": "En revisión",
      "waiting_staff": "Esperando al staff",
      "waiting_user": "Esperando al usuario"
    }
  },
  "ticket.labels.assigned": "Asignado a",
  "ticket.labels.category": "Categoría",
  "ticket.labels.claimed": "Reclamado por",
  "ticket.labels.priority": "Prioridad",
  "ticket.labels.status": "Estado",
  "ticket.workflow.assigned": "Asignado",
  "ticket.workflow.closed": "Cerrado",
  "ticket.workflow.open": "Abierto",
  "ticket.workflow.triage": "En revisión",
  "ticket.workflow.waiting_staff": "Esperando staff",
  "ticket.workflow.waiting_user": "Esperando usuario",
  "tickets": {
    "auto_assignment": {
      "require_online": "Require online",
      "respect_away": "Respect away",
      "status": "Status",
      "title": "Title"
    },
    "categories": {
      "more": "...y {{count}} más",
      "none": "Sin categorías configuradas",
      "off": "APAGADO",
      "on": "ENCENDIDO",
      "pings": "{{count}} pings"
    },
    "common": {
      "all_categories": "All categories",
      "default": "Default",
      "disabled": "Disabled",
      "enabled": "Habilitado",
      "minutes": "Minutes",
      "no": "No",
      "not_configured": "Not configured",
      "removed": "Removed",
      "yes": "Yes"
    },
    "customization": {
      "color_label": "Color label",
      "control_reset_description": "Control reset description",
      "control_reset_title": "Control reset título",
      "control_updated_description": "Control updated description",
      "control_updated_title": "Control updated título",
      "current_message_label": "Current message label",
      "description_label": "Descripción label",
      "footer_label": "Footer label",
      "panel_reset_description": "Panel reset description",
      "panel_reset_title": "Panel reset título",
      "panel_updated_description": "Panel updated description",
      "panel_updated_title": "Panel updated título",
      "placeholders_label": "Placeholders label",
      "title_label": "Title label",
      "welcome_reset_description": "Welcome reset description",
      "welcome_reset_title": "Welcome reset título",
      "welcome_updated_description": "Welcome updated description",
      "welcome_updated_title": "Welcome updated título"
    },
    "daily_report": {
      "channel": "Canal",
      "status": "Status",
      "title": "Title"
    },
    "errors": {
      "build_panel": "Build panel",
      "category_not_configured": "Category not configured",
      "daily_report_channel_required": "Daily report channel required",
      "escalation_channel_required": "Escalation channel required",
      "escalation_minutes_required": "Escalation minutos required",
      "exact_target": "Exact target",
      "invalid_categories": "Invalid categories",
      "invalid_color": "Invalid color",
      "message_empty": "Mensaje vacío",
      "message_or_reset": "Mensaje or reset",
      "no_categories": "No categories",
      "publish_failed": "Publish failed",
      "publish_permissions": "Publish permissions",
      "update_or_reset": "Update or reset"
    },
    "fields": {
      "channels_roles": "Infraestructura y Permisos",
      "commercial_status": "Comercial y Suscripción",
      "escalation_reporting": "Reporte de Incidentes y Escalamiento",
      "incident_mode": "Modo de Interrupción e Incidente",
      "limits_access": "Control de Acceso y Uso Justo",
      "panel_messaging": "Experiencia de Usuario y Personalización",
      "sla_automation": "Inteligencia Operativa y Automatización"
    },
    "footers": {
      "free": "Consola TON618 | Edición Comunitaria",
      "pro": "TON618 Pro | Inteligencia Operativa Activa"
    },
    "incident": {
      "configured_categories": "Categorías Activas",
      "default_message": "Actualmente estamos experimentando un alto volumen de tickets. Los tiempos de respuesta pueden ser mayores de lo habitual.",
      "disabled_title": "Disabled título",
      "enabled_title": "Habilitado título",
      "inactive": "El bot está operando normalmente",
      "message": "Difusión de Incidente",
      "paused_categories": "Paused categories",
      "resumed": "Resumed",
      "user_message": "Usuario message"
    },
    "labels": {
      "admin": "Rol de Admin del Bot",
      "auto_assignment": "Motor de Auto-Asignación",
      "auto_close": "Auto-Cierre por Inactividad",
      "base_sla": "Umbral SLA Base",
      "control_embed_color": "Color de Control (HEX)",
      "control_embed_description": "Descripción de Control de Staff",
      "control_embed_title": "Título de Control de Staff",
      "cooldown": "Enfriamiento de Creación",
      "global_limit": "Límite Global del Servidor",
      "logs": "Registros de Moderación",
      "max_per_user": "Tickets Concurrentes",
      "minimum_days": "Edad Mínima Cuenta (Días)",
      "more": "...y {{count}} más",
      "online_only": "Solo Asignar Staff Online",
      "panel": "Panel de Tickets",
      "panel_status": "Estado del Panel",
      "public_panel_color": "Color del Panel (HEX)",
      "public_panel_description": "Descripción del Panel Público",
      "public_panel_title": "Título del Panel Público",
      "simple_help": "Modo de Triaje Simple",
      "smart_ping": "Aviso de Smart Ping",
      "staff": "Rol de Staff de Soporte",
      "transcripts": "Transcripciones de Tickets",
      "welcome_message": "Mensaje de Bienvenida del Ticket"
    },
    "override": {
      "category_target": "Category target",
      "escalation": "Escalation",
      "priority_target": "Priority target",
      "target": "Target",
      "title": "Title",
      "type": "Type",
      "value": "Value",
      "warning": "Advertencia"
    },
    "panel": {
      "published_description": "Publicado description",
      "published_title": "Publicado título",
      "staff_role_active": "Staff role active",
      "staff_role_missing": "Staff role missing"
    },
    "panel_status": {
      "not_configured": "🔴 NO CONFIGURADO",
      "pending": "🟡 PENDIENTE",
      "published": "🟢 PUBLICADO"
    },
    "sla": {
      "base": "Base",
      "channel": "Canal",
      "escalation": "Escalation",
      "role": "Role",
      "threshold": "Threshold",
      "title": "Title"
    }
  },
  "tickets.auto_assignment.require_online": "Requerir staff en línea",
  "tickets.auto_assignment.respect_away": "Respetar estado ausente",
  "tickets.auto_assignment.status": "Estado",
  "tickets.auto_assignment.title": "Auto-asignación",
  "tickets.common.all_categories": "Todas las categorías",
  "tickets.common.default": "Predeterminado",
  "tickets.common.disabled": "Desactivado",
  "tickets.common.enabled": "Activado",
  "tickets.common.minutes": "{{value}} min",
  "tickets.common.no": "No",
  "tickets.common.not_configured": "No configurado",
  "tickets.common.removed": "Eliminado",
  "tickets.common.yes": "Sí",
  "tickets.customization.color_label": "Color",
  "tickets.customization.control_reset_description": "El panel interno de control volvió a sus valores predeterminados.",
  "tickets.customization.control_reset_title": "Panel de control restablecido",
  "tickets.customization.control_updated_description": "Se guardó el nuevo texto del panel interno de control.",
  "tickets.customization.control_updated_title": "Panel de control actualizado",
  "tickets.customization.current_message_label": "Mensaje actual",
  "tickets.customization.description_label": "Descripción",
  "tickets.customization.footer_label": "Pie",
  "tickets.customization.panel_reset_description": "El panel público de tickets volvió a sus valores predeterminados.",
  "tickets.customization.panel_reset_title": "Panel de tickets restablecido",
  "tickets.customization.panel_updated_description": "Se guardó el nuevo texto del panel público.",
  "tickets.customization.panel_updated_title": "Panel de tickets actualizado",
  "tickets.customization.placeholders_label": "Placeholders disponibles",
  "tickets.customization.title_label": "Título",
  "tickets.customization.welcome_reset_description": "El mensaje de bienvenida dentro del ticket volvió a sus valores predeterminados.",
  "tickets.customization.welcome_reset_title": "Mensaje de bienvenida del ticket restablecido",
  "tickets.customization.welcome_updated_description": "Se guardó el nuevo mensaje de bienvenida dentro del ticket.",
  "tickets.customization.welcome_updated_title": "Mensaje de bienvenida del ticket actualizado",
  "tickets.daily_report.channel": "Canal del reporte",
  "tickets.daily_report.status": "Estado",
  "tickets.daily_report.title": "Reporte Diario de Tickets",
  "tickets.errors.build_panel": "No se pudo construir el panel de tickets: {{error}}",
  "tickets.errors.category_not_configured": "Esa categoría de ticket no está configurada.",
  "tickets.errors.daily_report_channel_required": "Configura un canal antes de activar el reporte diario.",
  "tickets.errors.escalation_channel_required": "Configura un canal de escalamiento antes de activarlo.",
  "tickets.errors.escalation_minutes_required": "Proporciona minutos de escalamiento mayores que cero.",
  "tickets.errors.exact_target": "Elige exactamente un objetivo: prioridad o categoría.",
  "tickets.errors.invalid_categories": "Uno o más IDs de categoría son inválidos.",
  "tickets.errors.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos.",
  "tickets.errors.message_empty": "El mensaje no puede estar vacío.",
  "tickets.errors.message_or_reset": "Proporciona un mensaje o usa reset.",
  "tickets.errors.no_categories": "Configura al menos una categoría de tickets antes de publicar el panel.",
  "tickets.errors.publish_failed": "No se pudo publicar el panel de tickets.",
  "tickets.errors.publish_permissions": "Me faltan permisos para publicar el panel en {{channel}}.",
  "tickets.errors.update_or_reset": "Proporciona al menos un campo para actualizar o usa reset.",
  "tickets.incident.disabled_title": "Modo incidente desactivado",
  "tickets.incident.enabled_title": "Modo incidente activado",
  "tickets.incident.paused_categories": "Categorías pausadas",
  "tickets.incident.resumed": "Se reanudó el flujo normal de tickets.",
  "tickets.incident.user_message": "Mensaje visible para usuarios",
  "tickets.override.category_target": "Categoría: {{target}}",
  "tickets.override.escalation": "Escalamiento",
  "tickets.override.priority_target": "Prioridad: {{target}}",
  "tickets.override.target": "Objetivo",
  "tickets.override.title": "Override de SLA Actualizado",
  "tickets.override.type": "Tipo",
  "tickets.override.value": "Valor",
  "tickets.override.warning": "Advertencia",
  "tickets.panel.published_description": "Se publicó el panel de tickets en {{channel}}.",
  "tickets.panel.published_title": "Panel de tickets publicado",
  "tickets.panel.staff_role_active": "Rol de staff activo: {{role}}",
  "tickets.panel.staff_role_missing": "Aún no hay rol de staff configurado.",
  "tickets.sla.base": "SLA Base",
  "tickets.sla.channel": "Canal de escalamiento",
  "tickets.sla.escalation": "Escalamiento",
  "tickets.sla.role": "Rol de escalamiento",
  "tickets.sla.threshold": "Umbral",
  "tickets.sla.title": "Configuración SLA de Tickets",
  "transcript": {
    "error_generating": "Error al generar la transcripción",
    "labels": {
      "active": "Activo",
      "attended_by": "Atendido por",
      "category": "Categoría",
      "closed": "Cerrado",
      "created": "Creado",
      "duration": "Duración",
      "generated_on": "Transcripción generada el {{date}}",
      "messages": "Mensajes",
      "no_messages": "No hay mensajes en este ticket",
      "open": "Abierto",
      "rating": "Calificación",
      "status": "Estado",
      "ticket": "Ticket"
    },
    "title": "Transcripción de Ticket #{{ticketId}}"
  },
  "transcript.error_generating": "Ocurrió un error al generar la transcripción.",
  "transcript.labels.active": "Activo",
  "transcript.labels.attended_by": "Atendido por",
  "transcript.labels.category": "Categoría",
  "transcript.labels.closed": "Cerrado",
  "transcript.labels.created": "Creado",
  "transcript.labels.duration": "Duración",
  "transcript.labels.generated_on": "Generado el",
  "transcript.labels.messages": "Mensajes",
  "transcript.labels.no_messages": "No hay mensajes registrados",
  "transcript.labels.open": "Abierto",
  "transcript.labels.rating": "Valoración",
  "transcript.labels.status": "Estado",
  "transcript.labels.ticket": "Ticket",
  "transcript.title": "Transcripción del Ticket",
  "verification": {
    "autokick": {
      "description": "{{member}} (`{{tag}}`) fue expulsado tras permanecer no verificado por {{hours}}h.",
      "kick_reason": "No verificado tras {{hours}}h",
      "reason_log": "Auto-kick tras {{hours}}h sin verificación",
      "title": "Auto-kick: miembro no verificado"
    }
  },
  "verification.autokick.description": "{{user}} fue removido por no completar la verificación a tiempo.",
  "verification.autokick.kick_reason": "No completó la verificación a tiempo.",
  "verification.autokick.reason_log": "Expulsión automática por tiempo de verificación agotado",
  "verification.autokick.title": "Miembro Sin Verificar Expulsado",
  "verify": {
    "activity": {
      "anti_raid": "Anti-raid",
      "anti_raid_triggered": "Anti-raid activado",
      "force_unverified": "Verificación retirada manualmente",
      "force_verified": "Verificado manualmente",
      "info": "Información",
      "kicked": "Expulsado",
      "panel_publish_failed": "Falló la publicación del panel",
      "panel_published": "Panel publicado",
      "permission_error": "Error de permisos",
      "unverified": "Sin verificar",
      "unverified_kicked": "Miembro sin verificar expulsado",
      "verified": "Verificado"
    },
    "audit": {
      "completed": "Completed",
      "removed": "Removed"
    },
    "command": {
      "account_age_pro": "Requisito de edad de cuenta mayor a {{max}} días",
      "actor": "Actor",
      "anti_raid_disabled": "El anti-raid ahora está **desactivado**.",
      "anti_raid_enabled": "El anti-raid ahora está **activado**.\nUmbral: **{{joins}} joins** en **{{seconds}}s**.\nAcción: **{{action}}**.",
      "anti_raid_triggers": "Activaciones anti-raid",
      "auto_kick_disabled": "El auto-kick para miembros sin verificar ahora está **desactivado**.",
      "auto_kick_enabled": "Los miembros sin verificar serán expulsados después de **{{hours}} hora(s)**.",
      "captcha_emoji": "Contar emojis",
      "captcha_emoji_pro": "Tipo de CAPTCHA con emojis",
      "captcha_math": "Matemático",
      "captcha_type": "Tipo de CAPTCHA",
      "code_sends": "Códigos enviados",
      "confirmation_dm": "DM de confirmación",
      "dm_updated": "El DM de confirmación de verificación ahora está **{{state}}**.",
      "enable_failed": "Todavía no puedo activar la verificación.\n\n{{issues}}",
      "enabled_state": "La verificación ahora está **{{state}}**.",
      "failed": "Fallidos",
      "force_bot": "Los bots no pueden verificarse mediante el flujo de verificación de miembros.",
      "force_failed": "No pude verificar a <@{{userId}}>.\n\n{{issues}}",
      "force_log_title": "Miembro verificado manualmente",
      "force_success": "<@{{userId}}> fue verificado manualmente.{{warningText}}",
      "force_unverified": "Desverificados manualmente",
      "force_verified": "Verificados manualmente",
      "invalid_color": "Color inválido. Usa un valor hexadecimal de 6 caracteres como `57F287`.",
      "invalid_image": "La URL de la imagen debe comenzar con `https://`.",
      "kicked": "Expulsados",
      "logs_permissions": "No puedo usar {{channel}} para los logs de verificación. Permisos faltantes: {{permissions}}.",
      "logs_set": "Los logs de verificación se enviarán a {{channel}}.",
      "member": "Miembro",
      "message_require_one": "Proporciona al menos un campo para actualizar: `title`, `description`, `color` o `image`.",
      "message_updated": "Panel de verificación actualizado. {{detail}}",
      "min_account_age": "Edad mínima de cuenta",
      "mode_changed": "El modo de verificación cambió a **{{mode}}**. {{detail}}",
      "mode_failed": "Todavía no puedo cambiar a **{{mode}}**.\n\n{{issues}}",
      "note_question_mode": "El modo pregunta está activo. Usa `/verify question` si quieres reemplazar el desafío por defecto.",
      "note_ticket_role_aligned": "El rol mínimo de verificación para tickets se alineó automáticamente porque no estaba configurado.",
      "operational_health": "Salud operativa",
      "panel_publish_failed": "El panel de verificación no pudo publicarse.\n\n{{issues}}",
      "panel_published": "Panel de verificación publicado.",
      "panel_refreshed": "Panel de verificación actualizado.",
      "panel_saved_but_not_published": "La configuración de verificación se guardó, pero el panel no pudo publicarse.\n\n{{issues}}",
      "pending_members": "Miembros pendientes",
      "permission_errors": "Errores de permisos",
      "pool_added": "Pregunta agregada: **{{question}}...**\nTotal de preguntas: {{total}}",
      "pool_cleared": "Se eliminaron {{count}} pregunta(s) del pool.",
      "pool_count": "{{count}} pregunta(s) en el pool",
      "pool_empty": "No hay preguntas en el pool todavía.\n\nUsa `/verify question-pool add` para agregar preguntas.",
      "pool_footer": "Usa /verify question-pool add para agregar preguntas",
      "pool_invalid_index": "Índice inválido. Usa un número entre 1 y {{max}}.",
      "pool_max_reached": "Máximo de 20 preguntas alcanzado. Elimina algunas antes de agregar más.",
      "pool_pro_feature": "Más de 5 preguntas en el pool",
      "pool_removed": "Pregunta eliminada: **{{question}}...**\nRestantes: {{remaining}}",
      "pool_title": "Pool de Preguntas",
      "question_prompts": "Prompts de pregunta",
      "question_updated": "Pregunta de verificación actualizada.",
      "raid_action": "Acción anti-raid",
      "raid_threshold": "Umbral de raid",
      "risk_escalation": "Escalado por riesgo",
      "risk_escalation_pro": "Escalado de verificación basado en riesgo",
      "security_age_disabled": "Verificación de edad de cuenta **desactivada**",
      "security_age_set": "Edad mínima de cuenta establecida en **{{days}} días**",
      "security_captcha_set": "Tipo de CAPTCHA establecido a **{{type}}**",
      "security_footer": "Usa /verify security con opciones para cambiar la configuración",
      "security_risk_disabled": "Escalado basado en riesgo **desactivado**",
      "security_risk_enabled": "Escalado basado en riesgo **activado**",
      "security_title": "Configuración de Seguridad",
      "security_updated": "Configuración de seguridad actualizada:\n{{changes}}",
      "setup_failed": "Todavía no puedo completar la configuración.\n\n{{issues}}",
      "setup_ready_description": "El sistema de verificación está configurado y el panel en vivo está disponible.",
      "setup_ready_title": "Verificación lista",
      "starts": "Inicios",
      "stats_footer": "Eventos de verificación almacenados: {{total}}",
      "stats_title": "Estadísticas de verificación",
      "unknown_subcommand": "Subcomando de verificación desconocido.",
      "unverify_bot": "Los bots no usan el flujo de verificación de miembros.",
      "unverify_failed": "No pude quitar la verificación de <@{{userId}}>.\n\n{{issues}}",
      "unverify_log_title": "Miembro desverificado",
      "unverify_success": "Se quitó la verificación de <@{{userId}}>.{{warningText}}",
      "user_missing": "Ese usuario no está en este servidor.",
      "verified": "Verificados",
      "verified_members": "Miembros verificados"
    },
    "handler": {
      "account_too_new": "Tu cuenta de Discord es muy nueva. Las cuentas deben tener al menos {{days}} días de antigüedad para verificarse. Tu cuenta tiene {{currentDays}} días.",
      "already_verified": "Ya estás verificado en este servidor.",
      "bot_missing_permissions": "El bot no tiene permisos suficientes para verificarte (Gestionar Roles).",
      "captcha_invalid": "Respuesta de captcha inválida.",
      "captcha_modal_title": "Verificación de seguridad",
      "captcha_placeholder": "Escribe tu respuesta",
      "captcha_reason_expired": "Tu captcha expiró. Pulsa **Verificarme** para obtener uno nuevo.",
      "captcha_reason_no_captcha": "No se encontró un captcha pendiente. Pulsa **Verificarme** para empezar de nuevo.",
      "captcha_reason_wrong": "Respuesta incorrecta. Intenta de nuevo.",
      "code_dm_description": "Tu código de verificación para **{{guild}}** es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.\nVuelve al servidor y pulsa **{{enterCodeLabel}}**.",
      "code_dm_title": "Código de verificación",
      "code_reason_expired": "Tu código expiró. Pulsa **Verificarme** para generar uno nuevo.",
      "code_reason_no_code": "No se encontró un código pendiente. Pulsa **Verificarme** para generar uno nuevo.",
      "code_reason_wrong": "Código incorrecto. Intenta otra vez.",
      "code_sent_description": "Se envió un código de 8 caracteres a tus mensajes directos.\n\n1. Abre tu bandeja de DMs y copia el código.\n2. Vuelve aquí y pulsa **{{enterCodeLabel}}**.\n\nEl código expira en **10 minutos**.",
      "code_sent_footer": "Los reenvíos están limitados. Espera {{seconds}}s antes de pedir otro código.",
      "code_sent_title": "Código enviado por DM",
      "completed_description": "Bienvenido a **{{guild}}**, <@{{userId}}>. Ahora ya tienes acceso completo al servidor.",
      "completed_title": "Verificación completada",
      "completion_failed": "No pude completar tu verificación porque la configuración de roles no está operativa.\n\n{{issues}}",
      "dm_failed": "No pude enviarte un DM.\n\nActiva los mensajes directos para este servidor y vuelve a intentarlo.",
      "enter_code_label": "Código recibido por DM",
      "enter_code_placeholder": "Ejemplo: AB1C2D3E",
      "enter_code_title": "Ingresa tu código",
      "help_attempts": "Después de {{failures}} intentos fallidos, la verificación se pausa durante {{minutes}} minutos.",
      "help_attempts_label": "Protección de intentos",
      "help_blocked": "Contacta a un administrador del servidor para obtener ayuda manual.",
      "help_blocked_label": "¿Sigues bloqueado?",
      "help_dm_problems": "Activa los mensajes directos para este servidor y vuelve a intentarlo.",
      "help_dm_problems_label": "¿Problemas con DM?",
      "help_mode_button": "Pulsa **Verificarme** y el bot te verificará inmediatamente.",
      "help_mode_code": "Pulsa **Verificarme**, revisa tu DM para ver el código y luego ingrésalo en el modal.",
      "help_mode_question": "Pulsa **Verificarme** y responde correctamente la pregunta de verificación.",
      "help_title": "Cómo funciona la verificación",
      "incorrect_answer": "Respuesta incorrecta. Lee la pregunta con cuidado e inténtalo de nuevo.{{cooldownText}}",
      "invalid_code": "Código de verificación inválido.",
      "join_too_recent": "Te uniste muy recientemente. Por favor espera {{retryText}} antes de verificarte.",
      "log_verified_title": "Miembro verificado",
      "log_warning_none": "Ninguno",
      "max_resends_reached": "Has alcanzado el número máximo de reenvíos de código ({{max}}). Por favor espera o contacta a un admin.",
      "member_not_found": "No pude encontrar tu perfil de miembro en este servidor.",
      "misconfigured": "La verificación está mal configurada en este momento.\n\n{{issues}}",
      "mode_invalid": "El modo de verificación no está configurado correctamente.",
      "new_code_description": "Tu nuevo código de verificación es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.",
      "new_code_title": "Nuevo código de verificación",
      "not_active": "La verificación no está activa en este servidor.",
      "not_code_mode": "Este modo de verificación no usa códigos por DM.",
      "question_missing": "No hay una pregunta de verificación configurada. Pide a un admin que ejecute `/verify question`.",
      "question_modal_title": "Pregunta de verificación",
      "question_placeholder": "Escribe tu respuesta aquí",
      "resend_dm_failed": "No pude enviarte un DM. Activa los mensajes directos e inténtalo de nuevo.",
      "resend_success": "Se envió un nuevo código de verificación por DM.",
      "resend_wait": "Espera antes de pedir otro código. Podrás reintentar {{retryText}}.",
      "too_many_attempts": "Demasiados intentos fallidos. Intenta de nuevo {{retryText}}.",
      "verified_dm_description": "Te verificaste correctamente en **{{guild}}**.",
      "verified_dm_title": "Ya estás verificado"
    },
    "info": {
      "no_issues": "No se detectaron problemas.",
      "protection_footer": "Protección: {{failures}} intentos fallidos -> {{minutes}}m de enfriamiento",
      "raid_action_kick": "Expulsar automáticamente",
      "raid_action_pause": "Solo alerta",
      "title": "Configuración de verificación"
    },
    "inspection": {
      "answer_missing": "El modo pregunta está activado pero la respuesta esperada está vacía.",
      "apply_role_update_failed": "No pude actualizar los roles de verificación.",
      "apply_unverified_unmanageable": "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "apply_verified_missing": "El rol verificado no está configurado o ya no existe.",
      "apply_verified_unmanageable": "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "button_mode_antiraid_warning": "El modo botón ofrece protección mínima contra bots. Considera usar el modo 'code' o 'question' con anti-raid activado.",
      "channel_deleted": "El canal de verificación configurado ya no existe.",
      "channel_missing": "El canal de verificación no está configurado.",
      "channel_permissions": "No puedo publicar el panel en {{channel}}. Permisos faltantes: {{permissions}}.",
      "log_channel_deleted": "El canal de logs de verificación configurado ya no existe.",
      "log_channel_permissions": "No puedo escribir en {{channel}}. Permisos faltantes: {{permissions}}.",
      "publish_failed": "No pude enviar o editar el panel de verificación en {{channel}}. Verifica que pueda enviar mensajes y embeds allí.",
      "question_missing": "El modo pregunta está activado pero la pregunta de verificación está vacía.",
      "revoke_role_update_failed": "No pude actualizar los roles de verificación.",
      "revoke_unverified_unmanageable": "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "revoke_verified_unmanageable": "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "roles_same": "El rol verificado y el rol sin verificar no pueden ser el mismo.",
      "unverified_role_deleted": "El rol sin verificar configurado ya no existe.",
      "unverified_role_managed": "El rol sin verificar está gestionado por una integración y el bot no puede asignarlo.",
      "unverified_role_unmanageable": "No puedo gestionar el rol sin verificar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "verified_role_deleted": "El rol verificado configurado ya no existe.",
      "verified_role_managed": "El rol verificado está gestionado por una integración y el bot no puede asignarlo.",
      "verified_role_missing": "El rol verificado no está configurado.",
      "verified_role_unmanageable": "No puedo gestionar el rol verificado {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "welcome_autorole_failed": "No pude asignar el auto-rol de bienvenida {{role}}.",
      "welcome_autorole_missing": "El auto-rol de bienvenida está configurado pero ya no existe.",
      "welcome_autorole_process_failed": "No pude procesar el auto-rol de bienvenida."
    },
    "mode": {
      "button": "Botón",
      "code": "Código por DM",
      "question": "Pregunta"
    },
    "options": {
      "verify_anti-raid_action_action": "Acción a tomar cuando el anti-raid se active",
      "verify_anti-raid_enabled_enabled": "Si la protección anti-raid permanece habilitada",
      "verify_anti-raid_joins_joins": "Umbral de entradas antes de que el anti-raid se active",
      "verify_anti-raid_seconds_seconds": "Ventana de detección en segundos",
      "verify_auto-kick_hours_hours": "Horas de espera antes de expulsar automáticamente a miembros no verificados",
      "verify_dm_enabled_enabled": "Si los MD de confirmación permanecen habilitados",
      "verify_enabled_enabled_enabled": "Si la función permanece habilitada",
      "verify_force_user_user": "Miembro a verificar manualmente",
      "verify_logs_channel_channel": "Canal usado para los registros de verificación",
      "verify_message_color_color": "Color del embed en hex sin `#`",
      "verify_message_description_description": "Descripción del panel",
      "verify_message_image_image": "URL de la imagen para el panel",
      "verify_message_title_title": "Título del panel",
      "verify_mode_type_type": "Modo de verificación al que cambiar",
      "verify_question-pool_add_answer_answer": "Respuesta esperada",
      "verify_question-pool_add_question_question": "Texto de la pregunta",
      "verify_question-pool_remove_index_index": "Número de elemento del pool para eliminar",
      "verify_question_answer_answer": "Respuesta esperada",
      "verify_question_prompt_prompt": "Mensaje o pregunta de verificación",
      "verify_security_captcha_type_captcha_type": "Tipo de CAPTCHA requerido",
      "verify_security_min_account_age_min_account_age": "Edad mínima de cuenta en días",
      "verify_security_risk_escalation_risk_escalation": "Si las cuentas de riesgo deberían enfrentar verificaciones más estrictas",
      "verify_setup_channel_channel": "Canal de verificación",
      "verify_setup_mode_mode": "Modo de verificación a usar",
      "verify_setup_unverified_role_unverified_role": "Rol asignado antes de la verificación",
      "verify_setup_verified_role_verified_role": "Rol otorgado tras la verificación",
      "verify_unverify_user_user": "Miembro a desverificar manualmente"
    },
    "panel": {
      "description": "Necesitas verificarte antes de acceder al servidor. Pulsa el botón de abajo para comenzar.",
      "footer": "{{guild}} • Verificación",
      "help_label": "Ayuda",
      "start_label": "Verificarme",
      "title": "Verificación"
    },
    "slash": {
      "choices": {
        "anti_raid_action": {
          "kick": "Expulsar automáticamente",
          "pause": "Solo alertar"
        },
        "captcha_type": {
          "emoji": "Contar emojis",
          "math": "Matemático"
        },
        "mode": {
          "button": "Botón",
          "code": "Código por DM",
          "question": "Pregunta"
        }
      },
      "description": "Configura el sistema de verificación de miembros",
      "groups": {
        "question_pool": {
          "description": "Gestiona el pool aleatorio de preguntas de verificación",
          "options": {
            "answer": "Respuesta esperada",
            "index": "Número del elemento que quieres eliminar",
            "question": "Texto de la pregunta"
          },
          "subcommands": {
            "add": {
              "description": "Agrega una pregunta al pool"
            },
            "clear": {
              "description": "Limpia por completo el pool de preguntas"
            },
            "list": {
              "description": "Lista el pool actual de preguntas"
            },
            "remove": {
              "description": "Elimina una pregunta del pool"
            }
          }
        }
      },
      "options": {
        "action": "Acción al dispararse el anti-raid",
        "answer": "Respuesta esperada",
        "anti_raid_enabled": "Si la protección anti-raid debe quedar activa",
        "captcha_type": "Tipo de CAPTCHA requerido",
        "channel": "Canal de verificación",
        "color": "Color del embed en hex sin `#`",
        "description": "Descripción del panel",
        "dm_enabled": "Si el DM de confirmación debe seguir activo",
        "enabled": "Si la función debe quedar activa",
        "hours": "Horas antes de expulsar miembros sin verificar",
        "image": "URL de imagen para el panel",
        "joins": "Cantidad de entradas antes de disparar el anti-raid",
        "log_channel": "Canal usado para los logs de verificación",
        "min_account_age": "Edad mínima de la cuenta en días",
        "mode": "Modo de verificación que se usará",
        "prompt": "Pregunta o texto del reto",
        "risk_escalation": "Si las cuentas riesgosas deben pasar controles más fuertes",
        "seconds": "Ventana de detección en segundos",
        "title": "Título del panel",
        "type": "Modo de verificación al que quieres cambiar",
        "unverified_role": "Rol asignado antes de verificar",
        "user_unverify": "Miembro al que quieres quitar la verificación",
        "user_verify": "Miembro que quieres verificar manualmente",
        "verified_role": "Rol que se entrega al verificar"
      },
      "subcommands": {
        "anti_raid": {
          "description": "Configura la protección anti-raid en entradas"
        },
        "auto_kick": {
          "description": "Configura el tiempo para expulsar miembros sin verificar"
        },
        "dm": {
          "description": "Activa o desactiva el DM de confirmación de verificación"
        },
        "enabled": {
          "description": "Activa o desactiva la verificación"
        },
        "force": {
          "description": "Verifica manualmente a un miembro"
        },
        "info": {
          "description": "Muestra la configuración actual de verificación"
        },
        "logs": {
          "description": "Define el canal de logs de verificación"
        },
        "message": {
          "description": "Personaliza el mensaje del panel de verificación"
        },
        "mode": {
          "description": "Cambia el modo de verificación"
        },
        "panel": {
          "description": "Publica o actualiza el panel de verificación"
        },
        "question": {
          "description": "Actualiza la pregunta y respuesta esperada"
        },
        "security": {
          "description": "Ajusta edad de cuenta, CAPTCHA y riesgo"
        },
        "setup": {
          "description": "Configura la verificación con su canal y roles principales"
        },
        "stats": {
          "description": "Muestra estadísticas de verificación"
        },
        "unverify": {
          "description": "Quita manualmente la verificación a un miembro"
        }
      }
    }
  },
  "verify.audit.completed": "Verificación completada",
  "verify.audit.removed": "Verificación eliminada",
  "warn": {
    "fields": {
      "list": "Advertencias",
      "moderator": "Moderador",
      "reason": "Motivo",
      "total": "Advertencias totales",
      "user": "Usuario"
    },
    "options": {
      "warn_add_reason_reason": "Razón de la advertencia",
      "warn_add_user_user": "Miembro a advertir",
      "warn_check_user_user": "Miembro cuyas advertencias deseas inspeccionar",
      "warn_remove_id_id": "ID de la advertencia"
    },
    "responses": {
      "add_description": "Se registró una advertencia para {{user}}.",
      "add_title": "Advertencia agregada",
      "auto_kick_failed": "La acción automática falló: no pude expulsar al miembro al llegar a 5 advertencias.",
      "auto_kick_success": "Acción automática: el miembro fue expulsado al llegar a 5 advertencias.",
      "auto_timeout_failed": "La acción automática falló: no pude silenciar al miembro al llegar a 3 advertencias.",
      "auto_timeout_success": "Acción automática: el miembro fue silenciado durante 1 hora al llegar a 3 advertencias.",
      "footer_id": "ID de advertencia: {{id}}",
      "list_description": "Advertencias almacenadas: **{{count}}**.",
      "list_entry": "**{{index}}.** `{{id}}`\nMotivo: {{reason}}\nModerador: <@{{moderatorId}}>\nFecha: <t:{{timestamp}}:R>",
      "list_footer": "Usa `/warn remove` con el ID de la advertencia para eliminar un registro.",
      "list_title": "Advertencias de {{user}}",
      "none_description": "{{user}} no tiene advertencias en este servidor.",
      "none_title": "Sin advertencias",
      "not_found_description": "No encontré una advertencia con ID `{{id}}`.",
      "not_found_title": "Advertencia no encontrada",
      "remove_description": "La advertencia `{{id}}` fue eliminada correctamente.",
      "remove_title": "Advertencia eliminada"
    },
    "slash": {
      "description": "Gestiona advertencias de miembros",
      "options": {
        "id": "ID de la advertencia",
        "reason": "Motivo de la advertencia",
        "user_inspect": "Miembro cuyas advertencias quieres revisar",
        "user_warn": "Miembro al que advertir"
      },
      "subcommands": {
        "add": {
          "description": "Agrega una advertencia a un miembro"
        },
        "check": {
          "description": "Muestra las advertencias de un miembro"
        },
        "remove": {
          "description": "Elimina una advertencia por ID"
        }
      }
    }
  },
  "weekly_report": {
    "active_categories": "Categorías más Activas",
    "avg_rating": "Valoración Promedio",
    "currently_open": "Abiertos Actualmente",
    "description": "Aquí tienes el resumen de actividad en el servidor durante los últimos 7 días.",
    "footer": "Excelencia Operativa • TON618",
    "no_data": "Sin actividad significativa registrada.",
    "response_time": "Tiempo de Respuesta Promedio",
    "tickets_closed": "Tickets Cerrados",
    "tickets_opened": "Tickets Abiertos",
    "title": "Reporte de Rendimiento Semanal - {{guildName}}",
    "top_staff": "Mejor Staff del Mes"
  },
  "welcome": {
    "invalid_color": "Invalid color",
    "test_channel_missing": "Test channel missing",
    "test_requires_channel": "Test requires channel"
  },
  "welcome.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos como `5865F2`.",
  "welcome.test_channel_missing": "El canal de bienvenida configurado ya no existe o no es accesible.",
  "welcome.test_requires_channel": "Configura un canal de bienvenida antes de enviar un mensaje de prueba.",
  "wizard": {
    "description": "El sistema ha sido configurado con los siguientes ajustes.",
    "footer": "TON618 Bot • Asistente de Configuración",
    "free_next_step": "Sistema listo. Considera mejorar a Pro para habilitar playbooks de automatización avanzada.",
    "next_step_label": "Próximos Pasos Recomendados",
    "panel_status": {
      "error": "❌ Error Crítico ({{error}})",
      "missing_permissions": "❌ Error de Permisos",
      "published": "✅ Publicado",
      "skipped": "⏩ Omitido"
    },
    "pro_next_step": "¡Todo está listo! Tu plan Pro está activo y los playbooks están habilitados.",
    "summary_label": "Resumen de Configuración",
    "title": "Resultado de Configuración Rápida"
  }
};
