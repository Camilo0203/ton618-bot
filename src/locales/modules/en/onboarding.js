module.exports = {
  onboarding: {
    body: "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    buttons: {
      documentation: "Documentation",
      support_server: "Support Server"
    },
    confirm_description: "TON618 will now operate in **{{label}}** for this server.",
    confirm_title: "Server language updated",
    delivery_failed: "TON618 joined the server, but I could not deliver the language onboarding prompt in a writable channel or DM.",
    description: "Please choose the primary language for this server / Por favor elige el idioma principal de este servidor.",
    dm_fallback_intro: "I could not post the onboarding prompt in a writable server channel, so I am sending it here.",
    dm_fallback_subject: "TON618 language setup",
    embed: {
      description: "Thank you for adding **{{brand}}** to your server!\n\nI'm your all-in-one Discord management solution, designed to help you with:\n\n{{ticketIcon}} **Support Tickets** — Streamlined ticket system with SLA tracking\n{{moderationIcon}} **Moderation** — AutoMod, case management, and warnings\n{{giveawayIcon}} **Giveaways** — Fair and transparent giveaway management\n{{statsIcon}} **Analytics** — Server statistics and insights\n{{settingsIcon}} **Configuration** — Easy setup with /setup commands\n\n**Quick Start:** Use `/quickstart` to see your setup progress\n**Full Setup:** Use `/setup wizard` for ticket configuration\n\n**First, please select your preferred language:**",
      features: {
        analytics: "Analytics",
        analytics_description: "Server statistics and insights",
        configuration: "Configuration",
        configuration_description: "Easy setup with /setup commands",
        giveaways: "Giveaways",
        giveaways_description: "Fair and transparent giveaway management",
        moderation: "Moderation",
        moderation_description: "AutoMod, case management, and warnings",
        quick_start: "Quick Start",
        quickstart_command: "Use `/quickstart` to see your setup progress",
        setup_wizard_command: "Use `/setup wizard` for ticket configuration",
        support_tickets: "Support Tickets",
        tickets_description: "Streamlined ticket system with SLA tracking"
      },
      full_setup: "Full Setup",
      quick_start: "Quick Start",
      select_language: "**First, please select your preferred language:**",
      subtitle: "Your all-in-one Discord management solution",
      thanks: "Thank you for adding {{brand}} to your server",
      title: "Welcome to {{brand}}"
    },
    footer: "If no language is selected, TON618 will default to English.",
    posted_description: "A language selection prompt was delivered for this server. TON618 will keep English until an administrator chooses a language.",
    posted_title: "Language onboarding sent",
    title: "Welcome to TON618 / Bienvenido a TON618"
  }
};
