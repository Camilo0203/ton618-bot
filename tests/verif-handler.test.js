const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const { handleVerif } = require("../src/handlers/verifHandler");

const originalSettingsGet = db.settings.get;
const originalVerifSettingsGet = db.verifSettings.get;
const originalVerifCodesVerify = db.verifCodes.verify;
const originalVerifLogsAdd = db.verifLogs.add;
const originalVerifMemberStatesGet = db.verifMemberStates.get;
const originalVerifMemberStatesMarkFailed = db.verifMemberStates.markFailed;

let markFailedCalls = [];

function createInteraction() {
  const calls = { reply: [] };
  return {
    customId: "verify_code_modal",
    guild: { id: "guild-1" },
    user: { id: "user-1" },
    fields: {
      getTextInputValue: () => "bad123",
    },
    replied: false,
    deferred: false,
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    followUp: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  markFailedCalls = [];
  db.settings.get = async () => ({ verify_role: null });
  db.verifSettings.get = async () => ({
    enabled: true,
    mode: "code",
    question_answer: "yes",
  });
  db.verifCodes.verify = async () => ({ valid: false, reason: "wrong" });
  db.verifLogs.add = async () => ({ ok: true });
  db.verifMemberStates.get = async () => ({
    active_failures: 4,
    cooldown_until: null,
  });
  db.verifMemberStates.markFailed = async (_guildId, _userId, _mode, _reason, options) => {
    markFailedCalls.push(options);
    return { ok: true };
  };
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.verifSettings.get = originalVerifSettingsGet;
  db.verifCodes.verify = originalVerifCodesVerify;
  db.verifLogs.add = originalVerifLogsAdd;
  db.verifMemberStates.get = originalVerifMemberStatesGet;
  db.verifMemberStates.markFailed = originalVerifMemberStatesMarkFailed;
});

test("verify code modal enters cooldown after repeated failures", async () => {
  const interaction = createInteraction();

  await handleVerif(interaction);

  assert.equal(markFailedCalls.length, 1);
  assert.equal(markFailedCalls[0].cooldownUntil instanceof Date, true);
  assert.equal(interaction.__calls.reply.length, 1);
  const description = interaction.__calls.reply[0].embeds?.[0]?.data?.description || "";
  assert.match(description, /Too many failed attempts/i);
});
