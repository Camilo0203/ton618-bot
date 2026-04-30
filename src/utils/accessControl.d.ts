export function getGuildSettings(guildId: string): Promise<unknown>;
export function hasAdminPrivileges(member: unknown, settings: unknown): boolean;
export function hasStaffPrivileges(member: unknown, settings: unknown): boolean;
