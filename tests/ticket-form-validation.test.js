const test = require("node:test");
const assert = require("node:assert/strict");

const { sanitizeTicketAnswers } = require("../src/domain/tickets/formValidation");

test("sanitizeTicketAnswers normaliza y recorta respuestas", () => {
  const result = sanitizeTicketAnswers(
    ["  hola   mundo  ", "segunda   respuesta"],
    { minLength: 3, firstMinLength: 8, maxLength: 20 }
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.answers, ["hola mundo", "segunda respuesta"]);
});

test("sanitizeTicketAnswers marca error si la primera respuesta es corta", () => {
  const result = sanitizeTicketAnswers(
    ["corto", "respuesta valida"],
    { minLength: 3, firstMinLength: 8, maxLength: 100 }
  );

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].index, 0);
});
