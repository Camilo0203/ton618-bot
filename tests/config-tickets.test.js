const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const configCommand = require("../src/commands/admin/config/config");

const originalSettingsGet = db.settings.get;
const originalTicketCategoriesGetByGuild = db.ticketCategories.getByGuild;

function createInteraction() {
  const calls = { reply: [] };
  return {
    guild: { id: "g1", name: "Guild QA" },
    user: { id: "u1" },
    options: {
      getSubcommand: () => "tickets",
      getSubcommandGroup: () => null,
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.settings.get = async () => ({
    panel_channel_id: "111",
    panel_message_id: "112",
    log_channel: "113",
    transcript_channel: "114",
    support_role: "115",
    admin_role: "116",
    max_tickets: 4,
    global_ticket_limit: 15,
    cooldown_minutes: 10,
    min_days: 7,
    simple_help_mode: true,
    auto_close_minutes: 180,
    sla_minutes: 45,
    smart_ping_minutes: 15,
    auto_assign_enabled: true,
    auto_assign_require_online: true,
    auto_assign_respect_away: false,
    sla_escalation_enabled: true,
    sla_escalation_minutes: 90,
    sla_escalation_channel: "117",
    sla_escalation_role: "118",
    sla_overrides_priority: { urgent: 20 },
    sla_overrides_category: { billing: 30 },
    sla_escalation_overrides_priority: { urgent: 45 },
    sla_escalation_overrides_category: { vip: 60 },
    daily_sla_report_enabled: true,
    daily_sla_report_channel: "119",
    weekly_report_channel: "120",
    incident_mode_enabled: true,
    incident_paused_categories: ["billing", "vip"],
    incident_message: "Estamos atendiendo un incidente operativo. Las categorias sensibles quedaran pausadas temporalmente.",
  });

  db.ticketCategories.getByGuild = async () => ([
    {
      category_id: "billing",
      label: "Billing",
      emoji: ":moneybag:",
      priority: "high",
      enabled: true,
      discord_category_id: "221",
      ping_roles: ["r1", "r2"],
    },
    {
      category_id: "vip",
      label: "VIP",
      emoji: ":crown:",
      priority: "urgent",
      enabled: false,
      discord_category_id: null,
      ping_roles: [],
    },
  ]);
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.ticketCategories.getByGuild = originalTicketCategoriesGetByGuild;
});

test("config tickets responde con un embed de resumen operativo", async () => {
  const interaction = createInteraction();

  await configCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);

  const payload = interaction.__calls.reply[0];
  assert.equal(payload.flags, 64);
  assert.equal(Array.isArray(payload.embeds), true);
  assert.equal(payload.embeds.length, 1);

  const embed = payload.embeds[0];
  const fields = Array.isArray(embed.data.fields) ? embed.data.fields : [];

  assert.equal(embed.data.title, "Tickets - Guild QA");
  assert.deepEqual(
    fields.map((field) => field.name),
    [
      "Canales y Roles",
      "Limites y Acceso",
      "SLA y Automatizacion",
      "Escalado y Reportes",
      "Modo Incidente",
      "Categorias Configuradas (2)",
    ]
  );

  const incidentField = fields.find((field) => field.name === "Modo Incidente");
  const categoriesField = fields.find((field) => field.name === "Categorias Configuradas (2)");

  assert.equal(categoriesField.value.includes("Billing"), true);
  assert.equal(categoriesField.value.includes("VIP"), true);
  assert.equal(incidentField.value.includes("Billing"), true);
  assert.equal(incidentField.value.includes("VIP"), true);
});
