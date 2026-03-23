const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isCategoryBlockedByIncident,
  resolveIncidentMessage,
} = require("../src/domain/tickets/incidentMode");

test("modo incidente global bloquea cualquier categoria", () => {
  const s = {
    incident_mode_enabled: true,
    incident_paused_categories: [],
  };
  assert.equal(isCategoryBlockedByIncident(s, "support"), true);
  assert.equal(isCategoryBlockedByIncident(s, "billing"), true);
});

test("modo incidente por categorias bloquea solo categorias configuradas", () => {
  const s = {
    incident_mode_enabled: true,
    incident_paused_categories: ["support", "bug"],
  };
  assert.equal(isCategoryBlockedByIncident(s, "support"), true);
  assert.equal(isCategoryBlockedByIncident(s, "billing"), false);
});

test("resolveIncidentMessage usa mensaje custom cuando existe", () => {
  assert.equal(
    resolveIncidentMessage({ incident_message: "Pausa temporal por mantenimiento." }),
    "Pausa temporal por mantenimiento."
  );
});
