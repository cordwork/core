import { ChannelType, Snowflake } from "discord.js";

export const generateGuildKey = (guildId: Snowflake|string): string =>
	`__GUILD__${guildId}`;

export const generateChannelKey = (
	guildId: Snowflake|string,
	channelId: Snowflake|string,
	type: ChannelType
): string => `${generateGuildKey(guildId)}/__CHANNEL__${channelId}:${type}`;