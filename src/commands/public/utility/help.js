const { createHelpCommand } = require("../../../utils/helpFactory");

const command = createHelpCommand({
  name: "help",
  description: "Interactive help center for the commands available in this server",
  descriptionLocalizations: {
    "en-US": "Interactive help center for the commands available in this server",
    "en-GB": "Interactive help center for the commands available in this server",
    "es-ES": "Centro de ayuda interactivo para los comandos disponibles en este servidor",
    "es-419": "Centro de ayuda interactivo para los comandos disponibles en este servidor",
  },
  audience: "user",
});

module.exports = command;
