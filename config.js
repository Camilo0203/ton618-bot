// ================================================
//        MAIN BOT CONFIGURATION
//     Adjust these defaults as needed
// ================================================

module.exports = {

  // ----------------------------------------------
  //   OWNER (OAuth / protected surfaces)
  // ----------------------------------------------
  ownerId: process.env.DISCORD_OWNER_ID || null,

  // ----------------------------------------------
  //   TICKET CATEGORIES
  // ----------------------------------------------
  categories: [
    {
      id: "support",
      label: "General Support",
      description: "Help with general issues",
      emoji: "🛠️",
      color: 0x5865F2,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 👋\n\n" +
        "Thanks for contacting **General Support**.\n" +
        "A team member will help you shortly.\n\n" +
        "> Please describe your issue with as much detail as possible.",
      questions: [
        "ticket.questions.support.0",
        "ticket.questions.support.1",
        "ticket.questions.support.2",
      ],
      priority: "normal",
    },
    {
      id: "billing",
      label: "Billing",
      description: "Payments, invoices, or refunds",
      emoji: "💳",
      color: 0x57F287,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 💳\n\n" +
        "You opened a **Billing** ticket.\n\n" +
        "> Never share full banking or card details.",
      questions: [
        "ticket.questions.billing.0",
        "ticket.questions.billing.1",
        "ticket.questions.billing.2",
      ],
      priority: "high",
    },
    {
      id: "report",
      label: "User Report",
      description: "Report inappropriate behavior",
      emoji: "🚨",
      color: 0xED4245,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 🚨\n\n" +
        "You opened a **User Report**.\n" +
        "The moderation team will review it as soon as possible.\n\n" +
        "> Please include any useful evidence such as screenshots or message links.",
      questions: [
        "ticket.questions.report.0",
        "ticket.questions.report.1",
        "ticket.questions.report.2",
      ],
      priority: "urgent",
    },
    {
      id: "partnership",
      label: "Partnerships",
      description: "Collaboration or partnership requests",
      emoji: "🤝",
      color: 0xFEE75C,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 🤝\n\n" +
        "You opened a **Partnerships** ticket.\n" +
        "Please share details about your server, brand, or project.",
      questions: [
        "ticket.questions.partnership.0",
        "ticket.questions.partnership.1",
        "ticket.questions.partnership.2",
      ],
      priority: "low",
    },
    {
      id: "staff",
      label: "Staff Application",
      description: "Apply to join the team",
      emoji: "⭐",
      color: 0xF1C40F,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! ⭐\n\n" +
        "You opened a **Staff Application**.\n" +
        "Please answer honestly and with enough detail for review.",
      questions: [
        "ticket.questions.staff.0",
        "ticket.questions.staff.1",
        "ticket.questions.staff.2",
        "ticket.questions.staff.3",
      ],
      priority: "normal",
    },
    {
      id: "bug",
      label: "Bug Report",
      description: "Report a bug or broken flow",
      emoji: "🐛",
      color: 0xE67E22,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 🐛\n\n" +
        "You opened a **Bug Report**.\n" +
        "Please describe the issue clearly so we can reproduce it.",
      questions: [
        "ticket.questions.bug.0",
        "ticket.questions.bug.1",
        "ticket.questions.bug.2",
      ],
      priority: "high",
    },
    {
      id: "other",
      label: "Other",
      description: "Anything else",
      emoji: "📩",
      color: 0x95A5A6,
      categoryId: null,
      pingRoles: [],
      welcomeMessage:
        "Hi {user}! 📩\n\n" +
        "You opened a ticket.\n" +
        "The team will help you soon.",
      questions: [
        "ticket.questions.other.0",
      ],
      priority: "normal",
    },
  ],

  // ----------------------------------------------
  //   PRIORITIES
  // ----------------------------------------------
  priorities: {
    low:    { label: "🟢 Low",    color: 0x57F287 },
    normal: { label: "🔵 Normal", color: 0x5865F2 },
    high:   { label: "🟡 High",   color: 0xFEE75C },
    urgent: { label: "🔴 Urgent", color: 0xED4245 },
  },

  // ----------------------------------------------
  //   TICKET PANEL
  // ----------------------------------------------
  panel: {
    title: "🎫 Support Center",
    description:
      "Welcome to the ticket system.\n" +
      "Choose the category that best matches your request.\n\n" +
      "**📋 Before opening a ticket:**\n" +
      "▸ Read the server rules\n" +
      "▸ Check the FAQ or announcement channels\n" +
      "▸ Be specific and include useful details\n\n" +
      "**⏰ Expected response time:** usually under 24h",
    footer: "TON618 Tickets v3.0 • Built for fast support",
    color: 0x5865F2,
    image: process.env.TICKET_PANEL_IMAGE_URL || null,
  },

  // ----------------------------------------------
  //   RATINGS
  // ----------------------------------------------
  ratings: {
    enabled: true,
    dmRating: true,
  },

  // ----------------------------------------------
  //   MAINTENANCE MESSAGE
  // ----------------------------------------------
  maintenance: {
    defaultMessage: "The ticket system is currently under maintenance. Please try again later.",
  },
};
