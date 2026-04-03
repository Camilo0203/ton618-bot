const test = require("node:test");
const assert = require("node:assert/strict");
const { PermissionFlagsBits } = require("discord.js");

const {
  validateBotPermissions,
  validateOperation,
  validateTicketPermissions,
  validateChannelPermissions,
  buildPermissionErrorEmbed,
  getPermissionName,
  OPERATION_PERMISSIONS,
} = require("../src/utils/permissionValidator");

function createGuild(granted = []) {
  const grantedSet = new Set(granted);
  return {
    members: {
      me: { id: "bot-1" },
      fetchMe: async () => ({
        permissions: {
          has: (permission) => grantedSet.has(permission),
        },
      }),
    },
  };
}

test("permissionValidator valida permisos directos del bot", async () => {
  const guild = createGuild([
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ViewChannel,
  ]);

  const result = await validateBotPermissions(guild, [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ViewChannel,
  ]);

  assert.equal(result.hasPermissions, true);
  assert.deepEqual(result.missing, []);
});

test("permissionValidator detecta operaciones incompletas", async () => {
  const guild = createGuild([
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ViewChannel,
  ]);

  const result = await validateOperation(guild, "SEND_TICKET_MESSAGE");
  assert.equal(result.canProceed, false);
  assert.equal(result.missing.length > 0, true);
});

test("permissionValidator valida el flujo de tickets y canales", async () => {
  const guild = createGuild([
    ...OPERATION_PERMISSIONS.CREATE_TICKET_CHANNEL,
    ...OPERATION_PERMISSIONS.MANAGE_TICKET_PERMISSIONS,
    ...OPERATION_PERMISSIONS.SEND_TICKET_MESSAGE,
  ]);
  const channel = {
    guild: { members: { me: { id: "bot-1" } } },
    permissionsFor: () => ({
      has: () => true,
    }),
  };

  const ticketValidation = await validateTicketPermissions(guild, channel);
  const channelValidation = await validateChannelPermissions(channel, [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ]);

  assert.equal(ticketValidation.allPassed, true);
  assert.equal(channelValidation.canProceed, true);
});

test("permissionValidator construye embeds de error legibles", () => {
  const embed = buildPermissionErrorEmbed({
    operation: "create",
    missing: [PermissionFlagsBits.ManageChannels],
  }, "en");

  assert.equal(embed.data.title.includes("Permissions"), true);
  assert.equal(String(embed.data.description).includes(getPermissionName(PermissionFlagsBits.ManageChannels)), true);
});
