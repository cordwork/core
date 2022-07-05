import { Client } from 'discord.js';
import { Type } from '../interfaces/type.interface';
import { DISCORD_COMMAND, DISCORD_OATH_GUILDS } from '../constants';
import { isArray, isUndefined } from '../utils/shared.utils';
import { GuildMetadata } from '../interfaces/discords/discord-guild.interface';

export class CommandFactory {
	constructor(private client: Client) {
		this.getGuildId = this.getGuildId.bind(this);
	}

	public attach(app: Type<any>): void {
		const definedCommandObject
			= Reflect.getMetadata(`${DISCORD_COMMAND}:objects`, this.client) || {};
		const appGuilds = Reflect.getMetadata('guilds', app) || [];
		const commands = Reflect.getMetadata('commands', app) || [];

		for ( const command of commands ) {
			const metadata = Reflect.getMetadata(DISCORD_COMMAND, command);
			const guilds = (isArray(metadata.guilds) ? metadata.guilds : appGuilds) || [];

			if ( guilds.length <= 0 ) {
				throw Error(`@DiscordCommand('${metadata.name}') ${command.name} must include at least 1 guild.`);
			}
			//this.registerCommand(guildIds, command);
			for ( const guild of guilds.map((g) => typeof g === 'string' ? { name: g } : g) ) {
				if ( !isArray(definedCommandObject[guild.name]) ) {
					definedCommandObject[guild.name] = [];
				}
				definedCommandObject[guild.name].push({ guild, command });
			}
		}
		Reflect.defineMetadata(`${DISCORD_COMMAND}:objects`, definedCommandObject, this.client);
	}

	public guildRegister(): void {
		const definedCommandObject: any[]
			= Reflect.getMetadata(`${DISCORD_COMMAND}:objects`, this.client) || [];
		
		const guildIds: string[] = [];
		for ( const entityList of Object.values(definedCommandObject) ){
			for ( const { guild, command } of entityList ) {
				const guildId = this.getGuildId(guild);
				this.registerCommand(guildId, command);
				guildIds.push(guildId);
			}
		}
		Reflect.defineMetadata(`${DISCORD_COMMAND}:guilds`, guildIds, this.client);
	}

	private registerCommand(guildId: string, command: Type<any>) {
		const commands = Reflect.getMetadata(`${DISCORD_COMMAND}:${guildId}`, this.client) || [];
		commands.push(command);
		Reflect.defineMetadata(`${DISCORD_COMMAND}:${guildId}`, commands, this.client);
	}

	private getGuildId(guild: GuildMetadata): string {
		if ( isUndefined(guild.id) ) {
			const guilds = Reflect.getMetadata(DISCORD_OATH_GUILDS, this.client) || [];
			const tmp = guilds.find(({name}) => name === guild.name) as GuildMetadata;
			if ( isUndefined(tmp) ) {
				throw Error(`Can not find guild id from name [${guild.name}]`);
			}
			guild = tmp;
		}
		return guild.id as string;
	}
}