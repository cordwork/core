import { Inject } from "../inject.decorator";
import { generateChannelKey } from "../../utils/generate.utils";
import { Snowflake, ChannelType } from "discord.js";

export const InjectChannel = (
	guildId: Snowflake|string,
	channelId: Snowflake|string,
	type: ChannelType = ChannelType.GuildText
) => Inject(generateChannelKey(guildId, channelId, type));