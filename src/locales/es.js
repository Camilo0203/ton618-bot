module.exports = {
  "common": {
    "yes": "Sí",
    "no": "No",
    "enabled": "Activado",
    "disabled": "Desactivado",
    "on": "Encendido",
    "off": "Apagado",
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
      "notes": "Notas",
      "error": "Error"
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
    },
    "buttons": {
      "enter_code": "Ingresar Código",
      "resend_code": "Reenviar Código",
      "english": "Inglés",
      "spanish": "Español"
    },
    "errors": {
      "bot_missing_permissions": "El bot no tiene los siguientes permisos para realizar esta acción: {{permissions}}."
    },
    "all": "Todos",
    "none": "Ninguno",
    "no_reason": "Sin razón",
    "open": "Abierto",
    "closed": "Cerrado",
    "footer": {
      "tickets": "Tickets de TON618"
    },
    "setup_hint": {
      "run_setup": "Usa `/setup wizard` para comenzar a configurar el bot."
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
    "unexpected": "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador.",
    "tag_delete": {
      "success": "✅ El tag **{{name}}** ha sido eliminado.",
      "error": "Ocurrió un error al eliminar el tag.",
      "cancelled": "❌ Eliminación cancelada."
    },
    "dashboard_refresh": {
      "success": "✅ ¡Panel de control actualizado! Las estadísticas se han refrescado con éxito."
    },
    "shutdown": {
      "rebooting": "⚠️ El bot se está reiniciando. Por favor intenta en unos segundos."
    }
  },
  "serverstats": {
    "overview": {
      "title": "📊 Vista General: {{server}}",
      "members": "👥 Miembros",
      "members_value": "**Total:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}\n**Online:** {{online}}",
      "channels": "📝 Canales",
      "channels_value": "**Total:** {{total}}\n**Texto:** {{text}}\n**Voz:** {{voice}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Más alto:** {{highest}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Estáticos:** {{static}}\n**Animados:** {{animated}}",
      "info": "ℹ️ Información",
      "info_value": "**Dueño:** {{owner}}\n**Creado:** {{created}}\n**Nivel Boost:** {{boostLevel}}",
      "boosts": "✨ Boosts",
      "boosts_value": "**Boosts Totales:** {{count}}\n**Boosters:** {{boosters}}",
      "footer": "ID del Servidor: {{id}}"
    },
    "members": {
      "title": "👥 Estadísticas de Miembros - {{period}}",
      "current_stats": "📈 Estado Actual",
      "current_stats_value": "**Miembros Totales:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}",
      "new_members": "🆕 Miembros Nuevos",
      "new_members_value": "**Unidos:** {{count}}\n**Promedio/Día:** {{avg}}",
      "growth": "📊 Crecimiento",
      "growth_value": "**Cambio:** {{change}}\n**Porcentaje:** {{percent}}%",
      "period_footer": "Periodo: {{period}}"
    },
    "activity": {
      "title": "📊 Estadísticas de Actividad - {{period}}",
      "messages": "💬 Mensajes",
      "messages_value": "**Total:** {{total}}\n**Promedio/Día:** {{avg}}",
      "top_channels": "🔥 Canales Principales",
      "top_channels_value": "{{num}}. <#{{channelId}}> - {{count}} msgs",
      "top_users": "⭐ Usuarios más Activos",
      "top_users_value": "{{num}}. <@{{userId}}> - {{count}} msgs",
      "peak_hour": "⏰ Hora Pico",
      "peak_hour_value": "**{{hour}}:00 - {{next}}:00** con {{count}} mensajes"
    },
    "growth": {
      "title": "📈 Estadísticas de Crecimiento",
      "stats_30d": "📊 Crecimiento (30 días)",
      "stats_30d_value": "**Cambio Total:** {{change}}\n**Porcentaje:** {{percent}}%\n**Inicio:** {{start}}\n**Actual:** {{current}}",
      "trend": "📅 Tendencia Reciente",
      "trend_value": "**Promedio Diario:** {{avg}}\n**Proyectado (30d):** {{projected}}",
      "footer": "Basado en los últimos 30 días de datos"
    },
    "support": {
      "title": "🎫 Estadísticas de Soporte - {{period}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Abiertos:** {{open}}\n**Cerrados:** {{closed}}",
      "times": "⏱️ Tiempos de Respuesta",
      "times_value": "**Promedio Respuesta:** {{avgResponse}}\n**Promedio Resolución:** {{avgResolution}}",
      "top_staff": "⭐ Staff Destacado (Histórico)",
      "top_staff_value": "{{num}}. <@{{userId}}> - {{count}} tickets"
    },
    "channels": {
      "title": "📝 Actividad por Canal - {{period}}",
      "channel_entry": "**{{num}}.** <#{{channelId}}>\n└ {{count}} mensajes",
      "footer": "Periodo: {{period}} | Top 10 canales"
    },
    "roles": {
      "title": "🎭 Distribución de Roles",
      "role_entry": "**{{num}}.** {{role}}\n└ {{count}} miembros ({{percent}}%)",
      "footer": "Total de roles: {{total}} | Mostrando top 15"
    },
    "periods": {
      "day": "Hoy",
      "week": "Esta Semana",
      "month": "Este Mes",
      "all": "Histórico"
    },
    "errors": {
      "overview_failed": "No se pudo obtener la vista general del servidor.",
      "members_failed": "No se pudieron obtener las estadísticas de miembros.",
      "activity_failed": "No se pudieron obtener las estadísticas de actividad.",
      "growth_failed": "No se pudieron obtener las estadísticas de crecimiento.",
      "support_failed": "No se pudieron obtener las estadísticas de soporte.",
      "channels_failed": "No se pudieron obtener las estadísticas de canales.",
      "roles_failed": "No se pudieron obtener las estadísticas de roles.",
      "no_data": "No hay datos de {{type}} disponibles para analizar.",
      "no_activity": "No se registró actividad de mensajes durante este periodo."
    }
  },
  "autorole": {
    "list": {
      "title": "✨ Configuraciones de Auto-Role",
      "join_role": "📥 Rol de Entrada",
      "join_role_value": "**Rol:** {{role}}\n**Espera:** {{delay}}s\n**Excluir Bots:** {{excludeBots}}",
      "reaction_roles": "🔘 Roles por Reacción",
      "message": "Mensaje",
      "level_roles": "📈 Recompensas de Nivel (Modo: {{mode}})",
      "level_entry": "**Nivel {{level}}:** <@&{{roleId}}>"
    },
    "panel": {
      "title": "Selección de Roles",
      "description": "Selecciona los roles que deseas reaccionando debajo.",
      "footer": "Roles por Reacción de TON618"
    },
    "success": {
      "reaction_added": "✅ Rol por reacción añadido: {{emoji}} → {{role}}",
      "reaction_removed": "✅ Rol por reacción eliminado para el emoji {{emoji}}",
      "panel_created": "✅ Panel de roles creado en {{channel}} (ID: {{messageId}})",
      "join_set": "✅ Rol de entrada establecido en {{role}} con {{delay}}s de espera (Excluir Bots: {{excludeBots}})",
      "join_removed": "✅ El rol de entrada ha sido desactivado.",
      "level_added": "✅ Recompensa de nivel {{level}} establecida en {{role}}.",
      "level_removed": "✅ Recompensa de nivel {{level}} eliminada.",
      "mode_set": "✅ El modo de roles por nivel se estableció en **{{mode}}**."
    },
    "errors": {
      "message_not_found": "No se pudo encontrar el mensaje especificado en este canal.",
      "role_hierarchy": "No puedo asignar este rol porque está por encima de mi rol más alto.",
      "add_failed": "Error al añadir la recompensa de rol por reacción.",
      "remove_failed": "Error al eliminar la recompensa de rol por reacción.",
      "not_found": "No se encontró ninguna configuración de rol por reacción para estos datos.",
      "panel_failed": "Error al crear el panel de roles por reacción.",
      "join_set_failed": "Error al configurar el rol de entrada.",
      "join_remove_failed": "Error al desactivar el rol de entrada.",
      "level_add_failed": "Error al añadir la recompensa de nivel.",
      "level_remove_failed": "Error al eliminar la recompensa de nivel.",
      "list_failed": "Error al obtener la lista de auto-roles.",
      "no_level_roles": "No hay recompensas de nivel configuradas.",
      "no_autoroles": "No se encontraron configuraciones de auto-role para este servidor."
    }
  },
  "embed": {
    "modal": {
      "create_title": "Constructor de Embeds",
      "edit_title": "Editar Embed",
      "field_title_label": "Título del Embed",
      "field_description_label": "Descripción Principal",
      "field_description_placeholder": "Contenido de tu embed...",
      "field_extra_label": "Campos Extra (Nombre|Valor|inline)",
      "field_extra_placeholder": "Campo 1|Valor 1|true\nCampo 2|Valor 2|false",
      "field_color_label": "Color HEX (ej. 5865F2)",
      "field_extra_fallback_name": "Campo"
    },
    "footer": {
      "sent_by": "Enviado por {{username}}",
      "announcement": "Anuncio Oficial | {{guildName}}"
    },
    "announcement_prefix": "📢 ",
    "success": {
      "sent": "✅ Embed enviado correctamente a {{channel}}.",
      "edited": "✅ Embed actualizado correctamente.",
      "template_saved": "✅ Plantilla **{{name}}** guardada con éxito.",
      "template_deleted": "✅ Plantilla **{{name}}** eliminada.",
      "announcement_sent": "📢 Anuncio enviado a {{channel}}."
    },
    "errors": {
      "invalid_color": "Formato de color HEX inválido.",
      "invalid_image_url": "La URL de la imagen debe empezar por http o https.",
      "invalid_thumbnail_url": "La URL de la miniatura debe empezar por http o https.",
      "template_exists": "Ya existe una plantilla con el nombre **{{name}}**.",
      "template_not_found": "No se encontró la plantilla **{{name}}**.",
      "message_not_found": "No se pudo encontrar el mensaje para editar.",
      "not_bot_message": "Solo puedo editar embeds que fueron enviados originalmente por mí.",
      "no_embeds": "El mensaje especificado no contiene ningún embed.",
      "form_expired": "El formulario interactivo ha expirado. Por favor, ejecuta el comando de nuevo.",
      "channel_not_found": "No se pudo encontrar el canal de destino.",
      "pro_required": "✨ **Función Pro**: La gestión de plantillas requiere una suscripción Pro."
    },
    "templates": {
      "no_templates": "Aún no se han guardado plantillas de embed.",
      "list_title": "✨ Plantillas de {{guildName}}",
      "footer": "{{count}}/{{max}} plantillas utilizadas"
    }
  },
  "onboarding": {
    "title": "Welcome to TON618 / Bienvenido a TON618",
    "description": "Please choose the primary language for this server / Por favor elige el idioma principal de este servidor.",
    "body": "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    "footer": "If no language is selected, TON618 will default to English.",
    "posted_title": "Onboarding de idioma enviado",
    "posted_description": "Se ha enviado el selector de idioma para este servidor. TON618 utilizará el inglés hasta que un administrador elija un idioma.",
    "confirm_title": "Idioma del servidor actualizado",
    "confirm_description": "TON618 ahora operará en **{{label}}** dentro de este servidor.",
    "dm_fallback_subject": "Configuración de idioma de TON618",
    "dm_fallback_intro": "No he podido publicar el mensaje de bienvenida en un canal con permisos de escritura, por lo que te lo envío por aquí.",
    "delivery_failed": "TON618 se ha unido al servidor, pero no he podido entregar el selector de idioma ni en un canal público ni por mensaje directo."
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
      "transcripts_description": "Establecer el canal para las transcripciones de los tickets",
      "dashboard_description": "Establecer el canal del panel de control de tickets",
      "weekly_report_description": "Establecer el canal para los reportes semanales de actividad",
      "live_members_description": "Establecer el canal de voz para el contador de miembros en vivo",
      "live_role_description": "Establecer el canal de voz para el contador de roles específicos en vivo",
      "staff_role_description": "Establecer el rol de personal de soporte (Staff)",
      "admin_role_description": "Establecer el rol de administrador del bot",
      "verify_role_description": "Establecer el rol de usuario verificado",
      "max_tickets_description": "Establecer el máximo de tickets simultáneos por usuario",
      "global_limit_description": "Establecer el límite global de tickets abiertos en el servidor",
      "cooldown_description": "Establecer el tiempo de espera entre la creación de tickets",
      "min_days_description": "Establecer la antigüedad mínima de la cuenta (en días) para abrir tickets",
      "smart_ping_description": "Configurar los ajustes del sistema de aviso inteligente (Smart Ping)",
      "dm_open_description": "Configurar el mensaje directo (DM) enviado al abrir un ticket",
      "dm_close_description": "Configurar el mensaje directo (DM) enviado al cerrar un ticket",
      "log_edits_description": "Configurar el registro de ediciones de mensajes en los canales de tickets",
      "log_deletes_description": "Configurar el registro de eliminaciones de mensajes en los canales de tickets",
      "option_channel": "Canal de texto",
      "option_voice_channel": "Canal de voz",
      "option_role": "Rol de servidor",
      "option_role_to_count": "Rol que se desea contabilizar",
      "option_verify_role": "Rol de verificación (dejar vacío para desactivar)",
      "option_count": "Cantidad numérica",
      "option_minutes": "Minutos de espera",
      "option_days": "Días de antigüedad",
      "auto_close_description": "Configurar el cierre automático de tickets inactivos",
      "sla_description": "Configurar los umbrales de advertencia y escalado de SLA"
    },
    "language": {
      "title": "Idioma del servidor",
      "description": "Revisa o actualiza el idioma operativo que TON618 utiliza en este servidor.",
      "current_value": "TON618 está operando actualmente en **{{label}}**.",
      "onboarding_completed": "Completado",
      "onboarding_pending": "Pendiente",
      "updated_value": "Idioma cambiado a **{{label}}**. TON618 utilizará este idioma para todas las respuestas visibles en este servidor.",
      "fallback_note": "Los servidores sin una selección explícita continuarán usando inglés hasta que un administrador configure un nuevo idioma.",
      "audit_reason_manual": "Cambio manual de idioma",
      "audit_reason_onboarding": "Selección de idioma durante el onboarding"
    },
    "suggestions": {
      "group_description": "Configura el sistema de sugerencias",
      "enabled_description": "Activa o desactiva las sugerencias",
      "channel_description": "Establece el canal utilizado para las sugerencias"
    },
    "confessions": {
      "group_description": "Configura las confesiones anónimas",
      "configure_description": "Establece el canal y el rol utilizados para las confesiones"
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
      "enabled_success": "Comando `/{{command}}` habilitado de nuevo.",
      "group_description": "Gestiona qué comandos están disponibles en este servidor",
      "disable_description": "Desactiva un comando en este servidor",
      "enable_description": "Vuelve a activar un comando previamente desactivado",
      "status_description": "Comprueba un comando o ve el resumen actual",
      "reset_description": "Vuelve a activar todos los comandos desactivados",
      "list_description": "Lista los comandos actualmente desactivados en este servidor",
      "panel_description": "Abre el panel de control interactivo de comandos"
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
      "test_sent": "Mensaje de prueba de bienvenida enviado a {{channel}}.",
      "group_description": "Configura los mensajes de bienvenida y avisos de incorporación",
      "enabled_description": "Activa o desactiva los mensajes de bienvenida",
      "channel_description": "Establece el canal utilizado para los mensajes de bienvenida",
      "message_description": "Actualiza el mensaje de bienvenida",
      "title_description": "Actualiza el título del embed de bienvenida",
      "color_description": "Establece el color del embed de bienvenida (hex)",
      "footer_description": "Actualiza el pie de página del embed de bienvenida",
      "banner_description": "Establece o borra la imagen del banner de bienvenida",
      "avatar_description": "Muestra u oculta el avatar del nuevo miembro",
      "dm_description": "Configura el mensaje directo de bienvenida",
      "autorole_description": "Establece el rol asignado automáticamente al unirse",
      "test_description": "Envía un mensaje de bienvenida de prueba"
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
      "test_sent": "Mensaje de prueba de despedida enviado a {{channel}}.",
      "group_description": "Configura los mensajes de despedida",
      "enabled_description": "Activa o desactiva los mensajes de despedida",
      "channel_description": "Establece el canal utilizado para los mensajes de despedida",
      "message_description": "Actualiza el mensaje de despedida",
      "title_description": "Actualiza el título del embed de despedida",
      "color_description": "Establece el color del embed de despedida (hex)",
      "footer_description": "Actualiza el pie de página del embed de despedida",
      "avatar_description": "Muestra u oculta el avatar del miembro que sale",
      "test_description": "Envía un mensaje de despedida de prueba"
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
            "sla_escalation": "Escalada",
            "style_buttons": "Botones",
            "style_select": "Menú desplegable",
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
    },
    "wizard": {
      "description": "Iniciar el asistente de configuración rápida del servidor",
      "option_dashboard": "Canal para el panel de control (Dashboard) de tickets",
      "option_logs": "Canal para los registros (Logs) de actividad de tickets",
      "option_transcripts": "Canal para el almacenamiento de transcripciones de tickets",
      "option_staff": "Rol asignado al personal de soporte (Staff)",
      "option_admin": "Rol asignado a los administradores del bot",
      "option_plan": "Plan de operación inicial del servidor",
      "option_sla_warning": "Minutos de espera antes de la primera advertencia de SLA",
      "option_sla_escalation": "Minutos de espera antes de proceder con la escalada de SLA",
      "option_publish_panel": "Publicar el panel de creación de tickets inmediatamente"
    },
    "options": {
      "setup_language_value_value": "Idioma que utilizará el bot para las respuestas visibles en este servidor",
      "setup_wizard_dashboard_dashboard": "Define el canal principal para el panel de control de tickets",
      "setup_wizard_logs_logs": "Define el canal para los registros de tickets (opcional)",
      "setup_wizard_transcripts_transcripts": "Define el canal para las transcripciones de tickets (opcional)",
      "setup_wizard_staff_staff": "Define el rol para el personal de soporte (Staff - opcional)",
      "setup_wizard_admin_admin": "Define el rol para el administrador del bot (opcional)",
      "setup_wizard_plan_plan": "Selecciona el plan inicial de operación del servidor",
      "setup_wizard_sla-warning-minutes_sla-warning-minutes": "Umbral de minutos antes de la primera advertencia base de SLA",
      "setup_wizard_sla-escalation-minutes_sla-escalation-minutes": "Umbral de minutos antes de la escalada base de SLA",
      "setup_wizard_publish-panel_publish-panel": "Si el panel de creación de tickets debe publicarse inmediatamente",
      "setup_general_logs_channel_channel": "Selecciona el canal de texto para los registros (Logs)",
      "setup_general_transcripts_channel_channel": "Selecciona el canal para las transcripciones",
      "setup_general_dashboard_channel_channel": "Selecciona el canal para el panel de control (Dashboard)",
      "setup_general_weekly-report_channel_channel": "Selecciona el canal para los reportes semanales",
      "setup_general_live-members_channel_channel": "Selecciona el canal de voz para el contador de miembros",
      "setup_general_live-role_channel_channel": "Selecciona el canal de voz para el contador de roles",
      "setup_general_live-role_role_role": "Selecciona el rol que deseas contabilizar",
      "setup_general_staff-role_role_role": "Selecciona el rol para el personal de soporte (Staff)",
      "setup_general_admin-role_role_role": "Selecciona el rol para la administración del bot",
      "setup_general_verify-role_role_role": "Selecciona el rol para usuarios verificados (dejar vacío para desactivar)",
      "setup_general_max-tickets_count_count": "Número máximo de tickets permitidos por usuario",
      "setup_general_global-limit_count_count": "Número máximo de tickets abiertos permitidos en el servidor",
      "setup_general_cooldown_minutes_minutes": "Tiempo de espera (en minutos) entre la creación de tickets",
      "setup_general_min-days_days_days": "Días de antigüedad mínima requeridos para la cuenta del usuario",
      "setup_general_auto-close_minutes_minutes": "Minutos de inactividad antes del cierre automático del ticket",
      "setup_general_sla_minutes_minutes": "Minutos antes de activar la alerta de cumplimiento de SLA",
      "setup_general_smart-ping_minutes_minutes": "Minutos antes de realizar un aviso (Smart Ping) de recordatorio",
      "setup_general_dm-open_enabled_enabled": "Si se debe enviar un mensaje directo al usuario al abrir un ticket",
      "setup_general_dm-close_enabled_enabled": "Si se debe enviar un mensaje directo al usuario al cerrar un ticket",
      "setup_general_log-edits_enabled_enabled": "Si se deben registrar las ediciones de mensajes en los canales de tickets",
      "setup_general_log-deletes_enabled_enabled": "Si se deben registrar las eliminaciones de mensajes en los canales de tickets",
      "setup_general_language_value_value": "Idioma que utilizará el bot para las respuestas visibles en este servidor",
      "setup_automod_channel-alert_channel_channel": "Define el canal para recibir alertas del sistema AutoMod",
      "setup_automod_channel-alert_clear_clear": "Permite limpiar el canal de alertas actualmente configurado",
      "setup_automod_exempt-channel_action_action": "Acción a realizar en el canal seleccionado",
      "setup_automod_exempt-channel_channel_channel": "Selecciona el canal que deseas exentar de AutoMod",
      "setup_automod_exempt-role_action_action": "Acción a realizar en el rol seleccionado",
      "setup_automod_exempt-role_role_role": "Selecciona el rol que deseas exentar de AutoMod",
      "setup_automod_preset_name_name": "Nombre descriptivo del preset de protección",
      "setup_automod_preset_enabled_enabled": "Si deseas activar o desactivar este preset de protección",
      "setup_tickets_sla_warning-minutes_warning-minutes": "Umbral de minutos antes de la advertencia base de SLA",
      "setup_tickets_sla_escalation-enabled_escalation-enabled": "Determina si el sistema de escalado está activo",
      "setup_tickets_sla_escalation-minutes_escalation-minutes": "Umbral de minutos antes de proceder al escalado de SLA",
      "setup_tickets_sla_escalation-role_escalation-role": "Rol al que se le notificará (mención) durante la escalada",
      "setup_tickets_sla_escalation-channel_escalation-channel": "Canal donde se publicarán las alertas de escalada de SLA",
      "setup_tickets_sla-rule_type_type": "Tipo de regla SLA que deseas configurar",
      "setup_tickets_sla-rule_minutes_minutes": "Umbral de minutos para la aplicación de esta regla",
      "setup_tickets_sla-rule_priority_priority": "Prioridad sobre la cual se aplicará esta regla",
      "setup_tickets_sla-rule_category_category": "Categoría sobre la cual se aplicará esta regla",
      "setup_tickets_auto-assignment_active_active": "Si la asignación automática de personal debe estar activa",
      "setup_tickets_auto-assignment_require-online_require-online": "Si solo el personal en línea puede recibir asignaciones",
      "setup_tickets_auto-assignment_respect-away_respect-away": "Si el sistema debe respetar el estado ausente (Away/DND) del personal",
      "setup_tickets_incident_active_active": "Si el modo de incidente (pausa de creación) debe estar activo",
      "setup_tickets_incident_categories_categories": "IDs de categorías afectadas por el modo incidente (separados por comas)",
      "setup_tickets_incident_message_message": "Mensaje personalizado que verán los usuarios durante el modo incidente",
      "setup_tickets_daily-report_active_active": "Si se deben generar reportes diarios de actividad",
      "setup_tickets_daily-report_channel_channel": "Canal donde se publicará el reporte diario de actividad",
      "setup_tickets_panel-style_title_title": "Define el título que tendrá el embed del panel de creación",
      "setup_tickets_panel-style_description_description": "Define el contenido descriptivo del embed del panel de creación",
      "setup_tickets_panel-style_footer_footer": "Define el texto del pie de página del embed del panel de creación",
      "setup_tickets_panel-style_color_color": "Define el color del embed del panel de creación (formato Hex)",
      "setup_tickets_panel-style_reset_reset": "Permite restablecer el estilo del panel al valor predeterminado",
      "setup_tickets_welcome-message_message_message": "Contenido del mensaje de bienvenida para tickets nuevos",
      "setup_tickets_welcome-message_reset_reset": "Permite restablecer el mensaje de bienvenida al valor predeterminado",
      "setup_tickets_control-embed_title_title": "Define el título que tendrá el embed de control del ticket",
      "setup_tickets_control-embed_description_description": "Define el contenido del embed de control del ticket",
      "setup_tickets_control-embed_footer_footer": "Define el texto del pie de página del embed de control del ticket",
      "setup_tickets_control-embed_color_color": "Define el color del embed de control del ticket (formato Hex)",
      "setup_tickets_control-embed_reset_reset": "Permite restablecer el embed de control al valor predeterminado",
      "setup_suggestions_enabled_enabled_enabled": "Si el sistema de sugerencias debe mantenerse habilitado",
      "setup_suggestions_channel_channel_channel": "Define el canal donde se publicarán las sugerencias",
      "setup_confessions_configure_channel_channel": "Define el canal donde se publicarán las confesiones",
      "setup_confessions_configure_role_role": "Define el rol requerido para poder utilizar las confesiones",
      "setup_welcome_enabled_enabled_enabled": "Si los mensajes de bienvenida deben mantenerse habilitados",
      "setup_welcome_channel_channel_channel": "Define el canal donde se enviarán los mensajes de bienvenida",
      "setup_welcome_message_text_text": "Define el contenido del mensaje de bienvenida",
      "setup_welcome_title_text_text": "Define el título que tendrá el embed de bienvenida",
      "setup_welcome_color_hex_hex": "Define el color hexadecimal del embed (sin incluir #)",
      "setup_welcome_footer_text_text": "Define el texto del pie de página del embed de bienvenida",
      "setup_welcome_banner_url_url": "URL de la imagen de banner (debe comenzar con https://)",
      "setup_welcome_avatar_show_show": "Determina si se debe mostrar el avatar del usuario en el mensaje",
      "setup_welcome_dm_enabled_enabled": "Si se debe enviar un mensaje directo de bienvenida al unirse",
      "setup_welcome_dm_message_message": "Diseño del MD de bienvenida. Variables: `{mention}` `{usuario}` `{tag}` `{server}` `{cantidad}` `{id}`",
      "setup_welcome_autorole_role_role": "Selecciona el rol para asignación automática (dejar vacío para deshabilitar)",
      "setup_goodbye_enabled_enabled_enabled": "Si los mensajes de despedida deben mantenerse habilitados",
      "setup_goodbye_channel_channel_channel": "Define el canal donde se enviarán los mensajes de despedida",
      "setup_goodbye_message_text_text": "Define el contenido del mensaje de despedida",
      "setup_goodbye_title_text_text": "Define el título que tendrá el embed de despedida",
      "setup_goodbye_color_hex_hex": "Define el color hexadecimal del embed (sin incluir #)",
      "setup_goodbye_footer_text_text": "Define el texto del pie de página del embed de despedida",
      "setup_goodbye_avatar_show_show": "Determina si se debe mostrar el avatar del usuario en el mensaje",
      "setup_commands_disable_command_command": "Nombre del comando que deseas deshabilitar (sin /)",
      "setup_commands_enable_command_command": "Nombre del comando que deseas habilitar de nuevo (sin /)",
      "setup_commands_status_command_command": "Nombre del comando que deseas consultar (sin /)"
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
      "bot_missing_permissions": "El bot no tiene permisos suficientes para verificarte (Gestionar Roles).",
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
      "info": "Información"
    },
    "options": {
      "verify_setup_channel_channel": "Canal de verificación",
      "verify_setup_verified_role_verified_role": "Rol otorgado tras la verificación",
      "verify_setup_mode_mode": "Modo de verificación a usar",
      "verify_setup_unverified_role_unverified_role": "Rol asignado antes de la verificación",
      "verify_enabled_enabled_enabled": "Si la función permanece habilitada",
      "verify_mode_type_type": "Modo de verificación al que cambiar",
      "verify_question_prompt_prompt": "Mensaje o pregunta de verificación",
      "verify_question_answer_answer": "Respuesta esperada",
      "verify_message_title_title": "Título del panel",
      "verify_message_description_description": "Descripción del panel",
      "verify_message_color_color": "Color del embed en hex sin `#`",
      "verify_message_image_image": "URL de la imagen para el panel",
      "verify_dm_enabled_enabled": "Si los MD de confirmación permanecen habilitados",
      "verify_auto-kick_hours_hours": "Horas de espera antes de expulsar automáticamente a miembros no verificados",
      "verify_anti-raid_enabled_enabled": "Si la protección anti-raid permanece habilitada",
      "verify_anti-raid_joins_joins": "Umbral de entradas antes de que el anti-raid se active",
      "verify_anti-raid_seconds_seconds": "Ventana de detección en segundos",
      "verify_anti-raid_action_action": "Acción a tomar cuando el anti-raid se active",
      "verify_logs_channel_channel": "Canal usado para los registros de verificación",
      "verify_force_user_user": "Miembro a verificar manualmente",
      "verify_unverify_user_user": "Miembro a desverificar manualmente",
      "verify_question-pool_add_question_question": "Texto de la pregunta",
      "verify_question-pool_add_answer_answer": "Respuesta esperada",
      "verify_question-pool_remove_index_index": "Número de elemento del pool para eliminar",
      "verify_security_min_account_age_min_account_age": "Edad mínima de cuenta en días",
      "verify_security_risk_escalation_risk_escalation": "Si las cuentas de riesgo deberían enfrentar verificaciones más estrictas",
      "verify_security_captcha_type_captcha_type": "Tipo de CAPTCHA requerido"
    }
  },
  "staff": {
    "slash": {
      "description": "Operaciones de staff y comandos de moderación",
      "subcommands": {
        "away_on": {
          "description": "Establecer tu estado como ausente (no recibirás auto-asignaciones)"
        },
        "away_off": {
          "description": "Establecer tu estado como en línea"
        },
        "my_tickets": {
          "description": "Ver tus tickets actualmente asignados o reclamados"
        },
        "warn_add": {
          "description": "Añadir una advertencia a un usuario"
        },
        "warn_check": {
          "description": "Consultar las advertencias de un usuario"
        },
        "warn_remove": {
          "description": "Eliminar una advertencia específica por ID"
        }
      },
      "options": {
        "reason": "Razón de la ausencia",
        "user": "El usuario a moderar",
        "warn_reason": "Razón de la advertencia",
        "warning_id": "El ID de la advertencia a eliminar"
      }
    }
  },
  "stats": {
    "title": "Estadísticas del Servidor",
    "closed_cap": "Tickets Cerrados (24h)",
    "this_week": "Actividad esta Semana",
    "response_time": "Tiempo de Respuesta Promedio",
    "close_time": "Tiempo de Resolución Promedio",
    "pro_metrics_title": "💎 Métricas de Rendimiento Pro",
    "pro_efficiency": "Eficiencia de Carga de Trabajo",
    "pro_rating_quality": "Calidad de Servicio",
    "pro_top_performer": "Élite",
    "pro_consistent": "Consistente",
    "pro_needs_focus": "Requiere Enfoque",
    "slash": {
      "description": "Ver estadísticas del servidor y reportes de SLA.",
      "subcommands": {
        "server": {
          "description": "Ver estadísticas generales de crecimiento y actividad."
        },
        "sla": {
          "description": "Ver el reporte de cumplimiento de SLA de tickets."
        },
        "staff": {
          "description": "Ver estadísticas de rendimiento de staff individual."
        },
        "leaderboard": {
          "description": "Ver la tabla de clasificación de staff."
        },
        "ratings": {
          "description": "Ver estadísticas de valoraciones de tickets."
        },
        "staff_rating": {
          "description": "Ver valoraciones de un miembro de staff específico."
        }
      }
    }
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
      "description": "**{{feature}}** es una función exclusiva del plan Pro.\nSi deseas utilizar esta función PRO, ve a nuestro servidor de Soporte y crea un ticket de compra. ¡También puedes donarnos para apoyar el proyecto si quieres!",
      "current_plan": "Plan actual",
      "supporter": "Supporter",
      "upgrade_label": "🚀 Obtener Pro",
      "upgrade_cta": "Únete al Servidor de Soporte para adquirir el plan",
      "button_label": "Comprar Pro | Soporte",
      "footer": "TON618 Commercial Services"
    }
  },
  "premium": {
    "guild_only": "Este comando solo funciona en servidores.",
    "owner_only": "Solo el dueño del servidor puede usar este comando.",
    "error_fetching": "No pude obtener la información de tu membresía. Inténtalo de nuevo más tarde.",
    "error_generic": "Ocurrió un error al procesar tu solicitud.",
    "status_title": "Estado de tu Membresía",
    "pro_active": "✅ Tienes una membresía PRO activa con acceso a todas las funciones premium.",
    "free_plan": "ℹ️ Estás usando el plan FREE. Actualiza a PRO para desbloquear funciones avanzadas.",
    "plan_label": "Plan",
    "status_label": "Estado",
    "time_remaining": "Tiempo restante",
    "expires_tomorrow": "🚨 **¡Vence mañana!** Renueva urgentemente.",
    "expires_soon": "⚠️ **¡Vence en {{days}} días!** No olvides renovar.",
    "expires_week": "⏰ Vence en **{{days}} días**. Prepárate para renovar.",
    "expires_in": "📅 Vence en **{{days}} días**.",
    "started_at": "Iniciado",
    "expires_at": "Vence el",
    "source_label": "Origen",
    "supporter_status": "Estado Supporter",
    "supporter_active": "✅ Activo",
    "active": "Activo",
    "reminder": {
      "title_7": "⏰ Tu membresía PRO vence en 7 días",
      "title_3": "⚠️ Tu membresía PRO vence en 3 días",
      "title_1": "🚨 Tu membresía PRO vence mañana",
      "description_7": "Tu membresía PRO para **{{guildName}}** vencerá en **7 días**.\n\nRenueva ahora para mantener todas las funciones premium activas.",
      "description_3": "Tu membresía PRO para **{{guildName}}** vencerá en **3 días**.\n\n¡No pierdas el acceso a funciones premium! Renueva antes de que sea tarde.",
      "description_1": "⏰ **URGENTE**: Tu membresía PRO para **{{guildName}}** vence **mañana**.\n\nRenueva inmediatamente o perderás el acceso a todas las funciones premium.",
      "field_server": "Servidor",
      "field_days_remaining": "Días restantes",
      "field_plan": "Plan",
      "footer": "TON618 - Sistema de Membresías"
    },
    "upgrade_label": "🚀 Obtener Pro",
    "upgrade_cta": "Obtener Pro — abre un ticket en nuestro servidor de soporte",
    "slash": {
      "description": "Ver el estado de tu membresía premium",
      "status": "Ver cuánto tiempo te queda de membresía premium",
      "redeem_description": "Canjea un código PRO para activar funciones premium",
      "code_option": "Tu código de canje PRO (formato: XXXX-XXXX-XXXX)"
    },
    "redeem": {
      "guild_only": "Este comando solo funciona en servidores.",
      "owner_only": "Solo el dueño del servidor puede canjear códigos PRO.",
      "error_title": "❌ Canje Fallido",
      "code_not_found": "El código que ingresaste no fue encontrado. Por favor verifica e intenta de nuevo.",
      "code_used": "Este código ya ha sido canjeado. Cada código solo puede usarse una vez.",
      "code_expired": "Este código ha expirado. Por favor contacta a soporte para obtener un nuevo código.",
      "invalid_code": "El código que ingresaste es inválido.",
      "processing_error": "Hubo un error procesando tu canje. Por favor intenta de nuevo o contacta a soporte.",
      "generic_error": "Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.",
      "success_title": "✅ ¡PRO Activado Exitosamente!",
      "success_description": "Tu código `{{code}}` ha sido canjeado exitosamente.\n\n¡Ahora tienes acceso **{{plan}}** a todas las funciones premium!",
      "lifetime_access": "🌟 ¡Tienes acceso PRO **de por vida**!",
      "expires_at": "📅 Tu acceso PRO expira el {{date}}.",
      "extended": "🔄 ¡Tu membresía PRO existente ha sido extendida!",
      "duration_label": "Duración",
      "lifetime": "De por vida",
      "days": "{{days}} días",
      "server_label": "Servidor"
    }
  },
  "audit": {
    "slash": {
      "description": "Auditorías administrativas y exportaciones",
      "subcommands": {
        "tickets": {
          "description": "Exportar tickets a CSV con filtros"
        }
      }
    },
    "options": {
      "status": "Filtrar por estado del ticket",
      "priority": "Filtrar por prioridad",
      "category": "Filtrar por categoría",
      "from": "Fecha de inicio en AAAA-MM-DD",
      "to": "Fecha de fin en AAAA-MM-DD",
      "limit": "Cantidad máxima de filas (1-500)"
    },
    "unsupported_subcommand": "Subcomando no soportado.",
    "invalid_from": "Fecha 'desde' inválida. Use AAAA-MM-DD.",
    "invalid_to": "Fecha 'hasta' inválida. Use AAAA-MM-DD.",
    "invalid_range": "La fecha 'desde' debe ser anterior a 'hasta'.",
    "title": "Exportación de Auditoría",
    "empty": "No se encontraron tickets con esos filtros.",
    "rows": "Filas totales",
    "status_label": "Estado",
    "priority_label": "Prioridad",
    "category_label": "Categoría",
    "from_label": "Desde",
    "to_label": "Hasta",
    "export_title": "📊 Exportación de Auditoría Generada",
    "all": "Todos",
    "none": "Ninguno"
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
      "guilds_attention": "Guilds que requieren atención"
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
    },
    "slash": {
      "description": "Herramientas de diagnóstico y derechos solo para el propietario",
      "subcommands": {
        "status": {
          "description": "Ver estado del bot e información de despliegue"
        },
        "automod_badge": {
          "description": "Ver progreso de insignia de AutoMod en vivo en todos los servidores"
        },
        "health": {
          "description": "Ver estado de salud y latido en vivo"
        },
        "memory": {
          "description": "Ver uso de memoria del proceso"
        },
        "cache": {
          "description": "Ver tamaños de caché del bot"
        },
        "guilds": {
          "description": "Listar servidores conectados"
        },
        "voice": {
          "description": "Ver estado del subsistema de música"
        },
        "entitlements_set_plan": {
          "description": "Establecer un plan de servidor manualmente"
        },
        "entitlements_set_supporter": {
          "description": "Activar o desactivar reconocimiento de supporter"
        },
        "entitlements_status": {
          "description": "Inspeccionar el plan efectivo y estado de supporter para un servidor"
        }
      }
    },
    "options": {
      "debug_entitlements_status_guild_id_guild_id": "ID del servidor objetivo",
      "debug_entitlements_set-plan_guild_id_guild_id": "ID del servidor objetivo",
      "debug_entitlements_set-plan_tier_tier": "Nivel de plan",
      "debug_entitlements_set-plan_expires_in_days_expires_in_days": "Duración opcional en días para Pro",
      "debug_entitlements_set-plan_note_note": "Nota interna opcional",
      "debug_entitlements_set-supporter_guild_id_guild_id": "ID del servidor objetivo",
      "debug_entitlements_set-supporter_active_active": "Activar o desactivar reconocimiento de supporter",
      "debug_entitlements_set-supporter_expires_in_days_expires_in_days": "Duración opcional en días para estado de supporter",
      "debug_entitlements_set-supporter_note_note": "Nota interna opcional"
    }
  },
  "ticket": {
    "footer": "TON618 Tickets",
    "error_label": "Error",
    "field_category": "Categoría",
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
      "faq_button": "Preguntas frecuentes",
      "default_category": "Soporte General",
      "default_description": "Ayuda con temas generales"
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
      "auto_escalation_applied": "Pro: Escalamiento Inteligente aplicado (Prioridad: Urgente)",
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
      "move_select_description": "Selecciona la categoría a la que quieres mover este ticket:",
      "move_select_placeholder": "Selecciona la nueva categoría...",
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
        "dm_field_category": "Categoría",
        "dm_field_opened": "Fecha de apertura",
        "dm_field_closed": "Fecha de cierre",
        "dm_field_duration": "Duración total",
        "dm_field_reason": "Razón de cierre",
        "dm_field_handled_by": "Atendido por",
        "dm_field_messages": "Mensajes",
        "dm_field_transcript": "Transcripcion en linea",
        "dm_transcript_link": "Ver transcripcion completa",
        "dm_no_reason": "No se proporciono una razón",
        "dm_footer": "Gracias por confiar en nuestro soporte - TON618 Tickets",
        "dm_warning_title": "Aviso: DM no enviado",
        "dm_warning_description": "No se pudo enviar el mensaje de cierre por DM a <@{{userId}}>.\n\n**Posible causa:** el usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n**Ticket:** #{{ticketId}}",
        "dm_warning_transcript": "Transcripcion disponible",
        "dm_warning_unavailable": "No disponible",
        "warning_dm_failed": "No se pudo enviar DM al usuario.",
        "warning_channel_not_deleted": "El canal no se eliminara automaticamente hasta que la transcripcion quede archivada de forma segura.",
        "log_reason": "Razón",
        "log_duration": "Duración",
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
        "transcript_field_duration": "Duración",
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
        "user_missing": "No pude encontrar al usuario que creó este ticket.",
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
        "dm_title": "Tu ticket ya está siendo atendido",
        "dm_description": "Tu ticket **#{{ticketId}}** en **{{guild}}** ya tiene un miembro del staff asignado.\n\n**Staff asignado:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Canal:** [Ir al ticket]({{channelLink}})\n\nUsa el enlace de arriba para entrar directamente al ticket y continuar la conversación.",
        "event_description": "{{userTag}} reclamó el ticket #{{ticketId}}.",
        "result_title": "Ticket reclamado",
        "result_description": "Reclamaste el ticket **#{{ticketId}}** correctamente.{{dmLine}}{{warningBlock}}",
        "dm_line": "\n\nSe notificó al usuario por DM.",
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
        "event_description": "{{userTag}} liberó el ticket #{{ticketId}}.",
        "result_description": "El ticket fue liberado. Cualquier miembro del staff puede reclamarlo ahora.{{warningLine}}",
        "warning_permissions": "Algunos permisos no pudieron restaurarse completamente.",
        "log_released_by": "Liberado por",
        "log_previous_claimer": "Anteriormente reclamado por"
      },
      "assign": {
        "closed_ticket": "No puedes asignar un ticket cerrado.",
        "staff_only": "Solo el staff puede asignar tickets.",
        "bot_denied": "No puedes asignar el ticket a un bot.",
        "creator_denied": "No puedes asignar el ticket al usuario que lo creó.",
        "staff_member_missing": "No pude encontrar a ese miembro del staff en este servidor.",
        "invalid_assignee": "Solo puedes asignar el ticket a miembros del staff (rol de soporte o administrador).",
        "verify_permissions": "No pude verificar mis permisos en este servidor.",
        "manage_channels_required": "Necesito el permiso `Manage Channels` para asignar tickets.",
        "assign_permissions_error": "Hubo un error al dar permisos al miembro del staff asignado: {{error}}",
        "database_error": "Hubo un error al actualizar el ticket en la base de datos.",
        "dm_title": "Ticket asignado",
        "dm_description": "Se te asignó el ticket **#{{ticketId}}** en **{{guild}}**.\n\n**{{categoryLabel}}:** {{category}}\n**Usuario:** <@{{userId}}>\n**Canal:** [Ir al ticket]({{channelLink}})\n\nPor favor revísalo lo antes posible.",
        "event_description": "{{userTag}} asignó el ticket #{{ticketId}} a {{staffTag}}.",
        "result_title": "Ticket asignado",
        "result_description": "El ticket **#{{ticketId}}** fue asignado a <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        "dm_line": "\n\nSe notificó al miembro del staff por DM.",
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
          "event_description": "{{userTag}} agregó a {{targetTag}} al ticket #{{ticketId}}.",
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
          "event_description": "{{userTag}} quitó a {{targetTag}} del ticket #{{ticketId}}.",
          "result_title": "Usuario quitado",
          "result_description": "<@{{userId}}> fue quitado del ticket y ya no puede verlo."
        },
        "move": {
          "closed_ticket": "No puedes mover un ticket cerrado.",
          "category_not_found": "Categoría no encontrada.",
          "already_in_category": "El ticket ya esta en esta categoría.",
          "verify_permissions": "No pude verificar mis permisos en este servidor.",
          "manage_channels_required": "Necesito el permiso `Manage Channels` para mover tickets.",
          "database_error": "Hubo un error al actualizar la categoría del ticket en la base de datos.",
          "event_title": "Categoría actualizada",
          "event_description": "{{userTag}} movió el ticket #{{ticketId}} de {{from}} a {{to}}.",
          "log_previous": "Anterior",
          "log_new": "Nueva",
          "log_priority": "Prioridad actualizada",
          "result_title": "Categoría cambiada",
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
          "description": "Mueve el ticket a otra categoría"
        },
        "transcript": {
          "description": "Genera la transcripción del ticket"
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
        "assign_staff": "Miembro del staff que tendrá el ticket",
        "add_user": "Usuario que se agregará al ticket",
        "remove_user": "Usuario que se quitará del ticket",
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
    },
    "options": {
      "ticket_close_reason_reason": "Razón para cerrar el ticket",
      "ticket_assign_staff_staff": "Miembro del personal que será responsable del ticket",
      "ticket_add_user_user": "Usuario para agregar al ticket",
      "ticket_remove_user_user": "Usuario para eliminar del ticket",
      "ticket_rename_name_name": "Nuevo nombre del canal",
      "ticket_priority_level_level": "Nuevo nivel de prioridad",
      "ticket_history_user_user": "Miembro cuyo historial de tickets deseas inspeccionar",
      "ticket_note_add_note_note": "Contenido de la nota interna",
      "ticket_playbook_confirm_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_dismiss_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_apply-macro_recommendation_recommendation": "ID de recomendación",
      "ticket_playbook_enable_playbook_playbook": "Nombre del playbook",
      "ticket_playbook_disable_playbook_playbook": "Nombre del playbook"
    },
    "auto_reply": {
      "prefix": "🛡️ **TON618 PRO** | `Soporte Verificado` — *\"{{trigger}}\"*",
      "footer": "──────────────────────────────────\n⚡ **Prioridad Ultra-Rápida** (0.4s) | 💪 [Sé un héroe, apoya el proyecto](https://ton618.com/pro)",
      "pro_badge": "🛡️ SOPORTE VERIFICADO PRO",
      "pro_footer_small": "Impulsado por TON618 Pro — La excelencia en soporte.",
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
      ],
      "priority_badge": "🚨 **[PRIORIDAD URGENTE DETECTADA]**",
      "priority_note": "⚠️ **Nota de Inteligencia:** Se ha acelerado la revisión manual debido a la naturaleza crítica de este ticket.",
      "sentiment_label": "🎭 Sentimiento del Usuario",
      "sentiment_calm": "😊 Calma (Estándar)",
      "sentiment_angry": "😡 Enfado / Urgencia Crítica",
      "suggestion_label": "💡 Sugerencia Pro"
    },
    "events": {
      "claimed_dashboard": "Ticket reclamado desde dashboard",
      "claimed": "Ticket reclamado",
      "released_dashboard": "Ticket liberado desde dashboard",
      "assigned_dashboard": "Ticket asignado desde dashboard",
      "unassigned": "Asignación removida",
      "status_updated": "Estado operativo actualizado",
      "closed_dashboard": "Ticket cerrado desde dashboard",
      "closed": "Ticket cerrado",
      "reopened_dashboard": "Ticket reabierto desde dashboard",
      "reopened": "Ticket reabierto",
      "internal_note": "Nota interna agregada",
      "tag_added": "Tag agregado",
      "tag_removed": "Tag removido",
      "reply_sent": "Respuesta enviada",
      "macro_sent": "Macro enviada",
      "priority_updated": "Prioridad actualizada",
      "recommendation_confirmed": "Recomendación confirmada",
      "recommendation_discarded": "Recomendación descartada",
      "footer_bridge": "TON618 · Inbox operativa",
      "status_attending": "En Atención",
      "status_searching": "Buscando Staff",
      "claimed_dashboard_desc": "{{actor}} reclamó el ticket #{{id}} desde la dashboard.",
      "claimed_desc": "{{actor}} tomó este ticket desde la dashboard.",
      "released_dashboard_desc": "{{actor}} liberó el ticket #{{id}} desde la dashboard.",
      "assigned_dashboard_desc": "{{actor}} se asignó el ticket #{{id}}.",
      "unassigned_desc": "{{actor}} removió la asignación del ticket #{{id}}.",
      "status_updated_desc": "{{actor}} cambió el estado del ticket #{{id}} a {{status}}.",
      "closed_dashboard_desc": "{{actor}} cerró el ticket #{{id}} desde la dashboard.",
      "closed_desc": "{{actor}} cerró este ticket desde la dashboard.\nMotivo: {{reason}}",
      "reopened_dashboard_desc": "{{actor}} reabrió el ticket #{{id}} desde la dashboard.",
      "reopened_desc": "{{actor}} reabrió este ticket desde la dashboard.",
      "internal_note_desc": "{{actor}} agregó una nota interna desde la dashboard.",
      "tag_added_desc": "{{actor}} agregó el tag {{tag}} desde la dashboard.",
      "tag_removed_desc": "{{actor}} removió el tag {{tag}} desde la dashboard.",
      "reply_sent_desc": "{{actor}} respondió al cliente desde la dashboard.",
      "reply_sent_title": "Respuesta desde la dashboard",
      "macro_sent_desc": "{{actor}} envió la macro {{macro}} desde la dashboard.",
      "priority_updated_desc": "{{actor}} cambió la prioridad del ticket #{{id}} a {{priority}}.",
      "recommendation_confirmed_desc": "{{actor}} confirmó una recomendación operativa desde la dashboard.",
      "recommendation_discarded_desc": "{{actor}} descartó una recomendación operativa desde la dashboard.",
      "no_details": "Sin detalles adicionales."
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
      "add_description": "Se registró una advertencia para {{user}}.",
      "footer_id": "ID de advertencia: {{id}}",
      "auto_kick_success": "Acción automática: el miembro fue expulsado al llegar a 5 advertencias.",
      "auto_kick_failed": "La acción automática falló: no pude expulsar al miembro al llegar a 5 advertencias.",
      "auto_timeout_success": "Acción automática: el miembro fue silenciado durante 1 hora al llegar a 3 advertencias.",
      "auto_timeout_failed": "La acción automática falló: no pude silenciar al miembro al llegar a 3 advertencias.",
      "none_title": "Sin advertencias",
      "none_description": "{{user}} no tiene advertencias en este servidor.",
      "list_title": "Advertencias de {{user}}",
      "list_description": "Advertencias almacenadas: **{{count}}**.",
      "list_entry": "**{{index}}.** `{{id}}`\nMotivo: {{reason}}\nModerador: <@{{moderatorId}}>\nFecha: <t:{{timestamp}}:R>",
      "list_footer": "Usa `/warn remove` con el ID de la advertencia para eliminar un registro.",
      "remove_title": "Advertencia eliminada",
      "remove_description": "La advertencia `{{id}}` fue eliminada correctamente.",
      "not_found_title": "Advertencia no encontrada",
      "not_found_description": "No encontré una advertencia con ID `{{id}}`."
    },
    "options": {
      "warn_add_user_user": "Miembro a advertir",
      "warn_add_reason_reason": "Razón de la advertencia",
      "warn_check_user_user": "Miembro cuyas advertencias deseas inspeccionar",
      "warn_remove_id_id": "ID de la advertencia"
    }
  },
  "modlogs": {
    "slash": {
      "description": "Configura los logs de moderación",
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
        "channel": "Canal de texto para logs de moderación",
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
      "setup_description": "Los logs de moderación ahora se enviarán a {{channel}}.",
      "channel_required": "Define primero un canal de modlogs antes de activar el sistema.",
      "enabled_state": "Los modlogs ahora están **{{state}}**.",
      "channel_updated": "Canal de modlogs actualizado a {{channel}}.",
      "event_state": "El registro de **{{event}}** ahora está **{{state}}**.",
      "info_title": "Configuración de modlogs"
    },
    "options": {
      "modlogs_setup_channel_channel": "Canal de texto para registros de moderación",
      "modlogs_enabled_enabled_enabled": "Si la función permanece habilitada",
      "modlogs_channel_channel_channel": "Canal de texto para registros de moderación",
      "modlogs_config_event_event": "Tipo de evento a configurar",
      "modlogs_config_enabled_enabled": "Si ese tipo de evento debe registrarse"
    }
  },
  "config": {
    "slash": {
      "description": "Configurar los ajustes del bot para este servidor",
      "subcommands": {
        "status": {
          "description": "Ver el estado actual de la configuración del bot"
        },
        "tickets": {
          "description": "Ver la configuración del sistema de tickets"
        },
        "center": {
          "description": "Abrir el Centro de Configuración interactivo"
        }
      }
    }
  },
  "menuActions": {
    "profile": {
      "title": "Perfil",
      "description": "Usa `/perfil ver` para ver tu perfil.\nUsa `/perfil top` para ver el ranking rápido."
    },
    "config": {
      "admin_only": "Solo los administradores pueden usar la configuración rápida.",
      "title": "Configuración rápida",
      "description": "Usa `/config center` para abrir el panel interactivo de control.\nSi necesitas algo más completo, usa `/setup`."
    },
    "help": {
      "title": "Ayuda rápida",
      "description": "Comandos clave:\n- `/menu`\n- `/fun`\n- `/ticket open`\n- `/perfil ver`\n- `/staff my-tickets` (staff)\n- `/config status` (admin)\n- `/help`"
    }
  },
  "events": {
    "guildMemberAdd": {
      "anti_raid": {
        "title": "Anti-raid activado",
        "description": "Se detectaron **{{recentJoins}} entradas** en **{{seconds}}s**.\nÚltima entrada: **{{memberTag}}**",
        "fields": {
          "threshold": "Umbral",
          "action": "Acción"
        },
        "action_kick": "Expulsar automáticamente",
        "action_alert": "Solo alertar"
      },
      "welcome": {
        "default_title": "¡Bienvenido!",
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
        "title": "Miembro entró",
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
        "default_title": "¡Adiós!",
        "default_message": "Lamentamos ver partir a **{user}**. Esperamos verte pronto otra vez.",
        "fields": {
          "user": "Usuario",
          "remaining_members": "Miembros restantes"
        },
        "remaining_members_value": "{{count}} miembros"
      },
      "modlog": {
        "title": "Miembro salió",
        "fields": {
          "user": "Usuario",
          "joined_at": "Se unió",
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
          "after": "Después",
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
        "default_welcome": "¡Hola <@{{userId}}>! Bienvenido a nuestro sistema de soporte. Un miembro del staff te atenderá pronto.",
        "summary": "**Resumen de la solicitud:**\n- **Usuario:** <@{{userId}}>\n- **Categoría:** {{category}}\n- **Prioridad:** {{priority}}\n- **Creado:** <t:{{createdAt}}:R>",
        "footer": "Usa los botones de abajo para gestionar este ticket",
        "question_fallback": "Pregunta {{index}}",
        "form_field": "Información del formulario"
      },
      "closed": {
        "title": "Ticket cerrado",
        "no_reason": "Sin motivo",
        "fields": {
          "ticket": "Ticket",
          "closed_by": "Cerrado por",
          "reason": "Motivo",
          "duration": "Duración",
          "messages": "Mensajes"
        }
      },
      "reopened": {
        "title": "Ticket reabierto",
        "description": "<@{{userId}}> reabrió este ticket.\nUn miembro del staff retomará la atención pronto.",
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
          "category": "Categoría",
          "priority": "Prioridad",
          "status": "Estado",
          "messages": "Mensajes",
          "duration": "Duración",
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
          "category": "Categoría"
        },
        "actions": {
          "open": "Ticket abierto",
          "close": "Ticket cerrado",
          "reopen": "Ticket reabierto",
          "claim": "Ticket reclamado",
          "unclaim": "Ticket liberado",
          "assign": "Ticket asignado",
          "unassign": "Asignación removida",
          "add": "Usuario agregado",
          "remove": "Usuario quitado",
          "transcript": "Transcripción generada",
          "rate": "Ticket calificado",
          "move": "Categoría cambiada",
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
        "create": {
          "description": "Crear y enviar un embed con formulario interactivo"
        },
        "edit": {
          "description": "Editar un embed existente enviado por el bot"
        },
        "quick": {
          "description": "Enviar un embed rápido con título y descripción"
        },
        "announcement": {
          "description": "Plantilla de anuncio profesional"
        },
        "template": {
          "description": "✨ Gestionar plantillas de embed (Pro)",
          "save": {
            "description": "Guardar una configuración de embed como plantilla"
          },
          "load": {
            "description": "Cargar y enviar una plantilla de embed guardada"
          },
          "list": {
            "description": "Listar todas las plantillas de embed guardadas"
          },
          "delete": {
            "description": "Eliminar una plantilla de embed guardada"
          }
        }
      },
      "options": {
        "channel": "Canal donde enviar el embed",
        "color": "Color HEX sin # (ej: 5865F2)",
        "image": "URL de imagen grande",
        "thumbnail": "URL de miniatura (arriba a la derecha)",
        "footer": "Texto del pie",
        "author": "Texto del autor (arriba del todo)",
        "author_icon": "URL del icono del autor",
        "timestamp": "Mostrar fecha y hora actual en el footer",
        "mention": "Mencionar a alguien o un rol junto al embed (ej: @Todos)",
        "message_id": "ID del mensaje a editar",
        "title": "Título",
        "description": "Descripción",
        "text": "Contenido del anuncio",
        "template_name": "Nombre de la plantilla"
      }
    },
    "errors": {
      "invalid_color": "Color inválido. Usa formato HEX de 6 caracteres sin `#` (ej: `5865F2`).",
      "template_not_found": "No se encontró la plantilla `{{name}}`.",
      "template_exists": "Ya existe una plantilla con el nombre `{{name}}`.",
      "pro_required": "Esta función requiere **TON618 Pro**. ¡Mejora tu servidor para desbloquear plantillas de embed y mucho más!",
      "invalid_image_url": "URL de imagen inválida. Debe empezar con `http` o `https`.",
      "invalid_thumbnail_url": "URL de miniatura inválida. Debe empezar con `http` o `https`.",
      "channel_not_found": "Canal no encontrado.",
      "not_bot_message": "Ese mensaje no fue enviado por el bot.",
      "no_embeds": "Ese mensaje no contiene ningún embed.",
      "message_not_found": "Mensaje no encontrado en el canal especificado.",
      "form_expired": "El formulario ha expirado. Por favor ejecuta el comando de nuevo."
    },
    "success": {
      "sent": "Embed enviado en {{channel}}.",
      "announcement_sent": "Anuncio enviado en {{channel}}.",
      "edited": "Embed editado correctamente."
    },
    "templates": {
      "list_title": "Plantillas de Embed - {{guildName}}",
      "no_templates": "No hay plantillas guardadas en este servidor. Usa `/embed template save` para crear una.",
      "footer": "Total: {{count}}/{{max}} plantillas"
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
    "footer": {
      "sent_by": "Enviado por {{username}}",
      "announcement": "{{guildName}} · Anuncio"
    }
  },
  "poll": {
    "slash": {
      "description": "Sistema de encuestas interactivas",
      "subcommands": {
        "create": {
          "description": "Crear una nueva encuesta con hasta 10 opciones"
        },
        "end": {
          "description": "Finalizar una encuesta antes de tiempo"
        },
        "list": {
          "description": "Ver las encuestas activas en el servidor"
        }
      },
      "options": {
        "question": "La pregunta de la encuesta",
        "options": "Opciones separadas por |, ej: Opción A | Opción B",
        "duration": "Duración, ej: 1h, 30m, 2d, 1h30m",
        "multiple": "Permitir que los usuarios voten en múltiples opciones",
        "channel": "Canal donde se publicará la encuesta",
        "id": "ID de la encuesta, últimos 6 caracteres",
        "anonymous": "Ocultar resultados hasta que termine la encuesta (Pro)",
        "required_role": "Solo usuarios con este rol pueden votar (Pro)",
        "max_votes": "Número máximo de opciones permitidas (Pro)"
      }
    },
    "placeholder": "📊 Preparando encuesta...",
    "embed": {
      "created_title": "✅ Encuesta Creada",
      "created_description": "La encuesta se ha publicado correctamente en {{channel}}.",
      "field_question": "Pregunta",
      "field_options": "Opciones",
      "field_ends": "Finaliza el",
      "field_in": "Finaliza en",
      "field_mode": "Modo",
      "field_id": "ID Encuesta",
      "mode_multiple": "Opción Múltiple",
      "mode_single": "Única Opción",
      "active_title": "📊 Encuestas Activas",
      "active_empty": "No hay encuestas activas en este servidor.",
      "active_channel_deleted": "Canal Eliminado",
      "active_item_votes": "Votos",
      "active_count_title": "📊 Encuestas Activas ({{count}})",
      "active_footer": "Usa `/poll end <id>` para cerrar una encuesta manualmente."
    },
    "success": {
      "ended": "✅ La encuesta **\"{{question}}\"** ha sido finalizada manualmente.",
      "vote_removed": "Tu voto fue retirado.",
      "vote_active_multiple": "Tus votos activos: {{options}}.",
      "vote_active_single": "Tu voto actual es **{{option}}**."
    },
    "errors": {
      "pro_required": "✨ **Función Pro**: Las opciones avanzadas (anónima, rol requerido, votos máx.) requieren una suscripción Pro.",
      "min_options": "Debes proporcionar al menos 2 opciones.",
      "max_options": "Puedes proporcionar hasta 10 opciones.",
      "option_too_long": "Cada opción debe tener menos de 80 caracteres.",
      "min_duration": "La duración de la encuesta debe ser al menos 1 minuto.",
      "max_duration": "La duración de la encuesta no puede superar los 30 días.",
      "manage_messages_required": "Necesitas el permiso `Manage Messages` para cerrar encuestas manualmente.",
      "poll_not_found": "No se encontró ninguna encuesta activa con el ID `{{id}}`.",
      "unknown_subcommand": "Subcomando de encuesta desconocido."
    }
  },
  "profile": {
    "slash": {
      "description": "Ver tu perfil del servidor y estadísticas",
      "subcommands": {
        "view": {
          "description": "Ver el perfil de un usuario específico"
        },
        "top": {
          "description": "Ver la tabla de clasificación del servidor"
        }
      },
      "options": {
        "user": "Usuario objetivo para inspeccionar"
      }
    }
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
      "processing_error": "❌ Ocurrió un error al procesar la interacción.",
      "pro_required": "Esta función requiere **TON618 Pro**."
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
      "debate_footer": "Usa este hilo para discutir esta sugerencia",
      "field_staff_note": "💬 Nota del Staff"
    },
    "buttons": {
      "vote_up": "👍 Votar a Favor",
      "vote_down": "👎 Votar en Contra",
      "approve": "✅ Aprobar",
      "reject": "❌ Rechazar",
      "staff_note": "Añadir Nota de Staff (Pro)"
    },
    "success": {
      "submitted_title": "✅ Sugerencia Enviada",
      "submitted_description": "Tu sugerencia **#{{num}}** ha sido publicada en {{channel}}.",
      "submitted_footer": "¡Gracias por tu aporte!",
      "vote_registered": "✅ Tu voto ha sido registrado. ({{emoji}})",
      "staff_note_updated": "Nota de staff actualizada para la sugerencia #{{num}}.",
      "auto_thread_created": "Hilo de debate creado automáticamente.",
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
    "embed": {
      "title": "Perfil de {{username}}",
      "user_fallback": "Usuario {{id}}",
      "field_level": "Nivel",
      "field_total_xp": "XP Total",
      "field_rank": "Rango",
      "field_wallet": "Cartera",
      "field_bank": "Banco",
      "field_total": "Dinero Total",
      "top_title": "Top del Servidor",
      "top_levels": "Top Niveles",
      "top_economy": "Top Economía",
      "level_format": "Nivel {{level}}",
      "coins_format": "{{amount}} monedas",
      "no_data": "Aún no hay registros en la base de datos."
    }
  },
  "leveling": {
    "slash": {
      "description": "Ver información de nivel y XP",
      "subcommands": {
        "view": {
          "description": "Ver tu nivel o el de otro usuario"
        },
        "rank": {
          "description": "Ver tu posición en la tabla de clasificación"
        },
        "leaderboard": {
          "description": "Ver la tabla de clasificación del servidor"
        }
      },
      "options": {
        "user": "Usuario para ver nivel (predeterminado: tú mismo)",
        "page": "Número de página a ver"
      }
    },
    "status_disabled": "❌ El sistema de niveles está desactivado en este servidor.",
    "user_not_found": "❌ Usuario no encontrado.",
    "embed": {
      "title": "Nivel de {{user}}",
      "field_level_name": "Nivel",
      "field_progress_name": "Progreso",
      "field_total_xp_name": "XP Total",
      "field_rank_name": "Rango"
    },
    "leaderboard": {
      "title": "Tabla de clasificación de {{guild}}",
      "empty": "No hay datos en la tabla de clasificación todavía.",
      "page": "Página {{current}} de {{total}}"
    },
    "rank": {
      "title": "Rango de {{user}}",
      "description": "Estás en la posición #**{{rank}}** de **{{total}}** miembros (Página {{page}})",
      "field_current_level_name": "Nivel Actual",
      "field_current_rank_name": "Rango Actual",
      "footer": "XP: {{xp}} / {{next}} (faltan {{remaining}})",
      "no_xp": "Este usuario aún no tiene XP."
    }
  },
  "help": {
    "embed": {
      "title": "Centro de Ayuda - {{category}}",
      "description": "Aquí está la lista de comandos disponibles para esta categoría.",
      "category_label": "Categoría",
      "access_label": "Acceso",
      "quick_start": "Guía de Inicio Rápido",
      "command_overviews": "Vista General de Comandos",
      "usage_overrides": "Ejemplos de Uso",
      "footer": "Solicitado por {{user}}",
      "categories": {
        "admin": "Administración",
        "mods": "Moderación",
        "public": "Comandos Públicos",
        "economy": "Economía",
        "ticket": "Tickets",
        "giveaway": "Sorteos",
        "level": "Niveles"
      },
      "quick_start_notes": {
        "ticket_open": "Abre un nuevo ticket de soporte e inicia el flujo de atención.",
        "help_base": "Explora los comandos disponibles para ti en este servidor.",
        "staff_my_tickets": "Revisa tu carga activa de tickets antes de asumir más trabajo.",
        "ticket_claim": "Asume el ticket actual para que el equipo sepa que tú lo estás atendiendo.",
        "ticket_note_add": "Deja una nota interna de relevo para facilitar el seguimiento posterior.",
        "modlogs_info": "Comprueba si el registro de moderación está configurado y operativo.",
        "setup_wizard": "Aplica una configuración inicial guiada para un nuevo servidor de soporte.",
        "config_status": "Revisa de un vistazo la configuración activa.",
        "verify_panel": "Actualiza el panel de verificación después de cambios de seguridad o de incorporación.",
        "stats_sla": "Revisa el rendimiento del SLA y la presión de escalado.",
        "debug_status": "Inspecciona diagnósticos de despliegue y ejecución exclusivos del propietario del bot."
      },
      "overviews": {
        "audit": "Exporta datos de tickets y prepara revisiones administrativas sin modificar los registros activos.",
        "config": "Revisa la configuración activa del servidor, los ajustes de tickets y abre el centro de control administrativo interactivo.",
        "debug": "Ejecuta diagnósticos exclusivos del propietario sobre tiempo activo, estado, cachés, conectividad con servidores y permisos comerciales.",
        "embed": "Crea, edita y publica embeds personalizados de Discord para anuncios o actualizaciones estructuradas.",
        "help": "Explora el centro de ayuda interactivo y consulta solo los comandos que tienes disponibles en este servidor.",
        "modlogs": "Controla la entrega de registros de moderación, el canal de almacenamiento y la cobertura de eventos.",
        "profile": "Revisa la progresión de los miembros, el balance de economía y clasificaciones rápidas.",
        "ping": "Comprueba la latencia del bot, el tiempo activo y los contadores de ejecución exclusivos del propietario.",
        "poll": "Crea encuestas interactivas para el servidor, revisa las activas y ciérralas antes de tiempo cuando sea necesario.",
        "setup": "Configura tickets, automatizaciones, flujos de incorporación y disponibilidad de comandos para este servidor.",
        "staff": "Gestiona la disponibilidad del staff, la carga de trabajo activa y accesos rápidos a avisos desde un solo comando.",
        "stats": "Revisa métricas globales de tickets, rendimiento del SLA, actividad del staff y tendencias de satisfacción.",
        "suggest": "Abre el flujo de sugerencias para que los miembros envíen ideas para el servidor.",
        "ticket": "Gestiona todo el ciclo de vida de los tickets, las notas internas, las transcripciones y las acciones activas de los playbooks.",
        "verify": "Gestiona la verificación, la protección anti-raid, los mensajes de confirmación y la actividad de verificación.",
        "warn": "Aplica, revisa y elimina advertencias, incluidas las acciones automáticas asociadas al número de advertencias."
      },
      "usages": {
        "audit_tickets": "Exporta datos de tickets a un archivo CSV mediante filtros opcionales de estado, prioridad, categoría, fecha y límite de filas.",
        "config_center": "Abre el centro de configuración interactivo para que los administradores revisen y ajusten la configuración activa desde Discord.",
        "config_status": "Revisa de un vistazo la configuración actual del servidor, incluidos los canales clave, los roles, el modo de ayuda y el estado comercial.",
        "config_tickets": "Abre un resumen completo de operaciones de tickets con límites, ajustes de SLA, automatización y cobertura por categorías.",
        "embed_anuncio": "Envía un embed de anuncio preformateado para noticias del servidor o actualizaciones de alta visibilidad.",
        "embed_crear": "Abre un formulario interactivo para componer y enviar un embed totalmente personalizado.",
        "embed_editar": "Edita un mensaje embed existente que el bot haya enviado con anterioridad.",
        "embed_rapido": "Envía un embed rápido con título y descripción sin abrir el constructor completo.",
        "help_base": "Abre el centro de ayuda interactivo y explora solo los comandos que puedes usar en este servidor.",
        "profile_top": "Muestra las clasificaciones rápidas de nivel y economía de este servidor.",
        "profile_ver": "Abre tu perfil, o el de otro miembro, con información de nivel y economía.",
        "poll_crear": "Crea una encuesta interactiva con hasta 10 opciones, programación y voto múltiple opcional.",
        "poll_finalizar": "Cierra una encuesta activa antes de tiempo usando su ID corto.",
        "poll_lista": "Lista las encuestas que siguen activas en este servidor.",
        "setup_commands_panel": "Abre un panel de control interactivo para habilitar, deshabilitar y revisar comandos sin escribir los nombres manualmente.",
        "setup_wizard": "Aplica una configuración base guiada para un servidor de soporte, incluido el dashboard, los canales clave, los roles, el plan, los valores predeterminados de SLA y la publicación opcional del panel.",
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
        "verify_stats": "Muestra la actividad reciente de verificación y los totales de miembros verificados, fallidos y expulsados.",
        "debug_entitlements_set_plan": "Cambia manualmente el plan comercial de un servidor y su expiración opcional para pruebas o soporte.",
        "debug_entitlements_set_supporter": "Activa o desactiva el estado de supporter para un servidor y, si es necesario, define una expiración.",
        "debug_entitlements_status": "Inspecciona el plan comercial efectivo y el estado de supporter de un servidor concreto."
      }
    }
  },
  "support_server": {
    "restricted": "❌ Este comando solo está disponible en el servidor de soporte oficial."
  },
  "giveaway": {
    "embed": {
      "title": "🎉 SORTEO 🎉",
      "prize": "Premio",
      "winners": "Ganadores",
      "ends": "Finaliza",
      "hosted_by": "Organizado por",
      "click_participant": "¡Haz clic en el botón de abajo para participar!",
      "requirements": "Requisitos",
      "status_ended": "Estado",
      "status_no_participants": "Finalizado (Sin participantes)",
      "status_cancelled": "Cancelado",
      "winners_announcement": "¡Felicidades {{winners}}! Ganaron **{{prize}}**!",
      "reroll_announcement": "¡Se ha vuelto a elegir ganadores! ¡Felicidades {{winners}}! Ganaron **{{prize}}**!",
      "participate_label": "Participar en el sorteo"
    },
    "requirements": {
      "role": "Debes tener el rol: {{role}}",
      "level": "Debes ser al menos nivel **{{level}}**",
      "account_age": "Tu cuenta debe tener al menos **{{days}}** días de antigüedad"
    },
    "success": {
      "created": "✅ ¡Sorteo creado en {{channel}}! [Ir al mensaje]({{url}})",
      "ended": "✅ ¡Sorteo finalizado! Ganadores: {{winners}}",
      "rerolled": "✅ ¡Nuevos ganadores elegidos! Ganadores: {{winners}}",
      "cancelled": "✅ Sorteo cancelado.",
      "entered": "✅ ¡Has entrado en el sorteo con éxito!"
    },
    "errors": {
      "create_failed": "Error al crear el sorteo. Verifica los permisos del bot.",
      "not_found": "Sorteo no encontrado en la base de datos.",
      "already_ended": "Este sorteo ya ha finalizado.",
      "no_participants": "Ningún participante válido se unió al sorteo.",
      "end_failed": "Ocurrió un error al finalizar el sorteo.",
      "reroll_failed": "Ocurrió un error al volver a elegir ganadores.",
      "no_active": "No hay sorteos activos en este servidor.",
      "cancel_failed": "Ocurrió un error al cancelar el sorteo.",
      "requirement_role": "❌ Necesitas el rol {{role}} para participar en este sorteo.",
      "requirement_level": "❌ Necesitas ser al menos nivel {{level}} para participar en este sorteo.",
      "requirement_age": "❌ Tu cuenta debe tener al menos {{days}} días de antigüedad para participar en este sorteo.",
      "already_entered": "⚠️ Ya estás participando en este sorteo.",
      "invalid_action": "❌ No se pudo interpretar la acción del sorteo."
    }
  },
  "autorole": {
    "slash": {
      "description": "Configurar asignación automática de roles",
      "subcommands": {
        "reaction_add": {
          "description": "Agregar un rol por reacción a un mensaje",
          "options": {
            "message_id": "ID del mensaje",
            "emoji": "Emoji para reaccionar",
            "role": "Rol a asignar"
          }
        },
        "reaction_remove": {
          "description": "Quitar un rol por reacción de un mensaje",
          "options": {
            "message_id": "ID del mensaje",
            "emoji": "Emoji a quitar"
          }
        },
        "reaction_panel": {
          "description": "Crear un panel de roles por reacción",
          "options": {
            "channel": "Canal donde publicar el panel"
          }
        },
        "join_set": {
          "description": "Configurar un rol para dar cuando los usuarios se unan",
          "options": {
            "role": "Rol a asignar al unirse",
            "delay": "Retraso en segundos antes de asignar (predeterminado: 0)",
            "exclude_bots": "Excluir bots de recibir el rol"
          }
        },
        "join_remove": {
          "description": "Quitar el rol de entrada"
        },
        "level_add": {
          "description": "Añadir una recompensa de rol por nivel",
          "options": {
            "level": "Nivel requerido",
            "role": "Rol a asignar"
          }
        },
        "level_remove": {
          "description": "Quitar una recompensa de rol por nivel",
          "options": {
            "level": "Nivel a quitar"
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
        "list": {
          "description": "Listar todas las configuraciones de auto-roles"
        }
      },
      "groups": {
        "reaction": "Gestionar roles por reacción",
        "join": "Gestionar roles de entrada",
        "level": "Gestionar roles de nivel"
      }
    },
    "choices": {
      "mode_stack": "Acumular - Mantener todos los roles de nivel anteriores",
      "mode_replace": "Reemplazar - Remover roles de nivel anteriores"
    },
    "options": {
      "autorole_reaction_add_message_id_message_id": "ID del mensaje para agregar rol por reacción",
      "autorole_reaction_add_emoji_emoji": "Emoji para reaccionar",
      "autorole_reaction_add_role_role": "Rol a asignar al reaccionar",
      "autorole_reaction_remove_message_id_message_id": "ID del mensaje para quitar rol por reacción",
      "autorole_reaction_remove_emoji_emoji": "Emoji a quitar",
      "autorole_reaction_panel_channel_channel": "Canal donde crear el panel (predeterminado: actual)",
      "autorole_reaction_panel_title_title": "Título para el panel",
      "autorole_reaction_panel_description_description": "Descripción para el panel",
      "autorole_join_set_role_role": "Rol a asignar cuando los usuarios se unan",
      "autorole_join_set_delay_delay": "Retraso en segundos antes de asignar el rol",
      "autorole_join_set_exclude_bots_exclude_bots": "Excluir bots de recibir el rol",
      "autorole_level_add_level_level": "Nivel requerido para recibir el rol",
      "autorole_level_add_role_role": "Rol a asignar en este nivel",
      "autorole_level_remove_level_level": "Nivel del cual quitar el rol",
      "autorole_level_mode_mode_mode": "Modo para roles de nivel (acumular o reemplazar)"
    },
    "errors": {
      "message_not_found": "❌ Mensaje no encontrado en este canal. Asegúrate de que el ID del mensaje sea correcto.",
      "role_hierarchy": "❌ No puedo asignar este rol porque es superior o igual a mi rol más alto.",
      "not_found": "❌ Rol por reacción no encontrado.",
      "add_failed": "❌ Error al agregar rol por reacción. Por favor intenta de nuevo.",
      "remove_failed": "❌ Error al remover rol por reacción. Por favor intenta de nuevo.",
      "panel_failed": "❌ Error al crear el panel. Por favor intenta de nuevo.",
      "join_set_failed": "❌ Error al configurar el rol de entrada. Por favor intenta de nuevo.",
      "join_remove_failed": "❌ Error al remover el rol de entrada. Por favor intenta de nuevo.",
      "level_add_failed": "❌ Error al agregar rol de nivel. Por favor intenta de nuevo.",
      "level_remove_failed": "❌ Error al remover rol de nivel. Por favor intenta de nuevo.",
      "no_level_roles": "📭 No hay roles de nivel configurados.",
      "no_autoroles": "📭 No hay auto-roles configurados aún.",
      "list_failed": "❌ Error al listar auto-roles. Por favor intenta de nuevo."
    },
    "success": {
      "reaction_added": "✅ ¡Rol por reacción agregado! Los usuarios que reaccionen con {{emoji}} recibirán {{role}}.",
      "reaction_removed": "✅ Rol por reacción removido para {{emoji}}.",
      "panel_created": "✅ ¡Panel de roles por reacción creado en {{channel}}!\n\nID del mensaje: `{{messageId}}`\n\nUsa `/autorole reaction add` para agregar roles a este panel.",
      "join_set": "✅ ¡Rol de entrada configurado a {{role}}!\nRetraso: {{delay}} segundos\nExcluir bots: {{excludeBots}}",
      "join_removed": "✅ Rol de entrada removido.",
      "level_added": "✅ ¡Rol de nivel agregado! Los usuarios que alcancen el nivel {{level}} recibirán {{role}}.",
      "level_removed": "✅ Rol de nivel removido para el nivel {{level}}.",
      "mode_set": "✅ Modo de roles de nivel configurado a **{{mode}}**."
    },
    "panel": {
      "title": "🎭 Selección de Roles",
      "description": "¡Reacciona a este mensaje para obtener roles!\n\nHaz clic en las reacciones de abajo para alternar tus roles.",
      "footer": "Reacciona para obtener roles • Remueve la reacción para remover el rol"
    },
    "list": {
      "title": "🎭 Configuración de Auto-Roles",
      "join_role": "👋 Rol de Entrada",
      "join_role_value": "Rol: {{role}}\nRetraso: {{delay}}s\nExcluir bots: {{excludeBots}}",
      "reaction_roles": "⚡ Roles por Reacción",
      "level_roles": "📊 Roles de Nivel ({{mode}})",
      "message": "Mensaje"
    }
  },
  "mod": {
    "slash": {
      "description": "Comandos de moderación avanzada",
      "subcommands": {
        "ban": {
          "description": "Banea a un usuario del servidor"
        },
        "unban": {
          "description": "Desbanea a un usuario"
        },
        "kick": {
          "description": "Expulsa a un usuario del servidor"
        },
        "timeout": {
          "description": "Silencia a un usuario (nativo de Discord)"
        },
        "mute": {
          "description": "Silencia a un usuario con un rol"
        },
        "unmute": {
          "description": "Quita el silencio a un usuario"
        },
        "history": {
          "description": "Ver el historial de moderación de un usuario"
        },
        "purge": {
          "description": "Elimina múltiples mensajes"
        },
        "slowmode": {
          "description": "Establece el modo lento para un canal"
        }
      },
      "options": {
        "user": "El usuario objetivo",
        "reason": "Razón de la acción",
        "duration": "Duración (ej: 1h, 7d, 30d)",
        "delete_messages": "Eliminar mensajes de los últimos...",
        "user_id": "ID de Discord del usuario a desbanear",
        "limit": "Número de acciones a mostrar",
        "amount": "Número de mensajes a eliminar (1-100)",
        "contains": "Solo eliminar mensajes que contengan este texto",
        "seconds": "Duración del modo lento en segundos (0 para desactivar)",
        "channel": "Canal para establecer el modo lento"
      },
      "choices": {
        "duration": {
          "1m": "1 minuto",
          "1h": "1 hora",
          "6h": "6 horas",
          "1d": "1 día",
          "7d": "7 días",
          "28d": "28 días",
          "30d": "30 días",
          "permanent": "Permanente"
        },
        "delete_messages": {
          "0": "No eliminar",
          "3600": "Última hora",
          "86400": "Últimas 24 horas",
          "604800": "Últimos 7 días"
        }
      }
    },
    "errors": {
      "user_hierarchy": "❌ No puedes {{action}} a este usuario porque tiene un rol superior o igual al tuyo.",
      "bot_hierarchy": "❌ No puedo {{action}} a este usuario porque tiene un rol superior o igual al mío.",
      "ban_failed": "❌ Error al banear al usuario.",
      "unban_failed": "❌ Error al desbanear al usuario.",
      "not_banned": "❌ Este usuario no está baneado en este servidor.",
      "kick_failed": "❌ Error al expulsar al usuario.",
      "timeout_failed": "❌ Error al silenciar al usuario.",
      "mute_failed": "❌ Error al silenciar al usuario.",
      "unmute_failed": "❌ Error al quitar el silencio al usuario.",
      "not_muted": "❌ Este usuario no está silenciado.",
      "history_failed": "❌ Error al obtener el historial de moderación.",
      "no_history": "ℹ️ No se ha encontrado historial de moderación para {{user}}.",
      "no_messages": "❌ No se encontraron mensajes que coincidan con los criterios en los últimos 100 mensajes.",
      "purge_failed": "❌ Error al eliminar los mensajes.",
      "slowmode_failed": "❌ Error al establecer el modo lento."
    },
    "success": {
      "banned": "✅ **{{user}}** fue baneado.\n**Razón:** {{reason}}\n{{extra}}",
      "unbanned": "✅ **{{user}}** fue desbaneado.\n**Razón:** {{reason}}",
      "kicked": "✅ **{{user}}** fue expulsado.\n**Razón:** {{reason}}",
      "timeout": "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      "muted": "✅ **{{user}}** fue silenciado por **{{duration}}**.\n**Razón:** {{reason}}",
      "unmuted": "✅ **{{user}}** ya no está silenciado.\n**Razón:** {{reason}}",
      "purged": "✅ Se han eliminado **{{count}}** mensajes correctamente.",
      "slowmode_set": "✅ Modo lento establecido en **{{seconds}}s** en {{channel}}.",
      "slowmode_disabled": "✅ Modo lento desactivado en {{channel}}."
    },
    "ban_extra": {
      "duration": "*Baneo temporal: {{duration}}*",
      "permanent": "*Baneo permanente*",
      "messages_deleted": "*Mensajes eliminados de las últimas {{hours}}h*"
    },
    "history": {
      "title": "🛡️ Historial de Moderación - {{user}}",
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderador:** {{moderator}}\n**Razón:** {{reason}}{{duration}}",
      "footer": "Mostrando las {{count}} acciones más recientes"
    }
  },
  "leveling": {
    "embed": {
      "level": "Nivel",
      "total_xp": "XP Total",
      "messages": "Mensajes",
      "progress": "Progreso",
      "footer": "¡Mantente activo para subir de nivel!"
    },
    "rank": {
      "description": "Tu posición actual es {{rank}} con nivel {{level}} y {{xp}} XP."
    },
    "leaderboard": {
      "title": "Tabla de Clasificación del Servidor",
      "stats": "Nivel: {{level}} | XP: {{xp}}",
      "footer": "Página {{page}}/{{total}} • {{users}} usuarios en total",
      "unknown_user": "Usuario Desconocido"
    },
    "errors": {
      "disabled": "❌ El sistema de niveles está desactivado en este servidor.",
      "user_not_found": "❌ Usuario no encontrado.",
      "no_rank": "❌ Aún no tienes una posición. ¡Envía algunos mensajes!",
      "invalid_page": "❌ Página inválida. La página máxima es {{max}}.",
      "no_data": "❌ No se encontraron datos para este servidor."
    }
  },
  "serverstats": {
    "slash": {
      "description": "Ver estadísticas del servidor",
      "subcommands": {
        "overview": {
          "description": "Ver vista general del servidor"
        },
        "members": {
          "description": "Ver estadísticas de miembros",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        },
        "activity": {
          "description": "Ver estadísticas de actividad",
          "options": {
            "period": "Período de tiempo para ver estadísticas"
          }
        },
        "growth": {
          "description": "Ver estadísticas de crecimiento del servidor"
        },
        "support": {
          "description": "Ver estadísticas de tickets de soporte",
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
        "roles": {
          "description": "Ver estadísticas de distribución de roles"
        }
      }
    },
    "choices": {
      "period_day": "Hoy",
      "period_week": "Esta Semana",
      "period_month": "Este Mes",
      "period_all": "Todo el Tiempo"
    },
    "options": {
      "serverstats_members_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_activity_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_growth_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_support_period_period": "Período de tiempo para ver estadísticas",
      "serverstats_channels_period_period": "Período de tiempo para ver estadísticas"
    },
    "errors": {
      "overview_failed": "❌ Error al obtener la vista general del servidor. Por favor intenta de nuevo.",
      "members_failed": "❌ Error al obtener estadísticas de miembros. Por favor intenta de nuevo.",
      "activity_failed": "❌ Error al obtener estadísticas de actividad. Por favor intenta de nuevo.",
      "growth_failed": "❌ Error al obtener estadísticas de crecimiento. Por favor intenta de nuevo.",
      "support_failed": "❌ Error al obtener estadísticas de soporte. Por favor intenta de nuevo.",
      "channels_failed": "❌ Error al obtener estadísticas de canales. Por favor intenta de nuevo.",
      "roles_failed": "❌ Error al obtener estadísticas de roles. Por favor intenta de nuevo.",
      "no_data": "📊 No hay suficientes datos aún. Las estadísticas de {{type}} estarán disponibles después de algunos días de seguimiento.",
      "no_activity": "📊 No hay datos de actividad de canales disponibles aún."
    },
    "overview": {
      "title": "📊 {{server}} - Vista General del Servidor",
      "members": "👥 Miembros",
      "members_value": "**Total:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}\n**En línea:** {{online}}",
      "channels": "📝 Canales",
      "channels_value": "**Total:** {{total}}\n**Texto:** {{text}}\n**Voz:** {{voice}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Más alto:** {{highest}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Estáticos:** {{static}}\n**Animados:** {{animated}}",
      "info": "ℹ️ Info del Servidor",
      "info_value": "**Dueño:** {{owner}}\n**Creado:** {{created}}\n**Nivel de Boost:** {{boostLevel}}",
      "boosts": "🚀 Boosts",
      "boosts_value": "**Cantidad:** {{count}}\n**Boosters:** {{boosters}}",
      "footer": "ID del Servidor: {{id}}"
    },
    "members": {
      "title": "👥 Estadísticas de Miembros - {{period}}",
      "current": "📈 Estadísticas Actuales",
      "current_value": "**Total de Miembros:** {{total}}\n**Humanos:** {{humans}}\n**Bots:** {{bots}}",
      "new_members": "🆕 Nuevos Miembros",
      "new_members_value": "**Se unieron:** {{joined}}\n**Promedio/Día:** {{avgPerDay}}",
      "growth": "📊 Crecimiento",
      "growth_value": "**Cambio:** {{change}}\n**Porcentaje:** {{percent}}%",
      "footer": "Período: {{period}}"
    },
    "activity": {
      "title": "📊 Estadísticas de Actividad - {{period}}",
      "messages": "💬 Mensajes",
      "messages_value": "**Total:** {{total}}\n**Prom/Día:** {{avgPerDay}}",
      "top_channels": "🔥 Top Canales",
      "top_users": "⭐ Usuarios Más Activos",
      "peak_hour": "⏰ Hora Pico",
      "peak_hour_value": "**{{hour}}:00 - {{hourEnd}}:00** con {{messages}} mensajes",
      "footer": "Período: {{period}}"
    },
    "growth": {
      "title": "📈 Estadísticas de Crecimiento del Servidor",
      "30day": "📊 Crecimiento de 30 Días",
      "30day_value": "**Cambio Total:** {{change}}\n**Porcentaje:** {{percent}}%\n**Inicio:** {{start}}\n**Actual:** {{current}}",
      "trend": "📅 Tendencia Reciente",
      "trend_value": "**Crecimiento Diario Prom:** {{avgDaily}}\n**Proyectado (30d):** {{projected}}",
      "footer": "Basado en los últimos 30 días de datos"
    },
    "support": {
      "title": "🎫 Estadísticas de Soporte - {{period}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Abiertos:** {{open}}\n**Cerrados:** {{closed}}",
      "response_times": "⏱️ Tiempos de Respuesta",
      "response_times_value": "**Respuesta Prom:** {{avgResponse}}\n**Resolución Prom:** {{avgResolution}}",
      "top_staff": "⭐ Top Staff (Todo el Tiempo)",
      "footer": "Período: {{period}}"
    },
    "channels": {
      "title": "📝 Actividad de Canales - {{period}}",
      "footer": "Período: {{period}} | Top 10 canales",
      "entry": "**{{index}}.** {{channel}}\n└ {{messages}} mensajes"
    },
    "roles": {
      "title": "🎭 Distribución de Roles",
      "footer": "Total de roles: {{total}} | Mostrando top 15",
      "entry": "**{{index}}.** {{role}}\n└ {{count}} miembros ({{percent}}%)"
    },
    "periods": {
      "day": "Hoy",
      "week": "Esta Semana",
      "month": "Este Mes",
      "all": "Todo el Tiempo"
    }
  },
  "transcript": {
    "title": "Transcripción de Ticket #{{ticketId}}",
    "error_generating": "Error al generar la transcripción",
    "labels": {
      "ticket": "Ticket",
      "category": "Categoría",
      "created": "Creado",
      "status": "Estado",
      "open": "Abierto",
      "closed": "Cerrado",
      "duration": "Duración",
      "messages": "Mensajes",
      "attended_by": "Atendido por",
      "rating": "Calificación",
      "active": "Activo",
      "no_messages": "No hay mensajes en este ticket",
      "generated_on": "Transcripción generada el {{date}}"
    }
  },
  "dashboard": {
    "title": "📊 Centro de Control y Estadísticas",
    "description": "📡 *Este panel se actualiza en tiempo real*",
    "global_stats": "📈 Estadísticas Globales",
    "top_staff": "🏆 Top Staff",
    "away_staff": "💤 Staff Ausente",
    "observability": "📡 Observabilidad",
    "total_tickets": "📊 Total de Tickets",
    "open_tickets": "🟢 Tickets Abiertos",
    "closed_today": "🔴 Cerrados Hoy",
    "opened_today": "📅 Abiertos Hoy",
    "no_data": "Aún no hay datos",
    "all_active": "Todo el equipo está activo ✅",
    "no_recent_activity": "Sin actividad reciente registrada.",
    "auto_update": "🔄 Actualización automática cada 30s"
  },
  "weekly_report": {
    "title": "Reporte de Rendimiento Semanal - {{guildName}}",
    "description": "Aquí tienes el resumen de actividad en el servidor durante los últimos 7 días.",
    "tickets_opened": "Tickets Abiertos",
    "tickets_closed": "Tickets Cerrados",
    "currently_open": "Abiertos Actualmente",
    "avg_rating": "Valoración Promedio",
    "response_time": "Tiempo de Respuesta Promedio",
    "top_staff": "Mejor Staff del Mes",
    "active_categories": "Categorías más Activas",
    "footer": "Excelencia Operativa • TON618",
    "no_data": "Sin actividad significativa registrada."
  },
  "leaderboard": {
    "title": "🏆 Leaderboard de Staff",
    "no_data": "Aún no hay datos de staff.",
    "closed": "cerrados",
    "claimed": "reclamados"
  },
  "staff_rating": {
    "leaderboard_title": "🏆 Leaderboard de Staff — Calificaciones",
    "no_ratings": "Aún no hay calificaciones registradas.\n\nLas calificaciones aparecen cuando los usuarios califican tickets cerrados.",
    "star_full": "⭐ estrella completa",
    "star_half": "✨ media",
    "star_empty": "☆ vacía",
    "profile_title": "📊 Calificaciones de {{username}}",
    "no_ratings_profile": "Este miembro del staff aún no tiene calificaciones registradas.",
    "average": "⭐ Promedio",
    "total_ratings": "📊 Total calificaciones",
    "max": "🎯 Máximo posible",
    "distribution": "📈 Distribución",
    "trend_excellent": "🔥 Excelente",
    "trend_good": "✅ Bueno",
    "trend_average": "⚠️ Regular",
    "trend_needs_improve": "❌ Necesita mejorar"
  },
  "observability": {
    "window": "Ventana",
    "interactions": "Interacciones",
    "scope_errors": "Errores por scope",
    "top_error": "Top error"
  },
  "case_brief": {
    "title": "📋 Case Brief - Ticket #{{ticketId}}",
    "status": "Estado",
    "open": "🟢 Abierto",
    "closed": "🔒 Cerrado",
    "risk_level": "Nivel de Riesgo",
    "no_risk_factors": "Sin factores de riesgo detectados",
    "next_action": "Siguiente Acción",
    "operational_context": "Contexto Operativo",
    "recommendations": "Recomendaciones",
    "footer": "Case Brief generado automáticamente por TON618",
    "pro_unlock_title": "Análisis de Riesgo y Recomendaciones",
    "pro_unlock_description": "Actualiza a **Pro** para desbloquear el Case Brief completo con análisis de riesgo, recomendaciones inteligentes y sugerencias de siguiente acción.",
    "risks": {
      "high_priority_category": "Categoría de alta prioridad",
      "urgent_priority": "Prioridad urgente",
      "outside_sla": "Fuera de SLA sin respuesta",
      "reopened_times": "Reabierto {{count}} veces",
      "extensive_conversation": "Conversación extensa (>50 mensajes)",
      "unassigned_30min": "Sin asignar por más de 30 minutos"
    },
    "actions": {
      "closed_no_action": "Ticket cerrado. No requiere acción.",
      "urgent_first_response": "🔴 **URGENTE**: Dar primera respuesta al usuario",
      "claim_or_assign": "Reclamar o asignar el ticket a un miembro del staff",
      "near_sla_limit": "Resolver pronto - cerca del límite SLA",
      "urgent_priority_resolve": "Resolver con prioridad urgente",
      "review_reopen": "Revisar por qué fue reabierto y resolver definitivamente",
      "continue_normal": "Continuar atención normal del ticket"
    },
    "context_labels": {
      "type": "Tipo",
      "age": "Edad",
      "first_response": "1ª respuesta",
      "pending": "⚠️ Pendiente",
      "responsible": "Responsable",
      "assigned": "Asignado",
      "unassigned": "⚠️ Sin asignar",
      "messages": "Mensajes",
      "reopenings": "Reaperturas"
    },
    "recommendations_list": {
      "respond_immediately": "• Responder inmediatamente al usuario",
      "use_claim": "• Usar `/ticket claim` para tomar responsabilidad",
      "consider_priority": "• Considerar elevar la prioridad con `/ticket priority`",
      "escalate": "• Escalar a supervisor si no se puede resolver pronto",
      "review_history": "• Revisar historial con `/ticket history` antes de cerrar",
      "document_resolution": "• Documentar resolución en notas internas",
      "verify_user": "• Verificar si el usuario sigue necesitando ayuda",
      "continue_normal": "• Continuar con el flujo normal de resolución"
    }
  },
  "health_monitor": {
    "downtime_recovery_title": "Salud del bot: recuperación de caída",
    "downtime_recovery_description": "El bot volvió a estar activo en **{{guildName}}**.\nTiempo estimado sin heartbeat: **{{minutes}} min**.",
    "ping_high_title": "Salud del bot: ping alto",
    "ping_high_description": "Ping actual: **{{pingMs}}ms** (umbral {{thresholdMs}}ms)\nServidor: **{{guildName}}**",
    "error_rate_high_title": "Salud del bot: error rate alto",
    "error_rate_high_description": "Error rate: **{{errorRatePct}}%** (umbral {{thresholdPct}}%)\nServidor: **{{guildName}}**",
    "field_interactions": "Interacciones ventana",
    "field_error_rate": "Error rate",
    "field_errors": "Errores",
    "field_ping": "Ping"
  },
  "daily_sla_report": {
    "title": "Reporte Diario de SLA",
    "window": "Ventana de monitoreo: {{from}} a {{to}}",
    "opened_24h": "Abiertos (24h)",
    "closed_24h": "Cerrados (24h)",
    "avg_first_response": "Prom. Primera Respuesta",
    "open_out_of_sla": "Fuera de SLA",
    "open_escalated": "Escalados",
    "sla_compliance": "Cumplimiento SLA",
    "top_staff": "Top Staff (Cierres)",
    "no_closures": "No se registraron cierres en las últimas 24h.",
    "no_data": "Sin datos",
    "no_sla_threshold": "Sin umbral SLA"
  },
  "wizard": {
    "title": "Resultado de Configuración Rápida",
    "description": "El sistema ha sido configurado con los siguientes ajustes.",
    "summary_label": "Resumen de Configuración",
    "next_step_label": "Próximos Pasos Recomendados",
    "pro_next_step": "¡Todo está listo! Tu plan Pro está activo y los playbooks están habilitados.",
    "free_next_step": "Sistema listo. Considera mejorar a Pro para habilitar playbooks de automatización avanzada.",
    "footer": "TON618 Bot • Asistente de Configuración",
    "panel_status": {
      "published": "✅ Publicado",
      "skipped": "⏩ Omitido",
      "missing_permissions": "❌ Error de Permisos",
      "error": "❌ Error Crítico ({{error}})"
    }
  },
  "crons": {
    "auto_close": {
      "title": "Ticket cerrado automáticamente"
    },
    "reminders": {
      "footer": "Recordatorio de TON618"
    }
  },
  "economy": {
    "items": {
      "role_vip": {
        "name": "🎖️ Rol VIP",
        "description": "Rol VIP por 30 días"
      },
      "role_premium": {
        "name": "💎 Rol Premium",
        "description": "Rol Premium por 30 días"
      },
      "role_staff": {
        "name": "👔 Rol Staff",
        "description": "Rol Staff temporal"
      },
      "boost_xp": {
        "name": "⚡ XP Boost",
        "description": "2x XP por 1 día"
      },
      "boost_daily": {
        "name": "💰 Daily Boost",
        "description": "2x recompensas diarias por 7 días"
      },
      "ticket": {
        "name": "🎫 Ticket Extra",
        "description": "Un ticket adicional"
      },
      "background": {
        "name": "🖼️ Background",
        "description": "Fondo personalizado para profile"
      },
      "color": {
        "name": "🎨 Color de nombre",
        "description": "Color personalizado en embed"
      },
      "badge": {
        "name": "🏅 Insignia",
        "description": "Insignia en tu perfil"
      },
      "crate_common": {
        "name": "📦 Caja Común",
        "description": "Suerte de 50-200 monedas"
      },
      "crate_rare": {
        "name": "✨ Caja Rara",
        "description": "Suerte de 200-500 monedas"
      },
      "crate_epic": {
        "name": "💜 Caja Épica",
        "description": "Suerte de 500-1500 monedas"
      },
      "crate_legendary": {
        "name": "🔥 Caja Legendaria",
        "description": "Suerte de 1500-5000 monedas"
      }
    }
  },
  "automod": {
    "labels": {
      "spam": "Prevención de Spam",
      "invites": "Bloqueo de invitaciones",
      "scam": "Bloqueo de frases de estafa",
      "regex": "Filtrado por patrones Regex"
    }
  },
  "sla_alerts": {
    "title": "Alerta SLA - Sin respuesta del staff",
    "description": "El ticket <#{{channelId}}> **#{{ticketId}}** lleva **{{time}}** sin respuesta del staff.",
    "user": "Usuario",
    "category": "Categoría",
    "sla_limit": "Límite SLA",
    "minutes_plural": "{{count}} minutos",
    "hours_minutes": "{{h}}h {{m}}m"
  },
  "sla_escalation": {
    "title": "Escalado SLA - Atención requerida",
    "description": "El ticket <#{{channelId}}> **#{{ticketId}}** superó el umbral de escalado (**{{limit}} min**) sin respuesta del staff.",
    "user": "Usuario",
    "category": "Categoría"
  },
  "verification": {
    "autokick": {
      "reason_log": "Auto-kick tras {{hours}}h sin verificación",
      "title": "Auto-kick: miembro no verificado",
      "description": "{{member}} (`{{tag}}`) fue expulsado tras permanecer no verificado por {{hours}}h.",
      "kick_reason": "No verificado tras {{hours}}h"
    }
  },
  "smart_ping": {
    "title": "Smart Ping - Atención necesaria",
    "description": "Este ticket lleva más de **{{time}}** sin respuesta del staff.",
    "user": "Usuario",
    "category": "Categoría",
    "hours_plural": "{{count}} hora(s)"
  },
  "economy.buy.not_found": "El item no existe en la tienda.",
  "economy.buy.insufficient_funds": "Necesitas {{price}} monedas. Tienes {{wallet}}.",
  "economy.buy.crate_win": "¡Ganaste {{reward}} monedas de la caja!",
  "economy.buy.success": "¡Compraste {{name}}!",
  "economy.buy.error": "Error al procesar la compra.",
  "common.units.minutes_short": "m",
  "common.units.hours_short": "h",
  "common.units.days_short": "d",
  "common.units.weeks_short": "sem",
  "ticket.workflow.waiting_staff": "Esperando staff",
  "ticket.workflow.waiting_user": "Esperando usuario",
  "ticket.workflow.triage": "En revisión",
  "ticket.workflow.assigned": "Asignado",
  "ticket.workflow.open": "Abierto",
  "ticket.workflow.closed": "Cerrado",
  "ticket.labels.category": "Categoría",
  "ticket.labels.priority": "Prioridad",
  "ticket.labels.assigned": "Asignado a",
  "ticket.labels.claimed": "Reclamado por",
  "ticket.labels.status": "Estado",
  "giveaway.embed.prize": "Premio",
  "giveaway.embed.winners": "Ganadores",
  "giveaway.embed.ends": "Finaliza",
  "giveaway.embed.hosted_by": "Organizado por",
  "giveaway.embed.click_participant": "¡Haz clic en el botón de abajo para participar!",
  "giveaway.embed.participate_label": "Participar",
  "giveaway.embed.status_ended": "Sorteo Finalizado",
  "giveaway.embed.status_no_participants": "No hubo participantes válidos.",
  "giveaway.embed.status_cancelled": "Sorteo cancelado.",
  "giveaway.embed.winners_announcement": "¡Felicidades {{winners}}! Ganaste **{{prize}}**!",
  "giveaway.embed.reroll_announcement": "¡Nuevos ganadores: {{winners}}! Felicidades, ganaron **{{prize}}**!",
  "giveaway.requirements.role": "Rol Requerido: {{role}}",
  "giveaway.requirements.level": "Nivel Requerido: {{level}}",
  "giveaway.requirements.account_age": "Antigüedad mínima: {{days}} días",
  "giveaway.success.created": "¡Sorteo creado en {{channel}}! [Ir al mensaje]({{url}})",
  "giveaway.success.ended": "¡Sorteo finalizado! Ganadores: {{winners}}",
  "giveaway.success.rerolled": "¡Reroll completado! Nuevos ganadores: {{winners}}",
  "giveaway.success.cancelled": "Sorteo cancelado correctamente.",
  "giveaway.errors.not_found": "Sorteo no encontrado.",
  "giveaway.errors.already_ended": "Este sorteo ya ha finalizado.",
  "giveaway.errors.no_participants": "No se unieron participantes al sorteo.",
  "giveaway.errors.no_active": "No hay sorteos activos.",
  "giveaway.errors.create_failed": "Error al crear el sorteo.",
  "giveaway.errors.end_failed": "Error al finalizar el sorteo.",
  "giveaway.errors.reroll_failed": "Error al realizar el reroll.",
  "giveaway.errors.cancel_failed": "Error al cancelar el sorteo.",
  "suggest.audit.approved": "Sugerencia aprobada por {{user}}",
  "suggest.audit.rejected": "Sugerencia rechazada por {{user}}",
  "suggest.audit.thread_reason": "Hilo de debate para sugerencia #{{num}}",
  "verify.audit.completed": "Verificación completada",
  "verify.audit.removed": "Verificación eliminada",
  "help.embed.home_title": "Centro de Ayuda TON618",
  "help.embed.home_desc": "Bienvenido al centro de ayuda de **{{guild}}**. Selecciona una categoría abajo para explorar los comandos.",
  "help.embed.home_footer": "Seguridad y Soporte TON618 • {{guild}}",
  "help.embed.home_overview": "Resumen del Sistema",
  "help.embed.home_overview_value": "Gestión avanzada de tickets, soporte multi-idioma y herramientas de utilidad para servidores Pro.",
  "help.embed.home_visibility": "Tu Acceso",
  "help.embed.home_visibility_value": "Nivel: **{{access}}**\nDisponible: **{{commands}}** comandos en **{{categories}}** categorías.\n{{simple_help}}",
  "help.embed.home_categories": "Categorías Disponibles",
  "help.embed.home_quick_start": "Sugerencias de Inicio Rápido",
  "help.embed.category_title": "Comandos de {{category}}",
  "help.embed.category_desc": "Documentación detallada para este grupo de comandos.",
  "help.embed.category_footer": "Sistema TON618 • {{guild}}",
  "help.embed.command_footer": "Manual TON618 • {{guild}}",
  "help.embed.command_desc": "**Resumen:** {{summary}}\n**Categoría:** {{category}}\n**Acceso:** `{{access}}`{{focus}}",
  "help.embed.focused_match": "Coincidencia: `{{usage}}`",
  "help.embed.and_word": "y",
  "help.embed.required_label": "Requerido",
  "help.embed.optional_label": "Opcional",
  "help.embed.no_description": "Sin descripción proporcionada.",
  "help.embed.command_not_found": "Comando no encontrado",
  "help.embed.command_not_found_desc": "No se pudo encontrar ningún comando que coincida con `{{command}}`.",
  "help.embed.page_label": "Página",
  "help.embed.continued_suffix": " (cont.)",
  "help.embed.overview_prefix": "Resumen",
  "help.embed.visible_commands_label": "Comandos Interactivos",
  "help.embed.visible_entries_label": "Usos Únicos",
  "help.embed.command_singular": "comando",
  "help.embed.command_plural": "comandos",
  "help.embed.visible_entry_singular": "uso",
  "help.embed.visible_entry_plural": "usos",
  "help.embed.simple_help_note": "*(Nota: Algunos comandos avanzados están ocultos debido al modo Ayuda Simple)*",
  "help.embed.categories.utility": "Utilidad",
  "help.embed.categories.tickets": "Tickets",
  "help.embed.categories.fun": "Comunidad y Diversión",
  "help.embed.categories.moderation": "Moderación",
  "help.embed.categories.config": "Configuración",
  "help.embed.categories.system": "Sistema e Interno",
  "help.embed.categories.general": "General",
  "help.embed.categories.other": "Otros",
  "help.embed.categories.owner": "Propietario",
  "help.embed.categories.admin": "Administrador",
  "help.embed.categories.staff": "Miembro del Staff",
  "help.embed.categories.member": "Miembro Regular",
  "help.embed.quick_start_notes.ticket_open": "Abrir un ticket de soporte",
  "help.embed.quick_start_notes.help_base": "Volver a este menú",
  "help.embed.quick_start_notes.staff_my_tickets": "Ver tus tickets asignados",
  "help.embed.quick_start_notes.ticket_claim": "Tomar control de un ticket",
  "help.embed.quick_start_notes.ticket_note_add": "Añadir nota interna de staff",
  "help.embed.quick_start_notes.modlogs_info": "Consultar historial de moderación",
  "help.embed.quick_start_notes.setup_wizard": "Lanzar asistente de configuración",
  "help.embed.quick_start_notes.config_status": "Verificar configuración del servidor",
  "help.embed.quick_start_notes.verify_panel": "Desplegar sistema de verificación",
  "help.embed.quick_start_notes.stats_sla": "Ver reportes de SLA de tickets",
  "help.embed.quick_start_notes.debug_status": "Verificar estado del bot",
  "help.embed.command_help": "Comando: /{{command}}",
  "help.embed.field_entries": "Usos",
  "help.embed.no_commands_in_category": "No hay comandos disponibles en esta categoría.",
  "help.embed.select_home": "Inicio",
  "help.embed.select_placeholder": "Seleccionar una categoría",
  "help.embed.owner_only_menu": "Solo el usuario que abrió este panel puede navegarlo.",
  "help.embed.expired_placeholder": "Sesión expirada — usa /help de nuevo",
  "help.embed.denied_owner": "Este panel de ayuda está restringido al propietario del bot.",
  "help.embed.denied_staff": "Este panel de ayuda está restringido a miembros del staff.",
  "help.embed.denied_default": "No tienes permiso para ver este panel de ayuda.",
  "economy.deposit.insufficient": "No tienes suficientes monedas en tu wallet.",
  "economy.deposit.success": "Has depositado {{amount}} monedas.",
  "economy.deposit.error": "Error al depositar.",
  "economy.withdraw.insufficient": "No tienes suficientes monedas en el banco.",
  "economy.withdraw.success": "Has retirado {{amount}} monedas.",
  "economy.withdraw.error": "Error al retirar.",
  "economy.daily.already_claimed": "Ya reclamaste tus monedas diarias hoy.",
  "economy.daily.success": "¡Reclamaste {{reward}} monedas! (Racha: {{streak}})",
  "economy.daily.error": "Error al reclamar diario.",
  "economy.transfer.self_transfer": "No puedes transferirte monedas a ti mismo.",
  "economy.transfer.insufficient": "No tienes suficientes monedas.",
  "economy.transfer.success": "Has transferido {{amount}} monedas a {{user}}.",
  "economy.transfer.error": "Error al transferir.",
  "economy.work.no_job": "No tienes un trabajo. Usa `/work set` para conseguir uno.",
  "economy.work.cooldown": "Espera {{remaining}} minutos para trabajar de nuevo.",
  "economy.work.success": "¡Trabajaste como **{{job}}** y ganaste {{amount}} monedas!",
  "economy.work.error": "Error al trabajar.",
  "suggest.audit.status_updated": "Sugerencia {{status}} por {{user}}",
  "crons.reminders.title": "Recordatorio",
  "crons.reminders.field_ago": "Establecido hace {{time}}",
  "crons.auto_close.warning_desc": "⚠️ <@{{user}}> Este ticket será cerrado automáticamente en ~30 minutos por inactividad.\nResponde para evitar el cierre.",
  "crons.auto_close.event_desc": "El ticket #{{ticketId}} fue cerrado por inactividad.",
  "crons.auto_close.archive_warning_transcript": "No se pudo generar la transcripción del ticket. El canal quedará cerrado pero no se eliminará.",
  "giveaway": {
    "slash": {
      "description": "Gestionar sorteos en el servidor",
      "subcommands": {
        "create": { "description": "Crear un nuevo sorteo" },
        "end": { "description": "Finalizar un sorteo activo antes de tiempo" },
        "reroll": { "description": "Elegir nuevos ganadores para un sorteo finalizado" },
        "list": { "description": "Listar todos los sorteos activos" },
        "cancel": { "description": "Cancelar un sorteo activo sin ganadores" }
      },
      "options": {
        "prize": "El premio a sortear",
        "duration": "Duración (ej: 30s, 5m, 2h, 1d, 1w)",
        "winners": "Número de ganadores (1-20)",
        "channel": "Canal donde publicar el sorteo",
        "requirement_type": "Tipo de requisito para entrar",
        "requirement_value": "Valor para el requisito",
        "emoji": "Emoji personalizado para reaccionar",
        "description": "Detalles adicionales del sorteo",
        "required_role_2": "Requisito de rol adicional (Pro)",
        "bonus_role": "Rol para oportunidades extra (Pro)",
        "bonus_weight": "Peso para el rol de bono (Pro)",
        "min_account_age": "Antigüedad mínima de la cuenta en días (Pro)",
        "message_id": "ID del mensaje del sorteo"
      }
    },
    "choices": {
      "requirement_none": "Ninguno",
      "requirement_role": "Rol",
      "requirement_level": "Nivel",
      "requirement_account_age": "Antigüedad de cuenta"
    },
    "embed": {
      "title": "🎉 Sorteo",
      "prize": "Premio",
      "winners": "Ganadores",
      "ends": "Finaliza",
      "hosted_by": "Organizado por",
      "click_participant": "¡Haz clic en el botón de abajo para participar!",
      "participate_label": "Participar",
      "status_ended": "Estado",
      "status_no_participants": "Finalizado (Sin participantes)",
      "status_cancelled": "Cancelado",
      "winners_announcement": "¡Felicidades {{winners}}! Ganaste **{{prize}}**!",
      "reroll_announcement": "¡Nuevo(s) ganador(es): {{winners}}! Ganaste **{{prize}}**!",
      "requirements": "Requisitos"
    },
    "requirements": {
      "role": "Debe tener el rol: {{role}}",
      "level": "Debe ser al menos nivel: {{level}}",
      "account_age": "La cuenta debe tener al menos {{days}} días"
    },
    "success": {
      "created": "✅ ¡Sorteo creado en {{channel}}! [[Ir al Mensaje]]({{url}})",
      "ended": "✅ Sorteo finalizado. Ganadores: {{winners}}",
      "rerolled": "✅ ¡Re-sorteado! Nuevos ganadores: {{winners}}",
      "cancelled": "✅ El sorteo ha sido cancelado.",
      "requirement_role_2": "También debe tener: <@&{{roleId}}>",
      "requirement_bonus": "[PRO] Oportunidades extra para <@&{{roleId}}> (x{{weight}})"
    },
    "errors": {
      "create_failed": "Error al crear el sorteo.",
      "not_found": "Sorteo no encontrado.",
      "already_ended": "Este sorteo ya ha finalizado.",
      "no_participants": "No se encontraron participantes válidos para este sorteo.",
      "end_failed": "Error al finalizar el sorteo.",
      "reroll_failed": "Error al re-sortear los ganadores.",
      "cancel_failed": "Error al cancelar el sorteo."
    }
  },
  "poll": {
    "slash": {
      "description": "Sistema de encuestas interactivas",
      "subcommands": {
        "create": { "description": "Crear una nueva encuesta" },
        "end": { "description": "Finalizar una encuesta antes de tiempo" },
        "list": { "description": "Ver encuestas activas" }
      },
      "options": {
        "question": "Pregunta de la encuesta",
        "options": "Opciones separadas por |",
        "duration": "Duración (ej: 1h, 30m, 1d)",
        "multiple": "Permitir múltiples votos",
        "channel": "Canal de destino",
        "anonymous": "Ocultar resultados hasta el final (Pro)",
        "required_role": "Requisito para votar (Pro)",
        "max_votes": "Máximo de opciones permitidas (Pro)",
        "id": "ID de encuesta (últimos 6 caracteres)"
      }
    },
    "errors": {
      "pro_required": "✨ Esta opción requiere **TON618 Pro**. ¡Mejora para desbloquear funciones avanzadas!",
      "min_options": "Necesitas al menos 2 opciones.",
      "max_options": "Solo puedes tener hasta 10 opciones.",
      "option_too_long": "Una de las opciones es demasiado larga (máx. 80 caracteres).",
      "min_duration": "La encuesta debe durar al menos 1 minuto.",
      "max_duration": "La encuesta no puede durar más de 30 días.",
      "manage_messages_required": "Necesitas el permiso 'Gestionar Mensajes' para finalizar encuestas.",
      "poll_not_found": "Encuesta con ID `{{id}}` no encontrada.",
      "unknown_subcommand": "Subcomando de encuesta desconocido."
    },
    "placeholder": "📊 Cargando encuesta...",
    "embed": {
      "created_title": "✅ Encuesta Creada",
      "created_description": "La encuesta ha sido enviada a {{channel}}.",
      "title_prefix": "🗳️ Encuesta:",
      "title_ended_prefix": "🏁 Finalizada:",
      "field_question": "Pregunta",
      "field_options": "Opciones",
      "field_total_votes": "Votos Totales",
      "field_ends": "Finaliza",
      "field_created_by": "Creada por",
      "field_required_role": "Rol Requerido",
      "field_in": "Tiempo restante",
      "field_mode": "Modo de Votación",
      "field_id": "ID de Encuesta",
      "status_ended": "Encuesta Finalizada",
      "status_anonymous": "Resultados Ocultos",
      "mode_multiple": "Opción Múltiple",
      "mode_single": "Opción Única",
      "active_title": "📊 Encuestas Activas",
      "active_empty": "No hay encuestas activas en este servidor.",
      "active_channel_deleted": "Canal Eliminado",
      "active_item_votes": "Votos",
      "active_count_title": "📊 Encuestas Activas ({{count}})",
      "active_footer": "Usa /poll end <id> para finalizar una antes de tiempo",
      "vote_plural": "votos",
      "vote_singular": "voto",
      "footer_ended": "Votación cerrada",
      "footer_multiple": "Puedes votar por varias opciones",
      "footer_single": "Solo una opción permitida"
    },
    "success": {
      "ended": "✅ La encuesta **\"{{question}}\"** ha sido finalizada."
    }
  },
  "embed": {
    "slash": {
      "description": "✨ Constructor de embeds personalizados",
      "subcommands": {
        "create": { "description": "Crear y enviar un embed" },
        "edit": { "description": "Editar un embed existente" },
        "quick": { "description": "Enviar un embed rápido simple" },
        "announcement": { "description": "Plantilla de anuncio profesional" },
        "template": { 
          "description": "✨ Gestionar plantillas de embed (Pro)",
          "save": { "description": "Guardar la configuración actual como plantilla" },
          "load": { "description": "Cargar y enviar una plantilla" },
          "list": { "description": "Listar todas las plantillas del servidor" },
          "delete": { "description": "Eliminar una plantilla existente" }
        }
      },
      "options": {
        "channel": "Canal de destino",
        "color": "Color HEX",
        "image": "URL de la imagen",
        "thumbnail": "URL de la miniatura",
        "footer": "Texto del pie de página",
        "author": "Nombre del autor",
        "author_icon": "URL del icono del autor",
        "timestamp": "Mostrar fecha/hora",
        "mention": "Mención al enviar",
        "message_id": "ID del mensaje",
        "title": "Título",
        "description": "Descripción",
        "text": "Contenido del anuncio",
        "template_name": "Nombre de la plantilla"
      }
    },
    "errors": {
      "pro_required": "✨ Las plantillas de embed requieren **TON618 Pro**. ¡Mejora para guardar y reutilizar diseños!",
      "invalid_color": "Formato de color HEX inválido.",
      "invalid_image_url": "La URL de la imagen debe comenzar con http/https.",
      "invalid_thumbnail_url": "La URL de la miniatura debe comenzar con http/https.",
      "template_exists": "Ya existe una plantilla con el nombre `{{name}}`.",
      "template_not_found": "Plantilla `{{name}}` no encontrada.",
      "form_expired": "La sesión del formulario caducó. Por favor, reinicia el comando.",
      "channel_not_found": "Canal de destino no encontrado.",
      "message_not_found": "Mensaje no encontrado en este canal.",
      "not_bot_message": "Ese mensaje no fue enviado por el bot.",
      "no_embeds": "Ese mensaje no contiene ningún embed."
    },
    "success": {
      "template_saved": "✅ Plantilla **{{name}}** guardada exitosamente.",
      "template_deleted": "✅ Plantilla **{{name}}** eliminada.",
      "sent": "✅ Embed enviado a {{channel}}.",
      "edited": "✅ Embed editado exitosamente.",
      "announcement_sent": "📢 Anuncio emitido en {{channel}}."
    },
    "templates": {
      "no_templates": "No hay plantillas guardadas en este servidor. Usa `/embed template save` para crear una.",
      "list_title": "Plantillas de Embed - {{guildName}}",
      "footer": "Total: {{count}}/50 plantillas"
    },
    "modal": {
      "create_title": "✨ Crear Embed",
      "edit_title": "✏️ Editar Embed",
      "field_title_label": "Título (dejar en blanco para ninguno)",
      "field_description_label": "Descripción",
      "field_description_placeholder": "Escribe el contenido del embed aquí...",
      "field_extra_label": "Campos extra (nombre|valor|inline)",
      "field_extra_placeholder": "Nombre del Campo|Valor del Campo|true\nOtro Campo|Otro valor|false",
      "field_color_label": "Color HEX sin #",
      "field_extra_fallback_name": "Campo"
    },
    "footer": {
      "sent_by": "Enviado por {{username}}",
      "announcement": "Anuncio Oficial de {{guildName}}"
    },
    "announcement_prefix": "📢 "
  },
  "profile": {
    "slash": {
      "description": "Perfil simple: nivel + economía",
      "subcommands": {
        "view": { "description": "Ver un perfil" },
        "top": { "description": "Ver tabla de clasificación" }
      },
      "options": {
        "user": "Usuario a consultar"
      }
    },
    "embed": {
      "title": "Perfil de {{username}}",
      "field_level": "Nivel",
      "field_total_xp": "XP Total",
      "field_rank": "Rango",
      "field_wallet": "Cartera",
      "field_bank": "Banco",
      "field_total": "Patrimonio Total",
      "user_fallback": "Usuario #{{id}}",
      "top_title": "🏆 Tabla de Clasificación",
      "top_levels": "📊 Top Niveles",
      "top_economy": "💰 Miembros más Ricos",
      "no_data": "No hay participantes aún.",
      "level_format": "Nivel {{level}}",
      "coins_format": "{{amount}} monedas",
      "page_format": "Página {{current}} de {{total}}"
    }
  },
  "crons.auto_close.archive_warning_inaccessible": "El canal de transcripciones configurado no es accesible. El canal no se eliminará.",
  "crons.auto_close.archive_warning_error": "Ocurrió un error al archivar la transcripción. El canal quedará cerrado pero no se eliminará.",
  "crons.auto_close.embed_title_auto": "Ticket cerrado automáticamente",
  "crons.auto_close.embed_title_manual": "Ticket cerrado sin borrar canal",
  "crons.auto_close.embed_desc_auto": "Este ticket fue cerrado por inactividad y será eliminado en unos segundos.",
  "interaction.shutdown.rebooting": "El bot se está reiniciando para aplicar actualizaciones. Por favor, intenta de nuevo en 15 segundos.",
  "premium.reminder.field_plan": "Plan",
  "crons.polls.ended_title": "Encuesta Finalizada",
  "crons.polls.ended_desc": "La encuesta **\"{{question}}\"** ha terminado.",
  "events.modlog.ban_title": "🔨 Usuario Baneado",
  "events.modlog.unban_title": "✅ Usuario Desbaneado",
  "events.modlog.edit_title": "✏️ Mensaje Editado",
  "events.modlog.fields.user": "👤 Usuario",
  "events.modlog.fields.author": "👤 Autor",
  "events.modlog.fields.executor": "🛡️ Ejecutado por",
  "events.modlog.fields.channel": "📍 Canal",
  "events.modlog.fields.reason": "📋 Razón",
  "events.modlog.fields.link": "🔗 Enlace",
  "events.modlog.fields.before": "📝 Antes",
  "events.modlog.fields.after": "📝 Después",
  "events.modlog.no_reason": "Sin razón especificada",
  "events.modlog.unknown_executor": "Desconocido",
  "events.modlog.edit_empty": "*(vacío)*",
  "events.modlog.goto_message": "Ir al mensaje",
  "modals.tags.success_title": "Etiqueta Creada",
  "modals.tags.success_desc": "La etiqueta **{{name}}** ha sido creada exitosamente.",
  "modals.tags.error_empty": "El contenido no puede estar vacío.",
  "modals.tags.error_exists": "Ya existe una etiqueta con ese nombre.",
  "modals.tags.error_failed": "Ocurrió un error al crear la etiqueta.",
  "modals.tags.footer": "Creado por {{user}}",
  "modals.suggest.success_msg": "Tu sugerencia ha sido enviada exitosamente.",
  "interaction.error_generic": "Ocurrió un error inesperado al ejecutar este comando. Por favor, contacta al administrador.",
  "profile": {
    "slash": {
      "description": "Perfil simple: nivel + economía",
      "subcommands": {
        "view": { "description": "Ver un perfil" },
        "top": { "description": "Ver tabla de clasificación" }
      },
      "options": {
        "user": "Usuario objetivo a inspeccionar"
      }
    },
    "embed": {
      "title": "Perfil de {{username}}",
      "field_level": "Nivel",
      "field_total_xp": "XP Total",
      "field_rank": "Rango",
      "field_wallet": "Cartera",
      "field_bank": "Banco",
      "field_total": "Total Neto",
      "user_fallback": "Usuario #{{id}}",
      "top_title": "🏆 Tabla de Clasificación",
      "top_levels": "📊 Top Niveles",
      "top_economy": "💰 Miembros más Ricos",
      "no_data": "Sin participantes aún.",
      "level_format": "Nivel {{level}}",
      "coins_format": "{{amount}} monedas",
      "page_format": "Página {{current}} de {{total}}"
    }
  },
  "staff": {
    "slash": {
      "description": "Utilidades de gestión y moderación exclusivas para el personal",
      "subcommands": {
        "away_on": { "description": "Márcate como ausente con una razón opcional" },
        "away_off": { "description": "Limpia tu estado de ausencia y vuelve a estar activo" },
        "my_tickets": { "description": "Revisa tus tickets actualmente reclamados y asignados" },
        "warn_add": { "description": "Aplicar una advertencia formal a un miembro" },
        "warn_check": { "description": "Revisar el historial de advertencias de un miembro" },
        "warn_remove": { "description": "Eliminar una advertencia específica por su ID único" }
      },
      "options": {
        "reason": "Nota que explica tu estado de ausencia",
        "user": "El miembro a inspeccionar o advertir",
        "warn_reason": "Descripción de la infracción",
        "warning_id": "El ID de 6 caracteres de la advertencia"
      }
    },
    "moderation_required": "No tienes permisos suficientes para gestionar las advertencias de los miembros."
  },
  "stats": {
    "slash": {
      "description": "Métricas de tickets de alta fidelidad y análisis de rendimiento",
      "subcommands": {
        "server": { "description": "Vista general operativa de los totales de tickets y tendencias de respuesta" },
        "sla": { "description": "Informe de cumplimiento: tiempo de primera respuesta y densidad de escalamiento" },
        "staff": { "description": "Análisis profundo de la producción individual y la eficiencia de resolución" },
        "leaderboard": { "description": "Clasifica al staff activo por productividad y velocidad de reclamo" },
        "ratings": { "description": "Tendencias de satisfacción del staff basadas en los comentarios de los usuarios" },
        "staff_rating": { "description": "Perfil de calificación visual para un miembro específico del staff" }
      }
    },
    "server_title": "Estadísticas del Servidor: {{guild}}",
    "total": "Total de Tickets",
    "open": "Abiertos",
    "closed": "Cerrados",
    "today": "Actividad Hoy",
    "week": "Actividad esta Semana",
    "opened": "Abiertos",
    "avg_rating": "Calificación Promedio",
    "avg_response": "Promedio 1ra Respuesta",
    "avg_close": "Promedio de Resolución",
    "no_data": "N/A",
    "staff_title": "Perfil de Staff: {{user}}",
    "closed_tickets": "Tickets Cerrados",
    "claimed_tickets": "Tickets Reclamados",
    "assigned_tickets": "Tickets Asignados",
    "average_rating": "Calificación Promedio",
    "ratings_count": "{{count}} calificaciones",
    "no_ratings_yet": "Sin calificaciones aún",
    "pro_consistent": "Consistente",
    "pro_top_performer": "Alto Rendimiento",
    "pro_needs_focus": "Necesita Enfoque",
    "pro_metrics_title": "Inteligencia de Rendimiento Pro",
    "pro_efficiency": "Eficiencia de Resolución",
    "pro_rating_quality": "Calidad de Servicio",
    "leaderboard_title": "Tabla de Rendimiento del Staff",
    "leaderboard_closed": "cerrados",
    "leaderboard_claimed": "reclamados",
    "leaderboard_empty": "Sin actividad de staff registrada aún.",
    "staff_rating_title": "Densidad de Calificación: {{user}}",
    "staff_rating_empty": "Este miembro del staff no ha recibido calificaciones aún.",
    "average_score": "Puntuación Promedio",
    "total_ratings": "Total de Calificaciones",
    "sla_title": "Panel de Cumplimiento SLA: {{guild}}",
    "sla_description": "Métricas avanzadas para tiempos de respuesta y gestión de escalamientos.",
    "sla_threshold": "Umbral SLA",
    "escalation": "Estado de Escalamiento",
    "escalation_threshold": "Umbral de Escalamiento",
    "sla_overrides": "Reglas de Prioridad SLA",
    "escalation_overrides": "Reglas de Escalamiento",
    "open_out_of_sla": "Abiertos Incumplidos",
    "open_escalated": "Escalados Actualmente",
    "avg_first_response": "Promedio 1ra Respuesta",
    "sla_compliance": "Tasa de Cumplimiento SLA",
    "tickets_evaluated": "Tickets Evaluados"
  },
  "config": {
    "slash": {
      "description": "Consola premium de administración y configuración del servidor",
      "subcommands": {
        "status": { "description": "Ver el estado general del sistema y estado comercial" },
        "tickets": { "description": "Revisar la salud operativa del sistema de tickets" },
        "center": { "description": "Abrir el centro de configuración interactivo" }
      }
    },
    "category": {
      "group_description": "Gestionar categorías de tickets y reglas de triaje",
      "add_description": "Inicializar una nueva categoría de tickets",
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
      "option_priority": "Prioridad de ticket predeterminada",
      "option_discord_category_edit": "Nuevo ID de categoría de Discord",
      "option_ping_roles": "Roles a notificar (IDs separados por comas)",
      "option_welcome_message": "Mensaje de bienvenida personalizado",
      "option_id_toggle": "ID de la categoría para cambiar estado"
    }
  },
  "center": {
    "general": {
      "title": "Centro de Configuración TON618",
      "description": "Consola interactiva para gestionar todos tus módulos y reglas de automatización."
    },
    "sections": {
      "general": "Sistema General",
      "tickets": "Motor de Tickets",
      "automod": "Reglas de AutoMod",
      "verification": "Identidad y Seguridad",
      "welcome": "Bienvenida",
      "goodbye": "Despedida",
      "staff": "Operaciones de Equipo",
      "commercial": "Plan y Estado Pro"
    }
  },
  "tickets": {
    "labels": {
      "panel": "Panel de Tickets",
      "panel_status": "Estado del Panel",
      "logs": "Registros de Moderación",
      "transcripts": "Transcripciones de Tickets",
      "staff": "Rol de Staff de Soporte",
      "admin": "Rol de Admin del Bot",
      "public_panel_title": "Título del Panel Público",
      "public_panel_description": "Descripción del Panel Público",
      "welcome_message": "Mensaje de Bienvenida del Ticket",
      "control_embed_title": "Título de Control de Staff",
      "control_embed_description": "Descripción de Control de Staff",
      "public_panel_color": "Color del Panel (HEX)",
      "control_embed_color": "Color de Control (HEX)",
      "max_per_user": "Tickets Concurrentes",
      "global_limit": "Límite Global del Servidor",
      "cooldown": "Enfriamiento de Creación",
      "minimum_days": "Edad Mínima Cuenta (Días)",
      "simple_help": "Modo de Triaje Simple",
      "base_sla": "Umbral SLA Base",
      "smart_ping": "Aviso de Smart Ping",
      "auto_close": "Auto-Cierre por Inactividad",
      "auto_assignment": "Motor de Auto-Asignación",
      "online_only": "Solo Asignar Staff Online",
      "more": "...y {{count}} más"
    },
    "fields": {
      "channels_roles": "Infraestructura y Permisos",
      "commercial_status": "Comercial y Suscripción",
      "panel_messaging": "Experiencia de Usuario y Personalización",
      "limits_access": "Control de Acceso y Uso Justo",
      "sla_automation": "Inteligencia Operativa y Automatización",
      "escalation_reporting": "Reporte de Incidentes y Escalamiento",
      "incident_mode": "Modo de Interrupción e Incidente"
    },
    "panel_status": {
      "not_configured": "🔴 NO CONFIGURADO",
      "published": "🟢 PUBLICADO",
      "pending": "🟡 PENDIENTE"
    },
    "incident": {
      "inactive": "El bot está operando normalmente",
      "message": "Difusión de Incidente",
      "default_message": "Actualmente estamos experimentando un alto volumen de tickets. Los tiempos de respuesta pueden ser mayores de lo habitual.",
      "configured_categories": "Categorías Activas"
    },
    "categories": {
      "none": "Sin categorías configuradas",
      "on": "ENCENDIDO",
      "off": "APAGADO",
      "pings": "{{count}} pings",
      "more": "...y {{count}} más"
    },
    "footers": {
      "pro": "TON618 Pro | Inteligencia Operativa Activa",
      "free": "Consola TON618 | Edición Comunitaria"
    }
  },
  "common.labels.onboarding_status": "Estado del onboarding",
  "common.labels.last_updated": "Última actualización",
  "common.labels.reason": "Razón",
  "common.invalid_date": "Fecha inválida.",
  "common.no_backups": "No hay respaldos disponibles.",
  "common.no_recent_activity": "No hay actividad reciente.",
  "common.time.minutes_plural": "{{count}} minutos",
  "commands.audit_disabled": "Comando deshabilitado",
  "general.dashboard.author": "Configuración General | {{guild}}",
  "welcome.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos como `5865F2`.",
  "welcome.test_requires_channel": "Configura un canal de bienvenida antes de enviar un mensaje de prueba.",
  "welcome.test_channel_missing": "El canal de bienvenida configurado ya no existe o no es accesible.",
  "goodbye.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos como `ED4245`.",
  "goodbye.test_requires_channel": "Configura un canal de despedida antes de enviar un mensaje de prueba.",
  "goodbye.test_channel_missing": "El canal de despedida configurado ya no existe o no es accesible.",
  "stats.no_sla_threshold": "Sin umbral configurado",
  "stats.not_configured": "No configurado",
  "stats.period_all": "Todo el tiempo",
  "stats.period_month": "Último mes",
  "stats.period_week": "Última semana",
  "stats.ratings_title": "Valoraciones de satisfacción del staff",
  "stats.ratings_empty": "No hay valoraciones disponibles.",
  "stats.fallback_user": "Usuario #{{suffix}}",
  "stats.fallback_staff": "Staff #{{suffix}}",
  "stats.staff_no_data_title": "Aún no hay datos del staff",
  "stats.staff_no_data_description": "Este miembro del staff todavía no tiene actividad suficiente para generar un perfil.",
  "support_server.restricted": "Este comando solo está disponible en el servidor de soporte oficial.",
  "setup.automod.hint_sync": "Ejecuta `/setup automod sync` para aplicar los cambios más recientes de presets.",
  "setup.automod.hint_bootstrap": "Ejecuta `/setup automod bootstrap` para crear por primera vez las reglas gestionadas de AutoMod.",
  "setup.automod.permission_failure": "No puedo {{action}} porque me faltan estos permisos: {{permissions}}.",
  "setup.automod.permission_failure_generic": "No puedo completar `{{action}}` porque faltan permisos requeridos de AutoMod.",
  "setup.automod.rule_live": "Activa",
  "setup.automod.rule_missing": "Faltante",
  "setup.automod.no_presets": "No hay presets seleccionados.",
  "setup.automod.permissions_ok": "Todos los permisos requeridos están disponibles.",
  "setup.automod.alert_not_configured": "No hay canal de alertas configurado.",
  "setup.automod.none": "Ninguno",
  "setup.automod.never": "Nunca",
  "setup.automod.no_sync_recorded": "Aún no se ha registrado ninguna sincronización.",
  "setup.automod.status_title": "Estado de AutoMod para {{guildName}}",
  "setup.automod.status_enabled": "Activado",
  "setup.automod.status_disabled": "Desactivado",
  "setup.automod.field_managed_rules": "Reglas Gestionadas",
  "setup.automod.live_count": "Reglas gestionadas activas: {{live}} / {{desired}}",
  "setup.automod.stored_rule_ids": "IDs de reglas guardadas: {{count}}",
  "setup.automod.field_alerts_exemptions": "Alertas y Exenciones",
  "setup.automod.alert_channel": "Canal de alertas: {{channel}}",
  "setup.automod.exempt_roles": "Roles exentos: {{roles}}",
  "setup.automod.exempt_channels": "Canales exentos: {{channels}}",
  "setup.automod.field_sync_state": "Estado de Sincronización",
  "setup.automod.last_sync": "Última sincronización: {{timestamp}}",
  "setup.automod.sync_result": "Último resultado: {{status}}",
  "setup.automod.sync_summary": "Resumen: {{summary}}",
  "setup.automod.field_permissions": "Permisos",
  "setup.automod.error_no_presets": "Selecciona al menos un preset antes de ejecutar esta acción.",
  "setup.automod.fetch_error": "No se pudo {{action}} el estado de AutoMod: {{message}}",
  "setup.automod.fetch_error_generic": "No se pudo obtener el estado de AutoMod desde Discord.",
  "setup.automod.bootstrap_created": "Se crearon {{count}} regla{{plural}} gestionada{{plural}} de AutoMod.",
  "setup.automod.bootstrap_no_new": "No se crearon reglas gestionadas nuevas de AutoMod.",
  "setup.automod.error_not_enabled": "Activa AutoMod primero antes de sincronizar reglas gestionadas.",
  "setup.automod.error_no_active_presets": "No hay presets activos para sincronizar.",
  "setup.automod.sync_summary_line": "Creadas {{created}}, actualizadas {{updated}}, eliminadas {{removed}}, sin cambios {{unchanged}}.",
  "setup.automod.disable_removed": "Se eliminaron {{count}} regla{{plural}} gestionada{{plural}} de AutoMod.",
  "setup.automod.disable_no_rules": "No había reglas gestionadas de AutoMod para eliminar.",
  "setup.automod.disable_partial": "Se eliminaron {{removed}} regla{{removedPlural}}, pero se conservaron {{preserved}} IDs de reglas vinculadas.",
  "setup.automod.error_provide_channel_or_clear": "Proporciona un canal de alertas o usa `clear` para quitarlo.",
  "setup.automod.success_alert_cleared": "Canal de alertas de AutoMod eliminado. {{hint}}",
  "setup.automod.success_alert_set": "Las alertas de AutoMod ahora se enviarán a {{channel}}. {{hint}}",
  "setup.automod.error_provide_channel_or_reset": "Proporciona un canal o elige reset/clear.",
  "setup.automod.info_already_exempt_channel": "{{channel}} ya está exento de AutoMod.",
  "setup.automod.error_max_exempt_channels": "Alcanzaste el máximo de canales exentos.",
  "setup.automod.error_unknown_action": "Acción de AutoMod desconocida.",
  "setup.automod.success_exempt_channels_updated": "Canales exentos actualizados. Total actual: {{count}}. {{hint}}",
  "setup.automod.error_provide_role_or_reset": "Proporciona un rol o elige reset/clear.",
  "setup.automod.info_already_exempt_role": "{{role}} ya está exento de AutoMod.",
  "setup.automod.error_max_exempt_roles": "Alcanzaste el máximo de roles exentos.",
  "setup.automod.success_exempt_roles_updated": "Roles exentos actualizados. Total actual: {{count}}. {{hint}}",
  "setup.automod.error_unknown_preset": "Preset de AutoMod desconocido.",
  "setup.automod.presets_none": "No hay presets activados.",
  "setup.automod.hint_disable": "Ejecuta `/setup automod disable` si quieres eliminar las reglas gestionadas de Discord.",
  "setup.automod.success_presets_updated": "Presets de AutoMod actualizados: {{summary}} {{followUp}}",
  "config.category.admin_only": "Solo los administradores pueden gestionar categorías de tickets.",
  "config.category.error_generic": "Ocurrió un problema al actualizar las categorías. {{message}}",
  "config.category.error_not_found": "No se encontró la categoría `{{categoryId}}`.",
  "config.category.add_verification_success": "Las verificaciones pasaron correctamente.",
  "config.category.add_verification_failed": "Las verificaciones requieren atención.",
  "config.category.add_title": "Categoría Creada",
  "config.category.add_success_description": "Se creó la categoría `{{categoryId}}` como **{{label}}**. {{verification}}",
  "config.category.footer": "Controles de Categorías TON618",
  "config.category.error_no_category": "La categoría `{{categoryId}}` no existe.",
  "config.category.remove_title": "Categoría Eliminada",
  "config.category.remove_success_message": "Se eliminó la categoría `{{categoryId}}` (**{{label}}**).",
  "config.category.error_remove_failed": "No se pudo eliminar la categoría seleccionada.",
  "config.category.list_description_empty": "Aún no hay categorías de tickets configuradas.",
  "config.category.list_description_empty_free": "Aún no hay categorías de tickets configuradas. Pro desbloquea enrutamiento avanzado por categorías.",
  "config.category.list_title_empty": "No Hay Categorías Configuradas",
  "config.category.list_status_enabled": "Activada",
  "config.category.list_status_disabled": "Desactivada",
  "config.category.list_extras_discord": "Categoría de Discord enlazada",
  "config.category.list_extras_ping_roles": "{{count}} rol(es) de ping",
  "config.category.list_extras_welcome": "Mensaje de bienvenida personalizado",
  "config.category.list_pro_note": "Actualiza a Pro para reglas avanzadas de categorías, prioridades y enrutamiento.",
  "config.category.list_title": "Categorías Configuradas: {{count}}",
  "config.category.footer_free": "TON618 Edición Comunitaria",
  "config.category.error_no_fields": "Proporciona al menos un campo para actualizar.",
  "config.category.edit_emoji_line": "Emoji: {{emoji}}",
  "config.category.edit_discord_line": "Categoría de Discord: {{discordCategory}}",
  "config.category.edit_ping_line": "Roles de ping: {{count}}",
  "config.category.edit_welcome_line": "Mensaje de bienvenida personalizado activado",
  "config.category.edit_title": "Categoría Actualizada",
  "config.category.edit_success_message": "Se actualizó **{{label}}**.\nEstado: {{status}}\n{{emojiLine}}{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}",
  "config.category.toggle_title_enabled": "Categoría Activada",
  "config.category.toggle_title_disabled": "Categoría Desactivada",
  "config.category.toggle_description_enabled": "**{{label}}** ahora está activada.",
  "config.category.toggle_description_disabled": "**{{label}}** ahora está desactivada.",
  "center.responses.set_welcome_channel_first": "Configura primero un canal de bienvenida.",
  "center.responses.welcome_channel_missing": "El canal de bienvenida configurado falta o no es accesible.",
  "center.responses.welcome_default_title": "¡Bienvenido a {{guild}}!",
  "center.responses.welcome_default_message": "Nos alegra tenerte aquí, {{user}}.",
  "center.responses.welcome_test_suffix": "Este es un mensaje de bienvenida de prueba.",
  "center.responses.test_sent": "Mensaje de prueba enviado a {{channel}}.",
  "center.responses.set_goodbye_channel_first": "Configura primero un canal de despedida.",
  "center.responses.goodbye_channel_missing": "El canal de despedida configurado falta o no es accesible.",
  "center.responses.goodbye_default_title": "Despedida de {{guild}}",
  "center.responses.goodbye_default_message": "{{user}} ha salido del servidor.",
  "center.responses.goodbye_test_suffix": "Este es un mensaje de despedida de prueba.",
  "center.modals.verify_question_title": "Pregunta de Verificación",
  "center.modals.field_question": "Pregunta",
  "center.modals.field_answer": "Respuesta",
  "center.modals.verify_panel_title": "Panel de Verificación",
  "center.modals.field_title": "Título",
  "center.modals.field_description": "Descripción",
  "center.modals.field_color": "Color",
  "center.modals.field_image": "URL de imagen",
  "center.modals.welcome_text_title": "Texto de Bienvenida",
  "center.modals.field_message": "Mensaje",
  "center.modals.field_footer": "Pie",
  "center.modals.field_banner": "URL del banner",
  "center.modals.goodbye_text_title": "Texto de Despedida",
  "center.modals.limits_title": "Límites",
  "center.modals.field_global_limit": "Límite global de tickets",
  "center.modals.field_cooldown": "Cooldown (minutos)",
  "center.modals.field_min_days": "Días mínimos de cuenta",
  "center.modals.field_transcript_channel": "ID del canal de transcripciones",
  "center.modals.field_weekly_report_channel": "ID del canal de reporte semanal",
  "center.modals.automation_title": "Automatización",
  "center.modals.field_auto_close": "Minutos de auto-cierre",
  "center.modals.field_sla": "Minutos de aviso SLA",
  "center.modals.field_smart_ping": "Minutos de smart ping",
  "center.modals.antiraid_title": "Anti-raid",
  "center.modals.field_joins": "Umbral de entradas",
  "center.modals.field_seconds": "Ventana en segundos",
  "center.modals.field_action": "Acción",
  "center.modals.maintenance_reason_title": "Razón de Mantenimiento",
  "center.modals.field_reason_clear": "Razón o CLEAR",
  "center.modals.rate_limit_title": "Rate Limits de Interacción",
  "center.modals.field_window": "Ventana en segundos",
  "center.modals.field_max_actions": "Máximo de acciones",
  "center.modals.field_bypass_admin": "Omitir admins (true/false)",
  "center.modals.command_rate_limit_title": "Rate Limits de Comandos",
  "center.modals.field_cmd_window": "Ventana de comandos en segundos",
  "center.modals.field_cmd_max": "Máximo de comandos",
  "center.modals.autoresponse_add_title": "Agregar Auto Respuesta",
  "center.modals.field_trigger": "Trigger",
  "center.modals.field_response": "Respuesta",
  "center.modals.autoresponse_toggle_title": "Cambiar Estado de Auto Respuesta",
  "center.modals.autoresponse_delete_title": "Eliminar Auto Respuesta",
  "center.modals.autoresponse_title": "Auto Respuesta",
  "center.modals.field_exact_trigger": "Trigger exacto",
  "center.modals.blacklist_add_title": "Bloquear Usuario",
  "center.modals.field_user_id": "ID del usuario",
  "center.modals.field_reason": "Razón",
  "center.modals.blacklist_remove_title": "Eliminar Entrada de Blacklist",
  "center.modals.blacklist_check_title": "Revisar Entrada de Blacklist",
  "center.modals.blacklist_title": "Blacklist",
  "center.modals.import_title": "Importar Configuración",
  "center.modals.field_json": "Payload JSON",
  "center.modals.rollback_title": "Revertir Configuración",
  "center.modals.field_backup_id": "ID del respaldo",
  "center.verify.stats_title": "Estadísticas de Verificación",
  "center.verify.stats_verified": "Verificados",
  "center.verify.stats_failed": "Fallidos",
  "center.verify.stats_kicked": "Expulsados",
  "center.verify.stats_total": "Total",
  "center.verify.stats_recent": "Actividad reciente",
  "center.access.owner_only": "Solo el propietario de este panel puede usar esta acción.",
  "center.access.admin_only": "Solo los administradores pueden usar esta acción.",
  "center.actions.no_backups_for_rollback": "No hay respaldos disponibles para revertir.",
  "center.actions.invalid_critical_action": "Esa acción crítica ya no es válida.",
  "center.actions.action_confirmed": "Acción confirmada.",
  "center.actions.action_canceled": "Acción cancelada.",
  "center.actions.clear_staff": "Quitar rol de staff",
  "center.actions.clear_admin": "Quitar rol de admin",
  "center.actions.clear_verify": "Quitar rol de verify",
  "center.actions.clear_verified": "Quitar rol verificado",
  "center.actions.clear_unverified": "Quitar rol sin verificar",
  "center.actions.clear_autorole": "Quitar autorole",
  "center.actions.maintenance_off": "Modo mantenimiento desactivado.",
  "center.actions.maintenance_on": "Modo mantenimiento activado.",
  "center.actions.rollback_latest": "Revertir último respaldo",
  "center.actions.confirm_prompt": "¿Seguro que quieres ejecutar: {{action}}?",
  "center.actions.confirm_fallback": "Acción crítica",
  "center.actions.confirm": "Confirmar",
  "center.actions.cancel": "Cancelar",
  "center.actions.set_panel_channel_first": "Configura primero el canal del panel de verificación.",
  "center.actions.panel_published": "Panel de verificación publicado correctamente.",
  "center.actions.verification_panel_refreshed": "Panel de verificación actualizado.",
  "center.actions.recent_backups": "Respaldos recientes: {{list}}",
  "center.actions.export_with_id": "Configuración exportada. ID del respaldo: `{{id}}`.",
  "center.actions.export_without_id": "Configuración exportada correctamente.",
  "center.actions.invalid_action_autoresponses": "Acción de autorespuestas no soportada.",
  "center.actions.invalid_action_blacklist": "Acción de blacklist no soportada.",
  "center.responses.invalid_transcript_channel_id": "El ID del canal de transcripciones es inválido.",
  "center.responses.invalid_weekly_report_channel_id": "El ID del canal de reporte semanal es inválido.",
  "center.responses.limits_updated": "Límites actualizados correctamente.",
  "center.responses.automation_updated": "Ajustes de automatización actualizados correctamente.",
  "center.responses.maintenance_reason_updated": "Razón de mantenimiento actualizada.",
  "center.responses.rate_limit_updated": "Rate limits de interacción actualizados.",
  "center.responses.command_rate_limit_updated": "Rate limits de comandos actualizados.",
  "center.responses.import_payload_required": "Pega un payload JSON para importar.",
  "center.responses.invalid_json": "El JSON proporcionado es inválido.",
  "center.responses.import_success": "Configuración importada correctamente.",
  "center.responses.backup_id_required": "Proporciona un ID de respaldo.",
  "center.responses.backup_not_found": "No se encontró el respaldo.",
  "center.responses.rollback_applied": "Rollback aplicado correctamente.",
  "center.responses.trigger_and_response_required": "Trigger y respuesta son obligatorios.",
  "center.responses.auto_response_saved": "Auto respuesta guardada.",
  "center.responses.trigger_required": "El trigger es obligatorio.",
  "center.responses.trigger_missing": "No se encontró ese trigger.",
  "center.responses.trigger_state": "El trigger `{{trigger}}` ahora está **{{state}}**.",
  "center.responses.trigger_deleted": "Trigger eliminado.",
  "center.blacklist.no_reason": "Sin razón proporcionada.",
  "center.responses.invalid_user_id": "El ID del usuario es inválido.",
  "center.responses.cannot_block_self": "No puedes bloquearte a ti mismo.",
  "center.responses.user_blocked": "Usuario bloqueado correctamente.",
  "center.responses.user_removed": "Usuario eliminado de la blacklist.",
  "center.responses.user_not_blacklisted": "Ese usuario no está en la blacklist.",
  "center.responses.blacklist_entry": "Entrada de blacklist para `{{userId}}`: {{reason}}",
  "center.responses.blacklist_not_found": "No se encontró entrada de blacklist para ese usuario.",
  "center.responses.question_answer_required": "Pregunta y respuesta son obligatorias.",
  "center.responses.verification_question_updated": "Pregunta de verificación actualizada.",
  "center.responses.invalid_color": "El color debe ser un código hexadecimal válido de 6 dígitos.",
  "center.responses.invalid_image": "La URL de imagen debe comenzar con `http://` o `https://`.",
  "center.responses.verification_panel_updated": "Panel de verificación actualizado correctamente.",
  "center.responses.invalid_antiraid_action": "Acción de anti-raid inválida.",
  "center.responses.antiraid_updated": "Ajustes de anti-raid actualizados.",
  "center.responses.invalid_banner": "La URL del banner debe comenzar con `http://` o `https://`.",
  "center.responses.welcome_text_updated": "Texto de bienvenida actualizado correctamente.",
  "center.responses.goodbye_text_updated": "Texto de despedida actualizado correctamente.",
  "center.responses.unsupported_modal": "Modal no soportado.",
  "tickets.common.default": "Predeterminado",
  "tickets.common.minutes": "{{value}} min",
  "tickets.common.disabled": "Desactivado",
  "tickets.common.enabled": "Activado",
  "tickets.common.not_configured": "No configurado",
  "tickets.common.removed": "Eliminado",
  "tickets.common.yes": "Sí",
  "tickets.common.no": "No",
  "tickets.common.all_categories": "Todas las categorías",
  "tickets.sla.title": "Configuración SLA de Tickets",
  "tickets.sla.base": "SLA Base",
  "tickets.sla.escalation": "Escalamiento",
  "tickets.sla.threshold": "Umbral",
  "tickets.sla.channel": "Canal de escalamiento",
  "tickets.sla.role": "Rol de escalamiento",
  "tickets.override.title": "Override de SLA Actualizado",
  "tickets.override.type": "Tipo",
  "tickets.override.escalation": "Escalamiento",
  "tickets.override.warning": "Advertencia",
  "tickets.override.target": "Objetivo",
  "tickets.override.priority_target": "Prioridad: {{target}}",
  "tickets.override.category_target": "Categoría: {{target}}",
  "tickets.override.value": "Valor",
  "tickets.auto_assignment.title": "Auto-asignación",
  "tickets.auto_assignment.status": "Estado",
  "tickets.auto_assignment.require_online": "Requerir staff en línea",
  "tickets.auto_assignment.respect_away": "Respetar estado ausente",
  "tickets.incident.enabled_title": "Modo incidente activado",
  "tickets.incident.disabled_title": "Modo incidente desactivado",
  "tickets.incident.paused_categories": "Categorías pausadas",
  "tickets.incident.resumed": "Se reanudó el flujo normal de tickets.",
  "tickets.incident.user_message": "Mensaje visible para usuarios",
  "tickets.daily_report.title": "Reporte Diario de Tickets",
  "tickets.daily_report.status": "Estado",
  "tickets.daily_report.channel": "Canal del reporte",
  "tickets.customization.panel_reset_title": "Panel de tickets restablecido",
  "tickets.customization.panel_reset_description": "El panel público de tickets volvió a sus valores predeterminados.",
  "tickets.customization.title_label": "Título",
  "tickets.customization.description_label": "Descripción",
  "tickets.customization.color_label": "Color",
  "tickets.customization.footer_label": "Pie",
  "tickets.customization.panel_updated_title": "Panel de tickets actualizado",
  "tickets.customization.panel_updated_description": "Se guardó el nuevo texto del panel público.",
  "tickets.customization.welcome_reset_title": "Mensaje de bienvenida del ticket restablecido",
  "tickets.customization.welcome_reset_description": "El mensaje de bienvenida dentro del ticket volvió a sus valores predeterminados.",
  "tickets.customization.placeholders_label": "Placeholders disponibles",
  "tickets.customization.welcome_updated_title": "Mensaje de bienvenida del ticket actualizado",
  "tickets.customization.welcome_updated_description": "Se guardó el nuevo mensaje de bienvenida dentro del ticket.",
  "tickets.customization.current_message_label": "Mensaje actual",
  "tickets.customization.control_reset_title": "Panel de control restablecido",
  "tickets.customization.control_reset_description": "El panel interno de control volvió a sus valores predeterminados.",
  "tickets.customization.control_updated_title": "Panel de control actualizado",
  "tickets.customization.control_updated_description": "Se guardó el nuevo texto del panel interno de control.",
  "tickets.panel.published_title": "Panel de tickets publicado",
  "tickets.panel.published_description": "Se publicó el panel de tickets en {{channel}}.",
  "tickets.panel.staff_role_active": "Rol de staff activo: {{role}}",
  "tickets.panel.staff_role_missing": "Aún no hay rol de staff configurado.",
  "tickets.errors.escalation_minutes_required": "Proporciona minutos de escalamiento mayores que cero.",
  "tickets.errors.escalation_channel_required": "Configura un canal de escalamiento antes de activarlo.",
  "tickets.errors.exact_target": "Elige exactamente un objetivo: prioridad o categoría.",
  "tickets.errors.category_not_configured": "Esa categoría de ticket no está configurada.",
  "tickets.errors.invalid_categories": "Uno o más IDs de categoría son inválidos.",
  "tickets.errors.daily_report_channel_required": "Configura un canal antes de activar el reporte diario.",
  "tickets.errors.invalid_color": "Color inválido. Usa un código hexadecimal de 6 dígitos.",
  "tickets.errors.update_or_reset": "Proporciona al menos un campo para actualizar o usa reset.",
  "tickets.errors.message_or_reset": "Proporciona un mensaje o usa reset.",
  "tickets.errors.message_empty": "El mensaje no puede estar vacío.",
  "tickets.errors.publish_permissions": "Me faltan permisos para publicar el panel en {{channel}}.",
  "tickets.errors.no_categories": "Configura al menos una categoría de tickets antes de publicar el panel.",
  "tickets.errors.build_panel": "No se pudo construir el panel de tickets: {{error}}",
  "tickets.errors.publish_failed": "No se pudo publicar el panel de tickets.",
  "staff.only_staff": "Solo los miembros del staff pueden usar este comando.",
  "staff.away_on_title": "Estado de ausencia activado",
  "staff.away_on_description": "Ahora apareces como ausente.{{reasonText}}",
  "staff.away_on_footer": "Recuerda desactivar el modo ausente cuando regreses.",
  "staff.away_off": "Estado de ausencia eliminado. Ya vuelves a estar activo.",
  "staff.my_tickets_title": "Tus Tickets ({{count}})",
  "staff.my_tickets_empty": "No tienes tickets reclamados ni asignados en este momento.",
  "staff.ownership_claimed": "Reclamado por ti",
  "staff.ownership_assigned": "Asignado a ti",
  "staff.ownership_watching": "Observando",
  "leveling.user_not_found": "No se pudo encontrar a ese usuario.",
  "leveling.status_disabled": "El sistema de niveles está desactivado en este servidor.",
  "leveling.embed.title": "Perfil de Nivel: {{user}}",
  "leveling.embed.field_level_name": "Nivel",
  "leveling.embed.field_total_xp_name": "XP Total",
  "leveling.embed.field_progress_name": "Progreso",
  "leveling.rank.no_xp": "Todavía no hay XP registrada.",
  "leveling.rank.title": "Rango de {{user}}",
  "leveling.rank.footer": "Sigue hablando para ganar más XP.",
  "leveling.leaderboard.empty": "Aún no hay datos disponibles para la tabla de clasificación.",
  "events.messageDelete.title": "Mensaje Eliminado",
  "events.messageDelete.fields.author": "Autor",
  "events.messageDelete.unknown_author": "Autor desconocido",
  "events.messageDelete.fields.channel": "Canal",
  "events.messageDelete.fields.content": "Contenido",
  "events.messageDelete.no_text": "Sin contenido de texto.",
  "events.messageDelete.footer": "ID del mensaje: {{id}}",
  "events.modlog.goto_message": "Ir al mensaje",
  "events.modlog.edit_empty": "(vacío)",
  "events.guildMemberAdd.anti_raid.title": "Anti-raid activado",
  "events.guildMemberAdd.anti_raid.description": "{{user}} entró mientras las protecciones anti-raid estaban activas.",
  "events.guildMemberAdd.anti_raid.fields.threshold": "Umbral",
  "events.guildMemberAdd.anti_raid.fields.action": "Acción",
  "events.guildMemberAdd.anti_raid.action_kick": "Expulsar automáticamente",
  "events.guildMemberAdd.anti_raid.action_alert": "Solo alertar",
  "events.guildMemberAdd.welcome.default_title": "¡Bienvenido, {{user}}!",
  "events.guildMemberAdd.welcome.fields.user": "Usuario",
  "events.guildMemberAdd.welcome.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.dm.title": "Bienvenido a {{guild}}",
  "events.guildMemberAdd.dm.fields.verification_required": "Verificación requerida",
  "events.guildMemberAdd.dm.fields.verification_value": "Completa la verificación para desbloquear el servidor.",
  "events.guildMemberAdd.modlog.title": "Miembro Unido",
  "events.guildMemberAdd.modlog.fields.user": "Usuario",
  "events.guildMemberAdd.modlog.fields.account_created": "Cuenta creada",
  "events.guildMemberAdd.modlog.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.modlog.footer": "Evento de entrada registrado",
  "events.guildMemberRemove.goodbye.default_title": "Adiós, {{user}}",
  "events.guildMemberRemove.goodbye.default_message": "Esperamos verte nuevamente pronto.",
  "events.guildMemberRemove.goodbye.fields.user": "Usuario",
  "events.guildMemberRemove.goodbye.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.goodbye.remaining_members_value": "{{count}} miembros restantes",
  "events.guildMemberRemove.modlog.title": "Miembro Salió",
  "events.guildMemberRemove.modlog.fields.user": "Usuario",
  "events.guildMemberRemove.modlog.fields.joined_at": "Se unió el",
  "events.guildMemberRemove.modlog.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.modlog.fields.roles": "Roles",
  "events.guildMemberRemove.modlog.no_roles": "Sin roles",
  "events.guildMemberRemove.modlog.unknown_join": "Fecha de entrada desconocida",
  "events.guildMemberRemove.modlog.footer": "Evento de salida registrado",
  "events.guildMemberUpdate.nickname.title": "Apodo Actualizado",
  "events.guildMemberUpdate.nickname.fields.user": "Usuario",
  "events.guildMemberUpdate.nickname.fields.before": "Antes",
  "events.guildMemberUpdate.nickname.fields.after": "Después",
  "events.guildMemberUpdate.nickname.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.roles.title": "Roles Actualizados",
  "events.guildMemberUpdate.roles.fields.user": "Usuario",
  "events.guildMemberUpdate.roles.fields.added": "Roles agregados",
  "events.guildMemberUpdate.roles.fields.removed": "Roles removidos",
  "events.guildMemberUpdate.roles.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.unknown_executor": "Ejecutor desconocido",
  "events.guildMemberUpdate.footer": "Actualización de miembro registrada",
  "daily_sla_report.no_closures": "No hubo tickets cerrados en esta ventana.",
  "daily_sla_report.no_data": "Aún no hay datos suficientes para construir el reporte SLA.",
  "daily_sla_report.no_sla_threshold": "No hay umbral SLA configurado.",
  "daily_sla_report.title": "Reporte Diario SLA",
  "daily_sla_report.window": "Ventana",
  "daily_sla_report.opened_24h": "Abiertos (24h)",
  "daily_sla_report.closed_24h": "Cerrados (24h)",
  "daily_sla_report.avg_first_response": "Promedio de primera respuesta",
  "daily_sla_report.open_out_of_sla": "Abiertos fuera de SLA",
  "daily_sla_report.open_escalated": "Abiertos escalados",
  "daily_sla_report.sla_compliance": "Cumplimiento SLA",
  "daily_sla_report.top_staff": "Top staff",
  "sla_alerts.hours_minutes": "{{hours}}h {{minutes}}m",
  "sla_alerts.minutes_plural": "{{count}} minutos",
  "sla_alerts.title": "Advertencia SLA",
  "sla_alerts.description": "El ticket <#{{channelId}}> **#{{ticketId}}** lleva **{{time}}** esperando respuesta del staff.",
  "sla_alerts.user": "Usuario",
  "sla_alerts.category": "Categoría",
  "sla_alerts.sla_limit": "Límite SLA",
  "sla_escalation.title": "SLA Escalado",
  "sla_escalation.description": "El ticket <#{{channelId}}> **#{{ticketId}}** superó el umbral de escalado (**{{limit}} min**) sin respuesta del staff.",
  "sla_escalation.user": "Usuario",
  "sla_escalation.category": "Categoría",
  "smart_ping.hours_plural": "{{count}} horas",
  "smart_ping.title": "Smart Ping",
  "smart_ping.description": "Este ticket lleva más de **{{time}}** sin respuesta del staff.",
  "smart_ping.user": "Usuario",
  "smart_ping.category": "Categoría",
  "verification.autokick.kick_reason": "No completó la verificación a tiempo.",
  "verification.autokick.reason_log": "Expulsión automática por tiempo de verificación agotado",
  "verification.autokick.title": "Miembro Sin Verificar Expulsado",
  "verification.autokick.description": "{{user}} fue removido por no completar la verificación a tiempo.",
  "transcript.error_generating": "Ocurrió un error al generar la transcripción.",
  "transcript.title": "Transcripción del Ticket",
  "transcript.labels.active": "Activo",
  "transcript.labels.ticket": "Ticket",
  "transcript.labels.category": "Categoría",
  "transcript.labels.created": "Creado",
  "transcript.labels.status": "Estado",
  "transcript.labels.open": "Abierto",
  "transcript.labels.closed": "Cerrado",
  "transcript.labels.duration": "Duración",
  "transcript.labels.messages": "Mensajes",
  "transcript.labels.attended_by": "Atendido por",
  "transcript.labels.rating": "Valoración",
  "transcript.labels.no_messages": "No hay mensajes registrados",
  "transcript.labels.generated_on": "Generado el",
  "case_brief.title": "Resumen del Caso",
  "case_brief.status": "Estado",
  "case_brief.open": "Abierto",
  "case_brief.closed": "Cerrado",
  "case_brief.risk_level": "Nivel de riesgo",
  "case_brief.no_risk_factors": "No se detectaron factores de riesgo importantes.",
  "case_brief.next_action": "Siguiente acción",
  "case_brief.operational_context": "Contexto operativo",
  "case_brief.recommendations": "Recomendaciones",
  "case_brief.footer": "Resumen operativo del caso",
  "case_brief.pro_unlock_title": "Función Pro",
  "case_brief.pro_unlock_description": "Actualiza a Pro para desbloquear el resumen avanzado del caso.",
  "case_brief.risks.high_priority_category": "Categoría de alta prioridad",
  "case_brief.risks.urgent_priority": "Prioridad urgente seleccionada",
  "case_brief.risks.outside_sla": "Fuera del umbral SLA",
  "case_brief.risks.reopened_times": "Reabierto múltiples veces",
  "case_brief.risks.extensive_conversation": "Historial de conversación extenso",
  "case_brief.risks.unassigned_30min": "Sin asignar por más de 30 minutos",
  "case_brief.actions.closed_no_action": "El ticket está cerrado. No se requiere acción.",
  "case_brief.actions.urgent_first_response": "Envía una primera respuesta de inmediato.",
  "case_brief.actions.claim_or_assign": "Reclama o asigna este ticket.",
  "case_brief.actions.near_sla_limit": "Responde antes de superar el umbral SLA.",
  "case_brief.actions.urgent_priority_resolve": "Prioriza la resolución de forma urgente.",
  "case_brief.actions.review_reopen": "Revisa el historial de reaperturas antes de responder.",
  "case_brief.actions.continue_normal": "Continúa con el manejo normal.",
  "case_brief.context_labels.type": "Tipo",
  "case_brief.context_labels.age": "Antigüedad",
  "case_brief.context_labels.first_response": "Primera respuesta",
  "case_brief.context_labels.pending": "Pendiente",
  "case_brief.context_labels.responsible": "Responsable",
  "case_brief.context_labels.assigned": "Asignado",
  "case_brief.context_labels.unassigned": "Sin asignar",
  "case_brief.context_labels.messages": "Mensajes",
  "case_brief.context_labels.reopenings": "Reaperturas",
  "case_brief.recommendations_list.respond_immediately": "Responde de inmediato.",
  "case_brief.recommendations_list.use_claim": "Usa claim o asigna propiedad.",
  "case_brief.recommendations_list.consider_priority": "Considera elevar la prioridad.",
  "case_brief.recommendations_list.escalate": "Escala al siguiente nivel de soporte.",
  "case_brief.recommendations_list.review_history": "Revisa el historial previo de conversación.",
  "case_brief.recommendations_list.document_resolution": "Documenta claramente la resolución final.",
  "case_brief.recommendations_list.verify_user": "Verifica la última solicitud y expectativa del usuario.",
  "case_brief.recommendations_list.continue_normal": "Continúa con el flujo estándar.",
  "health_monitor.downtime_recovery_title": "Recuperación detectada",
  "health_monitor.downtime_recovery_description": "El bot se recuperó después de una ventana de inactividad.",
  "health_monitor.ping_high_title": "Latencia alta detectada",
  "health_monitor.ping_high_description": "La latencia del gateway está por encima del umbral configurado.",
  "health_monitor.error_rate_high_title": "Alta tasa de errores detectada",
  "health_monitor.error_rate_high_description": "La tasa reciente de errores de interacción está por encima del umbral configurado.",
  "health_monitor.field_interactions": "Interacciones",
  "health_monitor.field_error_rate": "Tasa de error",
  "health_monitor.field_errors": "Errores",
  "health_monitor.field_ping": "Ping",
  "poll.errors.owner_only": "Solo el dueño del servidor puede usar esta opción de encuesta.",
  "help.embed.usages.ping": "/ping",
  "help.embed.overviews.ping": "Revisa la latencia, uptime y estado de caché del bot.",
  "help.embed.categories.public": "Público",
  "help.embed.usages.staffops": "/staff my-tickets",
  "security": {
    "slash": {
      "description": "Monitoreo de seguridad y alertas (Solo owner)",
      "subcommands": {
        "alerts": {
          "description": "Ver alertas de seguridad recientes"
        },
        "check": {
          "description": "Ejecutar verificación manual de seguridad"
        },
        "status": {
          "description": "Ver estado del sistema de seguridad"
        },
        "setup": {
          "description": "Configurar sistema de seguridad (índices, scheduler)"
        },
        "acknowledge": {
          "description": "Reconocer una alerta"
        },
        "test": {
          "description": "Probar notificaciones de alertas Discord"
        },
        "encryption": {
          "description": "Ver estado de encriptación y generar claves"
        }
      },
      "options": {
        "severity": "Filtrar por severidad",
        "limit": "Número de alertas a mostrar (máx 25)",
        "indexes": "Crear índices MongoDB",
        "scheduler": "Iniciar scheduler de seguridad",
        "alert_id": "ID de alerta a reconocer",
        "generate_key": "Generar nueva clave de encriptación"
      }
    },
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "alerts_title": "🔒 Alertas de Seguridad",
    "no_alerts": "No se encontraron alertas de seguridad.",
    "alert_acknowledged": "✅ Alerta Reconocida",
    "alert_not_found": "❌ Alerta no encontrada o ya reconocida.",
    "check_title": "🔒 Verificación Manual de Seguridad Completa",
    "check_triggered": "⚠️ **¡{{count}} alerta(s) de seguridad activada(s)!**\nUsa `/security alerts` para ver detalles.",
    "check_clean": "✅ No se detectaron problemas de seguridad.",
    "status_title": "🔒 Estado del Sistema de Seguridad",
    "status_running": "✅ Ejecutándose",
    "status_stopped": "❌ Detenido",
    "scheduler_running": "✅ Scheduler ejecutándose",
    "scheduler_stopped": "❌ Scheduler detenido",
    "alerts_count": "📊 {{count}} alertas en memoria",
    "high_severity": "🔴 {{count}} alta severidad",
    "db_connected": "✅ MongoDB conectado",
    "db_disconnected": "❌ MongoDB desconectado",
    "setup_complete": "🔒 Configuración de Seguridad Completa",
    "indexes_created": "Índices: ✅ Creados",
    "indexes_failed": "Índices: ❌ Fallidos",
    "scheduler_started": "Scheduler: ✅ Iniciado",
    "scheduler_failed": "Scheduler: ❌ Fallido",
    "test_sent": "✅ Alerta de Prueba Enviada",
    "test_description": "Se ha enviado una alerta de seguridad de prueba a tu canal/webhook de Discord configurado.",
    "webhook_configured": "✅ Configurado",
    "webhook_not_set": "❌ No configurado",
    "channel_configured": "✅ Configurado",
    "channel_not_set": "❌ No configurado",
    "test_failed": "❌ Fallo al enviar alerta de prueba. Verifica que SECURITY_ALERTS_WEBHOOK_URL o SECURITY_ALERTS_CHANNEL_ID estén configurados en tu archivo .env.",
    "encryption_title": "🔐 Estado de Encriptación",
    "encryption_enabled": "✅ Habilitado",
    "encryption_disabled": "❌ Deshabilitado",
    "key_configured": "✅ Sí",
    "key_not_configured": "❌ No",
    "key_valid": "(✅ Válida)",
    "key_invalid": "(❌ Muy corta)",
    "encryption_active": "Tus datos sensibles se están encriptando automáticamente con AES-256-GCM.",
    "encryption_inactive": "⚠️ La encriptación NO está habilitada. Los datos sensibles se almacenan en texto plano.\n\nEjecuta `/security encryption generate_key:true` para generar una clave.",
    "key_generated_title": "🔐 Nueva Clave de Encriptación Generada",
    "key_generated_desc": "Se ha generado una nueva clave de encriptación de 256 bits.\n\n**Agrega esto a tu archivo .env:**\n```\nENCRYPTION_KEY={{key}}\n```",
    "key_warning": "⚠️ Importante",
    "key_warning_value": "• Mantén esta clave SECRETA y en un administrador de contraseñas\n• Si la pierdes, los datos encriptados NO pueden recuperarse\n• Cambiar la clave hará que los datos encriptados existentes sean ilegibles"
  },
  "resetall": {
    "slash": {
      "description": "Restablecer TODAS las configuraciones de guilds (Solo owner)",
      "subcommands": {
        "preview": {
          "description": "Vista previa de lo que se eliminará sin ejecutar"
        },
        "execute": {
          "description": "Ejecutar el restablecimiento completo con código de confirmación"
        }
      },
      "options": {
        "confirm_code": "Código de confirmación (se proporcionará)"
      }
    },
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "preview_title": "🗑️ Vista Previa de Restablecimiento Masivo",
    "preview_description": "Esto eliminará los siguientes datos de TODOS los guilds:",
    "collections_cleared": "📁 Colecciones a limpiar: {{count}}",
    "documents_deleted": "📄 Documentos estimados: {{count}}",
    "guilds_affected": "🏠 Guilds afectados: {{count}}",
    "warning": "⚠️ ADVERTENCIA",
    "warning_value": "Esta acción es DESTRUCTIVA y NO PUEDE deshacerse. Todas las configuraciones de guilds serán eliminadas permanentemente.",
    "confirmation_code": "🔑 Código de Confirmación",
    "confirmation_value": "Para ejecutar, usa `/resetall execute` con el código: `{{code}}`",
    "executing_title": "🗑️ Ejecutando Restablecimiento Masivo...",
    "executing_desc": "Eliminando todas las configuraciones de guilds...",
    "success_title": "✅ Restablecimiento Masivo Completo",
    "success_description": "Todas las configuraciones de guilds han sido restablecidas.",
    "documents_deleted_count": "🗑️ Total de documentos eliminados: {{count}}",
    "collections_cleared_count": "📁 Colecciones limpiadas: {{count}}",
    "errors": "❌ Errores: {{count}}",
    "invalid_code": "❌ Código de confirmación inválido. Obtén el código correcto de `/resetall preview`.",
    "no_code": "❌ Este comando requiere un código de confirmación de `/resetall preview`."
  },
  "resetguild": {
    "slash": {
      "description": "Restablecer configuración de un guild específico (Solo owner)",
      "options": {
        "guild_id": "ID del guild a restablecer (vacío para este guild)",
        "preserve_pro": "Preservar estado PRO/premium",
        "preserve_tickets": "Preservar tickets activos",
        "reason": "Razón del restablecimiento"
      }
    },
    "owner_only": "🔒 Este comando está restringido al dueño del bot.",
    "reset_title": "🗑️ Restablecimiento de Guild Completo",
    "reset_description": "La configuración ha sido restablecida para el guild: `{{guildId}}`",
    "guild_not_found": "❌ Guild no encontrado con ID: `{{guildId}}`",
    "error": "❌ Ocurrió un error durante el restablecimiento."
  },
  "alerts": {
    "security_alert": "Alerta de Seguridad",
    "security_system": "Sistema de Seguridad",
    "test_message": "Esta es una alerta de prueba para verificar que el sistema de notificación de seguridad funciona.",
    "test_recommendation": "Si ves esto, ¡el sistema de alertas está configurado correctamente!",
    "action_investigate": "Investigar actividad del usuario",
    "action_temporary_ban": "Considerar ban temporal si continúa el patrón",
    "action_verify_generator": "Verificar con generador de códigos",
    "action_check_business": "Verificar justificación de negocio",
    "action_review_permissions": "Revisar permisos de administrador",
    "action_verify_identity": "Verificar identidad del administrador",
    "action_check_health": "Verificar salud del bot",
    "action_review_deployments": "Revisar deployments recientes"
  }
};
