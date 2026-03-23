function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeTicketAnswers(rawAnswers = [], options = {}) {
  const minLength = Math.max(1, Number(options.minLength || 3));
  const maxLength = Math.max(minLength, Number(options.maxLength || 500));
  const firstMinLength = Math.max(minLength, Number(options.firstMinLength || minLength));
  const out = [];
  const errors = [];

  for (let i = 0; i < rawAnswers.length; i += 1) {
    const normalized = normalizeWhitespace(rawAnswers[i]);
    if (!normalized) continue;

    const requiredMin = i === 0 ? firstMinLength : minLength;
    if (normalized.length < requiredMin) {
      errors.push({
        index: i,
        reason: "too_short",
        minLength: requiredMin,
      });
      continue;
    }

    out.push(normalized.slice(0, maxLength));
  }

  return {
    answers: out.slice(0, 5),
    errors,
    valid: errors.length === 0,
  };
}

module.exports = {
  sanitizeTicketAnswers,
};
