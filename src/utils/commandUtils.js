const { getGuildSettings, hasAdminPrivileges, hasStaffPrivileges } = require("./accessControl");

// Resolucion simple para slash commands.
function resolveCommand(commandName, client) {
  return client.commands.get(commandName) || null;
}

// Funcion para verificar si el usuario es administrador
async function checkAdmin(interaction) {
  if (!interaction?.guild || !interaction?.member) return false;
  const s = await getGuildSettings(interaction.guild.id);
  return hasAdminPrivileges(interaction.member, s);
}

// Funcion para verificar si el usuario es staff
function checkStaff(member, s) {
  return hasStaffPrivileges(member, s);
}

module.exports = {
  resolveCommand,
  checkAdmin,
  checkStaff,
};
