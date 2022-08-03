import { Guild } from "./discord-guild.interface";
import {
	ApplicationCommandSubCommand,
	ApplicationCommandOptionType
} from "discord.js";

export type DiscordCommandMetadata =  {
	type?: ApplicationCommandOptionType;
	guilds?: Guild[];
} & Omit<ApplicationCommandSubCommand, 'type'>;