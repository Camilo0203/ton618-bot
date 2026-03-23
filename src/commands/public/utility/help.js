const { createHelpCommand } = require("../../../utils/helpFactory");

const command = createHelpCommand({
  name: "help",
  description: "Ayuda publica para usuarios y clientes del servidor",
  audience: "user",
});

if (command?.data?.setDescriptionLocalizations) {
  command.data.setDescriptionLocalizations({
    "en-US": "Public help for server users and clients",
    "en-GB": "Public help for server users and clients",
  });
}

module.exports = command;
