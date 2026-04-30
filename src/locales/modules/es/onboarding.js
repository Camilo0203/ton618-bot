module.exports = {
  onboarding: {
    body: "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    buttons: {
      documentation: "Documentación",
      support_server: "Servidor de Soporte"
    },
    confirm_description: "TON618 ahora operará en **{{label}}** dentro de este servidor.",
    confirm_title: "Idioma del servidor actualizado",
    delivery_failed: "TON618 se ha unido al servidor, pero no he podido entregar el selector de idioma ni en un canal público ni por mensaje directo.",
    description: "Elige el idioma principal para este servidor / Please choose the primary language for this server.",
    dm_fallback_intro: "No he podido publicar el mensaje de bienvenida en un canal con permisos de escritura, por lo que te lo envío por aquí.",
    dm_fallback_subject: "Configuración de idioma de TON618",
    embed: {
      description: "Gracias por agregar **{{brand}}** a tu servidor.\n\nSoy tu solución todo-en-uno de gestión Discord, diseñado para ayudarte con:\n\n{{ticketIcon}} **Tickets de Soporte** — Sistema de tickets optimizado con seguimiento SLA\n{{moderationIcon}} **Moderación** — AutoMod, gestión de casos y advertencias\n{{giveawayIcon}} **Sorteos** — Gestión justa y transparente de sorteos\n{{statsIcon}} **Analíticas** — Estadísticas e insights del servidor\n{{settingsIcon}} **Configuración** — Configuración fácil con comandos /setup\n\n**Inicio Rápido:** Usa `/quickstart` para ver tu progreso de configuración\n**Configuración Completa:** Usa `/setup wizard` para configuración de tickets\n\n**Primero, por favor selecciona tu idioma preferido:**",
      features: {
        analytics: "Analíticas",
        analytics_description: "Estadísticas e insights del servidor",
        configuration: "Configuración",
        configuration_description: "Configuración fácil con comandos /setup",
        giveaways: "Sorteos",
        giveaways_description: "Gestión justa y transparente de sorteos",
        moderation: "Moderación",
        moderation_description: "AutoMod, gestión de casos y advertencias",
        quick_start: "Inicio Rápido",
        quickstart_command: "Usa `/quickstart` para ver tu progreso de configuración",
        setup_wizard_command: "Usa `/setup wizard` para configuración de tickets",
        support_tickets: "Tickets de Soporte",
        tickets_description: "Sistema de tickets optimizado con seguimiento SLA"
      },
      full_setup: "Configuración Completa",
      quick_start: "Inicio Rápido",
      select_language: "**Primero, por favor selecciona tu idioma preferido:**",
      subtitle: "Soy tu solución todo-en-uno de gestión Discord",
      thanks: "Gracias por agregar {{brand}} a tu servidor",
      title: "Bienvenido a {{brand}}"
    },
    footer: "Si no se selecciona un idioma, TON618 usará español por defecto.",
    posted_description: "Se ha enviado el selector de idioma para este servidor. TON618 utilizará el español hasta que un administrador elija un idioma.",
    posted_title: "Onboarding de idioma enviado",
    title: "Bienvenido a TON618 / Welcome to TON618"
  }
};
