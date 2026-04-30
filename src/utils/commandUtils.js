"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommand = resolveCommand;
exports.checkAdmin = checkAdmin;
exports.checkStaff = checkStaff;
const accessControl_1 = require("./accessControl");
/**
 * Resolve a loaded slash command by name.
 * @param commandName - Slash command name
 * @param client - Discord.js client with injected commands Map
 * @returns The command object or null
 */
function resolveCommand(commandName, client) {
    return client.commands.get(commandName) || null;
}
/**
 * Check if the interaction author has admin privileges.
 * @param interaction - Discord slash command interaction
 * @returns Whether the user is an admin
 */
async function checkAdmin(interaction) {
    if (!interaction?.guild || !interaction?.member)
        return false;
    const s = await (0, accessControl_1.getGuildSettings)(interaction.guild.id);
    return (0, accessControl_1.hasAdminPrivileges)(interaction.member, s);
}
/**
 * Check if a guild member has staff privileges.
 * @param member - Discord guild member
 * @param s - Guild settings object
 * @returns Whether the member is staff
 */
function checkStaff(member, s) {
    return (0, accessControl_1.hasStaffPrivileges)(member, s);
}
module.exports = {
    resolveCommand,
    checkAdmin,
    checkStaff,
};
