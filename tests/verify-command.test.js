const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const verificationService = require("../src/utils/verificationService");

const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;
const originalVerifSettingsGet = db.verifSettings.get;
const originalVerifSettingsUpdate = db.verifSettings.update;
const originalInspectVerificationConfiguration = verificationService.inspectVerificationConfiguration;
const originalSendVerificationPanel = verificationService.sendVerificationPanel;

let verifyCommand = null;
let currentSettings = null;
let currentVerifSettings = null;

function createRole(id) {
  return {
    id,
    toString() {
      return `<@&${id}>`;
    },
  };
}

function createChannel(id) {
  return {
    id,
    toString() {
      return `<#${id}>`;
    },
  };
}

function createInteraction() {
  const channel = createChannel("channel-verify");
  const verifiedRole = createRole("role-verified");
  const unverifiedRole = createRole("role-unverified");
  const calls = { reply: [] };

  return {
    guild: { id: "guild-1" },
    user: { id: "admin-1", tag: "Admin#0001" },
    options: {
      getSubcommand: () => "setup",
      getSubcommandGroup: () => null,
      getChannel: (name) => (name === "channel" ? channel : null),
      getRole: (name) => {
        if (name === "verified_role") return verifiedRole;
        if (name === "unverified_role") return unverifiedRole;
        return null;
      },
      getString: (name) => (name === "mode" ? "button" : null),
      getBoolean: () => null,
      getInteger: () => null,
      getUser: () => null,
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  delete require.cache[require.resolve("../src/commands/admin/config/verify")];

  currentSettings = { verify_role: null };
  currentVerifSettings = {
    enabled: false,
    channel: null,
    verified_role: null,
    unverified_role: null,
    mode: "button",
    panel_message_id: null,
  };

  verificationService.inspectVerificationConfiguration = () => ({
    errors: [],
    warnings: [],
  });
  verificationService.sendVerificationPanel = async () => ({
    ok: true,
    refreshed: false,
    warnings: [],
  });

  db.settings.get = async () => ({ ...currentSettings });
  db.settings.update = async (_guildId, patch) => {
    currentSettings = { ...currentSettings, ...patch };
    return { ...currentSettings };
  };
  db.verifSettings.get = async () => ({ ...currentVerifSettings });
  db.verifSettings.update = async (_guildId, patch) => {
    currentVerifSettings = { ...currentVerifSettings, ...patch };
    return { ...currentVerifSettings };
  };

  verifyCommand = require("../src/commands/admin/config/verify");
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.settings.update = originalSettingsUpdate;
  db.verifSettings.get = originalVerifSettingsGet;
  db.verifSettings.update = originalVerifSettingsUpdate;
  verificationService.inspectVerificationConfiguration = originalInspectVerificationConfiguration;
  verificationService.sendVerificationPanel = originalSendVerificationPanel;
});

test("/verify setup aligns settings.verify_role when it was missing", async () => {
  const interaction = createInteraction();

  await verifyCommand.execute(interaction);

  assert.equal(currentSettings.verify_role, "role-verified");
  assert.equal(currentVerifSettings.enabled, true);
  assert.equal(currentVerifSettings.channel, "channel-verify");
  assert.equal(interaction.__calls.reply.length, 1);
  assert.equal(interaction.__calls.reply[0].embeds[0].data.title, "Verification Ready");
});
