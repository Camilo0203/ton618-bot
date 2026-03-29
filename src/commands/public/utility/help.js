const { createHelpCommand } = require("../../../utils/helpFactory");

const command = createHelpCommand({
  name: "help",
  description: "Public help for server members and customers",
  descriptionLocalizations: {
    "en-US": "Public help for server users and clients",
    "en-GB": "Public help for server users and clients",
    "es-ES": "Ayuda publica para miembros y clientes del servidor",
    "es-419": "Ayuda publica para miembros y clientes del servidor",
  },
  audience: "user",
});

module.exports = command;
