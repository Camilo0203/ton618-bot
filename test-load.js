const path = require("path");
const pollPath = path.resolve(__dirname, "src/commands/public/utility/poll.js");
try {
  const poll = require(pollPath);
  console.log("Poll loaded!");
  console.log("Data name:", poll.data?.name);
  console.log("Execute type:", typeof poll.execute);
} catch (e) {
  console.error("Error loading poll:", e);
}
