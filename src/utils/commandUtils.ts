import type { ChatInputCommandInteraction, Client, GuildMember } from "discord.js";
import { getGuildSettings, hasAdminPrivileges, hasStaffPrivileges } from "./accessControl";

// Augment Client to reflect the commands Map injected at startup
interface CommandClient extends Client {
  commands: Map<string, unknown>;
}

/**
 * Resolve a loaded slash command by name.
 * @param commandName - Slash command name
 * @param client - Discord.js client with injected commands Map
 * @returns The command object or null
 */
export function resolveCommand(commandName: string, client: CommandClient): unknown | null {
  return client.commands.get(commandName) || null;
}

/**
 * Check if the interaction author has admin privileges.
 * @param interaction - Discord slash command interaction
 * @returns Whether the user is an admin
 */
export async function checkAdmin(interaction: ChatInputCommandInteraction): Promise<boolean> {
  if (!interaction?.guild || !interaction?.member) return false;
  const s = await getGuildSettings(interaction.guild.id);
  return hasAdminPrivileges(interaction.member as GuildMember, s);
}

/**
 * Check if a guild member has staff privileges.
 * @param member - Discord guild member
 * @param s - Guild settings object
 * @returns Whether the member is staff
 */
export function checkStaff(member: GuildMember, s: unknown): boolean {
  return hasStaffPrivileges(member, s);
}

module.exports = {
  resolveCommand,
  checkAdmin,
  checkStaff,
};
