const test = require("node:test");
const assert = require("node:assert/strict");
const { PermissionFlagsBits } = require("discord.js");

const {
  inspectVerificationConfiguration,
} = require("../src/utils/verificationService");

function createRole(id, position, options = {}) {
  return {
    id,
    position,
    managed: options.managed === true,
    editable: options.editable !== false,
    toString() {
      return `<@&${id}>`;
    },
  };
}

function createGuild({
  roles = [],
  channels = [],
  botHighestRolePosition = 50,
  botCanManageRoles = true,
} = {}) {
  const me = {
    permissions: {
      has(permission) {
        if (permission === PermissionFlagsBits.ManageRoles) {
          return botCanManageRoles;
        }
        return true;
      },
    },
    roles: {
      highest: { position: botHighestRolePosition },
    },
  };

  return {
    members: { me },
    roles: { cache: new Map(roles.map((role) => [role.id, role])) },
    channels: { cache: new Map(channels.map((channel) => [channel.id, channel])) },
  };
}

function createChannel(id, guild, options = {}) {
  const denied = new Set(options.deniedPermissions || []);
  return {
    id,
    guild,
    permissionsFor() {
      return {
        has(permission) {
          return !denied.has(permission);
        },
      };
    },
    toString() {
      return `<#${id}>`;
    },
  };
}

test("inspectVerificationConfiguration detects invalid question mode and duplicate roles", () => {
  const guild = createGuild({
    roles: [createRole("role-verified", 10)],
  });
  const channel = createChannel("channel-1", guild);
  guild.channels.cache.set(channel.id, channel);

  const result = inspectVerificationConfiguration(
    guild,
    {
      channel: channel.id,
      verified_role: "role-verified",
      unverified_role: "role-verified",
      mode: "question",
      question: "",
      question_answer: "",
      log_channel: null,
    },
    {}
  );

  assert.equal(result.errors.some((error) => error.includes("cannot be the same role")), true);
  assert.equal(result.errors.some((error) => error.includes("question is empty")), true);
  assert.equal(result.errors.some((error) => error.includes("expected answer is empty")), true);
});

test("inspectVerificationConfiguration reports missing panel permissions", () => {
  const guild = createGuild({
    roles: [createRole("role-verified", 10)],
  });
  const channel = createChannel("channel-1", guild, {
    deniedPermissions: [PermissionFlagsBits.EmbedLinks],
  });
  guild.channels.cache.set(channel.id, channel);

  const result = inspectVerificationConfiguration(
    guild,
    {
      channel: channel.id,
      verified_role: "role-verified",
      unverified_role: null,
      mode: "button",
      question: "ok",
      question_answer: "ok",
      log_channel: null,
    },
    {}
  );

  assert.equal(result.errors.some((error) => error.includes("Missing permissions")), true);
});
