import { Guild } from "./discord-guild.interface";

export interface DiscordCommandMetadata {
	name: string;
	description: string;
	options?: any[];
	defaultPermission?: boolean;
	guilds?: Guild[];
}