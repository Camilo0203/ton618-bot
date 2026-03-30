module.exports = {
  "common": {
    "currency": {
      "coins": "monedas"
    },
    "labels": {
      "channel": "Canal",
      "status": "Estado",
      "user": "Usuario",
      "category": "Categoría",
      "ticket_id": "ID de Ticket",
      "created": "Creado",
      "priority": "Prioridad",
      "verified_role": "Rol Verificado",
      "mode": "Modo",
      "unverified_role": "Rol No Verificado",
      "panel_message": "Mensaje del Panel",
      "notes": "Notas"
    },
    "value": {
      "no_data": "Sin datos"
    },
    "language": {
      "en": "Inglés",
      "es": "Español"
    },
    "state": {
      "disabled": "Deshabilitado",
      "enabled": "Habilitado"
    }
  },
  "access": {
    "owner_only": "Este comando es solo para el owner del bot.",
    "admin_required": "Necesitas permisos de administrador para usar este comando.",
    "staff_required": "Necesitas permisos de staff para usar este comando.",
    "guild_only": "Este comando solo se puede usar dentro de un servidor.",
    "default": "No tienes permisos para usar este comando."
  },
  "interaction": {
    "rate_limit": {
      "command": "Límite temporal para `/{{commandName}}`. Espera **{{retryAfterSec}}s** antes de reintentar.",
      "global": "Vas demasiado rápido. Espera **{{retryAfterSec}}s** antes de usar otra interacción."
    },
    "command_disabled": "El comando `/{{commandName}}` está deshabilitado en este servidor.",
    "db_unavailable": "Base de datos temporalmente no disponible. Intenta de nuevo en unos segundos.",
    "unexpected": "Ocurrió un error inesperado."
  },
  "onboarding": {
    "title": "Welcome to TON618 / Bienvenido a TON618",
    "description": "Choose the primary language for this server / Elige el idioma principal de este servidor.",
    "body": "TON618 puede operar en inglés o español. Elige ahora el idioma por defecto para esta guild. Puedes cambiarlo más tarde con `/setup language`.",
    "footer": "Si nadie selecciona un idioma, TON618 mantendrá inglés como valor por defecto hasta que se configure manualmente.",
    "posted_title": "Onboarding de idioma enviado",
    "posted_description": "Se envió un selector de idioma para este servidor. TON618 mantendrá inglés hasta que un administrador elija un idioma.",
    "confirm_title": "Idioma del servidor actualizado",
    "confirm_description": "TON618 ahora operará en **{{label}}** en este servidor.",
    "dm_fallback_subject": "Configuración de idioma de TON618",
    "dm_fallback_intro": "No pude publicar el mensaje de onboarding en un canal escribible del servidor, así que te lo envío por aquí.",
    "delivery_failed": "TON618 se unió al servidor, pero no pude entregar el onboarding de idioma ni en un canal escribible ni por DM."
  },
  "setup": {
    "general": {
      "language_set": "Idioma del bot configurado: **{{label}}**.",
      "language_label_es": "Español",
      "language_label_en": "Inglés",
      "option_enabled": "Activar o desactivar",
      "language_description": "Revisar o actualizar el idioma del bot para este servidor",
      "option_language_value": "Idioma a usar para las respuestas visibles del bot",
      "group_description": "Configurar los ajustes operacionales del servidor",
      "info_description": "Ver configuración actual del servidor",
      "logs_description": "Establecer el canal para logs de moderación",
      "transcripts_description": "Establecer el canal para transcripciones de tickets",
      "dashboard_description": "Establecer el canal para el panel de control",
      "weekly_report_description": "Establecer el canal para reportes semanales",
      "live_members_description": "Establecer el canal de voz para contador de miembros en vivo",
      "live_role_description": "Establecer el canal de voz para contador de roles en vivo",
      "staff_role_description": "Establecer el rol de staff",
      "admin_role_description": "Establecer el rol de administrador",
      "verify_role_description": "Establecer el rol de verificación",
      "max_tickets_description": "Establecer máximo de tickets por usuario",
      "global_limit_description": "Establecer límite global de tickets",
      "cooldown_description": "Establecer tiempo de espera para crear tickets",
      "min_days_description": "Establecer edad mínima de cuenta en días",
      "smart_ping_description": "Configurar ajustes de ping inteligente",
      "dm_open_description": "Configurar DM al abrir ticket",
      "dm_close_description": "Configurar DM al cerrar ticket",
      "log_edits_description": "Configurar registro de ediciones de mensajes",
      "log_deletes_description": "Configurar registro de eliminaciones de mensajes",
      "option_channel": "Canal",
      "option_voice_channel": "Canal de voz",
      "option_role": "Rol",
      "option_role_to_count": "Rol a contar",
      "option_verify_role": "Rol de verificación (dejar vacío para desactivar)",
      "option_count": "Cantidad",
      "option_minutes": "Minutos",
      "option_days": "Días",
      "auto_close_description": "Configurar cierre automático de tickets",
      "sla_description": "Configurar ajustes de SLA"
    },
    "language": {
      "title": "Idioma del servidor",
      "description": "Revisa o actualiza el idioma operativo que TON618 usa en este servidor.",
      "current_value": "TON618 está operando actualmente en **{{label}}**.",
      "onboarding_completed": "Completado",
      "onboarding_pending": "Pendiente",
      "updated_value": "Idioma cambiado a **{{label}}**. TON618 usará este idioma en las respuestas visibles de esta guild.",
      "fallback_note": "Las guilds sin selección explícita siguen usando inglés hasta que un administrador configure un idioma.",
      "audit_reason_manual": "cambio_manual_de_idioma",
      "audit_reason_onboarding": "selección_de_idioma_onboarding"
    },
    "panel": {
      "owner_only": "Solo la persona que abrió este panel puede usarlo.",
      "admin_only": "Solo los administradores pueden usar este panel.",
      "invalid_action": "Acción inválida.",
      "invalid_command": "No se seleccionó un comando válido.",
      "error_prefix": "Error: {{message}}",
      "default_action_failed": "No se pudo aplicar la acción.",
      "default_reset_failed": "No se pudo completar el reinicio.",
      "action_applied": "Acción aplicada.",
      "reset_applied": "Reinicio aplicado."
    },
    "commands": {
      "mode_enable": "Habilitar",
      "mode_status": "Estado",
      "mode_disable": "Deshabilitar",
      "summary_available": "Disponibles: **{{count}}**",
      "summary_disabled": "Deshabilitados: **{{count}}**",
      "summary_current_mode": "Modo actual: **{{mode}}**",
      "summary_candidates": "Candidatos en el menú: **{{visible}}**{{hiddenText}}",
      "hidden_suffix": " (+{{count}} ocultos)",
      "summary_result": "Resultado: {{notice}}",
      "panel_title": "Control de comandos del servidor",
      "placeholder_action": "Selecciona una acción",
      "option_disable_label": "Deshabilitar comando",
      "option_disable_description": "Bloquea un comando en este servidor",
      "option_enable_label": "Habilitar comando",
      "option_enable_description": "Restaura un comando previamente deshabilitado",
      "option_status_label": "Estado del comando",
      "option_status_description": "Comprueba si un comando está habilitado",
      "option_list_label": "Listar deshabilitados",
      "option_list_description": "Muestra el resumen de comandos deshabilitados",
      "option_reset_label": "Reiniciar todo",
      "option_reset_description": "Vuelve a habilitar todos los comandos deshabilitados",
      "placeholder_target": "Comando para {{action}}",
      "no_candidates_label": "No hay comandos disponibles",
      "no_candidates_description": "Cambia de acción para ver más opciones",
      "candidate_description_status": "Ver estado actual",
      "candidate_description_enable": "Habilitar comando",
      "candidate_description_disable": "Deshabilitar comando",
      "format_more": "- ... y {{count}} más",
      "list_none": "No hay comandos deshabilitados en este servidor.\nDisponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      "list_heading": "Comandos deshabilitados ({{count}}):",
      "list_footer": "Disponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      "audit_disabled": "Comando deshabilitado",
      "audit_enabled": "Comando habilitado",
      "audit_reset": "Comandos reiniciados",
      "audit_updated": "Actualización de comandos",
      "audit_affected": "Comando afectado: `/{{command}}`",
      "audit_global": "Se aplicó un cambio global de comandos.",
      "audit_executed_by": "Ejecutado por",
      "audit_server": "Servidor",
      "audit_before": "Antes",
      "audit_after": "Después",
      "list_embed_title": "Comandos del servidor",
      "status_embed_title": "Estado del comando",
      "panel_notice": "Usa los menús de abajo para gestionar comandos sin escribir nombres manualmente.",
      "unknown_command": "El comando `/{{command}}` no existe en este bot.",
      "status_result": "Estado de `/{{command}}`: **{{state}}**.\nComandos deshabilitados actualmente: **{{count}}**.",
      "reset_noop": "No había comandos deshabilitados. No hay nada que reiniciar.",
      "reset_done": "Se reactivaron **{{count}}** comando(s).",
      "missing_command_name": "Debes proporcionar un nombre de comando válido.",
      "disable_setup_forbidden": "No puedes deshabilitar `/setup`, o podrías bloquear tu acceso a la configuración.",
      "already_disabled": "El comando `/{{command}}` ya estaba deshabilitado.",
      "disabled_success": "Comando `/{{command}}` deshabilitado para este servidor.",
      "already_enabled": "El comando `/{{command}}` ya estaba habilitado.",
      "enabled_success": "Comando `/{{command}}` habilitado de nuevo."
    },
    "welcome": {
      "enabled_state": "Los mensajes de bienvenida ahora están **{{state}}**.",
      "channel_set": "Canal de bienvenida configurado en {{channel}}.",
      "message_updated": "Mensaje de bienvenida actualizado.\nVariables disponibles: {{vars}}",
      "title_updated": "Título de bienvenida actualizado a **{{text}}**.",
      "invalid_color": "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      "color_updated": "Color de bienvenida actualizado a **#{{hex}}**.",
      "footer_updated": "Footer de bienvenida actualizado.",
      "invalid_url": "La URL debe comenzar con `https://`.",
      "banner_configured": "Banner de bienvenida configurado.",
      "banner_removed": "Banner de bienvenida eliminado.",
      "visible": "Visible",
      "hidden": "Oculto",
      "avatar_state": "Avatar del miembro en mensajes de bienvenida: **{{state}}**.",
      "dm_state": "El DM de bienvenida ahora está **{{state}}**.{{messageNote}}",
      "dm_message_note": "\nTambién se actualizó el cuerpo del DM.",
      "autorole_set": "Auto-rol configurado: {{role}}",
      "autorole_disabled": "Auto-rol desactivado.",
      "test_requires_channel": "Configura primero un canal de bienvenida con `/setup welcome channel`.",
      "test_channel_missing": "No se encontró el canal de bienvenida configurado.",
      "test_default_title": "¡Bienvenido!",
      "test_default_message": "¡Bienvenido {mention}!",
      "test_field_user": "Usuario",
      "test_field_account_created": "Cuenta creada",
      "test_field_member_count": "Cantidad de miembros",
      "test_message_suffix": "*(mensaje de prueba)*",
      "test_sent": "Mensaje de prueba de bienvenida enviado a {{channel}}."
    },
    "goodbye": {
      "enabled_state": "Los mensajes de despedida ahora están **{{state}}**.",
      "channel_set": "Canal de despedida configurado en {{channel}}.",
      "message_updated": "Mensaje de despedida actualizado.\nVariables disponibles: {{vars}}",
      "title_updated": "Título de despedida actualizado a **{{text}}**.",
      "invalid_color": "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      "color_updated": "Color de despedida actualizado a **#{{hex}}**.",
      "footer_updated": "Footer de despedida actualizado.",
      "visible": "Visible",
      "hidden": "Oculto",
      "avatar_state": "Avatar del miembro en mensajes de despedida: **{{state}}**.",
      "test_requires_channel": "Configura primero un canal de despedida con `/setup goodbye channel`.",
      "test_channel_missing": "No se encontró el canal de despedida configurado.",
      "test_default_title": "Hasta luego",
      "test_default_message": "**{user}** salió del servidor.",
      "test_field_user": "Usuario",
      "test_field_user_id": "ID de usuario",
      "test_field_remaining_members": "Miembros restantes",
      "test_field_roles": "Roles",
      "test_roles_value": "Solo payload de prueba",
      "test_sent": "Mensaje de prueba de despedida enviado a {{channel}}."
    },
    "slash": {
      "description": "Configura los ajustes operativos del servidor",
      "subcommands": {
        "language": {
          "description": "Revisa o actualiza el idioma del bot para este servidor"
        }
      },
      "options": {
        "language_value": "Idioma para las respuestas visibles del bot"
      },
      "choices": {
        "english": "Inglés",
        "spanish": "Español"
      },
      "groups": {
        "commands": {
          "description": "Gestiona qué comandos están disponibles en este servidor",
          "subcommands": {
            "disable": {
              "description": "Deshabilita un comando en este servidor"
            },
            "enable": {
              "description": "Vuelve a habilitar un comando deshabilitado"
            },
            "status": {
              "description": "Consulta un comando o revisa el resumen actual"
            },
            "reset": {
              "description": "Vuelve a habilitar todos los comandos deshabilitados"
            },
            "list": {
              "description": "Lista los comandos deshabilitados en este servidor"
            },
            "panel": {
              "description": "Abre el panel interactivo de control de comandos"
            }
          },
          "options": {
            "command_required": "Nombre del comando sin `/`",
            "command_optional": "Nombre del comando sin `/` (opcional)"
          }
        },
        "welcome": {
          "description": "Configura los mensajes de bienvenida y el onboarding",
          "subcommands": {
            "enabled": {
              "description": "Activa o desactiva los mensajes de bienvenida"
            },
            "channel": {
              "description": "Define el canal para los mensajes de bienvenida"
            },
            "message": {
              "description": "Actualiza el mensaje de bienvenida. Variables: {{vars}}"
            },
            "title": {
              "description": "Actualiza el título del embed de bienvenida"
            },
            "color": {
              "description": "Define el color del embed de bienvenida (hex)"
            },
            "footer": {
              "description": "Actualiza el footer del embed de bienvenida"
            },
            "banner": {
              "description": "Configura o elimina la imagen de banner"
            },
            "avatar": {
              "description": "Muestra u oculta el avatar del nuevo miembro"
            },
            "dm": {
              "description": "Configura el mensaje directo de bienvenida"
            },
            "autorole": {
              "description": "Define el rol que se asigna automáticamente al entrar"
            },
            "test": {
              "description": "Envía un mensaje de bienvenida de prueba"
            }
          },
          "options": {
            "enabled": "Si los mensajes de bienvenida deben seguir activos",
            "channel": "Canal de bienvenida",
            "text": "Contenido del mensaje",
            "title_text": "Título del embed",
            "hex": "Color hex sin `#`",
            "footer_text": "Texto del footer",
            "url": "URL de imagen que empiece por `https://`",
            "show": "Mostrar el avatar del miembro",
            "dm_enabled": "Si los DMs de bienvenida deben seguir activos",
            "dm_message": "Contenido del DM. Variables: {{vars}}",
            "role": "Rol que se asignará al entrar (vacío para desactivar)"
          }
        },
        "goodbye": {
          "description": "Configura los mensajes de despedida",
          "subcommands": {
            "enabled": {
              "description": "Activa o desactiva los mensajes de despedida"
            },
            "channel": {
              "description": "Define el canal para los mensajes de despedida"
            },
            "message": {
              "description": "Actualiza el mensaje de despedida. Variables: {{vars}}"
            },
            "title": {
              "description": "Actualiza el título del embed de despedida"
            },
            "color": {
              "description": "Define el color del embed de despedida (hex)"
            },
            "footer": {
              "description": "Actualiza el footer del embed de despedida"
            },
            "avatar": {
              "description": "Muestra u oculta el avatar del miembro que sale"
            },
            "test": {
              "description": "Envía un mensaje de despedida de prueba"
            }
          },
          "options": {
            "enabled": "Si los mensajes de despedida deben seguir activos",
            "channel": "Canal de despedida",
            "text": "Contenido del mensaje",
            "title_text": "Título del embed",
            "hex": "Color hex sin `#`",
            "footer_text": "Texto del footer",
            "show": "Mostrar el avatar del miembro"
          }
        },
        "tickets": {
          "description": "Configurar ajustes del sistema de tickets",
          "subcommands": {
            "panel": {
              "description": "Publicar o actualizar el panel de tickets"
            },
            "sla": {
              "description": "Configurar advertencia y escalado de SLA"
            },
            "sla-rule": {
              "description": "Agregar o actualizar una regla SLA por prioridad o categoría"
            },
            "panel-style": {
              "description": "Establecer el estilo del panel de tickets"
            },
            "auto-assignment": {
              "description": "Configurar comportamiento de asignación automática"
            },
            "welcome-message": {
              "description": "Establecer mensaje de bienvenida personalizado para nuevos tickets"
            },
            "control-embed": {
              "description": "Personalizar el embed de control del ticket"
            }
          },
          "options": {
            "warning_minutes": "Minutos antes de advertencia SLA",
            "escalation_enabled": "Activar escalado",
            "escalation_minutes": "Minutos antes del escalado",
            "escalation_role": "Rol a mencionar en escalado",
            "escalation_channel": "Canal para alertas de escalado",
            "rule_type": "Tipo de regla",
            "rule_minutes": "Umbral de minutos",
            "target_priority": "Prioridad objetivo",
            "target_category": "Categoría objetivo",
            "style": "Estilo del panel",
            "enabled": "Activar o desactivar",
            "mode": "Modo de asignación",
            "require_online": "Requerir estado en línea",
            "welcome_message": "Contenido del mensaje de bienvenida",
            "reset": "Restablecer a predeterminado",
            "control_title": "Título del embed de control",
            "control_description": "Descripción del embed de control",
            "control_footer": "Pie del embed de control",
            "color": "Color del embed (hex)"
          },
          "choices": {
            "sla_warning": "Advertencia",
            "sla_escalation": "Escalado",
            "style_buttons": "Botones",
            "style_select": "Menú de selección",
            "mode_round_robin": "Round robin",
            "mode_random": "Aleatorio",
            "mode_least_active": "Menos activo"
          }
        },
        "automod": {
          "status_title": "Estado de AutoMod - {{guildName}}",
          "status_enabled": "La gestión de AutoMod de TON618 está activada para este servidor.",
          "status_disabled": "La gestión de AutoMod de TON618 está desactivada para este servidor.",
          "field_managed_rules": "Reglas Gestionadas",
          "field_alerts_exemptions": "Alertas y Exenciones",
          "field_sync_state": "Estado de Sincronización",
          "field_permissions": "Permisos",
          "live_count": "Conteo en vivo: `{{live}}/{{desired}}`",
          "stored_rule_ids": "IDs de reglas almacenadas: `{{count}}`",
          "no_presets": "No hay presets de AutoMod seleccionados.",
          "alert_channel": "Canal de alertas: {{channel}}",
          "alert_not_configured": "No configurado",
          "exempt_roles": "Roles exentos: {{roles}}",
          "exempt_channels": "Canales exentos: {{channels}}",
          "none": "Ninguno",
          "last_sync": "Última sincronización: {{timestamp}}",
          "never": "Nunca",
          "sync_result": "Resultado: `{{status}}`",
          "sync_summary": "Resumen: {{summary}}",
          "no_sync_recorded": "No se ha registrado ninguna sincronización aún.",
          "permissions_ok": "Todos los permisos requeridos están presentes",
          "rule_live": "activa",
          "rule_missing": "faltante",
          "error_no_presets": "No hay presets de AutoMod activos. Activa al menos un preset antes de inicializar.",
          "error_not_enabled": "AutoMod aún no está activado para este servidor. Ejecuta `/setup automod bootstrap` primero.",
          "error_no_active_presets": "No hay presets de AutoMod activos. Reactiva un preset o usa `/setup automod disable`.",
          "error_provide_channel_or_clear": "Proporciona `channel`, o establece `clear: true`.",
          "error_provide_channel_or_reset": "Proporciona `channel`, o usa `action: reset`.",
          "error_provide_role_or_reset": "Proporciona `role`, o usa `action: reset`.",
          "error_unknown_action": "Acción desconocida. Usa add, remove o reset.",
          "error_unknown_preset": "Selección de preset desconocida.",
          "info_already_exempt_channel": "{{channel}} ya está exento.",
          "info_already_exempt_role": "{{role}} ya está exento.",
          "error_max_exempt_channels": "AutoMod solo soporta hasta 50 canales exentos por servidor.",
          "error_max_exempt_roles": "AutoMod solo soporta hasta 20 roles exentos por servidor.",
          "success_alert_cleared": "Canal de alertas de AutoMod eliminado.\n{{hint}}",
          "success_alert_set": "Canal de alertas de AutoMod establecido en {{channel}}.\n{{hint}}",
          "success_exempt_channels_updated": "Canales exentos de AutoMod actualizados. Total: `{{count}}`.\n{{hint}}",
          "success_exempt_roles_updated": "Roles exentos de AutoMod actualizados. Total: `{{count}}`.\n{{hint}}",
          "success_presets_updated": "Presets de AutoMod actualizados: {{summary}}.\n{{followUp}}",
          "presets_none": "No hay presets seleccionados",
          "hint_sync": "Ejecuta `/setup automod sync` para aplicar este cambio a Discord.",
          "hint_bootstrap": "Ejecuta `/setup automod bootstrap` cuando estés listo para crear las reglas gestionadas.",
          "hint_disable": "Usa `/setup automod disable` para eliminar las reglas existentes, o reactiva un preset antes de sincronizar.",
          "bootstrap_created": "Se crearon {{count}} regla{{plural}} de AutoMod de TON618.",
          "bootstrap_no_new": "No se necesitaron nuevas reglas de AutoMod de TON618.",
          "sync_summary_line": "Se actualizaron {{updated}} regla{{updatedPlural}}, se recrearon {{created}} regla{{createdPlural}} faltante{{createdPlural}}, se eliminaron {{removed}} regla{{removedPlural}} obsoleta{{removedPlural}}.",
          "disable_removed": "Se eliminaron {{count}} regla{{plural}} de AutoMod gestionadas por TON618.",
          "disable_no_rules": "No había reglas de AutoMod gestionadas por TON618.",
          "disable_partial": "Se eliminaron {{removed}} regla{{removedPlural}}, se preservaron {{preserved}} debido a errores.",
          "permission_failure": "Se omitió {{action}}: faltan {{permissions}}.",
          "permission_failure_generic": "Se omitió {{action}}: falló la verificación de permisos.",
          "fetch_error": "Se omitió {{action}}: {{message}}",
          "fetch_error_generic": "No se pudieron inspeccionar las reglas de AutoMod.",
          "description": "Configurar reglas y exenciones de AutoMod",
          "subcommands": {
            "bootstrap": {
              "description": "Crear reglas iniciales de AutoMod"
            },
            "status": {
              "description": "Ver estado de configuración de AutoMod"
            },
            "sync": {
              "description": "Sincronizar reglas de AutoMod con configuración actual"
            },
            "disable": {
              "description": "Eliminar todas las reglas gestionadas de AutoMod"
            },
            "channel-alert": {
              "description": "Establecer o limpiar el canal de alertas de AutoMod"
            },
            "exempt-channel": {
              "description": "Gestionar canales exentos"
            },
            "exempt-role": {
              "description": "Gestionar roles exentos"
            },
            "preset": {
              "description": "Activar o desactivar un preset de AutoMod"
            }
          },
          "options": {
            "channel": "Canal para recibir alertas de AutoMod",
            "clear": "Limpiar el canal de alertas",
            "action": "Acción a realizar",
            "target_channel": "Canal a exentar",
            "target_role": "Rol a exentar",
            "preset_name": "Nombre del preset",
            "enabled": "Activar o desactivar este preset"
          },
          "choices": {
            "add": "Agregar",
            "remove": "Eliminar",
            "reset": "Reiniciar",
            "preset_spam": "Spam",
            "preset_invites": "Invitaciones",
            "preset_scam": "Enlaces de estafa",
            "preset_all": "Todos los presets"
          }
        }
      }
    },
    "tickets": {
      "group_description": "Configurar ajustes del sistema de tickets",
      "panel_description": "Publicar o actualizar el panel de tickets",
      "sla_description": "Configurar advertencia y escalado de SLA",
      "sla_rule_description": "Agregar o actualizar una regla SLA por prioridad o categoría",
      "panel_style_description": "Establecer el estilo del panel de tickets",
      "auto_assignment_description": "Configurar comportamiento de asignación automática",
      "welcome_message_description": "Establecer mensaje de bienvenida personalizado para nuevos tickets",
      "control_embed_description": "Personalizar el embed de control del ticket",
      "option_warning_minutes": "Minutos antes de advertencia SLA",
      "option_escalation_enabled": "Activar escalado",
      "option_escalation_minutes": "Minutos antes del escalado",
      "option_escalation_role": "Rol a mencionar en escalado",
      "option_escalation_channel": "Canal para alertas de escalado",
      "option_rule_type": "Tipo de regla",
      "option_rule_minutes": "Umbral de minutos",
      "option_target_priority": "Prioridad objetivo",
      "option_target_category": "Categoría objetivo",
      "option_style": "Estilo del panel",
      "option_enabled": "Activar o desactivar",
      "option_mode": "Modo de asignación",
      "option_require_online": "Requerir estado en línea",
      "option_welcome_message": "Contenido del mensaje de bienvenida",
      "option_reset": "Restablecer a predeterminado",
      "option_control_title": "Título del embed de control",
      "option_control_description": "Descripción del embed de control",
      "option_control_footer": "Pie del embed de control",
      "option_color": "Color del embed (hex)",
      "choice_sla_warning": "Advertencia",
      "choice_sla_escalation": "Escalado",
      "choice_style_buttons": "Botones",
      "choice_style_select": "Menú de selección",
      "choice_mode_round_robin": "Round robin",
      "choice_mode_random": "Aleatorio",
      "choice_mode_least_active": "Menos activo",
      "incident_description": "Activar o desactivar modo incidente",
      "daily_report_description": "Configurar reportes diarios de tickets",
      "option_active": "Activar o desactivar",
      "option_categories": "Categorías afectadas (IDs separados por comas)",
      "option_incident_message": "Mensaje de incidente personalizado",
      "option_report_channel": "Canal para reportes diarios",
      "option_panel_title": "Título del embed del panel",
      "option_panel_description": "Descripción del embed del panel",
      "option_panel_footer": "Pie del embed del panel",
      "option_respect_away": "Respetar estado ausente"
    },
    "automod": {
      "group_description": "Configurar reglas y exenciones de AutoMod",
      "bootstrap_description": "Crear reglas iniciales de AutoMod",
      "status_description": "Ver estado de configuración de AutoMod",
      "sync_description": "Sincronizar reglas de AutoMod con configuración actual",
      "disable_description": "Eliminar todas las reglas gestionadas de AutoMod",
      "channel_alert_description": "Establecer o limpiar el canal de alertas de AutoMod",
      "exempt_channel_description": "Gestionar canales exentos",
      "exempt_role_description": "Gestionar roles exentos",
      "preset_description": "Activar o desactivar un preset de AutoMod",
      "option_channel": "Canal para recibir alertas de AutoMod",
      "option_clear": "Limpiar el canal de alertas",
      "option_action": "Acción a realizar",
      "option_target_channel": "Canal a exentar",
      "option_target_role": "Rol a exentar",
      "option_preset_name": "Nombre del preset",
      "option_enabled": "Activar o desactivar este preset",
      "choice_add": "Agregar",
      "choice_remove": "Eliminar",
      "choice_reset": "Reiniciar",
      "choice_preset_spam": "Spam",
      "choice_preset_invites": "Invitaciones",
      "choice_preset_scam": "Enlaces de estafa",
      "choice_preset_all": "Todos los presets",
      "preset_spam": "Spam",
      "preset_invites": "Invitaciones",
      "preset_scam": "Enlaces de estafa",
      "preset_all": "Todos los presets"
    }
  },
  "status": {
    "commercial": "Comercial"
  },
  "verify": {
    "mode": {
      "button": "Botón",
      "code": "Código por DM",
      "question": "Pregunta"
    },
    "panel": {
      "title": "Verificación",
      "description": "Necesitas verificarte antes de acceder al servidor. Pulsa el botón de abajo para comenzar.",
      "footer": "{{guild}} • Verificación",
      "start_label": "Verificarme",
      "help_label": "Ayuda"
    },
    "info": {
      "title": "Configuración de verificación",
      "no_issues": "No se detectaron problemas.",
      "protection_footer": "Protección: {{failures}} intentos fallidos -> {{minutes}}m de enfriamiento",
      "raid_action_pause": "Solo alerta",
      "raid_action_kick": "Expulsar automáticamente"
    },
    "inspection": {
      "channel_missing": "El canal de verificación no está configurado.",
      "channel_deleted": "El canal de verificación configurado ya no existe.",
      "channel_permissions": "No puedo publicar el panel en {{channel}}. Permisos faltantes: {{permissions}}.",
      "verified_role_missing": "El rol verificado no está configurado.",
      "verified_role_deleted": "El rol verificado configurado ya no existe.",
      "verified_role_managed": "El rol verificado está gestionado por una integración y el bot no puede asignarlo.",
      "verified_role_unmanageable": "No puedo gestionar el rol verificado {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "unverified_role_deleted": "El rol sin verificar configurado ya no existe.",
      "unverified_role_managed": "El rol sin verificar está gestionado por una integración y el bot no puede asignarlo.",
      "unverified_role_unmanageable": "No puedo gestionar el rol sin verificar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "roles_same": "El rol verificado y el rol sin verificar no pueden ser el mismo.",
      "question_missing": "El modo pregunta está activado pero la pregunta de verificación está vacía.",
      "answer_missing": "El modo pregunta está activado pero la respuesta esperada está vacía.",
      "button_mode_antiraid_warning": "El modo botón ofrece protección mínima contra bots. Considera usar el modo 'code' o 'question' con anti-raid activado.",
      "log_channel_deleted": "El canal de logs de verificación configurado ya no existe.",
      "log_channel_permissions": "No puedo escribir en {{channel}}. Permisos faltantes: {{permissions}}.",
      "apply_verified_missing": "El rol verificado no está configurado o ya no existe.",
      "apply_verified_unmanageable": "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "apply_unverified_unmanageable": "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "apply_role_update_failed": "No pude actualizar los roles de verificación.",
      "welcome_autorole_missing": "El auto-rol de bienvenida está configurado pero ya no existe.",
      "welcome_autorole_failed": "No pude asignar el auto-rol de bienvenida {{role}}.",
      "welcome_autorole_process_failed": "No pude procesar el auto-rol de bienvenida.",
      "revoke_verified_unmanageable": "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "revoke_unverified_unmanageable": "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      "revoke_role_update_failed": "No pude actualizar los roles de verificación.",
      "publish_failed": "No pude enviar o editar el panel de verificación en {{channel}}. Verifica que pueda enviar mensajes y embeds allí."
    },
    "command": {
      "confirmation_dm": "DM de confirmación",
      "operational_health": "Salud operativa",
      "raid_threshold": "Umbral de raid",
      "raid_action": "Acción anti-raid",
      "panel_saved_but_not_published": "La configuración de verificación se guardó, pero el panel no pudo publicarse.\n\n{{issues}}",
      "panel_refreshed": "Panel de verificación actualizado.",
      "panel_published": "Panel de verificación publicado.",
      "setup_failed": "Todavía no puedo completar la configuración.\n\n{{issues}}",
      "setup_ready_title": "Verificación lista",
      "setup_ready_description": "El sistema de verificación está configurado y el panel en vivo está disponible.",
      "note_ticket_role_aligned": "El rol mínimo de verificación para tickets se alineó automáticamente porque no estaba configurado.",
      "note_question_mode": "El modo pregunta está activo. Usa `/verify question` si quieres reemplazar el desafío por defecto.",
      "panel_publish_failed": "El panel de verificación no pudo publicarse.\n\n{{issues}}",
      "enable_failed": "Todavía no puedo activar la verificación.\n\n{{issues}}",
      "enabled_state": "La verificación ahora está **{{state}}**.",
      "mode_failed": "Todavía no puedo cambiar a **{{mode}}**.\n\n{{issues}}",
      "mode_changed": "El modo de verificación cambió a **{{mode}}**. {{detail}}",
      "question_updated": "Pregunta de verificación actualizada.",
      "message_require_one": "Proporciona al menos un campo para actualizar: `title`, `description`, `color` o `image`.",
      "invalid_color": "Color inválido. Usa un valor hexadecimal de 6 caracteres como `57F287`.",
      "invalid_image": "La URL de la imagen debe comenzar con `https://`.",
      "message_updated": "Panel de verificación actualizado. {{detail}}",
      "dm_updated": "El DM de confirmación de verificación ahora está **{{state}}**.",
      "auto_kick_disabled": "El auto-kick para miembros sin verificar ahora está **desactivado**.",
      "auto_kick_enabled": "Los miembros sin verificar serán expulsados después de **{{hours}} hora(s)**.",
      "anti_raid_enabled": "El anti-raid ahora está **activado**.\nUmbral: **{{joins}} joins** en **{{seconds}}s**.\nAcción: **{{action}}**.",
      "anti_raid_disabled": "El anti-raid ahora está **desactivado**.",
      "logs_permissions": "No puedo usar {{channel}} para los logs de verificación. Permisos faltantes: {{permissions}}.",
      "logs_set": "Los logs de verificación se enviarán a {{channel}}.",
      "force_bot": "Los bots no pueden verificarse mediante el flujo de verificación de miembros.",
      "user_missing": "Ese usuario no está en este servidor.",
      "force_failed": "No pude verificar a <@{{userId}}>.\n\n{{issues}}",
      "force_success": "<@{{userId}}> fue verificado manualmente.{{warningText}}",
      "unverify_bot": "Los bots no usan el flujo de verificación de miembros.",
      "unverify_failed": "No pude quitar la verificación de <@{{userId}}>.\n\n{{issues}}",
      "unverify_success": "Se quitó la verificación de <@{{userId}}>.{{warningText}}",
      "stats_title": "Estadísticas de verificación",
      "stats_footer": "Eventos de verificación almacenados: {{total}}",
      "unknown_subcommand": "Subcomando de verificación desconocido.",
      "security_title": "Configuración de Seguridad",
      "security_footer": "Usa /verify security con opciones para cambiar la configuración",
      "min_account_age": "Edad mínima de cuenta",
      "risk_escalation": "Escalado por riesgo",
      "captcha_type": "Tipo de CAPTCHA",
      "captcha_math": "Matemático",
      "captcha_emoji": "Contar emojis",
      "security_updated": "Configuración de seguridad actualizada:\n{{changes}}",
      "security_age_set": "Edad mínima de cuenta establecida en **{{days}} días**",
      "security_age_disabled": "Verificación de edad de cuenta **desactivada**",
      "security_risk_enabled": "Escalado basado en riesgo **activado**",
      "security_risk_disabled": "Escalado basado en riesgo **desactivado**",
      "security_captcha_set": "Tipo de CAPTCHA establecido a **{{type}}**",
      "pool_title": "Pool de Preguntas",
      "pool_empty": "No hay preguntas en el pool todavía.\n\nUsa `/verify question-pool add` para agregar preguntas.",
      "pool_footer": "Usa /verify question-pool add para agregar preguntas",
      "pool_count": "{{count}} pregunta(s) en el pool",
      "pool_max_reached": "Máximo de 20 preguntas alcanzado. Elimina algunas antes de agregar más.",
      "pool_added": "Pregunta agregada: **{{question}}...**\nTotal de preguntas: {{total}}",
      "pool_removed": "Pregunta eliminada: **{{question}}...**\nRestantes: {{remaining}}",
      "pool_cleared": "Se eliminaron {{count}} pregunta(s) del pool.",
      "pool_invalid_index": "Índice inválido. Usa un número entre 1 y {{max}}.",
      "pool_pro_feature": "Más de 5 preguntas en el pool",
      "risk_escalation_pro": "Escalado de verificación basado en riesgo",
      "captcha_emoji_pro": "Tipo de CAPTCHA con emojis",
      "account_age_pro": "Requisito de edad de cuenta mayor a {{max}} días",
      "force_log_title": "Miembro verificado manualmente",
      "unverify_log_title": "Miembro desverificado",
      "actor": "Actor",
      "member": "Miembro",
      "verified": "Verificados",
      "failed": "Fallidos",
      "kicked": "Expulsados",
      "starts": "Inicios",
      "force_verified": "Verificados manualmente",
      "force_unverified": "Desverificados manualmente",
      "pending_members": "Miembros pendientes",
      "verified_members": "Miembros verificados",
      "code_sends": "Códigos enviados",
      "question_prompts": "Prompts de pregunta",
      "anti_raid_triggers": "Activaciones anti-raid",
      "permission_errors": "Errores de permisos"
    },
    "handler": {
      "not_active": "La verificación no está activa en este servidor.",
      "member_not_found": "No pude encontrar tu perfil de miembro en este servidor.",
      "already_verified": "Ya estás verificado en este servidor.",
      "misconfigured": "La verificación está mal configurada en este momento.\n\n{{issues}}",
      "too_many_attempts": "Demasiados intentos fallidos. Intenta de nuevo {{retryText}}.",
      "join_too_recent": "Te uniste muy recientemente. Por favor espera {{retryText}} antes de verificarte.",
      "account_too_new": "Tu cuenta de Discord es muy nueva. Las cuentas deben tener al menos {{days}} días de antigüedad para verificarse. Tu cuenta tiene {{currentDays}} días.",
      "code_dm_title": "Código de verificación",
      "code_dm_description": "Tu código de verificación para **{{guild}}** es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.\nVuelve al servidor y pulsa **{{enterCodeLabel}}**.",
      "dm_failed": "No pude enviarte un DM.\n\nActiva los mensajes directos para este servidor y vuelve a intentarlo.",
      "code_sent_title": "Código enviado por DM",
      "code_sent_description": "Se envió un código de 8 caracteres a tus mensajes directos.\n\n1. Abre tu bandeja de DMs y copia el código.\n2. Vuelve aquí y pulsa **{{enterCodeLabel}}**.\n\nEl código expira en **10 minutos**.",
      "code_sent_footer": "Los reenvíos están limitados. Espera {{seconds}}s antes de pedir otro código.",
      "question_missing": "No hay una pregunta de verificación configurada. Pide a un admin que ejecute `/verify question`.",
      "question_modal_title": "Pregunta de verificación",
      "question_placeholder": "Escribe tu respuesta aquí",
      "mode_invalid": "El modo de verificación no está configurado correctamente.",
      "help_title": "Cómo funciona la verificación",
      "help_mode_button": "Pulsa **Verificarme** y el bot te verificará inmediatamente.",
      "help_mode_code": "Pulsa **Verificarme**, revisa tu DM para ver el código y luego ingrésalo en el modal.",
      "help_mode_question": "Pulsa **Verificarme** y responde correctamente la pregunta de verificación.",
      "help_dm_problems_label": "¿Problemas con DM?",
      "help_dm_problems": "Activa los mensajes directos para este servidor y vuelve a intentarlo.",
      "help_attempts_label": "Protección de intentos",
      "help_attempts": "Después de {{failures}} intentos fallidos, la verificación se pausa durante {{minutes}} minutos.",
      "help_blocked_label": "¿Sigues bloqueado?",
      "help_blocked": "Contacta a un administrador del servidor para obtener ayuda manual.",
      "enter_code_title": "Ingresa tu código",
      "enter_code_label": "Código recibido por DM",
      "enter_code_placeholder": "Ejemplo: AB1C2D3E",
      "not_code_mode": "Este modo de verificación no usa códigos por DM.",
      "code_reason_no_code": "No se encontró un código pendiente. Pulsa **Verificarme** para generar uno nuevo.",
      "code_reason_expired": "Tu código expiró. Pulsa **Verificarme** para generar uno nuevo.",
      "code_reason_wrong": "Código incorrecto. Intenta otra vez.",
      "invalid_code": "Código de verificación inválido.",
      "incorrect_answer": "Respuesta incorrecta. Lee la pregunta con cuidado e inténtalo de nuevo.{{cooldownText}}",
      "resend_wait": "Espera antes de pedir otro código. Podrás reintentar {{retryText}}.",
      "new_code_title": "Nuevo código de verificación",
      "new_code_description": "Tu nuevo código de verificación es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.",
      "resend_dm_failed": "No pude enviarte un DM. Activa los mensajes directos e inténtalo de nuevo.",
      "resend_success": "Se envió un nuevo código de verificación por DM.",
      "max_resends_reached": "Has alcanzado el número máximo de reenvíos de código ({{max}}). Por favor espera o contacta a un admin.",
      "captcha_modal_title": "Verificación de seguridad",
      "captcha_placeholder": "Escribe tu respuesta",
      "captcha_reason_no_captcha": "No se encontró un captcha pendiente. Pulsa **Verificarme** para empezar de nuevo.",
      "captcha_reason_expired": "Tu captcha expiró. Pulsa **Verificarme** para obtener uno nuevo.",
      "captcha_reason_wrong": "Respuesta incorrecta. Intenta de nuevo.",
      "captcha_invalid": "Respuesta de captcha inválida.",
      "completion_failed": "No pude completar tu verificación porque la configuración de roles no está operativa.\n\n{{issues}}",
      "completed_title": "Verificación completada",
      "completed_description": "Bienvenido a **{{guild}}**, <@{{userId}}>. Ahora ya tienes acceso completo al servidor.",
      "verified_dm_title": "Ya estás verificado",
      "verified_dm_description": "Te verificaste correctamente en **{{guild}}**.",
      "log_verified_title": "Miembro verificado",
      "log_warning_none": "Ninguno"
    },
    "slash": {
      "description": "Configura el sistema de verificación de miembros",
      "subcommands": {
        "setup": {
          "description": "Configura la verificación con su canal y roles principales"
        },
        "panel": {
          "description": "Publica o actualiza el panel de verificación"
        },
        "enabled": {
          "description": "Activa o desactiva la verificación"
        },
        "mode": {
          "description": "Cambia el modo de verificación"
        },
        "question": {
          "description": "Actualiza la pregunta y respuesta esperada"
        },
        "message": {
          "description": "Personaliza el mensaje del panel de verificación"
        },
        "dm": {
          "description": "Activa o desactiva el DM de confirmación de verificación"
        },
        "auto_kick": {
          "description": "Configura el tiempo para expulsar miembros sin verificar"
        },
        "anti_raid": {
          "description": "Configura la protección anti-raid en entradas"
        },
        "logs": {
          "description": "Define el canal de logs de verificación"
        },
        "force": {
          "description": "Verifica manualmente a un miembro"
        },
        "unverify": {
          "description": "Quita manualmente la verificación a un miembro"
        },
        "stats": {
          "description": "Muestra estadísticas de verificación"
        },
        "info": {
          "description": "Muestra la configuración actual de verificación"
        },
        "security": {
          "description": "Ajusta edad de cuenta, CAPTCHA y riesgo"
        }
      },
      "options": {
        "channel": "Canal de verificación",
        "verified_role": "Rol que se entrega al verificar",
        "mode": "Modo de verificación que se usará",
        "unverified_role": "Rol asignado antes de verificar",
        "enabled": "Si la función debe quedar activa",
        "type": "Modo de verificación al que quieres cambiar",
        "prompt": "Pregunta o texto del reto",
        "answer": "Respuesta esperada",
        "title": "Título del panel",
        "description": "Descripción del panel",
        "color": "Color del embed en hex sin `#`",
        "image": "URL de imagen para el panel",
        "dm_enabled": "Si el DM de confirmación debe seguir activo",
        "hours": "Horas antes de expulsar miembros sin verificar",
        "anti_raid_enabled": "Si la protección anti-raid debe quedar activa",
        "joins": "Cantidad de entradas antes de disparar el anti-raid",
        "seconds": "Ventana de detección en segundos",
        "action": "Acción al dispararse el anti-raid",
        "log_channel": "Canal usado para los logs de verificación",
        "user_verify": "Miembro que quieres verificar manualmente",
        "user_unverify": "Miembro al que quieres quitar la verificación",
        "min_account_age": "Edad mínima de la cuenta en días",
        "risk_escalation": "Si las cuentas riesgosas deben pasar controles más fuertes",
        "captcha_type": "Tipo de CAPTCHA requerido"
      },
      "groups": {
        "question_pool": {
          "description": "Gestiona el pool aleatorio de preguntas de verificación",
          "subcommands": {
            "add": {
              "description": "Agrega una pregunta al pool"
            },
            "list": {
              "description": "Lista el pool actual de preguntas"
            },
            "remove": {
              "description": "Elimina una pregunta del pool"
            },
            "clear": {
              "description": "Limpia por completo el pool de preguntas"
            }
          },
          "options": {
            "question": "Texto de la pregunta",
            "answer": "Respuesta esperada",
            "index": "Número del elemento que quieres eliminar"
          }
        }
      },
      "choices": {
        "mode": {
          "button": "Botón",
          "code": "Código por DM",
          "question": "Pregunta"
        },
        "anti_raid_action": {
          "pause": "Solo alertar",
          "kick": "Expulsar automáticamente"
        },
        "captcha_type": {
          "math": "Matemático",
          "emoji": "Contar emojis"
        }
      }
    },
    "activity": {
      "anti_raid_triggered": "Anti-raid activado",
      "unverified_kicked": "Miembro sin verificar expulsado",
      "permission_error": "Error de permisos",
      "force_verified": "Verificado manualmente",
      "force_unverified": "Verificación retirada manualmente",
      "panel_publish_failed": "Falló la publicación del panel",
      "panel_published": "Panel publicado",
      "verified": "Verificado",
      "unverified": "Sin verificar",
      "anti_raid": "Anti-raid",
      "kicked": "Expulsado",
      "info": "Informaci?n"
    }
  },
  "staff": {
    "slash": {
      "description": "Herramientas de staff y gestión de tickets",
      "subcommands": {
        "away_on": {
          "description": "Marcarte como ausente (no recibirás asignaciones de tickets)"
        },
        "away_off": {
          "description": "Marcarte como disponible nuevamente"
        },
        "my_tickets": {
          "description": "Ver tus tickets asignados y reclamados"
        },
        "warn_add": {
          "description": "Agregar una advertencia a un usuario"
        },
        "warn_check": {
          "description": "Verificar advertencias de un usuario"
        },
        "warn_remove": {
          "description": "Eliminar una advertencia por ID"
        }
      },
      "options": {
        "reason": "Motivo de ausencia",
        "user": "Usuario a advertir o verificar",
        "warn_reason": "Motivo de la advertencia",
        "warning_id": "ID de advertencia a eliminar"
      }
    },
    "moderation_required": "Necesitas el permiso `Moderar Miembros` para este subcomando.",
    "only_staff": "Solo el staff puede usar este comando.",
    "away_on_title": "Modo ausente activado",
    "away_on_description": "Tu estado ahora es **ausente**.{{reasonText}}",
    "away_on_footer": "Usa /staff away-off cuando estés disponible nuevamente",
    "away_off": "Ahora estás **disponible** para trabajo de tickets nuevamente.",
    "my_tickets_title": "Mis Tickets ({{count}})",
    "my_tickets_empty": "No tienes tickets abiertos asignados o reclamados actualmente.",
    "ownership_claimed": "Reclamado",
    "ownership_assigned": "Asignado",
    "ownership_watching": "Observando"
  },
  "stats": {
    "server_title": "Operación de tickets - {{guild}}",
    "total": "Total",
    "open": "Abiertos",
    "closed": "Cerrados",
    "today": "Hoy",
    "week": "Esta semana",
    "avg_rating": "Calificación promedio",
    "avg_response": "Respuesta promedio",
    "avg_close": "Cierre promedio",
    "opened": "Abiertos",
    "no_data": "Sin datos",
    "sla_title": "SLA - {{guild}}",
    "sla_description": "Vista operativa del SLA para primera respuesta y presión de escalación.",
    "sla_threshold": "Umbral SLA",
    "escalation": "Escalación",
    "escalation_threshold": "Umbral de escalación",
    "sla_overrides": "Overrides SLA",
    "escalation_overrides": "Overrides de escalación",
    "open_out_of_sla": "Tickets abiertos fuera de SLA",
    "open_escalated": "Tickets abiertos escalados",
    "avg_first_response": "Primera respuesta promedio",
    "sla_compliance": "Cumplimiento SLA",
    "tickets_evaluated": "Tickets evaluados",
    "no_sla_threshold": "No hay umbral SLA o todavía no hay respuestas",
    "not_configured": "No configurado",
    "staff_no_data_title": "Sin datos",
    "staff_no_data_description": "<@{{userId}}> todavía no tiene estadísticas.",
    "no_ratings_yet": "Todavía no hay calificaciones",
    "ratings_count": "{{count}} calificaciones",
    "staff_title": "Estadísticas de staff - {{user}}",
    "closed_tickets": "Tickets cerrados",
    "claimed_tickets": "Tickets reclamados",
    "assigned_tickets": "Tickets asignados",
    "average_rating": "Calificación promedio",
    "leaderboard_title": "Leaderboard de staff",
    "leaderboard_empty": "Todavía no hay datos de staff.",
    "leaderboard_closed": "cerrados",
    "leaderboard_claimed": "reclamados",
    "ratings_title": "Leaderboard de calificaciones",
    "ratings_empty": "Todavía no hay calificaciones.",
    "period_all": "Todo el tiempo",
    "period_month": "Último mes",
    "period_week": "Última semana",
    "fallback_user": "Usuario {{suffix}}",
    "fallback_staff": "Staff {{suffix}}",
    "staff_rating_title": "Calificaciones - {{user}}",
    "staff_rating_empty": "Este miembro del staff todavía no tiene calificaciones registradas.",
    "average_score": "Puntaje promedio",
    "total_ratings": "Total de calificaciones"
  },
  "commercial": {
    "lines": {
      "current_plan": "Plan actual: `{{plan}}`",
      "stored_plan": "Plan guardado: `{{plan}}`",
      "plan_source": "Origen del plan: `{{source}}`",
      "plan_expires": "Expira el plan: {{value}}",
      "supporter": "Supporter: {{value}}",
      "status_expired": "Estado del plan: `expirado -> funcionando como free`",
      "plan_note": "Nota del plan: {{note}}",
      "supporter_expires": "Supporter expira: `{{date}}`"
    },
    "values": {
      "unknown": "desconocido",
      "never": "Nunca",
      "enabled": "Activado",
      "inactive": "Inactivo"
    },
    "pro_required": {
      "title": "Pro requerido",
      "description": "**{{feature}}** forma parte del plan Pro.\nPidele al owner del bot que active Pro manualmente para este servidor.",
      "current_plan": "Plan actual",
      "supporter": "Supporter",
      "footer": "Las donaciones no desbloquean funciones premium. El estado supporter es solo reconocimiento."
    }
  },
  "audit": {
    "unsupported_subcommand": "Subcomando no soportado.",
    "invalid_from": "`from` debe usar el formato YYYY-MM-DD.",
    "invalid_to": "`to` debe usar el formato YYYY-MM-DD.",
    "invalid_range": "`from` no puede ser mayor que `to`.",
    "title": "Auditoría de tickets",
    "empty": "Ningún ticket coincidió con esos filtros.",
    "export_title": "Exportación de auditoría de tickets",
    "rows": "Filas",
    "status": "Estado",
    "priority": "Prioridad",
    "category": "Categoría",
    "from": "Desde",
    "to": "Hasta",
    "all": "todos"
  },
  "debug": {
    "access_denied": "No tienes permisos para usar comandos de debug.",
    "unknown_subcommand": "Subcomando desconocido.",
    "no_connected_guilds": "No hay guilds conectadas.",
    "title": {
      "status": "Estado del Bot",
      "automod": "Progreso del Badge de AutoMod",
      "health": "Salud del Bot",
      "memory": "Uso de Memoria",
      "cache": "Estado de Cache",
      "guilds": "Guilds Conectadas",
      "voice": "Subsistema de Musica",
      "entitlements": "Entitlements de la Guild",
      "plan_updated": "Plan Actualizado",
      "supporter_updated": "Supporter Actualizado"
    },
    "description": {
      "automod": "Conteo en vivo, solo para owner, de reglas de AutoMod gestionadas por TON618 en las guilds conectadas.",
      "health": "Snapshot de la ventana activa mas el ultimo heartbeat persistido.",
      "cache": "Discord.js gestiona la cache automaticamente.",
      "voice": "Las colas de musica se gestionan por guild."
    },
    "field": {
      "api_ping": "Ping de API",
      "uptime": "Tiempo activo",
      "guilds": "Guilds",
      "cached_users": "Usuarios en cache",
      "cached_channels": "Canales en cache",
      "deploy": "Deploy",
      "progress": "Progreso",
      "guild_coverage": "Cobertura por Guild",
      "quick_state": "Estado rapido",
      "interaction_window": "Ventana de interacciones",
      "heartbeat": "Heartbeat",
      "top_errors": "Errores principales",
      "rss": "RSS",
      "heap_total": "Heap total",
      "heap_used": "Heap usado",
      "external": "External",
      "users": "Usuarios",
      "channels": "Canales",
      "guilds_live_rules": "Guilds con reglas vivas de TON618",
      "guilds_attention": "Guilds que requieren atencion"
    },
    "value": {
      "app_flag_present": "Flag de la app presente: {{value}}",
      "managed_rules": "Reglas gestionadas: `{{count}}`",
      "remaining_to_goal": "Restantes para {{goal}}: `{{count}}`",
      "automod_enabled": "AutoMod activado: `{{count}}`",
      "missing_permissions": "Permisos faltantes: `{{count}}`",
      "failed_partial_sync": "Sync fallida o parcial: `{{count}}`",
      "ping_state": "Ping: **{{state}}** ({{value}}ms, umbral {{threshold}}ms)",
      "error_rate": "Tasa de error: **{{state}}** ({{value}}%, umbral {{threshold}}%)",
      "interaction_totals": "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      "heartbeat": "Ultima vez visto: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      "yes": "Si",
      "no": "No",
      "high": "ALTO",
      "ok": "OK"
    }
  },
  "ticket": {
    "footer": "TON618 Tickets",
    "error_label": "Error",
    "field_category": "Categoria",
    "field_priority": "Prioridad",
    "field_assigned_to": "Asignado a",
    "priority": {
      "low": "Baja",
      "normal": "Normal",
      "high": "Alta",
      "urgent": "Urgente"
    },
    "workflow": {
      "waiting_staff": "Esperando al staff",
      "waiting_user": "Esperando al usuario",
      "triage": "En revisión",
      "assigned": "Asignado",
      "open": "Abierto",
      "closed": "Cerrado"
    },
    "quick_actions": {
      "priority_low": "Prioridad: Baja",
      "priority_normal": "Prioridad: Normal",
      "priority_high": "Prioridad: Alta",
      "priority_urgent": "Prioridad: Urgente",
      "status_wait": "Estado: Esperando al staff",
      "status_pending": "Estado: Esperando al usuario",
      "status_review": "Estado: En revisión",
      "placeholder": "Acciones rápidas de staff..."
    },
    "quick_feedback": {
      "only_staff": "Solo el staff puede usar estas acciones.",
      "not_found": "No se encontró la información del ticket.",
      "closed": "Las acciones rápidas no están disponibles en tickets cerrados.",
      "priority_event_title": "Prioridad actualizada",
      "priority_event_description": "{{userTag}} actualizó la prioridad del ticket #{{ticketId}} a {{priority}} desde acciones rápidas.",
      "priority_updated": "La prioridad del ticket se actualizó a **{{label}}** por <@{{userId}}>.",
      "workflow_event_title": "Estado operativo actualizado",
      "workflow_event_description": "{{userTag}} actualizó el estado operativo del ticket #{{ticketId}} a {{status}} desde acciones rápidas.",
      "workflow_updated": "El estado del ticket se actualizó a **{{label}}** por <@{{userId}}>.",
      "add_staff_prompt": "Menciona al miembro del staff que quieres agregar a este ticket.",
      "unknown_action": "Acción desconocida.",
      "processing_error": "Ocurrió un error mientras se procesaba esta acción."
    },
    "buttons": {
      "close": "Cerrar",
      "claim": "Reclamar",
      "claimed": "Reclamado",
      "transcript": "Transcripción"
    },
    "rating": {
      "invalid_identifier_title": "No se pudo guardar tu calificación",
      "invalid_identifier_description": "El identificador de esta solicitud de calificación no es válido.",
      "invalid_value_title": "Calificación inválida",
      "invalid_value_description": "Selecciona una puntuación entre 1 y 5 estrellas.",
      "prompt_title": "Califica el soporte que recibiste",
      "prompt_description": "Hola <@{{userId}}>, tu ticket **#{{ticketId}}** ha sido cerrado.\n\n**Calificación obligatoria:** debes calificar este ticket antes de abrir nuevos tickets en el futuro.\n\nTu feedback nos ayuda a mejorar el servicio y mantener una experiencia de soporte sólida.",
      "prompt_staff_label": "Miembro del staff",
      "prompt_category_fallback": "General",
      "prompt_footer": "Tu opinión nos importa",
      "prompt_placeholder": "Selecciona una calificación...",
      "prompt_option_1_label": "1 estrella",
      "prompt_option_1_description": "El soporte no cumplió mis expectativas",
      "prompt_option_2_label": "2 estrellas",
      "prompt_option_2_description": "El soporte fue aceptable pero necesita mejorar",
      "prompt_option_3_label": "3 estrellas",
      "prompt_option_3_description": "El soporte fue sólido y aceptable",
      "prompt_option_4_label": "4 estrellas",
      "prompt_option_4_description": "El soporte fue muy profesional",
      "prompt_option_5_label": "5 estrellas",
      "prompt_option_5_description": "El soporte superó mis expectativas",
      "resend_wrong_user": "Este botón solo puede usarlo el usuario correspondiente.",
      "resend_clear": "**Todo al día.**\n\nYa no tienes calificaciones de tickets pendientes.\nPuedes abrir un nuevo ticket cuando lo necesites.",
      "resend_sent": "**Solicitudes de calificación reenviadas**\n\nReenviamos **{{successCount}}** solicitud(es) de calificación a tus DMs.\n\n**Revisa tus DMs** para calificar los tickets pendientes.{{warning}}",
      "resend_partial_warning": "Aviso: no se pudieron reenviar {{failCount}} solicitud(es).",
      "resend_failed": "**No se pudieron reenviar las solicitudes de calificación**\n\nAsegúrate de tener los DMs abiertos e inténtalo otra vez.",
      "resend_error": "Ocurrió un error al reenviar las solicitudes de calificación. Inténtalo de nuevo más tarde.",
      "not_found_title": "Ticket no encontrado",
      "not_found_description": "No pude encontrar el ticket vinculado a esta solicitud de calificación.",
      "unavailable_title": "Calificación no disponible",
      "unavailable_description": "Solo el creador de este ticket puede enviar esta calificación.",
      "already_recorded_title": "Calificación ya registrada",
      "already_recorded_description": "Ya calificaste este ticket con **{{rating}} estrella(s)**.",
      "already_recorded_processing": "Este ticket fue calificado mientras se procesaba tu respuesta.",
      "event_title": "Calificación recibida",
      "event_description": "{{userTag}} calificó el ticket #{{ticketId}} con {{rating}}/5.",
      "thanks_title": "Gracias por tu calificación",
      "thanks_description": "Calificaste la experiencia de soporte con **{{rating}} estrella(s)**.\n\nTu feedback se registró correctamente y nos ayuda a mejorar el servicio.",
      "save_failed_title": "No se pudo guardar tu calificación",
      "save_failed_description": "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."
    },
    "move_select": {
      "move_failed": "No pude mover el ticket en este momento. Inténtalo de nuevo más tarde."
    },
    "transcript_button": {
      "not_ticket": "No pude generar la transcripción porque este canal ya no está registrado como un ticket.",
      "unavailable_now": "No pude generar la transcripción del ticket en este momento.",
      "intro": "Aquí está la transcripción manual de este ticket:",
      "error": "Hubo un error al generar la transcripción. Por favor, inténtalo de nuevo más tarde."
    },
    "playbook": {
      "group_description": "Gestionar recomendaciones de playbook",
      "list_description": "Listar recomendaciones activas de playbook",
      "confirm_description": "Confirmar y aplicar una recomendación de playbook",
      "dismiss_description": "Descartar una recomendación de playbook",
      "apply_macro_description": "Aplicar una macro de playbook manualmente",
      "enable_description": "Activar un playbook para este servidor",
      "disable_description": "Desactivar un playbook para este servidor",
      "option_recommendation": "ID de recomendación",
      "option_playbook": "Nombre del playbook"
    },
    "close_button": {
      "already_closed": "Este ticket ya está cerrado.",
      "bot_member_missing": "No pude verificar mis permisos en este servidor.",
      "missing_manage_channels": "Necesito el permiso `Manage Channels` para cerrar tickets.",
      "permission_denied_title": "Permiso denegado",
      "permission_denied_description": "Solo el staff puede cerrar tickets.",
      "modal_title": "Cerrar ticket #{{ticketId}}",
      "reason_label": "Motivo de cierre",
      "reason_placeholder": "Ejemplo: resuelto, duplicado, solicitud completada...",
      "notes_label": "Notas internas",
      "notes_placeholder": "Notas extra solo para staff...",
      "close_note_event_title": "Nota de cierre agregada",
      "close_note_event_description": "{{userTag}} agregó una nota interna antes de cerrar el ticket #{{ticketId}}.",
      "processing_title": "Procesando cierre",
      "processing_description": "Iniciando el flujo de cierre y generación de transcripción...",
      "auto_close_failed": "No pude cerrar el ticket automáticamente. Inténtalo de nuevo o avisa a un administrador.",
      "modal_error": "Ocurrió un error al procesar el cierre del ticket. Inténtalo de nuevo más tarde.",
      "open_form_error": "Ocurrió un error al abrir el formulario de cierre. Inténtalo otra vez."
    },
    "defaults": {
      "public_panel_title": "¿Necesitas ayuda? Estamos aquí para ti.",
      "public_panel_description": "Abre un ticket privado seleccionando la categoría que mejor encaje con tu solicitud.",
      "public_panel_footer": "{guild} • Soporte profesional",
      "welcome_message": "Hola {user}, tu ticket **{ticket}** ha sido creado. Comparte todos los detalles posibles.",
      "control_panel_title": "Panel de Control del Ticket",
      "control_panel_description": "Este es el panel de control del ticket **{ticket}**.\nUsa los controles de abajo para gestionarlo.",
      "control_panel_footer": "{guild} • TON618 Tickets"
    },
    "panel": {
      "categories_heading": "Elige una categoría",
      "categories_cta": "Elige una opción del menú de abajo para empezar.",
      "queue_name": "Cola actual",
      "queue_value": "Ahora mismo tenemos `{{openTicketCount}}` ticket(s) activo(s). Responderemos lo antes posible.",
      "faq_button": "Preguntas frecuentes"
    },
    "create_flow": {
      "system_not_configured_title": "Sistema de tickets no configurado",
      "system_not_configured_description": "El sistema de tickets no está configurado correctamente.\n\n**Problema:** no hay categorías de tickets configuradas.\n\n**Solución:** un administrador debe crear categorías con:\n`/config category add`\n\nContacta al equipo de administración del servidor para resolver este problema.",
      "system_not_configured_footer": "TON618 Tickets - Error de configuración",
      "category_not_found": "Categoría no encontrada.",
      "invalid_form": "El formulario no es válido. Amplía la primera respuesta.",
      "min_days_required": "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.",
      "blacklisted": "Estás en blacklist.\n**Motivo:** {{reason}}",
      "verify_role_required": "Necesitas el rol <@&{{roleId}}> para abrir tickets.",
      "pending_ratings_title": "Calificaciones de tickets pendientes",
      "pending_ratings_description": "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      "pending_ratings_footer": "TON618 Tickets - Sistema de calificación",
      "resend_ratings_button": "Reenviar solicitudes de calificación",
      "duplicate_request": "Ya se está procesando una solicitud de creación de ticket para ti. Espera unos segundos.",
      "global_limit": "Este servidor alcanzó el límite global de **{{limit}}** tickets abiertos. Espera a que se libere espacio.",
      "user_limit": "Ya tienes **{{openCount}}/{{maxPerUser}}** tickets abiertos{{suffix}}",
      "cooldown": "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.",
      "missing_permissions": "No tengo los permisos necesarios para crear tickets.\n\nPermisos requeridos: Manage Channels, View Channel, Send Messages, Manage Roles.",
      "self_permissions_error": "No pude verificar mis permisos en este servidor.",
      "welcome_message_failed": "No se pudo enviar el mensaje de bienvenida.",
      "control_panel_failed": "No se pudo enviar el panel de control.",
      "dm_created_title": "Ticket creado",
      "dm_created_description": "Tu ticket **#{{ticketId}}** ha sido creado en **{{guild}}**.\nCanal: <#{{channelId}}>\n\nTe avisaremos cuando el staff responda.",
      "created_success_title": "Ticket creado correctamente",
      "created_success_description": "Tu ticket ha sido creado: <#{{channelId}}> | **#{{ticketId}}**\n\nVe al canal para continuar tu solicitud.{{warningText}}",
      "submitted_form": "Formulario enviado",
      "question_fallback": "Pregunta {{index}}",
      "general_category": "General"
    },
    "create_errors": {
      "reserve_number": "No pude reservar un número interno para el ticket. Inténtalo de nuevo en unos segundos.",
      "duplicate_number": "Hubo un conflicto interno al numerar el ticket. Inténtalo de nuevo.",
      "missing_permissions": "No tengo permisos suficientes para crear o preparar el canal del ticket.",
      "generic": "Ocurrió un error al crear el ticket. Verifica mis permisos o contacta a un administrador."
    },
    "faq": {
      "title": "Preguntas frecuentes",
      "description": "Aquí están las respuestas más comunes que la gente necesita antes de abrir un ticket. Revisarlas rápido puede ahorrarte tiempo de espera.",
      "q1_question": "¿Cómo compro un producto o membresía?",
      "q1_answer": "Ve a nuestra tienda oficial, o abre un ticket en la categoría **Ventas** si necesitas ayuda paso a paso.",
      "q2_question": "¿Cómo solicito un reembolso?",
      "q2_answer": "Abre un ticket de **Soporte / Facturación** e incluye tu comprobante de pago más el ID de transacción para que el equipo lo revise.",
      "q3_question": "Quiero reportar a un usuario",
      "q3_answer": "Para que un reporte sea válido, incluye capturas o videos claros y explica la situación en un ticket de **Reportes**.",
      "q4_question": "Quiero aplicar para una partnership",
      "q4_answer": "Las solicitudes de partnership se gestionan por tickets de **Partnership**. Asegúrate de cumplir primero los requisitos mínimos.",
      "footer": "¿Sigues necesitando ayuda? Elige una categoría en el menú desplegable para abrir un ticket.",
      "load_failed": "No pudimos cargar la FAQ ahora mismo. Inténtalo de nuevo más tarde."
    },
    "picker": {
      "access_denied_title": "Acceso denegado",
      "access_denied_description": "No puedes crear tickets ahora mismo.\n**Motivo:** {{reason}}",
      "access_denied_footer": "Si crees que esto es un error, contacta a un administrador.",
      "limit_reached_title": "Límite de tickets alcanzado",
      "limit_reached_description": "Ya tienes **{{openCount}}/{{maxTickets}}** tickets abiertos.\n\n**Tus tickets activos:**\n{{ticketList}}\n\nCierra uno de tus tickets actuales antes de abrir uno nuevo.",
      "no_categories": "No hay categorías de tickets configuradas para este servidor.",
      "select_title": "Crear un nuevo ticket",
      "select_description": "Selecciona la categoría que mejor encaje con tu solicitud para que el equipo correcto pueda ayudarte más rápido.\n\nCada categoría enruta tu solicitud al staff adecuado.",
      "select_placeholder": "Selecciona el tipo de ticket...",
      "processing_error": "Ocurrió un error mientras se preparaba el formulario del ticket. Intenta de nuevo más tarde.",
      "category_missing": "Esa categoría no se encontró o no está disponible ahora mismo. Elige otra opción.",
      "cooldown": "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.\n\nEste cooldown ayuda al equipo a gestionar mejor las solicitudes entrantes.",
      "min_days": "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.\n\nTiempo actual en el servidor: **{{currentDays}} día(s)**",
      "pending_ratings_title": "Calificaciones de tickets pendientes",
      "pending_ratings_description": "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      "pending_ratings_footer": "TON618 Tickets - Sistema de calificación",
      "resend_ratings_button": "Reenviar solicitudes de calificación"
    },
    "modal": {
      "category_unavailable": "Esta categoría de ticket ya no está disponible. Vuelve a empezar.",
      "first_answer_short": "Tu primera respuesta es demasiado corta. Agrega más contexto antes de crear el ticket."
    },
    "maintenance": {
      "title": "Sistema en mantenimiento",
      "description": "El sistema de tickets está temporalmente desactivado.\n\n**Motivo:** {{reason}}\n\nPor favor vuelve más tarde.",
      "scheduled": "Mantenimiento programado"
    },
    "command": {
      "unknown_subcommand": "Subcomando de ticket desconocido.",
      "not_ticket_channel": "Este no es un canal de ticket.",
      "only_staff_close": "Solo el staff puede cerrar tickets.",
      "only_staff_reopen": "Solo el staff puede reabrir tickets.",
      "only_staff_claim": "Solo el staff puede reclamar tickets.",
      "release_denied": "No tienes permiso para liberar este ticket.",
      "only_staff_assign": "Solo el staff puede asignar tickets.",
      "only_staff_add": "Solo el staff puede agregar usuarios al ticket.",
      "only_staff_remove": "Solo el staff puede quitar usuarios del ticket.",
      "only_staff_rename": "Solo el staff puede renombrar tickets.",
      "valid_channel_name": "Proporciona un nombre de canal valido.",
      "channel_renamed": "Canal renombrado a **{{name}}**",
      "closed_priority_denied": "No puedes cambiar la prioridad de un ticket cerrado.",
      "only_staff_priority": "Solo el staff puede cambiar la prioridad del ticket.",
      "priority_updated": "Prioridad actualizada a **{{label}}**",
      "only_staff_move": "Solo el staff puede mover tickets.",
      "no_other_categories": "No hay otras categorias disponibles.",
      "move_select_description": "Selecciona la categoria a la que quieres mover este ticket:",
      "move_select_placeholder": "Selecciona la nueva categoria...",
      "only_staff_transcript": "Solo el staff puede generar transcripciones.",
      "transcript_failed": "No se pudo generar la transcripcion.",
      "transcript_generated": "Transcripcion generada.",
      "only_staff_brief": "Solo el staff puede ver el case brief.",
      "only_staff_info": "Solo el staff puede ver los detalles del ticket.",
      "only_staff_other_history": "Solo el staff puede ver el historial de otro usuario.",
      "history_title": "Historial de tickets de {{user}}",
      "history_empty": "<@{{userId}}> no tiene tickets en este servidor.",
      "history_summary": "Resumen",
      "history_open_now": "Abiertos ahora",
      "history_recently_closed": "Cerrados recientemente",
      "no_rating": "Sin calificacion",
      "history_summary_value": "Total: **{{total}}** | Abiertos: **{{open}}** | Cerrados: **{{closed}}**",
      "only_staff_notes": "Solo el staff puede ver o agregar notas.",
      "only_admin_clear_notes": "Solo los administradores pueden limpiar todas las notas del ticket.",
      "notes_cleared": "Se limpiaron todas las notas del ticket.",
      "notes_cleared_event_description": "{{userTag}} limpio las notas internas del ticket #{{ticketId}}.",
      "note_limit_reached": "Se alcanzo el limite de notas del ticket (**{{max}}** notas maximas por ticket). Usa `/ticket note clear` si necesitas limpiarlas.",
      "note_added_title": "Nota interna agregada",
      "note_added_event_description": "{{userTag}} agrego una nota interna al ticket #{{ticketId}}.",
      "note_added_footer": "Por {{userTag}} · {{count}}/{{max}}",
      "notes_title": "Notas del ticket",
      "notes_empty": "Todavia no hay notas en este ticket.",
      "notes_list_title": "Notas del ticket — #{{ticketId}} ({{count}}/{{max}})",
      "rename_event_title": "Canal renombrado",
      "rename_event_description": "{{userTag}} renombro el ticket #{{ticketId}} a {{name}}.",
      "priority_event_title": "Prioridad actualizada",
      "priority_event_description": "{{userTag}} cambio la prioridad del ticket #{{ticketId}} a {{label}}."
    },
    "lifecycle": {
      "close": {
        "already_closed": "Este ticket ya esta cerrado.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para cerrar este ticket.",
        "already_closed_during_request": "Este ticket ya fue cerrado mientras se procesaba tu solicitud.",
        "database_error": "Hubo un error al cerrar el ticket en la base de datos. Intenta de nuevo.",
        "event_title": "Ticket cerrado",
        "event_description": "{{userTag}} cerro el ticket #{{ticketId}}.",
        "transcript_generate_failed": "No se pudo generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        "transcript_channel_missing": "No hay un canal de transcripciones configurado. El canal permanecera cerrado y no se eliminara automaticamente.",
        "transcript_channel_unavailable": "El canal de transcripciones configurado no existe o no es accesible. El canal no se eliminara automaticamente.",
        "transcript_send_failed": "No se pudo enviar la transcripcion al canal configurado. El canal no se eliminara automaticamente.",
        "transcript_generate_error": "Ocurrio un error al generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        "dm_receipt_title": "Recibo de soporte",
        "dm_receipt_description": "Gracias por contactar con nuestro equipo de soporte. Aqui tienes un resumen de tu ticket.",
        "dm_field_ticket": "Ticket",
        "dm_field_category": "Categoria",
        "dm_field_opened": "Fecha de apertura",
        "dm_field_closed": "Fecha de cierre",
        "dm_field_duration": "Duracion total",
        "dm_field_reason": "Razon de cierre",
        "dm_field_handled_by": "Atendido por",
        "dm_field_messages": "Mensajes",
        "dm_field_transcript": "Transcripcion en linea",
        "dm_transcript_link": "Ver transcripcion completa",
        "dm_no_reason": "No se proporciono una razon",
        "dm_footer": "Gracias por confiar en nuestro soporte - TON618 Tickets",
        "dm_warning_title": "Aviso: DM no enviado",
        "dm_warning_description": "No se pudo enviar el mensaje de cierre por DM a <@{{userId}}>.\n\n**Posible causa:** el usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n**Ticket:** #{{ticketId}}",
        "dm_warning_transcript": "Transcripcion disponible",
        "dm_warning_unavailable": "No disponible",
        "warning_dm_failed": "No se pudo enviar DM al usuario.",
        "warning_channel_not_deleted": "El canal no se eliminara automaticamente hasta que la transcripcion quede archivada de forma segura.",
        "log_reason": "Razon",
        "log_duration": "Duracion",
        "log_user": "Usuario",
        "log_transcript": "Transcripcion",
        "log_unavailable": "No disponible",
        "result_closing_title": "Cerrando ticket",
        "result_closed_title": "Ticket cerrado",
        "result_closing_description": "Este ticket se eliminara en **{{seconds}} segundos**.\n\n{{dmStatus}}",
        "result_closed_description": "El ticket ya fue cerrado, pero el canal permanecera disponible hasta que la transcripcion pueda archivarse de forma segura.",
        "result_dm_sent": "Se envio un resumen al usuario por mensaje directo.",
        "result_dm_failed": "No se pudo notificar al usuario por DM.",
        "delete_reason": "Ticket cerrado",
        "transcript_embed_title": "Transcripcion de ticket",
        "transcript_field_user": "Usuario",
        "transcript_field_duration": "Duracion",
        "transcript_field_staff": "Staff",
        "transcript_field_closed": "Cerrado",
        "transcript_field_messages": "Mensajes",
        "transcript_field_rating": "Calificacion",
        "transcript_rating_none": "Sin calificar",
        "transcript_closed_unknown": "Desconocido",
        "transcript_closed_unavailable": "No disponible"
      },
      "reopen": {
        "already_open": "Este ticket ya esta abierto.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para reabrir este ticket.",
        "user_missing": "No pude encontrar al usuario que creo este ticket.",
        "reopened_during_request": "Este ticket ya fue reabierto mientras se procesaba tu solicitud.",
        "database_error": "Hubo un error al reabrir el ticket en la base de datos.",
        "dm_title": "Ticket reabierto",
        "dm_description": "Tu ticket **#{{ticketId}}** en **{{guild}}** fue reabierto por {{staff}}.\n\n**Canal:** [Ir al ticket]({{channelLink}})\n\nYa puedes volver al canal y continuar la conversacion.",
        "result_title": "Ticket reabierto",
        "result_description": "El ticket **#{{ticketId}}** fue reabierto correctamente.\n\n**Total de reaperturas:** {{count}}{{dmLine}}{{warningLine}}",
        "dm_line": "\nSe notifico al usuario por DM.",
        "warning_line": "\n\nAviso: {{warning}}",
        "dm_warning": "No se pudo notificar al usuario por DM (puede tener los DMs desactivados)."
      },
      "claim": {
        "closed_ticket": "No puedes reclamar un ticket cerrado.",
        "staff_only": "Solo el staff puede reclamar tickets.",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para reclamar este ticket.",
        "already_claimed_self": "Ya reclamaste este ticket.",
        "already_claimed_other": "Ya fue reclamado por <@{{userId}}>. Usa `/ticket unclaim` primero.",
        "claimed_during_request": "Este ticket fue reclamado por <@{{userId}}> mientras se procesaba tu solicitud.",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos. Intenta de nuevo.",
        "dm_title": "Tu ticket ya esta siendo atendido",
        "dm_description": "Tu ticket **#{{ticketId}}** en **{{guild}}** ya tiene un miembro del staff asignado.\n\n**Staff asignado:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Canal:** [Ir al ticket]({{channelLink}})\n\nUsa el enlace de arriba para entrar directamente al ticket y continuar la conversacion.",
        "event_description": "{{userTag}} reclamo el ticket #{{ticketId}}.",
        "result_title": "Ticket reclamado",
        "result_description": "Reclamaste el ticket **#{{ticketId}}** correctamente.{{dmLine}}{{warningBlock}}",
        "dm_line": "\n\nSe notifico al usuario por DM.",
        "warning_permissions": "Tus permisos no pudieron actualizarse completamente.",
        "warning_dm": "No se pudo notificar al usuario por DM (DMs desactivados).",
        "log_claimed_by": "Reclamado por"
      },
      "unclaim": {
        "closed_ticket": "No puedes liberar un ticket cerrado.",
        "not_claimed": "Este ticket no esta reclamado.",
        "denied": "Solo quien reclamo el ticket o un administrador puede liberarlo.",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos.",
        "result_title": "Ticket liberado",
        "event_description": "{{userTag}} libero el ticket #{{ticketId}}.",
        "result_description": "El ticket fue liberado. Cualquier miembro del staff puede reclamarlo ahora.{{warningLine}}",
        "warning_permissions": "Algunos permisos no pudieron restaurarse completamente.",
        "log_released_by": "Liberado por",
        "log_previous_claimer": "Anteriormente reclamado por"
      },
      "assign": {
        "closed_ticket": "No puedes asignar un ticket cerrado.",
        "staff_only": "Solo el staff puede asignar tickets.",
        "bot_denied": "No puedes asignar el ticket a un bot.",
        "creator_denied": "No puedes asignar el ticket al usuario que lo creo.",
        "staff_member_missing": "No pude encontrar a ese miembro del staff en este servidor.",
        "invalid_assignee": "Solo puedes asignar el ticket a miembros del staff (rol de soporte o administrador).",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para asignar tickets.",
        "assign_permissions_error": "Hubo un error al dar permisos al miembro del staff asignado: {{error}}",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos.",
        "dm_title": "Ticket asignado",
        "dm_description": "Se te asigno el ticket **#{{ticketId}}** en **{{guild}}**.\n\n**{{categoryLabel}}:** {{category}}\n**Usuario:** <@{{userId}}>\n**Canal:** [Ir al ticket]({{channelLink}})\n\nPor favor revisalo lo antes posible.",
        "event_description": "{{userTag}} asigno el ticket #{{ticketId}} a {{staffTag}}.",
        "result_title": "Ticket asignado",
        "result_description": "El ticket **#{{ticketId}}** fue asignado a <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        "dm_line": "\n\nSe notifico al miembro del staff por DM.",
        "dm_warning": "No se pudo notificar al miembro del staff por DM (DMs desactivados).",
        "log_assigned_to": "Asignado a",
        "log_assigned_by": "Asignado por"
      },
      "members": {
        "add": {
          "closed_ticket": "No puedes agregar usuarios a un ticket cerrado.",
          "bot_denied": "No puedes agregar bots al ticket.",
          "creator_denied": "Ese usuario ya es el creador del ticket.",
          "verify_permissions": "No pude verificar mis permisos en este servidor.",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para agregar usuarios.",
          "permissions_error": "Hubo un error al dar permisos al usuario: {{error}}",
          "event_title": "Usuario agregado",
          "event_description": "{{userTag}} agrego a {{targetTag}} al ticket #{{ticketId}}.",
          "result_title": "Usuario agregado",
          "result_description": "<@{{userId}}> fue agregado al ticket y ahora puede ver el canal."
        },
        "remove": {
          "closed_ticket": "No puedes quitar usuarios de un ticket cerrado.",
          "creator_denied": "No puedes quitar al creador del ticket.",
          "bot_denied": "No puedes quitar al bot del ticket.",
          "support_role_denied": "No puedes quitar el rol de soporte del ticket.",
          "admin_role_denied": "No puedes quitar el rol de administrador del ticket.",
          "verify_permissions": "No pude verificar mis permisos en este servidor.",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para quitar usuarios.",
          "permissions_error": "Hubo un error al quitar permisos al usuario: {{error}}",
          "event_title": "Usuario quitado",
          "event_description": "{{userTag}} quito a {{targetTag}} del ticket #{{ticketId}}.",
          "result_title": "Usuario quitado",
          "result_description": "<@{{userId}}> fue quitado del ticket y ya no puede verlo."
        },
        "move": {
          "closed_ticket": "No puedes mover un ticket cerrado.",
          "category_not_found": "Categoria no encontrada.",
          "already_in_category": "El ticket ya esta en esta categoria.",
          "verify_permissions": "No pude verificar mis permisos en este servidor.",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para mover tickets.",
          "database_error": "Hubo un error al actualizar la categoria del ticket en la base de datos.",
          "event_title": "Categoria actualizada",
          "event_description": "{{userTag}} movio el ticket #{{ticketId}} de {{from}} a {{to}}.",
          "log_previous": "Anterior",
          "log_new": "Nueva",
          "log_priority": "Prioridad actualizada",
          "result_title": "Categoria cambiada",
          "result_description": "Ticket movido de **{{from}}** -> **{{to}}**\n\n**Nueva prioridad:** {{priority}}"
        }
      }
    },
    "slash": {
      "description": "Gestiona tickets de soporte",
      "subcommands": {
        "open": {
          "description": "Abre un ticket nuevo"
        },
        "close": {
          "description": "Cierra el ticket actual"
        },
        "reopen": {
          "description": "Reabre el ticket actual"
        },
        "claim": {
          "description": "Reclama el ticket actual"
        },
        "unclaim": {
          "description": "Libera el ticket actual"
        },
        "assign": {
          "description": "Asigna el ticket actual a un miembro del staff"
        },
        "add": {
          "description": "Agrega un usuario al ticket actual"
        },
        "remove": {
          "description": "Quita un usuario del ticket actual"
        },
        "rename": {
          "description": "Renombra el canal del ticket actual"
        },
        "priority": {
          "description": "Cambia la prioridad del ticket"
        },
        "move": {
          "description": "Mueve el ticket a otra categor?a"
        },
        "transcript": {
          "description": "Genera la transcripci?n del ticket"
        },
        "brief": {
          "description": "Genera el resumen del caso para este ticket"
        },
        "info": {
          "description": "Muestra los detalles del ticket"
        },
        "history": {
          "description": "Muestra el historial de tickets de un miembro"
        }
      },
      "options": {
        "close_reason": "Motivo para cerrar el ticket",
        "assign_staff": "Miembro del staff que tendr? el ticket",
        "add_user": "Usuario que se agregar? al ticket",
        "remove_user": "Usuario que se quitar? del ticket",
        "rename_name": "Nuevo nombre del canal",
        "priority_level": "Nuevo nivel de prioridad",
        "history_user": "Miembro cuyo historial quieres revisar"
      },
      "groups": {
        "note": {
          "description": "Gestiona las notas internas del ticket",
          "subcommands": {
            "add": {
              "description": "Agrega una nota interna a este ticket"
            },
            "list": {
              "description": "Lista las notas internas de este ticket"
            },
            "clear": {
              "description": "Limpia todas las notas internas de este ticket"
            }
          },
          "options": {
            "note": "Contenido de la nota interna"
          }
        }
      },
      "choices": {
        "priority": {
          "low": "Baja",
          "normal": "Normal",
          "high": "Alta",
          "urgent": "Urgente"
        }
      }
    }
  },
  "ping": {
    "description": "Ver latencia y estadísticas del bot",
    "title": "PONG!",
    "field": {
      "latency": "Latencia del bot",
      "uptime": "Tiempo activo",
      "guilds": "Servidores",
      "users": "Usuarios",
      "channels": "Canales"
    }
  },
  "errors": {
    "language_permission": "Solo un administrador del servidor puede elegir el idioma de esta guild.",
    "language_save_failed": "No pude guardar el idioma del servidor. TON618 mantendrá inglés hasta que la configuración se complete correctamente.",
    "invalid_language_selection": "Esta selección de idioma ya no es válida. Usa `/setup language` para configurarlo manualmente."
  },
  "warn": {
    "slash": {
      "description": "Gestiona advertencias de miembros",
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
      },
      "options": {
        "user_warn": "Miembro al que advertir",
        "user_inspect": "Miembro cuyas advertencias quieres revisar",
        "reason": "Motivo de la advertencia",
        "id": "ID de la advertencia"
      }
    },
    "fields": {
      "user": "Usuario",
      "moderator": "Moderador",
      "reason": "Motivo",
      "total": "Advertencias totales",
      "list": "Advertencias"
    },
    "responses": {
      "add_title": "Advertencia agregada",
      "add_description": "Se registr? una advertencia para {{user}}.",
      "footer_id": "ID de advertencia: {{id}}",
      "auto_kick_success": "Acción autom?tica: el miembro fue expulsado al llegar a 5 advertencias.",
      "auto_kick_failed": "La acci?n autom?tica fall?: no pude expulsar al miembro al llegar a 5 advertencias.",
      "auto_timeout_success": "Acción autom?tica: el miembro fue silenciado durante 1 hora al llegar a 3 advertencias.",
      "auto_timeout_failed": "La acci?n autom?tica fall?: no pude silenciar al miembro al llegar a 3 advertencias.",
      "none_title": "Sin advertencias",
      "none_description": "{{user}} no tiene advertencias en este servidor.",
      "list_title": "Advertencias de {{user}}",
      "list_description": "Advertencias almacenadas: **{{count}}**.",
      "list_entry": "**{{index}}.** `{{id}}`\nMotivo: {{reason}}\nModerador: <@{{moderatorId}}>\nFecha: <t:{{timestamp}}:R>",
      "list_footer": "Usa `/warn remove` con el ID de la advertencia para eliminar un registro.",
      "remove_title": "Advertencia eliminada",
      "remove_description": "La advertencia `{{id}}` fue eliminada correctamente.",
      "not_found_title": "Advertencia no encontrada",
      "not_found_description": "No encontr? una advertencia con ID `{{id}}`."
    }
  },
  "modlogs": {
    "slash": {
      "description": "Configura los logs de moderaci?n",
      "subcommands": {
        "setup": {
          "description": "Activa los modlogs y define el canal principal"
        },
        "enabled": {
          "description": "Activa o desactiva el sistema de modlogs"
        },
        "channel": {
          "description": "Cambia el canal de modlogs"
        },
        "config": {
          "description": "Activa o desactiva un tipo de evento registrado"
        },
        "info": {
          "description": "Muestra la configuración actual de modlogs"
        }
      },
      "options": {
        "channel": "Canal de texto para logs de moderaci?n",
        "enabled": "Si la función debe quedar activa",
        "event": "Tipo de evento que quieres configurar",
        "event_enabled": "Si ese tipo de evento debe registrarse"
      },
      "choices": {
        "bans": "Baneos",
        "unbans": "Desbaneos",
        "kicks": "Expulsiones",
        "message_delete": "Mensajes eliminados",
        "message_edit": "Mensajes editados",
        "role_add": "Roles agregados",
        "role_remove": "Roles quitados",
        "nickname": "Cambios de apodo",
        "joins": "Entradas de miembros",
        "leaves": "Salidas de miembros"
      }
    },
    "events": {
      "bans": "Baneos",
      "unbans": "Desbaneos",
      "kicks": "Expulsiones",
      "message_delete": "Mensajes eliminados",
      "message_edit": "Mensajes editados",
      "role_add": "Roles agregados",
      "role_remove": "Roles quitados",
      "nickname": "Cambios de apodo",
      "joins": "Entradas de miembros",
      "leaves": "Salidas de miembros"
    },
    "fields": {
      "status": "Estado",
      "channel": "Canal"
    },
    "responses": {
      "setup_title": "Modlogs configurados",
      "setup_description": "Los logs de moderaci?n ahora se enviar?n a {{channel}}.",
      "channel_required": "Define primero un canal de modlogs antes de activar el sistema.",
      "enabled_state": "Los modlogs ahora están **{{state}}**.",
      "channel_updated": "Canal de modlogs actualizado a {{channel}}.",
      "event_state": "El registro de **{{event}}** ahora est? **{{state}}**.",
      "info_title": "Configuraci?n de modlogs"
    }
  },
  "config": {
    "slash": {
      "description": "Configuración y estado del servidor",
      "subcommands": {
        "status": {
          "description": "Ver configuración actual del servidor"
        },
        "tickets": {
          "description": "Ver configuración detallada del sistema de tickets"
        },
        "center": {
          "description": "Abrir centro de configuración interactivo"
        }
      }
    },
    "category": {
      "group_description": "Gestionar categorías de tickets",
      "add_description": "Agregar o vincular una categoría de tickets",
      "option_id": "ID de categoría desde config.js",
      "option_discord_category": "ID de categoría de Discord donde se crearán los tickets",
      "remove_description": "Eliminar una categoría de tickets",
      "remove_success_message": "**{{label}}** (`{{categoryId}}`) fue eliminada.\n\nLos tickets existentes no serán modificados.",
      "option_id_remove": "ID de categoría a eliminar",
      "list_description": "Listar todas las categorías de tickets configuradas",
      "edit_description": "Actualizar una categoría de tickets existente",
      "edit_success_message": "**{{label}}** fue actualizada exitosamente.\n\nID de categoría: `{{categoryId}}`\nDescripción: {{description}}\n{{emojiLine}}Prioridad: {{priority}}\n{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}Estado: {{status}}",
      "option_id_edit": "ID de categoría a editar",
      "option_label": "Etiqueta de visualización para la categoría",
      "option_description": "Descripción de la categoría",
      "option_emoji": "Emoji para la categoría",
      "option_priority": "Prioridad por defecto para tickets en esta categoría",
      "option_discord_category_edit": "ID de categoría de Discord",
      "option_ping_roles": "Roles a mencionar (IDs separados por comas)",
      "option_welcome_message": "Mensaje de bienvenida personalizado para esta categoría",
      "toggle_description": "Activar o desactivar una categoría de tickets",
      "option_id_toggle": "ID de categoría a alternar",
      "admin_only": "Solo los administradores pueden gestionar categorías de tickets.",
      "error_generic": "Ocurrió un error al procesar el comando: {{message}}",
      "error_not_found": "La categoría `{{categoryId}}` no se encontró en config.js.",
      "error_no_category": "No existe ninguna categoría con ID `{{categoryId}}`.",
      "error_remove_failed": "No se pudo eliminar la categoría.",
      "error_no_fields": "Debes proporcionar al menos un campo para editar.",
      "add_title": "Categoría configurada",
      "add_success_description": "**{{label}}** ahora está vinculada a una categoría de Discord.\n\nID de categoría: `{{categoryId}}`\nCategoría de Discord: `{{discordCategory}}`\n\nLos nuevos tickets creados para esta categoría se colocarán dentro de esa categoría de Discord.\n\nVerificación: {{verification}}",
      "add_verification_success": "Guardado exitosamente",
      "add_verification_failed": "Fallo al guardar",
      "remove_title": "Categoría eliminada",
      "list_title_empty": "No hay categorías de tickets configuradas",
      "list_description_empty": "Este servidor aún no tiene categorías de tickets configuradas.\n\nUsa `/config category add` para conectar una categoría de config.js a una categoría de Discord.",
      "list_title": "Categorías de tickets ({{count}}/25)",
      "list_status_enabled": "Activada",
      "list_status_disabled": "Desactivada",
      "list_extras_discord": "Categoría de Discord vinculada",
      "list_extras_ping_roles": "{{count}} rol(es) a mencionar",
      "list_extras_welcome": "Mensaje de bienvenida personalizado",
      "edit_title": "Categoría actualizada",
      "edit_emoji_line": "Emoji: {{emoji}}\n",
      "edit_discord_line": "Categoría de Discord: `{{discordCategory}}`\n",
      "edit_ping_line": "Roles a mencionar: {{count}}\n",
      "edit_welcome_line": "Mensaje de bienvenida personalizado: configurado\n",
      "toggle_title_enabled": "Categoría activada",
      "toggle_title_disabled": "Categoría desactivada",
      "toggle_description_enabled": "**{{label}}** fue activada.\n\nLos usuarios pueden seleccionar esta categoría nuevamente al abrir nuevos tickets.",
      "toggle_description_disabled": "**{{label}}** fue desactivada.\n\nLos usuarios ya no pueden seleccionar esta categoría al abrir nuevos tickets.",
      "footer": "TON618 Tickets - Gestión de Categorías"
    }
  },
  "menuActions": {
    "profile": {
      "title": "Perfil",
      "description": "Usa `/perfil ver` para ver tu perfil.\nUsa `/perfil top` para ver el ranking r?pido."
    },
    "config": {
      "admin_only": "Solo los administradores pueden usar la configuración r?pida.",
      "title": "Configuraci?n r?pida",
      "description": "Usa `/config center` para abrir el panel interactivo de control.\nSi necesitas algo más completo, usa `/setup`."
    },
    "help": {
      "title": "Ayuda r?pida",
      "description": "Comandos clave:\n- `/menu`\n- `/fun`\n- `/ticket open`\n- `/perfil ver`\n- `/staff my-tickets` (staff)\n- `/config status` (admin)\n- `/help`"
    }
  },
  "events": {
    "guildMemberAdd": {
      "anti_raid": {
        "title": "Anti-raid activado",
        "description": "Se detectaron **{{recentJoins}} entradas** en **{{seconds}}s**.\n?ltima entrada: **{{memberTag}}**",
        "fields": {
          "threshold": "Umbral",
          "action": "Acción"
        },
        "action_kick": "Expulsar automáticamente",
        "action_alert": "Solo alertar"
      },
      "welcome": {
        "default_title": "?Bienvenido!",
        "fields": {
          "user": "Usuario",
          "member_count": "Miembro #"
        }
      },
      "dm": {
        "title": "Bienvenido a {{guild}}",
        "fields": {
          "verification_required": "Verificación requerida",
          "verification_value": "Ve a {{channel}} para verificarte y acceder al servidor."
        }
      },
      "modlog": {
        "title": "Miembro entr?",
        "fields": {
          "user": "Usuario",
          "account_created": "Cuenta creada",
          "member_count": "Miembro #"
        },
        "footer": "ID: {{id}}"
      }
    },
    "guildMemberRemove": {
      "goodbye": {
        "default_title": "?Adi?s!",
        "default_message": "Lamentamos ver partir a **{user}**. Esperamos verte pronto otra vez.",
        "fields": {
          "user": "Usuario",
          "remaining_members": "Miembros restantes"
        },
        "remaining_members_value": "{{count}} miembros"
      },
      "modlog": {
        "title": "Miembro sali?",
        "fields": {
          "user": "Usuario",
          "joined_at": "Se uni?",
          "remaining_members": "Miembros restantes",
          "roles": "Roles"
        },
        "no_roles": "Ninguno",
        "unknown_join": "Desconocido",
        "footer": "ID: {{id}}"
      }
    },
    "guildMemberUpdate": {
      "unknown_executor": "Desconocido",
      "footer": "ID: {{id}}",
      "nickname": {
        "title": "Apodo actualizado",
        "fields": {
          "user": "Usuario",
          "before": "Antes",
          "after": "Despu?s",
          "executor": "Ejecutado por"
        }
      },
      "roles": {
        "title": "Roles actualizados",
        "fields": {
          "user": "Usuario",
          "added": "Roles agregados",
          "removed": "Roles quitados",
          "executor": "Ejecutado por"
        }
      }
    },
    "messageDelete": {
      "title": "Mensaje eliminado",
      "fields": {
        "author": "Autor",
        "channel": "Canal",
        "content": "Contenido"
      },
      "unknown_author": "Desconocido",
      "no_text": "*(sin texto)*",
      "footer": "ID del mensaje: {{id}}"
    }
  },
  "embeds": {
    "ticket": {
      "open": {
        "author": "Ticket #{{ticketId}} | {{category}}",
        "default_welcome": "?Hola <@{{userId}}>! Bienvenido a nuestro sistema de soporte. Un miembro del staff te atender? pronto.",
        "summary": "**Resumen de la solicitud:**\n- **Usuario:** <@{{userId}}>\n- **Categor?a:** {{category}}\n- **Prioridad:** {{priority}}\n- **Creado:** <t:{{createdAt}}:R>",
        "footer": "Usa los botones de abajo para gestionar este ticket",
        "question_fallback": "Pregunta {{index}}",
        "form_field": "Informaci?n del formulario"
      },
      "closed": {
        "title": "Ticket cerrado",
        "no_reason": "Sin motivo",
        "fields": {
          "ticket": "Ticket",
          "closed_by": "Cerrado por",
          "reason": "Motivo",
          "duration": "Duraci?n",
          "messages": "Mensajes"
        }
      },
      "reopened": {
        "title": "Ticket reabierto",
        "description": "<@{{userId}}> reabri? este ticket.\nUn miembro del staff retomar? la atenci?n pronto.",
        "fields": {
          "reopens": "Reaperturas"
        }
      },
      "info": {
        "title": "Ticket #{{ticketId}}",
        "status_open": "Abierto",
        "status_closed": "Cerrado",
        "first_response_value": "{{minutes}} min",
        "fields": {
          "creator": "Creador",
          "category": "Categor?a",
          "priority": "Prioridad",
          "status": "Estado",
          "messages": "Mensajes",
          "duration": "Duraci?n",
          "created": "Creado",
          "claimed_by": "Reclamado por",
          "assigned_to": "Asignado a",
          "subject": "Asunto",
          "first_response": "Primera respuesta",
          "reopens": "Reaperturas"
        }
      },
      "log": {
        "footer": "UID: {{userId}}",
        "fields": {
          "ticket": "Ticket",
          "by": "Por",
          "category": "Categor?a"
        },
        "actions": {
          "open": "Ticket abierto",
          "close": "Ticket cerrado",
          "reopen": "Ticket reabierto",
          "claim": "Ticket reclamado",
          "unclaim": "Ticket liberado",
          "assign": "Ticket asignado",
          "unassign": "Asignaci?n removida",
          "add": "Usuario agregado",
          "remove": "Usuario quitado",
          "transcript": "Transcripci?n generada",
          "rate": "Ticket calificado",
          "move": "Categor?a cambiada",
          "priority": "Prioridad cambiada",
          "edit": "Mensaje editado",
          "delete": "Mensaje eliminado",
          "sla": "Alerta SLA",
          "smartping": "Sin respuesta del staff",
          "autoclose": "Ticket auto-cerrado",
          "default": "Acción"
        }
      }
    }
  },
  "embed": {
    "slash": {
      "description": "✨ Constructor de embeds personalizados",
      "subcommands": {
        "crear": {
          "description": "Crear y enviar un embed con formulario interactivo"
        },
        "editar": {
          "description": "Editar un embed existente enviado por el bot"
        },
        "rapido": {
          "description": "Enviar un embed rápido con título y descripción"
        },
        "anuncio": {
          "description": "Plantilla de anuncio profesional"
        }
      },
      "options": {
        "canal": "Canal donde enviar el embed",
        "color": "Color HEX sin # (ej: 5865F2)",
        "imagen": "URL de imagen grande",
        "thumbnail": "URL de miniatura (arriba a la derecha)",
        "footer": "Texto del pie",
        "autor": "Texto del autor (arriba del todo)",
        "autor_icono": "URL del icono del autor",
        "timestamp": "Mostrar fecha y hora actual en el footer",
        "mencionar": "Mencionar a alguien o un rol junto al embed (ej: @Todos)",
        "mensaje_id": "ID del mensaje a editar",
        "titulo": "Título",
        "descripcion": "Descripción",
        "texto": "Contenido del anuncio"
      }
    },
    "errors": {
      "invalid_color": "Color inválido. Usa formato HEX de 6 caracteres sin `#` (ej: `5865F2`).",
      "invalid_image_url": "La URL de imagen debe empezar con `https://`.",
      "invalid_thumbnail_url": "La URL de thumbnail debe empezar con `https://`.",
      "channel_not_found": "El canal ya no existe.",
      "message_not_found": "No se encontró el mensaje. Verifica el ID y el canal.",
      "not_bot_message": "Solo puedo editar mensajes enviados por mí.",
      "no_embeds": "Ese mensaje no tiene embeds.",
      "form_expired": "❌ El formulario ha expirado. Ejecuta `/embed crear` de nuevo."
    },
    "modal": {
      "create_title": "✨ Crear Embed",
      "edit_title": "✏️ Editar Embed",
      "field_title_label": "Título (vacío = sin título)",
      "field_description_label": "Descripción",
      "field_description_placeholder": "Escribe el contenido del embed aquí...",
      "field_extra_label": "Campos extra (opcional) — formato: Nombre|Valor|inline",
      "field_extra_placeholder": "Nombre del campo|Valor del campo|true\nOtro campo|Otro valor|false",
      "field_color_label": "Color HEX sin # (ej: 5865F2)"
    },
    "success": {
      "sent": "Embed enviado en {{channel}}.",
      "announcement_sent": "Anuncio enviado en {{channel}}.",
      "edited": "Embed editado correctamente."
    },
    "footer": {
      "sent_by": "Enviado por {{username}}",
      "announcement": "{{guildName}} · Anuncio"
    }
  },
  "poll": {
    "slash": {
      "description": "Sistema de encuestas interactivas",
      "subcommands": {
        "crear": {
          "description": "Crear una nueva encuesta con hasta 10 opciones"
        },
        "finalizar": {
          "description": "Finalizar una encuesta antes de que termine"
        },
        "lista": {
          "description": "Ver encuestas activas en el servidor"
        }
      },
      "options": {
        "pregunta": "Pregunta de la encuesta",
        "opciones": "Opciones separadas por |, por ejemplo: Opcion A | Opcion B",
        "duracion": "Duración, por ejemplo: 1h, 30m, 2d, 1h30m",
        "multiple": "Permitir varios votos por usuario",
        "canal": "Canal donde publicar la encuesta",
        "id": "ID de la encuesta, últimos 6 caracteres"
      }
    },
    "errors": {
      "min_options": "Necesitas al menos 2 opciones separadas por `|`.",
      "max_options": "Máximo 10 opciones por encuesta.",
      "option_too_long": "Cada opción puede tener máximo 80 caracteres.",
      "min_duration": "Duración mínima: 1 minuto. Ejemplos: `30m`, `2h`, `1d`, `1h30m`.",
      "max_duration": "Duración máxima: 30 días.",
      "manage_messages_required": "Necesitas permiso de Gestionar Mensajes para finalizar encuestas.",
      "poll_not_found": "No se encontró la encuesta `{{id}}`. Usa `/poll lista` para ver las activas."
    },
    "embed": {
      "created_title": "Encuesta creada",
      "created_description": "Tu encuesta fue publicada en {{channel}}.",
      "field_question": "Pregunta",
      "field_options": "Opciones",
      "field_ends": "Termina",
      "field_in": "En",
      "field_mode": "Modo",
      "field_id": "ID",
      "mode_multiple": "Voto múltiple",
      "mode_single": "Un voto",
      "field_total_votes": "Total votos",
      "field_created_by": "Creada por",
      "status_ended": "Finalizada",
      "title_prefix": "📊",
      "title_ended_prefix": "📊 [FINALIZADA]",
      "footer_multiple": "Puedes votar por varias opciones",
      "footer_single": "Solo un voto por persona",
      "footer_ended": "Encuesta finalizada",
      "vote_singular": "voto",
      "vote_plural": "votos",
      "active_title": "Encuestas activas",
      "active_empty": "No hay encuestas activas en este momento.\nCrea una con `/poll crear`.",
      "active_count_title": "Encuestas activas ({{count}})",
      "active_footer": "Usa /poll finalizar [ID] para cerrar una manualmente",
      "active_channel_deleted": "Canal eliminado",
      "active_item_votes": "Votos"
    },
    "success": {
      "ended": "Encuesta **\"{{question}}\"** finalizada."
    },
    "placeholder": "Creando encuesta..."
  },
  "suggest": {
    "slash": {
      "description": "💡 Envía una sugerencia para el servidor"
    },
    "status": {
      "pending": "⏳ Pendiente",
      "approved": "✅ Aprobada",
      "rejected": "❌ Rechazada"
    },
    "emoji": {
      "pending": "⏳",
      "approved": "✅",
      "rejected": "❌"
    },
    "errors": {
      "system_disabled": "El sistema de sugerencias no está activado en este servidor.\nContacta a un administrador para activarlo.",
      "channel_not_configured": "No se encontró el canal de sugerencias configurado.\nContacta a un administrador.",
      "invalid_data": "Debes proporcionar al menos un título o descripción para tu sugerencia.",
      "already_reviewed": "Esta sugerencia ya fue revisada y no admite más votos.",
      "vote_error": "❌ Error al registrar tu voto.",
      "not_exists": "❌ Esta sugerencia ya no existe.",
      "manage_messages_required": "❌ Necesitas permisos de **Gestionar Mensajes** para revisar sugerencias.",
      "already_status": "❌ Esta sugerencia ya fue {{status}}.",
      "interaction_error": "❌ Interacción no válida.",
      "processing_error": "❌ Ocurrió un error al procesar la interacción."
    },
    "modal": {
      "title": "💡 Nueva Sugerencia",
      "field_title_label": "Título de la sugerencia",
      "field_title_placeholder": "Ej: Añadir un canal de música",
      "field_description_label": "Descripción detallada",
      "field_description_placeholder": "Explica tu idea con más detalle..."
    },
    "embed": {
      "title": "{{emoji}} Sugerencia #{{num}}",
      "no_description": "> (Sin descripción)",
      "field_author": "👤 Autor",
      "field_status": "📋 Estado",
      "field_submitted": "📅 Enviada",
      "field_votes": "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% aprobación",
      "footer_status": "Estado: {{status}}",
      "footer_reviewed": "Revisada por {{reviewer}} • {{status}}",
      "author_anonymous": "Anónimo",
      "field_staff_comment": "💬 Comentario del staff",
      "debate_title": "💬 Debate: Sugerencia #{{num}}",
      "debate_footer": "Usa este hilo para discutir esta sugerencia"
    },
    "buttons": {
      "vote_up": "👍 Votar a Favor",
      "vote_down": "👎 Votar en Contra",
      "approve": "✅ Aprobar",
      "reject": "❌ Rechazar"
    },
    "success": {
      "submitted_title": "✅ Sugerencia Enviada",
      "submitted_description": "Tu sugerencia **#{{num}}** ha sido publicada en {{channel}}.",
      "submitted_footer": "¡Gracias por tu aporte!",
      "vote_registered": "✅ Tu voto ha sido registrado. ({{emoji}})",
      "status_updated": "✅ Sugerencia **#{{num}}** marcada como **{{status}}**."
    },
    "cooldown": {
      "title": "⏱️ Cooldown Activo",
      "description": "Debes esperar **{{minutes}} minutos** antes de enviar otra sugerencia."
    },
    "dm": {
      "title_approved": "✅ Tu sugerencia fue Aprobada",
      "title_rejected": "❌ Tu sugerencia fue Rechazada",
      "description": "Tu sugerencia **#{{num}}** en **{{guildName}}** fue revisada.",
      "field_suggestion": "📝 Tu sugerencia"
    },
    "placeholder": "⏳ Creando sugerencia..."
  },
  "profile": {
    "slash": {
      "description": "Perfil ultra simple: nivel + economía",
      "subcommands": {
        "ver": {
          "description": "Ver tu perfil o el de otro usuario"
        },
        "top": {
          "description": "Ver top rápido de niveles y economía"
        }
      },
      "options": {
        "usuario": "Usuario a consultar"
      }
    },
    "embed": {
      "title": "Perfil de {{username}}",
      "field_level": "Nivel",
      "field_total_xp": "XP Total",
      "field_rank": "Rango",
      "field_wallet": "Wallet",
      "field_bank": "Banco",
      "field_total": "Total",
      "top_title": "Top Rápido",
      "top_levels": "Top Niveles",
      "top_economy": "Top Economía",
      "no_data": "Sin datos",
      "level_format": "Nv {{level}}",
      "coins_format": "{{amount}} monedas",
      "user_fallback": "Usuario {{id}}"
    }
  }
};
