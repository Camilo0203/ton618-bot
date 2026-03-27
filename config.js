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
        "What problem are you facing?",
        "When did it start happening?",
        "What have you tried so far?",
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
        "What is the billing issue?",
        "What is your transaction or invoice ID?",
        "Which payment method did you use?",
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
        "Who are you reporting?",
        "What happened?",
        "Do you have evidence to share?",
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
        "What is your server or project about?",
        "How large is your community?",
        "What kind of partnership are you proposing?",
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
        "What is your age and moderation/support experience?",
        "Why do you want to join the team?",
        "How many hours per week are you available?",
        "What is your timezone?",
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
        "What went wrong?",
        "How can we reproduce it?",
        "Which device, browser, or platform are you using?",
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
        "How can we help you today?",
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
