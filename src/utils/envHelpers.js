/**
 * Parse environment variable as boolean.
 * Accepts: true/false, 1/0, yes/no, on/off (case-insensitive)
 * @param {*} value - Environment variable value
 * @param {boolean} fallback - Default value if undefined/null/empty
 * @returns {boolean}
 */
function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

module.exports = {
  parseBoolean,
};
