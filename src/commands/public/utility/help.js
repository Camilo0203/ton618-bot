const { createHelpCommand } = require("../../../utils/helpFactory");

const command = createHelpCommand({
  name: "help",
  description: "Public help for server members and customers",
  audience: "user",
});

if (command?.data?.setDescriptionLocalizations) {
  command.data.setDescriptionLocalizations({
    "en-US": "Public help for server users and clients",
    "en-GB": "Public help for server users and clients",
  });
}

module.exports = command;
