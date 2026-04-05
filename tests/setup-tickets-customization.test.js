const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const ticketsSetup = require("../src/commands/admin/config/setup/tickets");

const originalSettingsUpdate = db.settings.update;
const originalSettingsGet = db.settings.get;

function createInteraction(optionMap = {}) {
  const calls = { reply: [] };
  return {
    options: {
      getInteger: (name) => (name in optionMap ? optionMap[name] : null),
      getBoolean: (name) => (name in optionMap ? optionMap[name] : null),
      getString: (name) => (name in optionMap ? optionMap[name] : null),
      getRole: () => null,
      getChannel: () => null,
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.settings.update = async () => true;
  db.settings.get = async () => ({
    ticket_panel_title: null,
    ticket_panel_description: null,
    ticket_panel_footer: null,
    ticket_panel_color: null,
    ticket_welcome_message: null,
    ticket_control_panel_title: null,
    ticket_control_panel_description: null,
    ticket_control_panel_footer: null,
    ticket_control_panel_color: null,
  });
});

test.after(() => {
  db.settings.update = originalSettingsUpdate;
  db.settings.get = originalSettingsGet;
});

test("setup/tickets panel-style works on free plan since it is not pro-gated", async () => {
  const interaction = createInteraction({ title: "VIP Support Center" });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "panel-style",
    gid: "g1",
    s: {
      dashboard_general_settings: { opsPlan: "free" },
      commercial_settings: { plan: "free" },
    },
  });

  assert.equal(handled, true);
  assert.equal(interaction.__calls.reply.length, 1);
  // Should succeed, not show "Pro required"
  assert.notEqual(interaction.__calls.reply[0].embeds[0].data.title, "Pro required");
});

test("setup/tickets welcome-message stores a custom Pro message", async () => {
  let updated = null;
  db.settings.update = async (_gid, payload) => {
    updated = payload;
    return true;
  };

  const interaction = createInteraction({
    message: "Hi {user}, ticket {ticket} is now open.",
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "welcome-message",
    gid: "g1",
    s: {
      dashboard_general_settings: { opsPlan: "pro" },
      commercial_settings: { plan: "pro" },
    },
  });

  assert.equal(handled, true);
  assert.deepEqual(updated, {
    ticket_welcome_message: "Hi {user}, ticket {ticket} is now open.",
  });
  assert.equal(interaction.__calls.reply.length, 1);
});

test("setup/tickets control-embed stores custom Pro embed fields", async () => {
  let updated = null;
  db.settings.update = async (_gid, payload) => {
    updated = payload;
    return true;
  };

  const interaction = createInteraction({
    title: "Ops Console",
    description: "Track {ticket} and {category}.",
    footer: "{guild} • Premium",
    color: "#123ABC",
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "control-embed",
    gid: "g1",
    s: {
      dashboard_general_settings: { opsPlan: "pro" },
      commercial_settings: { plan: "pro" },
    },
  });

  assert.equal(handled, true);
  assert.deepEqual(updated, {
    ticket_control_panel_title: "Ops Console",
    ticket_control_panel_description: "Track {ticket} and {category}.",
    ticket_control_panel_footer: "{guild} • Premium",
    ticket_control_panel_color: "#123ABC",
  });
  assert.equal(interaction.__calls.reply.length, 1);
});
