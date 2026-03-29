module.exports = {
  common: {
    language: {
      en: "Inglés",
      es: "Español",
    },
    value: {
      not_configured: "No configurado",
      not_published: "No publicado",
      none: "Ninguno",
      no_data: "Sin datos",
      no_recent_activity: "Sin actividad reciente.",
      system: "Sistema",
      unknown_time: "hora desconocida",
    },
    buttons: {
      english: "English",
      spanish: "Español",
      confirm: "Confirmar",
      cancel: "Cancelar",
      help: "Ayuda",
      enter_code: "Ingresar código",
      resend_code: "Reenviar código",
    },
    labels: {
      channel: "Canal",
      mode: "Modo",
      notes: "Notas",
      warnings: "Avisos",
      issues: "Problemas",
      recent_activity: "Actividad reciente",
      verified_role: "Rol verificado",
      unverified_role: "Rol sin verificar",
      log_channel: "Canal de logs",
      auto_kick: "Auto-kick",
      anti_raid: "Anti-raid",
      panel_message: "Mensaje del panel",
      question: "Pregunta",
      expected_answer: "Respuesta esperada",
      state: "Estado",
      status: "Estado",
      reason: "Motivo",
      current_language: "Idioma actual",
      onboarding_status: "Estado del onboarding",
      last_updated: "Última actualización",
      user: "Usuario",
      category: "Categoría",
      priority: "Prioridad",
      assigned_to: "Asignado a",
      claimed_by: "Reclamado por",
      ticket_id: "ID del ticket",
      created: "Creado",
      uptime: "Tiempo activo",
      servers: "Servidores",
      users: "Usuarios",
      channels: "Canales",
      build: "Build",
    },
    state: {
      enabled: "Activado",
      disabled: "Desactivado",
      ready: "Listo",
      operational_with_warnings: "Operativo con avisos",
      needs_attention: "Requiere atención",
      pending: "Pendiente",
      completed: "Completado",
    },
    setup_hint: {
      run_setup: "Siguiente paso: usa `/setup` para continuar con la configuración operativa.",
    },
  },
  access: {
    owner_only: "Este comando es solo para el owner del bot.",
    admin_required: "Necesitas permisos de administrador para usar este comando.",
    staff_required: "Necesitas permisos de staff para usar este comando.",
    guild_only: "Este comando solo se puede usar dentro de un servidor.",
    default: "No tienes permisos para usar este comando.",
  },
  interaction: {
    rate_limit: {
      command:
        "Límite temporal para `/{{commandName}}`. Espera **{{retryAfterSec}}s** antes de reintentar.",
      global:
        "Vas demasiado rápido. Espera **{{retryAfterSec}}s** antes de usar otra interacción.",
    },
    command_disabled:
      "El comando `/{{commandName}}` está deshabilitado en este servidor.",
    db_unavailable:
      "Base de datos temporalmente no disponible. Intenta de nuevo en unos segundos.",
    unexpected: "Ocurrió un error inesperado.",
  },
  onboarding: {
    title: "Welcome to TON618 / Bienvenido a TON618",
    description:
      "Choose the primary language for this server / Elige el idioma principal de este servidor.",
    body:
      "TON618 puede operar en inglés o español. Elige ahora el idioma por defecto para esta guild. Puedes cambiarlo más tarde con `/setup language`.",
    footer:
      "Si nadie selecciona un idioma, TON618 mantendrá inglés como valor por defecto hasta que se configure manualmente.",
    posted_title: "Onboarding de idioma enviado",
    posted_description:
      "Se envió un selector de idioma para este servidor. TON618 mantendrá inglés hasta que un administrador elija un idioma.",
    confirm_title: "Idioma del servidor actualizado",
    confirm_description:
      "TON618 ahora operará en **{{label}}** en este servidor.",
    dm_fallback_subject: "Configuración de idioma de TON618",
    dm_fallback_intro:
      "No pude publicar el mensaje de onboarding en un canal escribible del servidor, así que te lo envío por aquí.",
    delivery_failed:
      "TON618 se unió al servidor, pero no pude entregar el onboarding de idioma ni en un canal escribible ni por DM.",
  },
  setup: {
    general: {
      language_set: "Idioma del bot configurado: **{{label}}**.",
      language_label_es: "Español",
      language_label_en: "Inglés",
    },
    language: {
      title: "Idioma del servidor",
      description:
        "Revisa o actualiza el idioma operativo que TON618 usa en este servidor.",
      current_value:
        "TON618 está operando actualmente en **{{label}}**.",
      onboarding_completed: "Completado",
      onboarding_pending: "Pendiente",
      updated_value:
        "Idioma cambiado a **{{label}}**. TON618 usará este idioma en las respuestas visibles de esta guild.",
      fallback_note:
        "Las guilds sin selección explícita siguen usando inglés hasta que un administrador configure un idioma.",
      audit_reason_manual: "cambio_manual_de_idioma",
      audit_reason_onboarding: "selección_de_idioma_onboarding",
    },
    panel: {
      owner_only: "Solo la persona que abrió este panel puede usarlo.",
      admin_only: "Solo los administradores pueden usar este panel.",
      invalid_action: "Acción inválida.",
      invalid_command: "No se seleccionó un comando válido.",
      error_prefix: "Error: {{message}}",
      default_action_failed: "No se pudo aplicar la acción.",
      default_reset_failed: "No se pudo completar el reinicio.",
      action_applied: "Acción aplicada.",
      reset_applied: "Reinicio aplicado.",
    },
    commands: {
      mode_enable: "Habilitar",
      mode_status: "Estado",
      mode_disable: "Deshabilitar",
      summary_available: "Disponibles: **{{count}}**",
      summary_disabled: "Deshabilitados: **{{count}}**",
      summary_current_mode: "Modo actual: **{{mode}}**",
      summary_candidates: "Candidatos en el menú: **{{visible}}**{{hiddenText}}",
      hidden_suffix: " (+{{count}} ocultos)",
      summary_result: "Resultado: {{notice}}",
      panel_title: "Control de comandos del servidor",
      placeholder_action: "Selecciona una acción",
      option_disable_label: "Deshabilitar comando",
      option_disable_description: "Bloquea un comando en este servidor",
      option_enable_label: "Habilitar comando",
      option_enable_description: "Restaura un comando previamente deshabilitado",
      option_status_label: "Estado del comando",
      option_status_description: "Comprueba si un comando está habilitado",
      option_list_label: "Listar deshabilitados",
      option_list_description: "Muestra el resumen de comandos deshabilitados",
      option_reset_label: "Reiniciar todo",
      option_reset_description: "Vuelve a habilitar todos los comandos deshabilitados",
      placeholder_target: "Comando para {{action}}",
      no_candidates_label: "No hay comandos disponibles",
      no_candidates_description: "Cambia de acción para ver más opciones",
      candidate_description_status: "Ver estado actual",
      candidate_description_enable: "Habilitar comando",
      candidate_description_disable: "Deshabilitar comando",
      format_more: "- ... y {{count}} más",
      list_none:
        "No hay comandos deshabilitados en este servidor.\nDisponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      list_heading: "Comandos deshabilitados ({{count}}):",
      list_footer: "Disponibles: **{{available}}** | Habilitados: **{{enabled}}**.",
      audit_disabled: "Comando deshabilitado",
      audit_enabled: "Comando habilitado",
      audit_reset: "Comandos reiniciados",
      audit_updated: "Actualización de comandos",
      audit_affected: "Comando afectado: `/{{command}}`",
      audit_global: "Se aplicó un cambio global de comandos.",
      audit_executed_by: "Ejecutado por",
      audit_server: "Servidor",
      audit_before: "Antes",
      audit_after: "Después",
      list_embed_title: "Comandos del servidor",
      status_embed_title: "Estado del comando",
      panel_notice:
        "Usa los menús de abajo para gestionar comandos sin escribir nombres manualmente.",
      unknown_command: "El comando `/{{command}}` no existe en este bot.",
      status_result:
        "Estado de `/{{command}}`: **{{state}}**.\nComandos deshabilitados actualmente: **{{count}}**.",
      reset_noop: "No había comandos deshabilitados. No hay nada que reiniciar.",
      reset_done: "Se reactivaron **{{count}}** comando(s).",
      missing_command_name: "Debes proporcionar un nombre de comando válido.",
      disable_setup_forbidden:
        "No puedes deshabilitar `/setup`, o podrías bloquear tu acceso a la configuración.",
      already_disabled: "El comando `/{{command}}` ya estaba deshabilitado.",
      disabled_success: "Comando `/{{command}}` deshabilitado para este servidor.",
      already_enabled: "El comando `/{{command}}` ya estaba habilitado.",
      enabled_success: "Comando `/{{command}}` habilitado de nuevo.",
    },
    welcome: {
      enabled_state: "Los mensajes de bienvenida ahora están **{{state}}**.",
      channel_set: "Canal de bienvenida configurado en {{channel}}.",
      message_updated: "Mensaje de bienvenida actualizado.\nVariables disponibles: {{vars}}",
      title_updated: "Título de bienvenida actualizado a **{{text}}**.",
      invalid_color: "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      color_updated: "Color de bienvenida actualizado a **#{{hex}}**.",
      footer_updated: "Footer de bienvenida actualizado.",
      invalid_url: "La URL debe comenzar con `https://`.",
      banner_configured: "Banner de bienvenida configurado.",
      banner_removed: "Banner de bienvenida eliminado.",
      visible: "Visible",
      hidden: "Oculto",
      avatar_state: "Avatar del miembro en mensajes de bienvenida: **{{state}}**.",
      dm_state: "El DM de bienvenida ahora está **{{state}}**.{{messageNote}}",
      dm_message_note: "\nTambién se actualizó el cuerpo del DM.",
      autorole_set: "Auto-rol configurado: {{role}}",
      autorole_disabled: "Auto-rol desactivado.",
      test_requires_channel:
        "Configura primero un canal de bienvenida con `/setup welcome channel`.",
      test_channel_missing: "No se encontró el canal de bienvenida configurado.",
      test_default_title: "¡Bienvenido!",
      test_default_message: "¡Bienvenido {mention}!",
      test_field_user: "Usuario",
      test_field_account_created: "Cuenta creada",
      test_field_member_count: "Cantidad de miembros",
      test_message_suffix: "*(mensaje de prueba)*",
      test_sent: "Mensaje de prueba de bienvenida enviado a {{channel}}.",
    },
    goodbye: {
      enabled_state: "Los mensajes de despedida ahora están **{{state}}**.",
      channel_set: "Canal de despedida configurado en {{channel}}.",
      message_updated: "Mensaje de despedida actualizado.\nVariables disponibles: {{vars}}",
      title_updated: "Título de despedida actualizado a **{{text}}**.",
      invalid_color: "Color inválido. Usa un código hex de 6 caracteres como `{{example}}`.",
      color_updated: "Color de despedida actualizado a **#{{hex}}**.",
      footer_updated: "Footer de despedida actualizado.",
      visible: "Visible",
      hidden: "Oculto",
      avatar_state: "Avatar del miembro en mensajes de despedida: **{{state}}**.",
      test_requires_channel:
        "Configura primero un canal de despedida con `/setup goodbye channel`.",
      test_channel_missing: "No se encontró el canal de despedida configurado.",
      test_default_title: "Hasta luego",
      test_default_message: "**{user}** salió del servidor.",
      test_field_user: "Usuario",
      test_field_user_id: "ID de usuario",
      test_field_remaining_members: "Miembros restantes",
      test_field_roles: "Roles",
      test_roles_value: "Solo payload de prueba",
      test_sent: "Mensaje de prueba de despedida enviado a {{channel}}.",
    },
  },
  status: {
    commercial: "Comercial",
  },
  verify: {
    mode: {
      button: "Botón",
      code: "Código por DM",
      question: "Pregunta",
    },
    panel: {
      title: "Verificación",
      description:
        "Necesitas verificarte antes de acceder al servidor. Pulsa el botón de abajo para comenzar.",
      footer: "{{guild}} • Verificación",
      start_label: "Verificarme",
      help_label: "Ayuda",
    },
    info: {
      title: "Configuración de verificación",
      no_issues: "No se detectaron problemas.",
      protection_footer:
        "Protección: {{failures}} intentos fallidos -> {{minutes}}m de enfriamiento",
      raid_action_pause: "Solo alerta",
      raid_action_kick: "Expulsar automáticamente",
    },
    inspection: {
      channel_missing: "El canal de verificación no está configurado.",
      channel_deleted: "El canal de verificación configurado ya no existe.",
      channel_permissions:
        "No puedo publicar el panel en {{channel}}. Permisos faltantes: {{permissions}}.",
      verified_role_missing: "El rol verificado no está configurado.",
      verified_role_deleted: "El rol verificado configurado ya no existe.",
      verified_role_managed:
        "El rol verificado está gestionado por una integración y el bot no puede asignarlo.",
      verified_role_unmanageable:
        "No puedo gestionar el rol verificado {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      unverified_role_deleted:
        "El rol sin verificar configurado ya no existe.",
      unverified_role_managed:
        "El rol sin verificar está gestionado por una integración y el bot no puede asignarlo.",
      unverified_role_unmanageable:
        "No puedo gestionar el rol sin verificar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      roles_same:
        "El rol verificado y el rol sin verificar no pueden ser el mismo.",
      question_missing:
        "El modo pregunta está activado pero la pregunta de verificación está vacía.",
      answer_missing:
        "El modo pregunta está activado pero la respuesta esperada está vacía.",
      log_channel_deleted:
        "El canal de logs de verificación configurado ya no existe.",
      log_channel_permissions:
        "No puedo escribir en {{channel}}. Permisos faltantes: {{permissions}}.",
      apply_verified_missing:
        "El rol verificado no está configurado o ya no existe.",
      apply_verified_unmanageable:
        "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      apply_unverified_unmanageable:
        "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      apply_role_update_failed:
        "No pude actualizar los roles de verificación.",
      welcome_autorole_missing:
        "El auto-rol de bienvenida está configurado pero ya no existe.",
      welcome_autorole_failed:
        "No pude asignar el auto-rol de bienvenida {{role}}.",
      welcome_autorole_process_failed:
        "No pude procesar el auto-rol de bienvenida.",
      revoke_verified_unmanageable:
        "No puedo quitar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      revoke_unverified_unmanageable:
        "No puedo asignar {{role}}. Sube mi rol por encima de él y mantén `Manage Roles` activado.",
      revoke_role_update_failed:
        "No pude actualizar los roles de verificación.",
      publish_failed:
        "No pude enviar o editar el panel de verificación en {{channel}}. Verifica que pueda enviar mensajes y embeds allí.",
    },
    command: {
      confirmation_dm: "DM de confirmación",
      operational_health: "Salud operativa",
      raid_threshold: "Umbral de raid",
      raid_action: "Acción anti-raid",
      panel_saved_but_not_published:
        "La configuración de verificación se guardó, pero el panel no pudo publicarse.\n\n{{issues}}",
      panel_refreshed: "Panel de verificación actualizado.",
      panel_published: "Panel de verificación publicado.",
      setup_failed:
        "Todavía no puedo completar la configuración.\n\n{{issues}}",
      setup_ready_title: "Verificación lista",
      setup_ready_description:
        "El sistema de verificación está configurado y el panel en vivo está disponible.",
      note_ticket_role_aligned:
        "El rol mínimo de verificación para tickets se alineó automáticamente porque no estaba configurado.",
      note_question_mode:
        "El modo pregunta está activo. Usa `/verify question` si quieres reemplazar el desafío por defecto.",
      panel_publish_failed:
        "El panel de verificación no pudo publicarse.\n\n{{issues}}",
      enable_failed:
        "Todavía no puedo activar la verificación.\n\n{{issues}}",
      enabled_state: "La verificación ahora está **{{state}}**.",
      mode_failed:
        "Todavía no puedo cambiar a **{{mode}}**.\n\n{{issues}}",
      mode_changed:
        "El modo de verificación cambió a **{{mode}}**. {{detail}}",
      question_updated: "Pregunta de verificación actualizada.",
      message_require_one:
        "Proporciona al menos un campo para actualizar: `title`, `description`, `color` o `image`.",
      invalid_color:
        "Color inválido. Usa un valor hexadecimal de 6 caracteres como `57F287`.",
      invalid_image:
        "La URL de la imagen debe comenzar con `https://`.",
      message_updated: "Panel de verificación actualizado. {{detail}}",
      dm_updated:
        "El DM de confirmación de verificación ahora está **{{state}}**.",
      auto_kick_disabled:
        "El auto-kick para miembros sin verificar ahora está **desactivado**.",
      auto_kick_enabled:
        "Los miembros sin verificar serán expulsados después de **{{hours}} hora(s)**.",
      anti_raid_enabled:
        "El anti-raid ahora está **activado**.\nUmbral: **{{joins}} joins** en **{{seconds}}s**.\nAcción: **{{action}}**.",
      anti_raid_disabled: "El anti-raid ahora está **desactivado**.",
      logs_permissions:
        "No puedo usar {{channel}} para los logs de verificación. Permisos faltantes: {{permissions}}.",
      logs_set: "Los logs de verificación se enviarán a {{channel}}.",
      force_bot:
        "Los bots no pueden verificarse mediante el flujo de verificación de miembros.",
      user_missing: "Ese usuario no está en este servidor.",
      force_failed:
        "No pude verificar a <@{{userId}}>.\n\n{{issues}}",
      force_success:
        "<@{{userId}}> fue verificado manualmente.{{warningText}}",
      unverify_bot:
        "Los bots no usan el flujo de verificación de miembros.",
      unverify_failed:
        "No pude quitar la verificación de <@{{userId}}>.\n\n{{issues}}",
      unverify_success:
        "Se quitó la verificación de <@{{userId}}>.{{warningText}}",
      stats_title: "Estadísticas de verificación",
      stats_footer: "Eventos de verificación almacenados: {{total}}",
      unknown_subcommand: "Subcomando de verificación desconocido.",
      force_log_title: "Miembro verificado manualmente",
      unverify_log_title: "Miembro desverificado",
      actor: "Actor",
      member: "Miembro",
      verified: "Verificados",
      failed: "Fallidos",
      kicked: "Expulsados",
      starts: "Inicios",
      force_verified: "Verificados manualmente",
      force_unverified: "Desverificados manualmente",
      pending_members: "Miembros pendientes",
      verified_members: "Miembros verificados",
      code_sends: "Códigos enviados",
      question_prompts: "Prompts de pregunta",
      anti_raid_triggers: "Activaciones anti-raid",
      permission_errors: "Errores de permisos",
    },
    handler: {
      not_active: "La verificación no está activa en este servidor.",
      member_not_found:
        "No pude encontrar tu perfil de miembro en este servidor.",
      already_verified: "Ya estás verificado en este servidor.",
      misconfigured:
        "La verificación está mal configurada en este momento.\n\n{{issues}}",
      too_many_attempts:
        "Demasiados intentos fallidos. Intenta de nuevo {{retryText}}.",
      code_dm_title: "Código de verificación",
      code_dm_description:
        "Tu código de verificación para **{{guild}}** es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.\nVuelve al servidor y pulsa **{{enterCodeLabel}}**.",
      dm_failed:
        "No pude enviarte un DM.\n\nActiva los mensajes directos para este servidor y vuelve a intentarlo.",
      code_sent_title: "Código enviado por DM",
      code_sent_description:
        "Se envió un código de 6 caracteres a tus mensajes directos.\n\n1. Abre tu bandeja de DMs y copia el código.\n2. Vuelve aquí y pulsa **{{enterCodeLabel}}**.\n\nEl código expira en **10 minutos**.",
      code_sent_footer:
        "Los reenvíos están limitados. Espera {{seconds}}s antes de pedir otro código.",
      question_missing:
        "No hay una pregunta de verificación configurada. Pide a un admin que ejecute `/verify question`.",
      question_modal_title: "Pregunta de verificación",
      question_placeholder: "Escribe tu respuesta aquí",
      mode_invalid: "El modo de verificación no está configurado correctamente.",
      help_title: "Cómo funciona la verificación",
      help_mode_button:
        "Pulsa **Verificarme** y el bot te verificará inmediatamente.",
      help_mode_code:
        "Pulsa **Verificarme**, revisa tu DM para ver el código y luego ingrésalo en el modal.",
      help_mode_question:
        "Pulsa **Verificarme** y responde correctamente la pregunta de verificación.",
      help_dm_problems_label: "¿Problemas con DM?",
      help_dm_problems:
        "Activa los mensajes directos para este servidor y vuelve a intentarlo.",
      help_attempts_label: "Protección de intentos",
      help_attempts:
        "Después de {{failures}} intentos fallidos, la verificación se pausa durante {{minutes}} minutos.",
      help_blocked_label: "¿Sigues bloqueado?",
      help_blocked:
        "Contacta a un administrador del servidor para obtener ayuda manual.",
      enter_code_title: "Ingresa tu código",
      enter_code_label: "Código recibido por DM",
      enter_code_placeholder: "Ejemplo: AB1C2D",
      not_code_mode:
        "Este modo de verificación no usa códigos por DM.",
      code_reason_no_code:
        "No se encontró un código pendiente. Pulsa **Verificarme** para generar uno nuevo.",
      code_reason_expired:
        "Tu código expiró. Pulsa **Verificarme** para generar uno nuevo.",
      code_reason_wrong: "Código incorrecto. Intenta otra vez.",
      invalid_code: "Código de verificación inválido.",
      incorrect_answer:
        "Respuesta incorrecta. Lee la pregunta con cuidado e inténtalo de nuevo.{{cooldownText}}",
      resend_wait:
        "Espera antes de pedir otro código. Podrás reintentar {{retryText}}.",
      new_code_title: "Nuevo código de verificación",
      new_code_description:
        "Tu nuevo código de verificación es:\n\n# `{{code}}`\n\nEste código expira en **10 minutos**.",
      resend_dm_failed:
        "No pude enviarte un DM. Activa los mensajes directos e inténtalo de nuevo.",
      resend_success:
        "Se envió un nuevo código de verificación por DM.",
      completion_failed:
        "No pude completar tu verificación porque la configuración de roles no está operativa.\n\n{{issues}}",
      completed_title: "Verificación completada",
      completed_description:
        "Bienvenido a **{{guild}}**, <@{{userId}}>. Ahora ya tienes acceso completo al servidor.",
      verified_dm_title: "Ya estás verificado",
      verified_dm_description:
        "Te verificaste correctamente en **{{guild}}**.",
      log_verified_title: "Miembro verificado",
      log_warning_none: "Ninguno",
    },
  },
  staff: {
    moderation_required:
      "Necesitas el permiso `Moderate Members` para este subcomando.",
    only_staff: "Solo el staff puede usar este comando.",
    away_on_title: "Modo ausente activado",
    away_on_description:
      "Tu estado ahora es **ausente**.{{reasonText}}",
    away_on_footer: "Usa /staff away-off cuando vuelvas a estar disponible",
    away_off: "Ahora vuelves a estar **disponible** para tickets.",
    my_tickets_title: "Mis tickets ({{count}})",
    my_tickets_empty: "Ahora mismo no tienes tickets abiertos asignados o reclamados.",
    ownership_claimed: "Reclamado",
    ownership_assigned: "Asignado",
    ownership_watching: "En seguimiento",
  },
  stats: {
    server_title: "Operaci\u00f3n de tickets - {{guild}}",
    total: "Total",
    open: "Abiertos",
    closed: "Cerrados",
    today: "Hoy",
    week: "Esta semana",
    avg_rating: "Calificaci\u00f3n promedio",
    avg_response: "Respuesta promedio",
    avg_close: "Cierre promedio",
    opened: "Abiertos",
    no_data: "Sin datos",
    sla_title: "SLA - {{guild}}",
    sla_description:
      "Vista operativa del SLA para primera respuesta y presi\u00f3n de escalaci\u00f3n.",
    sla_threshold: "Umbral SLA",
    escalation: "Escalaci\u00f3n",
    escalation_threshold: "Umbral de escalaci\u00f3n",
    sla_overrides: "Overrides SLA",
    escalation_overrides: "Overrides de escalaci\u00f3n",
    open_out_of_sla: "Tickets abiertos fuera de SLA",
    open_escalated: "Tickets abiertos escalados",
    avg_first_response: "Primera respuesta promedio",
    sla_compliance: "Cumplimiento SLA",
    tickets_evaluated: "Tickets evaluados",
    no_sla_threshold: "No hay umbral SLA o todav\u00eda no hay respuestas",
    not_configured: "No configurado",
    staff_no_data_title: "Sin datos",
    staff_no_data_description: "<@{{userId}}> todav\u00eda no tiene estad\u00edsticas.",
    no_ratings_yet: "Todav\u00eda no hay calificaciones",
    ratings_count: "{{count}} calificaciones",
    staff_title: "Estad\u00edsticas de staff - {{user}}",
    closed_tickets: "Tickets cerrados",
    claimed_tickets: "Tickets reclamados",
    assigned_tickets: "Tickets asignados",
    average_rating: "Calificaci\u00f3n promedio",
    leaderboard_title: "Leaderboard de staff",
    leaderboard_empty: "Todav\u00eda no hay datos de staff.",
    leaderboard_closed: "cerrados",
    leaderboard_claimed: "reclamados",
    ratings_title: "Leaderboard de calificaciones",
    ratings_empty: "Todav\u00eda no hay calificaciones.",
    period_all: "Todo el tiempo",
    period_month: "\u00daltimo mes",
    period_week: "\u00daltima semana",
    fallback_user: "Usuario {{suffix}}",
    fallback_staff: "Staff {{suffix}}",
    staff_rating_title: "Calificaciones - {{user}}",
    staff_rating_empty:
      "Este miembro del staff todav\u00eda no tiene calificaciones registradas.",
    average_score: "Puntaje promedio",
    total_ratings: "Total de calificaciones",
  },
  commercial: {
    lines: {
      current_plan: "Plan actual: `{{plan}}`",
      stored_plan: "Plan guardado: `{{plan}}`",
      plan_source: "Origen del plan: `{{source}}`",
      plan_expires: "Expira el plan: {{value}}",
      supporter: "Supporter: {{value}}",
      status_expired: "Estado del plan: `expirado -> funcionando como free`",
      plan_note: "Nota del plan: {{note}}",
      supporter_expires: "Supporter expira: `{{date}}`",
    },
    values: {
      unknown: "desconocido",
      never: "Nunca",
      enabled: "Activado",
      inactive: "Inactivo",
    },
    pro_required: {
      title: "Pro requerido",
      description:
        "**{{feature}}** forma parte del plan Pro.\nPidele al owner del bot que active Pro manualmente para este servidor.",
      current_plan: "Plan actual",
      supporter: "Supporter",
      footer:
        "Las donaciones no desbloquean funciones premium. El estado supporter es solo reconocimiento.",
    },
  },
  audit: {
    unsupported_subcommand: "Subcomando no soportado.",
    invalid_from: "`from` debe usar el formato YYYY-MM-DD.",
    invalid_to: "`to` debe usar el formato YYYY-MM-DD.",
    invalid_range: "`from` no puede ser mayor que `to`.",
    title: "Auditor\u00eda de tickets",
    empty: "Ning\u00fan ticket coincidi\u00f3 con esos filtros.",
    export_title: "Exportaci\u00f3n de auditor\u00eda de tickets",
    rows: "Filas",
    status: "Estado",
    priority: "Prioridad",
    category: "Categor\u00eda",
    from: "Desde",
    to: "Hasta",
    all: "todos",
  },
  debug: {
    access_denied: "No tienes permisos para usar comandos de debug.",
    unknown_subcommand: "Subcomando desconocido.",
    no_connected_guilds: "No hay guilds conectadas.",
    title: {
      status: "Estado del Bot",
      automod: "Progreso del Badge de AutoMod",
      health: "Salud del Bot",
      memory: "Uso de Memoria",
      cache: "Estado de Cache",
      guilds: "Guilds Conectadas",
      voice: "Subsistema de Musica",
      entitlements: "Entitlements de la Guild",
      plan_updated: "Plan Actualizado",
      supporter_updated: "Supporter Actualizado",
    },
    description: {
      automod:
        "Conteo en vivo, solo para owner, de reglas de AutoMod gestionadas por TON618 en las guilds conectadas.",
      health: "Snapshot de la ventana activa mas el ultimo heartbeat persistido.",
      cache: "Discord.js gestiona la cache automaticamente.",
      voice: "Las colas de musica se gestionan por guild.",
    },
    field: {
      api_ping: "Ping de API",
      uptime: "Tiempo activo",
      guilds: "Guilds",
      cached_users: "Usuarios en cache",
      cached_channels: "Canales en cache",
      deploy: "Deploy",
      progress: "Progreso",
      guild_coverage: "Cobertura por Guild",
      quick_state: "Estado rapido",
      interaction_window: "Ventana de interacciones",
      heartbeat: "Heartbeat",
      top_errors: "Errores principales",
      rss: "RSS",
      heap_total: "Heap total",
      heap_used: "Heap usado",
      external: "External",
      users: "Usuarios",
      channels: "Canales",
      guilds_live_rules: "Guilds con reglas vivas de TON618",
      guilds_attention: "Guilds que requieren atencion",
    },
    value: {
      app_flag_present: "Flag de la app presente: {{value}}",
      managed_rules: "Reglas gestionadas: `{{count}}`",
      remaining_to_goal: "Restantes para {{goal}}: `{{count}}`",
      automod_enabled: "AutoMod activado: `{{count}}`",
      missing_permissions: "Permisos faltantes: `{{count}}`",
      failed_partial_sync: "Sync fallida o parcial: `{{count}}`",
      ping_state: "Ping: **{{state}}** ({{value}}ms, umbral {{threshold}}ms)",
      error_rate: "Tasa de error: **{{state}}** ({{value}}%, umbral {{threshold}}%)",
      interaction_totals:
        "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      heartbeat:
        "Ultima vez visto: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      yes: "Si",
      no: "No",
      high: "ALTO",
      ok: "OK",
    },
  },
  ticket: {
    footer: "TON618 Tickets",
    error_label: "Error",
    field_category: "Categoria",
    field_priority: "Prioridad",
    field_assigned_to: "Asignado a",
    priority: {
      low: "Baja",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
    },
    workflow: {
      waiting_staff: "Esperando al staff",
      waiting_user: "Esperando al usuario",
      triage: "En revisión",
      assigned: "Asignado",
      open: "Abierto",
      closed: "Cerrado",
    },
    quick_actions: {
      priority_low: "Prioridad: Baja",
      priority_normal: "Prioridad: Normal",
      priority_high: "Prioridad: Alta",
      priority_urgent: "Prioridad: Urgente",
      status_wait: "Estado: Esperando al staff",
      status_pending: "Estado: Esperando al usuario",
      status_review: "Estado: En revisión",
      placeholder: "Acciones rápidas de staff...",
    },
    quick_feedback: {
      only_staff: "Solo el staff puede usar estas acciones.",
      not_found: "No se encontró la información del ticket.",
      closed: "Las acciones rápidas no están disponibles en tickets cerrados.",
      priority_event_title: "Prioridad actualizada",
      priority_event_description:
        "{{userTag}} actualizó la prioridad del ticket #{{ticketId}} a {{priority}} desde acciones rápidas.",
      priority_updated:
        "La prioridad del ticket se actualizó a **{{label}}** por <@{{userId}}>.",
      workflow_event_title: "Estado operativo actualizado",
      workflow_event_description:
        "{{userTag}} actualizó el estado operativo del ticket #{{ticketId}} a {{status}} desde acciones rápidas.",
      workflow_updated:
        "El estado del ticket se actualizó a **{{label}}** por <@{{userId}}>.",
      add_staff_prompt: "Menciona al miembro del staff que quieres agregar a este ticket.",
      unknown_action: "Acción desconocida.",
      processing_error: "Ocurrió un error mientras se procesaba esta acción.",
    },
    buttons: {
      close: "Cerrar",
      claim: "Reclamar",
      claimed: "Reclamado",
      transcript: "Transcripción",
    },
    rating: {
      invalid_identifier_title: "No se pudo guardar tu calificación",
      invalid_identifier_description:
        "El identificador de esta solicitud de calificación no es válido.",
      invalid_value_title: "Calificación inválida",
      invalid_value_description: "Selecciona una puntuación entre 1 y 5 estrellas.",
      prompt_title: "Califica el soporte que recibiste",
      prompt_description:
        "Hola <@{{userId}}>, tu ticket **#{{ticketId}}** ha sido cerrado.\n\n**Calificación obligatoria:** debes calificar este ticket antes de abrir nuevos tickets en el futuro.\n\nTu feedback nos ayuda a mejorar el servicio y mantener una experiencia de soporte sólida.",
      prompt_staff_label: "Miembro del staff",
      prompt_category_fallback: "General",
      prompt_footer: "Tu opinión nos importa",
      prompt_placeholder: "Selecciona una calificación...",
      prompt_option_1_label: "1 estrella",
      prompt_option_1_description: "El soporte no cumplió mis expectativas",
      prompt_option_2_label: "2 estrellas",
      prompt_option_2_description: "El soporte fue aceptable pero necesita mejorar",
      prompt_option_3_label: "3 estrellas",
      prompt_option_3_description: "El soporte fue sólido y aceptable",
      prompt_option_4_label: "4 estrellas",
      prompt_option_4_description: "El soporte fue muy profesional",
      prompt_option_5_label: "5 estrellas",
      prompt_option_5_description: "El soporte superó mis expectativas",
      resend_wrong_user:
        "Este botón solo puede usarlo el usuario correspondiente.",
      resend_clear:
        "**Todo al día.**\n\nYa no tienes calificaciones de tickets pendientes.\nPuedes abrir un nuevo ticket cuando lo necesites.",
      resend_sent:
        "**Solicitudes de calificación reenviadas**\n\nReenviamos **{{successCount}}** solicitud(es) de calificación a tus DMs.\n\n**Revisa tus DMs** para calificar los tickets pendientes.{{warning}}",
      resend_partial_warning:
        "Aviso: no se pudieron reenviar {{failCount}} solicitud(es).",
      resend_failed:
        "**No se pudieron reenviar las solicitudes de calificación**\n\nAsegúrate de tener los DMs abiertos e inténtalo otra vez.",
      resend_error:
        "Ocurrió un error al reenviar las solicitudes de calificación. Inténtalo de nuevo más tarde.",
      not_found_title: "Ticket no encontrado",
      not_found_description:
        "No pude encontrar el ticket vinculado a esta solicitud de calificación.",
      unavailable_title: "Calificación no disponible",
      unavailable_description:
        "Solo el creador de este ticket puede enviar esta calificación.",
      already_recorded_title: "Calificación ya registrada",
      already_recorded_description:
        "Ya calificaste este ticket con **{{rating}} estrella(s)**.",
      already_recorded_processing:
        "Este ticket fue calificado mientras se procesaba tu respuesta.",
      event_title: "Calificación recibida",
      event_description:
        "{{userTag}} calificó el ticket #{{ticketId}} con {{rating}}/5.",
      thanks_title: "Gracias por tu calificación",
      thanks_description:
        "Calificaste la experiencia de soporte con **{{rating}} estrella(s)**.\n\nTu feedback se registró correctamente y nos ayuda a mejorar el servicio.",
      save_failed_title: "No se pudo guardar tu calificación",
      save_failed_description:
        "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
    },
    move_select: {
      move_failed:
        "No pude mover el ticket en este momento. Inténtalo de nuevo más tarde.",
    },
    transcript_button: {
      not_ticket:
        "No pude generar la transcripción porque este canal ya no está registrado como ticket.",
      unavailable_now: "No pude generar la transcripción del ticket ahora mismo.",
      intro: "Aquí tienes la transcripción manual de este ticket:",
      error: "Ocurrió un error al generar la transcripción. Inténtalo de nuevo más tarde.",
    },
    close_button: {
      already_closed: "Este ticket ya está cerrado.",
      bot_member_missing: "No pude verificar mis permisos en este servidor.",
      missing_manage_channels:
        "Necesito el permiso `Manage Channels` para cerrar tickets.",
      permission_denied_title: "Permiso denegado",
      permission_denied_description: "Solo el staff puede cerrar tickets.",
      modal_title: "Cerrar ticket #{{ticketId}}",
      reason_label: "Motivo de cierre",
      reason_placeholder:
        "Ejemplo: resuelto, duplicado, solicitud completada...",
      notes_label: "Notas internas",
      notes_placeholder: "Notas extra solo para staff...",
      close_note_event_title: "Nota de cierre agregada",
      close_note_event_description:
        "{{userTag}} agregó una nota interna antes de cerrar el ticket #{{ticketId}}.",
      processing_title: "Procesando cierre",
      processing_description:
        "Iniciando el flujo de cierre y generación de transcripción...",
      auto_close_failed:
        "No pude cerrar el ticket automáticamente. Inténtalo de nuevo o avisa a un administrador.",
      modal_error:
        "Ocurrió un error al procesar el cierre del ticket. Inténtalo de nuevo más tarde.",
      open_form_error:
        "Ocurrió un error al abrir el formulario de cierre. Inténtalo otra vez.",
    },
    defaults: {
      public_panel_title: "¿Necesitas ayuda? Estamos aquí para ti.",
      public_panel_description:
        "Abre un ticket privado seleccionando la categoría que mejor encaje con tu solicitud.",
      public_panel_footer: "{guild} • Soporte profesional",
      welcome_message:
        "Hola {user}, tu ticket **{ticket}** ha sido creado. Comparte todos los detalles posibles.",
      control_panel_title: "Panel de Control del Ticket",
      control_panel_description:
        "Este es el panel de control del ticket **{ticket}**.\nUsa los controles de abajo para gestionarlo.",
      control_panel_footer: "{guild} • TON618 Tickets",
    },
    panel: {
      categories_heading: "Elige una categoría",
      categories_cta: "Elige una opción del menú de abajo para empezar.",
      queue_name: "Cola actual",
      queue_value:
        "Ahora mismo tenemos `{{openTicketCount}}` ticket(s) activo(s). Responderemos lo antes posible.",
      faq_button: "Preguntas frecuentes",
    },
    create_flow: {
      system_not_configured_title: "Sistema de tickets no configurado",
      system_not_configured_description:
        "El sistema de tickets no está configurado correctamente.\n\n**Problema:** no hay categorías de tickets configuradas.\n\n**Solución:** un administrador debe crear categorías con:\n`/config category add`\n\nContacta al equipo de administración del servidor para resolver este problema.",
      system_not_configured_footer: "TON618 Tickets - Error de configuración",
      category_not_found: "Categoría no encontrada.",
      invalid_form: "El formulario no es válido. Amplía la primera respuesta.",
      min_days_required:
        "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.",
      blacklisted:
        "Estás en blacklist.\n**Motivo:** {{reason}}",
      verify_role_required:
        "Necesitas el rol <@&{{roleId}}> para abrir tickets.",
      pending_ratings_title: "Calificaciones de tickets pendientes",
      pending_ratings_description:
        "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      pending_ratings_footer: "TON618 Tickets - Sistema de calificación",
      resend_ratings_button: "Reenviar solicitudes de calificación",
      duplicate_request:
        "Ya se está procesando una solicitud de creación de ticket para ti. Espera unos segundos.",
      global_limit:
        "Este servidor alcanzó el límite global de **{{limit}}** tickets abiertos. Espera a que se libere espacio.",
      user_limit:
        "Ya tienes **{{openCount}}/{{maxPerUser}}** tickets abiertos{{suffix}}",
      cooldown:
        "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.",
      missing_permissions:
        "No tengo los permisos necesarios para crear tickets.\n\nPermisos requeridos: Manage Channels, View Channel, Send Messages, Manage Roles.",
      self_permissions_error:
        "No pude verificar mis permisos en este servidor.",
      welcome_message_failed: "No se pudo enviar el mensaje de bienvenida.",
      control_panel_failed: "No se pudo enviar el panel de control.",
      dm_created_title: "Ticket creado",
      dm_created_description:
        "Tu ticket **#{{ticketId}}** ha sido creado en **{{guild}}**.\nCanal: <#{{channelId}}>\n\nTe avisaremos cuando el staff responda.",
      created_success_title: "Ticket creado correctamente",
      created_success_description:
        "Tu ticket ha sido creado: <#{{channelId}}> | **#{{ticketId}}**\n\nVe al canal para continuar tu solicitud.{{warningText}}",
      submitted_form: "Formulario enviado",
      question_fallback: "Pregunta {{index}}",
      general_category: "General",
    },
    create_errors: {
      reserve_number:
        "No pude reservar un número interno para el ticket. Inténtalo de nuevo en unos segundos.",
      duplicate_number:
        "Hubo un conflicto interno al numerar el ticket. Inténtalo de nuevo.",
      missing_permissions:
        "No tengo permisos suficientes para crear o preparar el canal del ticket.",
      generic:
        "Ocurrió un error al crear el ticket. Verifica mis permisos o contacta a un administrador.",
    },
    faq: {
      title: "Preguntas frecuentes",
      description:
        "Aquí están las respuestas más comunes que la gente necesita antes de abrir un ticket. Revisarlas rápido puede ahorrarte tiempo de espera.",
      q1_question: "¿Cómo compro un producto o membresía?",
      q1_answer:
        "Ve a nuestra tienda oficial, o abre un ticket en la categoría **Ventas** si necesitas ayuda paso a paso.",
      q2_question: "¿Cómo solicito un reembolso?",
      q2_answer:
        "Abre un ticket de **Soporte / Facturación** e incluye tu comprobante de pago más el ID de transacción para que el equipo lo revise.",
      q3_question: "Quiero reportar a un usuario",
      q3_answer:
        "Para que un reporte sea válido, incluye capturas o videos claros y explica la situación en un ticket de **Reportes**.",
      q4_question: "Quiero aplicar para una partnership",
      q4_answer:
        "Las solicitudes de partnership se gestionan por tickets de **Partnership**. Asegúrate de cumplir primero los requisitos mínimos.",
      footer:
        "¿Sigues necesitando ayuda? Elige una categoría en el menú desplegable para abrir un ticket.",
      load_failed:
        "No pudimos cargar la FAQ ahora mismo. Inténtalo de nuevo más tarde.",
    },
    picker: {
      access_denied_title: "Acceso denegado",
      access_denied_description:
        "No puedes crear tickets ahora mismo.\n**Motivo:** {{reason}}",
      access_denied_footer:
        "Si crees que esto es un error, contacta a un administrador.",
      limit_reached_title: "Límite de tickets alcanzado",
      limit_reached_description:
        "Ya tienes **{{openCount}}/{{maxTickets}}** tickets abiertos.\n\n**Tus tickets activos:**\n{{ticketList}}\n\nCierra uno de tus tickets actuales antes de abrir uno nuevo.",
      no_categories:
        "No hay categorías de tickets configuradas para este servidor.",
      select_title: "Crear un nuevo ticket",
      select_description:
        "Selecciona la categoría que mejor encaje con tu solicitud para que el equipo correcto pueda ayudarte más rápido.\n\nCada categoría enruta tu solicitud al staff adecuado.",
      select_placeholder: "Selecciona el tipo de ticket...",
      processing_error:
        "Ocurrió un error mientras se preparaba el formulario del ticket. Intenta de nuevo más tarde.",
      category_missing:
        "Esa categoría no se encontró o no está disponible ahora mismo. Elige otra opción.",
      cooldown:
        "Espera **{{minutes}} minuto(s)** antes de abrir otro ticket.\n\nEste cooldown ayuda al equipo a gestionar mejor las solicitudes entrantes.",
      min_days:
        "Debes llevar al menos **{{days}} día(s)** en el servidor para abrir un ticket.\n\nTiempo actual en el servidor: **{{currentDays}} día(s)**",
      pending_ratings_title: "Calificaciones de tickets pendientes",
      pending_ratings_description:
        "Tienes **{{count}}** ticket(s) cerrados esperando una calificación:\n\n{{tickets}}\n\n**¿Por qué importa calificar?**\nTu feedback nos ayuda a mejorar el servicio y es obligatorio antes de abrir nuevos tickets.\n\n**Revisa tus DMs** para encontrar los prompts pendientes.\nSi no los encuentras, usa el botón de abajo para reenviarlos.",
      pending_ratings_footer: "TON618 Tickets - Sistema de calificación",
      resend_ratings_button: "Reenviar solicitudes de calificación",
    },
    modal: {
      category_unavailable:
        "Esta categoría de ticket ya no está disponible. Vuelve a empezar.",
      first_answer_short:
        "Tu primera respuesta es demasiado corta. Agrega más contexto antes de crear el ticket.",
    },
    maintenance: {
      title: "Sistema en mantenimiento",
      description:
        "El sistema de tickets está temporalmente desactivado.\n\n**Motivo:** {{reason}}\n\nPor favor vuelve más tarde.",
      scheduled: "Mantenimiento programado",
    },
    command: {
      unknown_subcommand: "Subcomando de ticket desconocido.",
      not_ticket_channel: "Este no es un canal de ticket.",
      only_staff_close: "Solo el staff puede cerrar tickets.",
      only_staff_reopen: "Solo el staff puede reabrir tickets.",
      only_staff_claim: "Solo el staff puede reclamar tickets.",
      release_denied: "No tienes permiso para liberar este ticket.",
      only_staff_assign: "Solo el staff puede asignar tickets.",
      only_staff_add: "Solo el staff puede agregar usuarios al ticket.",
      only_staff_remove: "Solo el staff puede quitar usuarios del ticket.",
      only_staff_rename: "Solo el staff puede renombrar tickets.",
      valid_channel_name: "Proporciona un nombre de canal valido.",
      channel_renamed: "Canal renombrado a **{{name}}**",
      closed_priority_denied: "No puedes cambiar la prioridad de un ticket cerrado.",
      only_staff_priority: "Solo el staff puede cambiar la prioridad del ticket.",
      priority_updated: "Prioridad actualizada a **{{label}}**",
      only_staff_move: "Solo el staff puede mover tickets.",
      no_other_categories: "No hay otras categorias disponibles.",
      move_select_description: "Selecciona la categoria a la que quieres mover este ticket:",
      move_select_placeholder: "Selecciona la nueva categoria...",
      only_staff_transcript: "Solo el staff puede generar transcripciones.",
      transcript_failed: "No se pudo generar la transcripcion.",
      transcript_generated: "Transcripcion generada.",
      only_staff_brief: "Solo el staff puede ver el case brief.",
      only_staff_info: "Solo el staff puede ver los detalles del ticket.",
      only_staff_other_history: "Solo el staff puede ver el historial de otro usuario.",
      history_title: "Historial de tickets de {{user}}",
      history_empty: "<@{{userId}}> no tiene tickets en este servidor.",
      history_summary: "Resumen",
      history_open_now: "Abiertos ahora",
      history_recently_closed: "Cerrados recientemente",
      no_rating: "Sin calificacion",
      history_summary_value: "Total: **{{total}}** | Abiertos: **{{open}}** | Cerrados: **{{closed}}**",
      only_staff_notes: "Solo el staff puede ver o agregar notas.",
      only_admin_clear_notes: "Solo los administradores pueden limpiar todas las notas del ticket.",
      notes_cleared: "Se limpiaron todas las notas del ticket.",
      notes_cleared_event_description:
        "{{userTag}} limpio las notas internas del ticket #{{ticketId}}.",
      note_limit_reached:
        "Se alcanzo el limite de notas del ticket (**{{max}}** notas maximas por ticket). Usa `/ticket note clear` si necesitas limpiarlas.",
      note_added_title: "Nota interna agregada",
      note_added_event_description:
        "{{userTag}} agrego una nota interna al ticket #{{ticketId}}.",
      note_added_footer: "Por {{userTag}} · {{count}}/{{max}}",
      notes_title: "Notas del ticket",
      notes_empty: "Todavia no hay notas en este ticket.",
      notes_list_title: "Notas del ticket — #{{ticketId}} ({{count}}/{{max}})",
      rename_event_title: "Canal renombrado",
      rename_event_description:
        "{{userTag}} renombro el ticket #{{ticketId}} a {{name}}.",
      priority_event_title: "Prioridad actualizada",
      priority_event_description:
        "{{userTag}} cambio la prioridad del ticket #{{ticketId}} a {{label}}.",
    },
    lifecycle: {
      close: {
        already_closed: "Este ticket ya esta cerrado.",
        verify_permissions: "No pude verificar mis permisos en este servidor.",
        manage_channels_required:
          "Necesito el permiso `Manage Channels` para cerrar este ticket.",
        already_closed_during_request:
          "Este ticket ya fue cerrado mientras se procesaba tu solicitud.",
        database_error:
          "Hubo un error al cerrar el ticket en la base de datos. Intenta de nuevo.",
        event_title: "Ticket cerrado",
        event_description:
          "{{userTag}} cerro el ticket #{{ticketId}}.",
        transcript_generate_failed:
          "No se pudo generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        transcript_channel_missing:
          "No hay un canal de transcripciones configurado. El canal permanecera cerrado y no se eliminara automaticamente.",
        transcript_channel_unavailable:
          "El canal de transcripciones configurado no existe o no es accesible. El canal no se eliminara automaticamente.",
        transcript_send_failed:
          "No se pudo enviar la transcripcion al canal configurado. El canal no se eliminara automaticamente.",
        transcript_generate_error:
          "Ocurrio un error al generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.",
        dm_receipt_title: "Recibo de soporte",
        dm_receipt_description:
          "Gracias por contactar con nuestro equipo de soporte. Aqui tienes un resumen de tu ticket.",
        dm_field_ticket: "Ticket",
        dm_field_category: "Categoria",
        dm_field_opened: "Fecha de apertura",
        dm_field_closed: "Fecha de cierre",
        dm_field_duration: "Duracion total",
        dm_field_reason: "Razon de cierre",
        dm_field_handled_by: "Atendido por",
        dm_field_messages: "Mensajes",
        dm_field_transcript: "Transcripcion en linea",
        dm_transcript_link: "Ver transcripcion completa",
        dm_no_reason: "No se proporciono una razon",
        dm_footer: "Gracias por confiar en nuestro soporte - TON618 Tickets",
        dm_warning_title: "Aviso: DM no enviado",
        dm_warning_description:
          "No se pudo enviar el mensaje de cierre por DM a <@{{userId}}>.\n\n**Posible causa:** el usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n**Ticket:** #{{ticketId}}",
        dm_warning_transcript: "Transcripcion disponible",
        dm_warning_unavailable: "No disponible",
        warning_dm_failed: "No se pudo enviar DM al usuario.",
        warning_channel_not_deleted:
          "El canal no se eliminara automaticamente hasta que la transcripcion quede archivada de forma segura.",
        log_reason: "Razon",
        log_duration: "Duracion",
        log_user: "Usuario",
        log_transcript: "Transcripcion",
        log_unavailable: "No disponible",
        result_closing_title: "Cerrando ticket",
        result_closed_title: "Ticket cerrado",
        result_closing_description:
          "Este ticket se eliminara en **{{seconds}} segundos**.\n\n{{dmStatus}}",
        result_closed_description:
          "El ticket ya fue cerrado, pero el canal permanecera disponible hasta que la transcripcion pueda archivarse de forma segura.",
        result_dm_sent: "Se envio un resumen al usuario por mensaje directo.",
        result_dm_failed: "No se pudo notificar al usuario por DM.",
        delete_reason: "Ticket cerrado",
        transcript_embed_title: "Transcripcion de ticket",
        transcript_field_user: "Usuario",
        transcript_field_duration: "Duracion",
        transcript_field_staff: "Staff",
        transcript_field_closed: "Cerrado",
        transcript_field_messages: "Mensajes",
        transcript_field_rating: "Calificacion",
        transcript_rating_none: "Sin calificar",
        transcript_closed_unknown: "Desconocido",
        transcript_closed_unavailable: "No disponible",
      },
      reopen: {
        already_open: "Este ticket ya esta abierto.",
        verify_permissions: "No pude verificar mis permisos en este servidor.",
        manage_channels_required:
          "Necesito el permiso `Manage Channels` para reabrir este ticket.",
        user_missing: "No pude encontrar al usuario que creo este ticket.",
        reopened_during_request:
          "Este ticket ya fue reabierto mientras se procesaba tu solicitud.",
        database_error:
          "Hubo un error al reabrir el ticket en la base de datos.",
        dm_title: "Ticket reabierto",
        dm_description:
          "Tu ticket **#{{ticketId}}** en **{{guild}}** fue reabierto por {{staff}}.\n\n**Canal:** [Ir al ticket]({{channelLink}})\n\nYa puedes volver al canal y continuar la conversacion.",
        result_title: "Ticket reabierto",
        result_description:
          "El ticket **#{{ticketId}}** fue reabierto correctamente.\n\n**Total de reaperturas:** {{count}}{{dmLine}}{{warningLine}}",
        dm_line: "\nSe notifico al usuario por DM.",
        warning_line: "\n\nAviso: {{warning}}",
        dm_warning:
          "No se pudo notificar al usuario por DM (puede tener los DMs desactivados).",
      },
      claim: {
        closed_ticket: "No puedes reclamar un ticket cerrado.",
        staff_only: "Solo el staff puede reclamar tickets.",
        verify_permissions: "No pude verificar mis permisos en este servidor.",
        manage_channels_required:
          "Necesito el permiso `Manage Channels` para reclamar este ticket.",
        already_claimed_self: "Ya reclamaste este ticket.",
        already_claimed_other:
          "Ya fue reclamado por <@{{userId}}>. Usa `/ticket unclaim` primero.",
        claimed_during_request:
          "Este ticket fue reclamado por <@{{userId}}> mientras se procesaba tu solicitud.",
        database_error:
          "Hubo un error al actualizar el ticket en la base de datos. Intenta de nuevo.",
        dm_title: "Tu ticket ya esta siendo atendido",
        dm_description:
          "Tu ticket **#{{ticketId}}** en **{{guild}}** ya tiene un miembro del staff asignado.\n\n**Staff asignado:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Canal:** [Ir al ticket]({{channelLink}})\n\nUsa el enlace de arriba para entrar directamente al ticket y continuar la conversacion.",
        event_description:
          "{{userTag}} reclamo el ticket #{{ticketId}}.",
        result_title: "Ticket reclamado",
        result_description:
          "Reclamaste el ticket **#{{ticketId}}** correctamente.{{dmLine}}{{warningBlock}}",
        dm_line: "\n\nSe notifico al usuario por DM.",
        warning_permissions:
          "Tus permisos no pudieron actualizarse completamente.",
        warning_dm:
          "No se pudo notificar al usuario por DM (DMs desactivados).",
        log_claimed_by: "Reclamado por",
      },
      unclaim: {
        closed_ticket: "No puedes liberar un ticket cerrado.",
        not_claimed: "Este ticket no esta reclamado.",
        denied:
          "Solo quien reclamo el ticket o un administrador puede liberarlo.",
        database_error:
          "Hubo un error al actualizar el ticket en la base de datos.",
        result_title: "Ticket liberado",
        event_description:
          "{{userTag}} libero el ticket #{{ticketId}}.",
        result_description:
          "El ticket fue liberado. Cualquier miembro del staff puede reclamarlo ahora.{{warningLine}}",
        warning_permissions:
          "Algunos permisos no pudieron restaurarse completamente.",
        log_released_by: "Liberado por",
        log_previous_claimer: "Anteriormente reclamado por",
      },
      assign: {
        closed_ticket: "No puedes asignar un ticket cerrado.",
        staff_only: "Solo el staff puede asignar tickets.",
        bot_denied: "No puedes asignar el ticket a un bot.",
        creator_denied:
          "No puedes asignar el ticket al usuario que lo creo.",
        staff_member_missing:
          "No pude encontrar a ese miembro del staff en este servidor.",
        invalid_assignee:
          "Solo puedes asignar el ticket a miembros del staff (rol de soporte o administrador).",
        verify_permissions: "No pude verificar mis permisos en este servidor.",
        manage_channels_required:
          "Necesito el permiso `Manage Channels` para asignar tickets.",
        assign_permissions_error:
          "Hubo un error al dar permisos al miembro del staff asignado: {{error}}",
        database_error:
          "Hubo un error al actualizar el ticket en la base de datos.",
        dm_title: "Ticket asignado",
        dm_description:
          "Se te asigno el ticket **#{{ticketId}}** en **{{guild}}**.\n\n**{{categoryLabel}}:** {{category}}\n**Usuario:** <@{{userId}}>\n**Canal:** [Ir al ticket]({{channelLink}})\n\nPor favor revisalo lo antes posible.",
        event_description:
          "{{userTag}} asigno el ticket #{{ticketId}} a {{staffTag}}.",
        result_title: "Ticket asignado",
        result_description:
          "El ticket **#{{ticketId}}** fue asignado a <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        dm_line: "\n\nSe notifico al miembro del staff por DM.",
        dm_warning:
          "No se pudo notificar al miembro del staff por DM (DMs desactivados).",
        log_assigned_to: "Asignado a",
        log_assigned_by: "Asignado por",
      },
      members: {
        add: {
          closed_ticket: "No puedes agregar usuarios a un ticket cerrado.",
          bot_denied: "No puedes agregar bots al ticket.",
          creator_denied: "Ese usuario ya es el creador del ticket.",
          verify_permissions: "No pude verificar mis permisos en este servidor.",
          manage_channels_required:
            "Necesito el permiso `Manage Channels` para agregar usuarios.",
          permissions_error:
            "Hubo un error al dar permisos al usuario: {{error}}",
          event_title: "Usuario agregado",
          event_description:
            "{{userTag}} agrego a {{targetTag}} al ticket #{{ticketId}}.",
          result_title: "Usuario agregado",
          result_description:
            "<@{{userId}}> fue agregado al ticket y ahora puede ver el canal.",
        },
        remove: {
          closed_ticket: "No puedes quitar usuarios de un ticket cerrado.",
          creator_denied: "No puedes quitar al creador del ticket.",
          bot_denied: "No puedes quitar al bot del ticket.",
          support_role_denied: "No puedes quitar el rol de soporte del ticket.",
          admin_role_denied: "No puedes quitar el rol de administrador del ticket.",
          verify_permissions: "No pude verificar mis permisos en este servidor.",
          manage_channels_required:
            "Necesito el permiso `Manage Channels` para quitar usuarios.",
          permissions_error:
            "Hubo un error al quitar permisos al usuario: {{error}}",
          event_title: "Usuario quitado",
          event_description:
            "{{userTag}} quito a {{targetTag}} del ticket #{{ticketId}}.",
          result_title: "Usuario quitado",
          result_description:
            "<@{{userId}}> fue quitado del ticket y ya no puede verlo.",
        },
        move: {
          closed_ticket: "No puedes mover un ticket cerrado.",
          category_not_found: "Categoria no encontrada.",
          already_in_category: "El ticket ya esta en esta categoria.",
          verify_permissions: "No pude verificar mis permisos en este servidor.",
          manage_channels_required:
            "Necesito el permiso `Manage Channels` para mover tickets.",
          database_error:
            "Hubo un error al actualizar la categoria del ticket en la base de datos.",
          event_title: "Categoria actualizada",
          event_description:
            "{{userTag}} movio el ticket #{{ticketId}} de {{from}} a {{to}}.",
          log_previous: "Anterior",
          log_new: "Nueva",
          log_priority: "Prioridad actualizada",
          result_title: "Categoria cambiada",
          result_description:
            "Ticket movido de **{{from}}** -> **{{to}}**\n\n**Nueva prioridad:** {{priority}}",
        },
      },
    },
  },
  ping: {
    description: "Ver latencia y estadísticas del bot",
    title: "PONG!",
    field: {
      latency: "Latencia del bot",
      uptime: "Tiempo activo",
      guilds: "Servidores",
      users: "Usuarios",
      channels: "Canales",
    },
  },
  errors: {
    language_permission:
      "Solo un administrador del servidor puede elegir el idioma de esta guild.",
    language_save_failed:
      "No pude guardar el idioma del servidor. TON618 mantendrá inglés hasta que la configuración se complete correctamente.",
    invalid_language_selection:
      "Esta selección de idioma ya no es válida. Usa `/setup language` para configurarlo manualmente.",
  },
};
