const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveRequiredAccess,
  checkAccess,
} = require("../src/utils/accessControl");

function memberWithPerms({ admin = false, roles = [] } = {}) {
  return {
    permissions: {
      has: () => admin,
    },
    roles: {
      cache: {
        has: (id) => roles.includes(id),
      },
    },
  };
}

function makeInteraction({ userId = "u1", member, guildId = "g1" } = {}) {
  return {
    user: { id: userId },
    client: { application: { owner: { id: "owner-1" } } },
    guild: guildId ? { id: guildId } : null,
    member: member || null,
  };
}

test("resolveRequiredAccess infiere por scope y respeta override", () => {
  assert.equal(resolveRequiredAccess({ meta: { scope: "admin" } }), "admin");
  assert.equal(resolveRequiredAccess({ meta: { scope: "staff" } }), "staff");
  assert.equal(resolveRequiredAccess({ meta: { scope: "developer" } }), "owner");
  assert.equal(resolveRequiredAccess({ meta: { scope: "public" } }), "public");
  assert.equal(resolveRequiredAccess({ access: "owner", meta: { scope: "public" } }), "owner");
});

test("setup/verify requieren admin y ticket requiere staff por scope", () => {
  const setup = require("../src/commands/admin/config/setup");
  const verify = require("../src/commands/admin/config/verify");
  const ticket = require("../src/commands/staff/tickets/ticket");

  assert.equal(resolveRequiredAccess({ ...setup, meta: { scope: "admin" } }), "admin");
  assert.equal(resolveRequiredAccess({ ...verify, meta: { scope: "admin" } }), "admin");
  assert.equal(resolveRequiredAccess({ ...ticket, meta: { scope: "staff" } }), "staff");
});

test("checkAccess permite public y owner", async () => {
  const interaction = makeInteraction({ userId: "owner-1", member: memberWithPerms() });
  const publicAccess = await checkAccess(interaction, "public");
  const ownerAccess = await checkAccess(interaction, "owner");
  assert.equal(publicAccess.allowed, true);
  assert.equal(ownerAccess.allowed, true);
});

test("checkAccess admin: permite admin nativo sin tocar DB", async () => {
  const interaction = makeInteraction({
    userId: "u2",
    member: memberWithPerms({ admin: true }),
  });
  const result = await checkAccess(interaction, "admin");
  assert.equal(result.allowed, true);
});

test("checkAccess admin: permite por admin_role y deniega sin permisos", async () => {
  const allowed = await checkAccess(
    makeInteraction({
      userId: "u3",
      member: memberWithPerms({ admin: false, roles: ["role-admin"] }),
    }),
    "admin",
    { admin_role: "role-admin", support_role: "role-support" }
  );
  assert.equal(allowed.allowed, true);

  const denied = await checkAccess(
    makeInteraction({
      userId: "u4",
      member: memberWithPerms({ admin: false, roles: [] }),
    }),
    "admin",
    { admin_role: "role-admin", support_role: "role-support" }
  );
  assert.equal(denied.allowed, false);
  assert.equal(denied.reason, "admin_required");
});

test("checkAccess staff: permite support_role y deniega sin permisos", async () => {
  const allowed = await checkAccess(
    makeInteraction({
      userId: "u5",
      member: memberWithPerms({ admin: false, roles: ["role-support"] }),
    }),
    "staff",
    { admin_role: "role-admin", support_role: "role-support" }
  );
  assert.equal(allowed.allowed, true);

  const denied = await checkAccess(
    makeInteraction({
      userId: "u6",
      member: memberWithPerms({ admin: false, roles: [] }),
    }),
    "staff",
    { admin_role: "role-admin", support_role: "role-support" }
  );
  assert.equal(denied.allowed, false);
  assert.equal(denied.reason, "staff_required");
});
