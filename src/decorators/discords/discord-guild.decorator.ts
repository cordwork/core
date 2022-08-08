import { Inject } from "../inject.decorator";
import { generateGuildKey } from "../../utils/generate.utils";
import { Snowflake } from "discord.js";

export const InjectGuild = (
	guildId: Snowflake|string,
) => Inject(generateGuildKey(guildId));