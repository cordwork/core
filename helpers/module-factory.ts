import { Client } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Type } from '../interfaces/type.interface';
import { DiscordCommandMetadata } from '../interfaces/discords/discord-command.interface';
import { CommandFactory } from './command-factory';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import {
	SELF_DECLARED_DEPS_METADATA,
	DISCORD_CLIENT,
	DISCORD_COMMAND,
	DISCORD_EVENT,
} from '../constants';
import { PromiseWorker } from './promise-worker';

export class ModuleFactory {

	private commandFactory: CommandFactory;

	constructor(
		private client: Client,
		private restClient: REST,
	) {
		this.commandFactory = new CommandFactory(this.client);
	}

	async attach(app: Type<any>): Promise<void> {
		this.eventRegister(app);
		this.commandFactory.attach(app);
	}

	eventRegister(app: Type<any>): void {
		const events = Reflect.getMetadata('events', app) || [];
		Reflect.defineMetadata(
			'events:real',
			events.map((handler) => {
				Reflect.defineMetadata(DISCORD_CLIENT, this.client, handler);
				const event = Reflect.getMetadata(DISCORD_EVENT, handler);
				

				const real = new handler(
					...this.propertyRegister(handler),
				);

				if ( typeof real.listener !== 'function' ) {
					throw Error(`@DiscordEvent(${event}) ${handler.name} must be has listener method.`)
				}
				this.client.on(event, real.listener.bind(real));
				return real;
			}),
			app,
		);
	}

	async commandRegister(): Promise<void> {
		this.commandFactory.guildRegister();
		const worker = new PromiseWorker();
		const guilds = Reflect.getMetadata(`${DISCORD_COMMAND}:guilds`, this.client) || [];
		for ( const guild of guilds ) {
			const commands = Reflect.getMetadata(`${DISCORD_COMMAND}:${guild}`, this.client) || [];
			console.log('commands', commands);
			worker.add(
				this.restClient.put(
					Routes.applicationGuildCommands(this.clientId, guild),
					{
						body: commands
							.map((command) => {
								const m = Reflect.getMetadata(DISCORD_COMMAND, command);
								console.log('metadata', m, command);
								return m;
							})
							.map((command: DiscordCommandMetadata) => 
								new SlashCommandBuilder()
									.setName(command.name)
									.setDescription(command.description)
									.toJSON()
							),
					},
				)
			);
		}
		await worker.wait();
	}

	propertyRegister(target): any[] {
		const properties = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];
		return properties.map(({ param }) => Reflect.getMetadata(param, target));
	}

	private get clientId() {
		const app = this.client.application;
		if ( app ) {
			return app.id;
		}
		return '';
	}

}