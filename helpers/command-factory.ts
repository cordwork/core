import { CordWorkContainer } from '../injector/container';
import { Type } from '../interfaces/type.interface';
import {
	DISCORD_COMMAND,
	DISCORD_OATH_GUILDS,
	MODULE_METADATA,
} from '../constants';
import { isArray, isUndefined } from '../utils/shared.utils';
import { GuildMetadata, Guild } from '../interfaces/discords/discord-guild.interface';
import { DiscordCommandMetadata } from '../interfaces/discords/discord-command.interface';

export class CommandFactory {
	constructor(
		private container: CordWorkContainer,
		private commands: Map<Guild, any[]>
	) {
		this.getGuildId = this.getGuildId.bind(this);
	}

	public scan(app: Type<any>) {
		const appGuilds = Reflect.getMetadata(MODULE_METADATA.GUILDS, app) || [];
		const commands = Reflect.getMetadata(MODULE_METADATA.COMMANDS, app) || [];
		for ( const commandRegist of commands ) {
			const metadata: DiscordCommandMetadata = Reflect.getMetadata(DISCORD_COMMAND, commandRegist) || {};
			const guilds = (isArray(metadata.guilds) ? metadata.guilds : appGuilds) || [];
			
			if ( guilds.length <= 0 ) {
				throw Error(`@DiscordCommand('${metadata.name}') ${commandRegist.name} must include at least 1 guild.`);
			}

			for ( const guild of guilds.map((g) => typeof g === 'string' ? { name: g } : g) ) {
				const cmds = this.commands.get(guild.name) || [];
				this.commands.set(guild.name, [...cmds, { guild, commandRegist }]);
			}
		}
	}

	public guildRegister(): void {
		for ( const entityList of this.commands.values() ){
			for ( const { guild } of entityList ) {
				guild.id = this.getGuildId(guild);
			}
		}
	}

	private getGuildId(guild: GuildMetadata): string {
		if ( isUndefined(guild.id) ) {
			const guilds = Reflect.getMetadata(DISCORD_OATH_GUILDS, this.container) || [];
			const tmp = guilds.find(({name}) => name === guild.name) as GuildMetadata;
			if ( isUndefined(tmp) ) {
				throw Error(`Can not find guild id from name [${guild.name}]`);
			}
			guild = tmp;
		}
		return guild.id as string;
	}
}