const test = require("node:test");
const assert = require("node:assert/strict");

const { pickRoundRobin, selectAutoAssignee } = require("../src/domain/tickets/autoAssign");

function makeMember(id, status = "online", isBot = false) {
  return {
    id,
    user: { bot: isBot },
    presence: { status },
  };
}

test("pickRoundRobin selecciona el siguiente segun ultimo asignado", () => {
  const members = [makeMember("3"), makeMember("1"), makeMember("2")];
  const selected = pickRoundRobin(members, "2");
  assert.equal(selected.id, "3");
});

test("selectAutoAssignee respeta ausentes y requiere online", () => {
  const members = [
    makeMember("a", "offline"),
    makeMember("b", "online"),
    makeMember("c", "online"),
  ];
  const selected = selectAutoAssignee({
    members,
    awayIds: new Set(["b"]),
    lastAssignedId: null,
    requireOnline: true,
    respectAway: true,
  });
  assert.equal(selected.id, "c");
});

test("selectAutoAssignee hace fallback si no hay online", () => {
  const members = [makeMember("x", "offline"), makeMember("y", "offline")];
  const selected = selectAutoAssignee({
    members,
    awayIds: new Set(),
    requireOnline: true,
    respectAway: false,
  });
  assert.equal(selected.id, "x");
});
