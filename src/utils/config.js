"use strict";
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
            labelKey: "ticket.categories.support.label",
            descriptionKey: "ticket.categories.support.description",
            emoji: "🛠️",
            color: 0x5865F2,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.support.welcome",
            questions: [
                "ticket.questions.support.0",
                "ticket.questions.support.1",
                "ticket.questions.support.2",
            ],
            priority: "normal",
        },
        {
            id: "billing",
            labelKey: "ticket.categories.billing.label",
            descriptionKey: "ticket.categories.billing.description",
            emoji: "💳",
            color: 0x57F287,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.billing.welcome",
            questions: [
                "ticket.questions.billing.0",
                "ticket.questions.billing.1",
                "ticket.questions.billing.2",
            ],
            priority: "high",
        },
        {
            id: "report",
            labelKey: "ticket.categories.report.label",
            descriptionKey: "ticket.categories.report.description",
            emoji: "🚨",
            color: 0xED4245,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.report.welcome",
            questions: [
                "ticket.questions.report.0",
                "ticket.questions.report.1",
                "ticket.questions.report.2",
            ],
            priority: "urgent",
        },
        {
            id: "partnership",
            labelKey: "ticket.categories.partnership.label",
            descriptionKey: "ticket.categories.partnership.description",
            emoji: "🤝",
            color: 0xFEE75C,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.partnership.welcome",
            questions: [
                "ticket.questions.partnership.0",
                "ticket.questions.partnership.1",
                "ticket.questions.partnership.2",
            ],
            priority: "low",
        },
        {
            id: "staff",
            labelKey: "ticket.categories.staff.label",
            descriptionKey: "ticket.categories.staff.description",
            emoji: "⭐",
            color: 0xF1C40F,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.staff.welcome",
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
            labelKey: "ticket.categories.bug.label",
            descriptionKey: "ticket.categories.bug.description",
            emoji: "🐛",
            color: 0xE67E22,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.bug.welcome",
            questions: [
                "ticket.questions.bug.0",
                "ticket.questions.bug.1",
                "ticket.questions.bug.2",
            ],
            priority: "high",
        },
        {
            id: "other",
            labelKey: "ticket.categories.other.label",
            descriptionKey: "ticket.categories.other.description",
            emoji: "📩",
            color: 0x95A5A6,
            categoryId: null,
            pingRoles: [],
            welcomeMessageKey: "ticket.categories.other.welcome",
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
        low: { labelKey: "ticket.priorities.low", color: 0x57F287 },
        normal: { labelKey: "ticket.priorities.normal", color: 0x5865F2 },
        high: { labelKey: "ticket.priorities.high", color: 0xFEE75C },
        urgent: { labelKey: "ticket.priorities.urgent", color: 0xED4245 },
    },
    // ----------------------------------------------
    //   TICKET PANEL
    // ----------------------------------------------
    panel: {
        titleKey: "ticket.panel.title",
        descriptionKey: "ticket.panel.description",
        footerKey: "ticket.panel.footer",
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
        defaultMessageKey: "ticket.maintenance.default",
    },
};
