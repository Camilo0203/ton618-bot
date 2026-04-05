const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeCommercialPlan,
  resolveCommercialState,
  hasRequiredPlan,
  buildCommercialSettingsPatch,
} = require("../src/utils/commercial");

const NOW = new Date("2026-03-26T12:00:00.000Z");

test("normalizeCommercialPlan accepts enterprise as a valid plan key", () => {
  assert.equal(normalizeCommercialPlan("enterprise"), "enterprise");
  assert.equal(normalizeCommercialPlan("ENTERPRISE"), "enterprise");
});

test("resolveCommercialState falls back to free when Pro is expired", () => {
  const state = resolveCommercialState({
    commercial_settings: {
      plan: "pro",
      plan_started_at: "2026-03-01T00:00:00.000Z",
      plan_expires_at: "2026-03-20T00:00:00.000Z",
    },
  }, NOW);

  assert.equal(state.storedPlan, "pro");
  assert.equal(state.effectivePlan, "free");
  assert.equal(state.planExpired, true);
  assert.equal(hasRequiredPlan({ commercial_settings: state.commercialSettings }, "pro"), false);
});

test("resolveCommercialState keeps supporter recognition separate from premium access", () => {
  const state = resolveCommercialState({
    commercial_settings: {
      plan: "free",
      supporter_enabled: true,
      supporter_started_at: "2026-03-10T00:00:00.000Z",
      supporter_expires_at: "2026-03-30T00:00:00.000Z",
    },
  }, NOW);

  assert.equal(state.effectivePlan, "free");
  assert.equal(state.supporterActive, true);
  assert.equal(hasRequiredPlan({ commercial_settings: state.commercialSettings }, "pro"), false);
});

test("buildCommercialSettingsPatch syncs commercial_settings with dashboard compatibility fields", () => {
  const patch = buildCommercialSettingsPatch(
    {
      dashboard_general_settings: { opsPlan: "enterprise" },
      commercial_settings: { plan: "enterprise" },
    },
    {
      plan: "pro",
      plan_source: "owner_debug",
      plan_started_at: NOW,
      plan_expires_at: "2026-04-26T12:00:00.000Z",
    },
    { now: NOW },
  );

  assert.equal(patch.commercial_settings.plan, "pro");
  assert.equal(patch.commercial_settings.plan_source, "owner_debug");
  assert.equal(patch.dashboard_general_settings.opsPlan, "pro");
});
