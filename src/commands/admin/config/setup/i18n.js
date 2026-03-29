"use strict";

const { normalizeLanguage } = require("../../../../utils/i18n");

const COPY = {
  en: {
    general: {
      common: {
        not_configured: "Not configured",
        enabled: "Enabled",
        disabled: "Disabled",
        unlimited: "Unlimited",
        no_reason: "no reason",
        yes: "Yes",
        no: "No",
        minutes: "{{value}} min",
      },
      permissions: {
        view_channel: "View Channel",
        send_messages: "Send Messages",
        embed_links: "Embed Links",
        read_history: "Read Message History",
        manage_channels: "Manage Channels",
        fallback: "Permission",
      },
      live_stats: {
        missing_permissions_title: "Missing permissions for live channel stats",
        missing_permissions_description: "I cannot rename {{channel}}.",
        missing_permission_label: "Missing permission",
        missing_permissions_footer: "Grant the permission and run the command again.",
      },
      dashboard: {
        missing_permissions_title: "Missing dashboard permissions",
        missing_permissions_description: "I cannot use {{channel}} as the dashboard channel.",
        required_permissions: "Required permissions",
        missing_permissions_footer:
          "Grant the missing permissions and run `/setup general dashboard` again.",
        author: "Dashboard Control | {{guild}}",
        configured_title: "Discord dashboard configured",
        configured_description:
          "The live dashboard is now configured in {{channel}}.\nSupport metrics will be published there and kept in sync automatically.",
        operational_summary: "Operational summary",
        operational_summary_value:
          "Channel: {{channel}}\nAuto refresh: every 30 seconds\nManual control: Refresh Panel button",
        checklist: "Checklist",
        checklist_value:
          "- Dashboard channel saved\n- Bot permissions verified\n- Dashboard message synchronized",
        next_steps: "Recommended next steps",
        next_steps_value:
          "- /setup general staff-role @role\n- /setup general logs #channel\n- /setup general transcripts #channel",
        open_button: "Open dashboard",
      },
      info: {
        author: "General Setup | {{guild}}",
        title: "System configuration status",
        description:
          "Consolidated view for support, automation, and operational controls.",
        channels: "Channels",
        roles: "Roles",
        ticket_policies: "Ticket policies",
        automation: "Automation",
        status: "Status",
        dashboard: "Dashboard",
        logs: "Logs",
        transcripts: "Transcripts",
        dashboard_channel: "Dashboard",
        weekly_report: "Weekly report",
        ticket_panel: "Ticket panel",
        live_members: "Live members",
        live_role: "Live role",
        support_role: "Support",
        admin_role: "Admin",
        verification_role: "Verification",
        live_role_target: "Live role target",
        max_per_user: "Max per user",
        global_limit: "Global limit",
        cooldown: "Cooldown",
        minimum_days: "Minimum days",
        auto_close: "Auto-close",
        sla_warning: "SLA warning",
        smart_ping: "Smart ping",
        sla_escalation: "SLA escalation",
        dm_open: "DM on open",
        dm_close: "DM on close",
        language: "Language",
        log_edits: "Log edits",
        log_deletes: "Log deletes",
        maintenance: "Maintenance",
        dashboard_link: "Open dashboard message",
        dashboard_missing: "No dashboard message has been published yet.",
        history_footer: "Historical tickets created: {{count}}",
        maintenance_enabled: "Enabled ({{reason}})",
      },
      success: {
        channel_updated: "{{label}} updated to {{target}}.",
        live_members_updated: "Live members channel updated to {{channel}}.",
        live_role_updated: "Live role channel updated to {{channel}}, tracking {{role}}.",
        support_role_updated: "Support role updated to {{role}}.",
        admin_role_updated: "Bot admin role updated to {{role}}.",
        verify_role_updated: "Minimum role required to open tickets: {{role}}",
        verify_role_disabled: "Minimum role requirement disabled.",
        max_tickets_updated: "Maximum open tickets per user: **{{count}}**.",
        global_limit_disabled: "Global ticket limit disabled.",
        global_limit_updated: "Global ticket limit: **{{count}}** open tickets.",
        cooldown_disabled: "Ticket cooldown disabled.",
        cooldown_updated: "Ticket cooldown set to **{{count}} minutes**.",
        min_days_disabled: "Minimum days requirement disabled.",
        min_days_updated: "Minimum days in server set to **{{count}}**.",
        auto_close_disabled: "Auto-close disabled.",
        auto_close_updated: "Auto-close set to **{{count}} minutes** of inactivity.",
        sla_disabled: "SLA warning disabled.",
        sla_updated: "SLA warning threshold set to **{{count}} minutes**.",
        smart_ping_disabled: "Smart ping disabled.",
        smart_ping_updated:
          "Smart ping threshold set to **{{count}} minutes** without response.",
        dm_open_updated: "Ticket open DM is now **{{state}}**.",
        dm_close_updated: "Ticket close DM is now **{{state}}**.",
        log_edits_updated: "Edited message logging is now **{{state}}**.",
        log_deletes_updated: "Deleted message logging is now **{{state}}**.",
      },
    },
    tickets: {
      common: {
        enabled: "Enabled",
        disabled: "Disabled",
        yes: "Yes",
        no: "No",
        not_configured: "Not configured",
        default: "Default",
        removed: "Removed",
        all_categories: "all",
        minutes: "{{value}} min",
      },
      errors: {
        escalation_minutes_required:
          "If escalation is enabled, `escalation-minutes` must be greater than 0.",
        escalation_channel_required:
          "Set `escalation-channel` or a logs channel before enabling escalation.",
        exact_target: "Choose exactly one target: `priority` or `category`.",
        category_not_configured: "Category `{{category}}` is not configured in this guild.",
        invalid_categories: "Invalid categories: `{{categories}}`",
        daily_report_channel_required:
          "Set a `channel`, logs channel, or weekly report channel before enabling this report.",
        update_or_reset:
          "Provide at least one field to update or use `reset:true`.",
        message_or_reset: "Provide `message` or use `reset:true`.",
        message_empty: "`message` cannot be empty.",
        invalid_color: "`color` must be a valid hex color like `#5865F2`.",
        publish_permissions:
          "I do not have the required permissions in {{channel}}.\n\nMake sure the bot has:\n- View Channel\n- Send Messages\n- Embed Links",
        no_categories:
          "No ticket categories are configured yet.\n\nCreate at least one enabled category before publishing the panel.",
        build_panel: "Error while building the ticket panel.\n\n{{error}}",
        publish_failed:
          "Could not send the ticket panel. Verify that the bot can send messages in this channel.",
      },
      sla: {
        title: "Ticket SLA updated",
        base: "Base SLA",
        escalation: "Escalation",
        threshold: "Escalation threshold",
        channel: "Escalation channel",
        role: "Escalation role",
      },
      override: {
        title: "SLA override updated",
        type: "Type",
        target: "Target",
        value: "Value",
        warning: "Warning",
        escalation: "Escalation",
        priority_target: "Priority {{target}}",
        category_target: "Category {{target}}",
      },
      auto_assignment: {
        title: "Auto-assignment updated",
        status: "Status",
        require_online: "Require online",
        respect_away: "Respect away",
      },
      incident: {
        enabled_title: "Incident mode enabled",
        disabled_title: "Incident mode disabled",
        paused_categories: "Paused categories: **{{categories}}**",
        resumed: "Ticket intake is back to normal.",
        user_message: "User-facing message",
      },
      daily_report: {
        title: "Daily report updated",
        status: "Status",
        channel: "Channel",
      },
      customization: {
        title_label: "Title",
        description_label: "Description",
        footer_label: "Footer",
        color_label: "Color",
        current_message_label: "Current message",
        placeholders_label: "Placeholders",
        panel_reset_title: "Ticket panel reset",
        panel_reset_description:
          "The public ticket panel was restored to the default copy and color.",
        panel_updated_title: "Ticket panel updated",
        panel_updated_description:
          "The public ticket panel now reflects your latest customization.",
        welcome_reset_title: "Ticket welcome message reset",
        welcome_reset_description:
          "New tickets will use the default welcome copy again.",
        welcome_updated_title: "Ticket welcome message updated",
        welcome_updated_description:
          "Every new ticket will use this welcome message.",
        control_reset_title: "Ticket control embed reset",
        control_reset_description:
          "New ticket channels will use the default control embed again.",
        control_updated_title: "Ticket control embed updated",
        control_updated_description:
          "New ticket channels will use the latest control embed copy.",
      },
      panel: {
        published_title: "Ticket panel published",
        published_description:
          "The ticket panel was sent to {{channel}}.\n\nUsers can now select a category and open a private ticket.\n\n{{staffNote}}",
        staff_role_active: "Active staff role: {{role}}",
        staff_role_missing:
          "Note: there is no staff role configured yet. Use `/setup general staff-role @role`.",
      },
    },
  },
  es: {
    general: {
      common: {
        not_configured: "No configurado",
        enabled: "Activado",
        disabled: "Desactivado",
        unlimited: "Sin límite",
        no_reason: "sin motivo",
        yes: "Sí",
        no: "No",
        minutes: "{{value}} min",
      },
      permissions: {
        view_channel: "Ver canal",
        send_messages: "Enviar mensajes",
        embed_links: "Insertar embeds",
        read_history: "Leer historial de mensajes",
        manage_channels: "Gestionar canales",
        fallback: "Permiso",
      },
      live_stats: {
        missing_permissions_title:
          "Faltan permisos para las estadísticas de canales de voz",
        missing_permissions_description: "No puedo renombrar {{channel}}.",
        missing_permission_label: "Permiso faltante",
        missing_permissions_footer:
          "Concede el permiso y vuelve a ejecutar el comando.",
      },
      dashboard: {
        missing_permissions_title: "Faltan permisos para el dashboard",
        missing_permissions_description:
          "No puedo usar {{channel}} como canal del dashboard.",
        required_permissions: "Permisos requeridos",
        missing_permissions_footer:
          "Concede los permisos faltantes y vuelve a ejecutar `/setup general dashboard`.",
        author: "Control del dashboard | {{guild}}",
        configured_title: "Dashboard de Discord configurado",
        configured_description:
          "El dashboard en vivo ahora está configurado en {{channel}}.\nLas métricas de soporte se publicarán allí y se mantendrán sincronizadas automáticamente.",
        operational_summary: "Resumen operativo",
        operational_summary_value:
          "Canal: {{channel}}\nAuto refresh: cada 30 segundos\nControl manual: botón Refresh Panel",
        checklist: "Checklist",
        checklist_value:
          "- Canal del dashboard guardado\n- Permisos del bot verificados\n- Mensaje del dashboard sincronizado",
        next_steps: "Siguientes pasos recomendados",
        next_steps_value:
          "- /setup general staff-role @role\n- /setup general logs #channel\n- /setup general transcripts #channel",
        open_button: "Abrir dashboard",
      },
      info: {
        author: "Setup general | {{guild}}",
        title: "Estado de configuración del sistema",
        description:
          "Vista consolidada para soporte, automatización y controles operativos.",
        channels: "Canales",
        roles: "Roles",
        ticket_policies: "Políticas de tickets",
        automation: "Automatización",
        status: "Estado",
        dashboard: "Dashboard",
        logs: "Logs",
        transcripts: "Transcripciones",
        dashboard_channel: "Dashboard",
        weekly_report: "Reporte semanal",
        ticket_panel: "Panel de tickets",
        live_members: "Miembros en vivo",
        live_role: "Rol en vivo",
        support_role: "Soporte",
        admin_role: "Admin",
        verification_role: "Verificación",
        live_role_target: "Rol objetivo",
        max_per_user: "Máximo por usuario",
        global_limit: "Límite global",
        cooldown: "Cooldown",
        minimum_days: "Días mínimos",
        auto_close: "Auto-cierre",
        sla_warning: "Aviso de SLA",
        smart_ping: "Smart ping",
        sla_escalation: "Escalado de SLA",
        dm_open: "DM al abrir",
        dm_close: "DM al cerrar",
        language: "Idioma",
        log_edits: "Registrar ediciones",
        log_deletes: "Registrar borrados",
        maintenance: "Mantenimiento",
        dashboard_link: "Abrir mensaje del dashboard",
        dashboard_missing: "Todavía no se ha publicado un mensaje del dashboard.",
        history_footer: "Tickets históricos creados: {{count}}",
        maintenance_enabled: "Activado ({{reason}})",
      },
      success: {
        channel_updated: "{{label}} actualizado a {{target}}.",
        live_members_updated:
          "El canal de miembros en vivo se actualizó a {{channel}}.",
        live_role_updated:
          "El canal de rol en vivo se actualizó a {{channel}}, siguiendo {{role}}.",
        support_role_updated: "El rol de soporte se actualizó a {{role}}.",
        admin_role_updated: "El rol de admin del bot se actualizó a {{role}}.",
        verify_role_updated:
          "Rol mínimo requerido para abrir tickets: {{role}}",
        verify_role_disabled:
          "El requisito de rol mínimo quedó desactivado.",
        max_tickets_updated:
          "Máximo de tickets abiertos por usuario: **{{count}}**.",
        global_limit_disabled: "El límite global de tickets quedó desactivado.",
        global_limit_updated:
          "Límite global de tickets: **{{count}}** tickets abiertos.",
        cooldown_disabled: "El cooldown de tickets quedó desactivado.",
        cooldown_updated:
          "El cooldown de tickets quedó en **{{count}} minutos**.",
        min_days_disabled:
          "El requisito de días mínimos quedó desactivado.",
        min_days_updated:
          "Los días mínimos en el servidor quedaron en **{{count}}**.",
        auto_close_disabled: "El auto-cierre quedó desactivado.",
        auto_close_updated:
          "El auto-cierre quedó en **{{count}} minutos** de inactividad.",
        sla_disabled: "El aviso de SLA quedó desactivado.",
        sla_updated:
          "El umbral del aviso de SLA quedó en **{{count}} minutos**.",
        smart_ping_disabled: "El smart ping quedó desactivado.",
        smart_ping_updated:
          "El umbral del smart ping quedó en **{{count}} minutos** sin respuesta.",
        dm_open_updated:
          "El DM al abrir tickets ahora está **{{state}}**.",
        dm_close_updated:
          "El DM al cerrar tickets ahora está **{{state}}**.",
        log_edits_updated:
          "El registro de mensajes editados ahora está **{{state}}**.",
        log_deletes_updated:
          "El registro de mensajes borrados ahora está **{{state}}**.",
      },
    },
    tickets: {
      common: {
        enabled: "Activado",
        disabled: "Desactivado",
        yes: "Sí",
        no: "No",
        not_configured: "No configurado",
        default: "Por defecto",
        removed: "Eliminado",
        all_categories: "todas",
        minutes: "{{value}} min",
      },
      errors: {
        escalation_minutes_required:
          "Si el escalado está activo, `escalation-minutes` debe ser mayor que 0.",
        escalation_channel_required:
          "Define `escalation-channel` o un canal de logs antes de activar el escalado.",
        exact_target:
          "Elige exactamente un objetivo: `priority` o `category`.",
        category_not_configured:
          "La categoría `{{category}}` no está configurada en esta guild.",
        invalid_categories: "Categorías inválidas: `{{categories}}`",
        daily_report_channel_required:
          "Define un `channel`, canal de logs o canal de reporte semanal antes de activar este reporte.",
        update_or_reset:
          "Envía al menos un campo para actualizar o usa `reset:true`.",
        message_or_reset: "Envía `message` o usa `reset:true`.",
        message_empty: "`message` no puede estar vacío.",
        invalid_color: "`color` debe ser un color hex válido como `#5865F2`.",
        publish_permissions:
          "No tengo los permisos requeridos en {{channel}}.\n\nAsegúrate de que el bot tenga:\n- View Channel\n- Send Messages\n- Embed Links",
        no_categories:
          "Todavía no hay categorías de tickets configuradas.\n\nCrea al menos una categoría activa antes de publicar el panel.",
        build_panel: "Error al construir el panel de tickets.\n\n{{error}}",
        publish_failed:
          "No pude enviar el panel de tickets. Verifica que el bot pueda enviar mensajes en este canal.",
      },
      sla: {
        title: "SLA de tickets actualizado",
        base: "SLA base",
        escalation: "Escalado",
        threshold: "Umbral de escalado",
        channel: "Canal de escalado",
        role: "Rol de escalado",
      },
      override: {
        title: "Regla de SLA actualizada",
        type: "Tipo",
        target: "Objetivo",
        value: "Valor",
        warning: "Aviso",
        escalation: "Escalado",
        priority_target: "Prioridad {{target}}",
        category_target: "Categoría {{target}}",
      },
      auto_assignment: {
        title: "Auto-asignación actualizada",
        status: "Estado",
        require_online: "Requerir online",
        respect_away: "Respetar ausentes",
      },
      incident: {
        enabled_title: "Modo incidente activado",
        disabled_title: "Modo incidente desactivado",
        paused_categories: "Categorías pausadas: **{{categories}}**",
        resumed: "La entrada de tickets volvió a la normalidad.",
        user_message: "Mensaje visible para usuarios",
      },
      daily_report: {
        title: "Reporte diario actualizado",
        status: "Estado",
        channel: "Canal",
      },
      customization: {
        title_label: "Título",
        description_label: "Descripción",
        footer_label: "Footer",
        color_label: "Color",
        current_message_label: "Mensaje actual",
        placeholders_label: "Placeholders",
        panel_reset_title: "Panel de tickets restaurado",
        panel_reset_description:
          "El panel público de tickets volvió al copy y color por defecto.",
        panel_updated_title: "Panel de tickets actualizado",
        panel_updated_description:
          "El panel público de tickets ahora refleja tu personalización más reciente.",
        welcome_reset_title: "Mensaje de bienvenida restaurado",
        welcome_reset_description:
          "Los nuevos tickets volverán a usar el copy de bienvenida por defecto.",
        welcome_updated_title: "Mensaje de bienvenida actualizado",
        welcome_updated_description:
          "Todos los tickets nuevos usarán este mensaje de bienvenida.",
        control_reset_title: "Embed de control restaurado",
        control_reset_description:
          "Los nuevos canales de ticket volverán a usar el embed de control por defecto.",
        control_updated_title: "Embed de control actualizado",
        control_updated_description:
          "Los nuevos canales de ticket usarán el copy más reciente del embed de control.",
      },
      panel: {
        published_title: "Panel de tickets publicado",
        published_description:
          "El panel de tickets se envió a {{channel}}.\n\nLos usuarios ya pueden elegir una categoría y abrir un ticket privado.\n\n{{staffNote}}",
        staff_role_active: "Rol de staff activo: {{role}}",
        staff_role_missing:
          "Aviso: todavía no hay un rol de staff configurado. Usa `/setup general staff-role @role`.",
      },
    },
  },
};

function getByPath(source, path) {
  return String(path)
    .split(".")
    .reduce((current, segment) => {
      if (current === undefined || current === null) return undefined;
      return current[segment];
    }, source);
}

function interpolate(template, vars = {}) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ""
  );
}

function setupT(language, key, vars = {}) {
  const lang = normalizeLanguage(language, "en");
  const template =
    getByPath(COPY[lang], key) ??
    getByPath(COPY.en, key) ??
    key;

  return interpolate(template, vars);
}

module.exports = {
  setupT,
};
