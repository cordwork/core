import { Client } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Type } from '../interfaces/type.interface';
import { DiscordCommandMetadata } from '../interfaces/discords/discord-command.interface';
import { CommandFactory } from './command-factory';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { InteractionFactory } from './interaction-factory';
import {
	DISCORD_CLIENT,
	DISCORD_COMMAND,
	DISCORD_EVENT,
	INJECTABLE_WATERMARK,
} from '../constants';
import { propertyRegister } from '../utils/property.utils';
import { PromiseWorker } from './promise-worker';

export class ModuleFactory {

	private commandFactory: CommandFactory;
	private interactionFactory: InteractionFactory;

	constructor(
		private client: Client,
		private restClient: REST,
	) {
		this.commandFactory = new CommandFactory(this.client);
		this.interactionFactory = new InteractionFactory(this.client);
	}

	async attach(app: Type<any>): Promise<void> {
		this.extentionRegister(app);
		this.eventRegister(app);
		this.componentRegister(app);
		this.commandFactory.attach(app);
		const modules = Reflect.getMetadata('imports', app) || [];
		for ( const module of modules ) {
			this.attach(module);
		}
	}

	extentionRegister(app: Type<any>): void {
		const extensions = Reflect.getMetadata('extensions', app) || [];
		for ( const extension of extensions ) {
			Reflect.defineMetadata(DISCORD_CLIENT, this.client, extension);
			const id = Reflect.getMetadata(INJECTABLE_WATERMARK, extension);
			const provider = new extension(...propertyRegister(extension));
			
			const components = Reflect.getMetadata('components', app) || [];
			components.forEach((component) => {
				Reflect.defineMetadata(id, provider, component);
			});

			const commands = Reflect.getMetadata('commands', app) || [];
			commands.forEach((command) => {
				Reflect.defineMetadata(id, provider, command);
			});

			const events = Reflect.getMetadata('events', app) || [];
			events.forEach((event) => {
				Reflect.defineMetadata(id, provider, event);
			});

			Reflect.defineMetadata(DISCORD_CLIENT, this.client, extension);
		}
	}

	componentRegister(app: Type<any>): void {
		const components = Reflect.getMetadata('components', app) || [];
		for ( const handler of components ) {
			Reflect.defineMetadata(DISCORD_CLIENT, this.client, handler);
		}
	}

	eventRegister(app: Type<any>): void {
		const events = Reflect.getMetadata('events', app) || [];
		Reflect.defineMetadata(
			'events:real',
			events.map((handler) => {
				Reflect.defineMetadata(DISCORD_CLIENT, this.client, handler);
				const event = Reflect.getMetadata(DISCORD_EVENT, handler);
				

				const real = new handler(
					...propertyRegister(handler),
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
			worker.add(
				this.restClient.put(
					Routes.applicationGuildCommands(this.clientId, guild),
					{
						body: commands
							.map((command) => {
								const cmd = Reflect.getMetadata(DISCORD_COMMAND, command);
								const provider = new command(...propertyRegister(command));
								if ( typeof provider.listener !== 'function' ) {
									throw Error(`@DiscordCommand('${cmd.name}') ${command.name} is must include listener method.`);
								}
								Reflect.defineMetadata(`${DISCORD_COMMAND}/${cmd.name}`, provider, this.client);
								return cmd;
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
		this.client.on('interactionCreate', this.interactionFactory.onInteractionCreate);
	}

	private get clientId() {
		const app = this.client.application;
		if ( app ) {
			return app.id;
		}
		return '';
	}

}