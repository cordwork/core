import {
	Interaction,
	MessageComponentInteraction,
} from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { Type } from '../interfaces/type.interface';
import {
	SELF_DECLARED_DEPS_METADATA,
	MODULE_METADATA,
	DISCORD_EVENT,
	DISCORD_OATH_GUILDS,
	DISCORD_COMMAND,
} from '../constants';
import {
	isPlainObject,
	isFunction,
} from '../utils/shared.utils';
import { InstanceWrapper } from './instance-wrapper';
import { CordWorkClient } from '../cordwork-client';
import { Guild } from '../interfaces/discords/discord-guild.interface';
import { CommandFactory } from '../helpers/command-factory';
import { PromiseWorker } from '../helpers/promise-worker';
import { CordWork } from '../cordwork';
import { Logger } from 'tslog';

export class CordWorkContainer {
	private provider = new Map<any, any>();
	private definedCommandObject = new Map<Guild, any[]>();
	private command = new Map<string, any>();
	private component = new Map<string, any>();
	private commandFactory;
	private log = new Logger({
		name: 'CordWorkContainer',
		displayFilePath: 'hidden',
		displayFunctionName: false,
	});

	constructor(
		private module: Type<any>,
		private serialize: (m: Type<any>) => InstanceWrapper,
		private app: CordWork,
	) {
		this.provider.set(CordWorkClient, this.app.client);
		this.commandFactory =
			new CommandFactory(
				this,
				this.definedCommandObject,
				this.log
			);
	}

	async scan(target: Type<any> = this.module): Promise<void> {
		const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, target) || [];
		for ( const injectable of imports ) {
			const guilds = Reflect.getMetadata(MODULE_METADATA.GUILDS, target) || [];
			if ( guilds.length ) {
				if ( !Reflect.getMetadata(MODULE_METADATA.GUILDS, injectable) ) {
					Reflect.defineMetadata(MODULE_METADATA.GUILDS, guilds, injectable);
				}
			}
			await this.attachProvider(
				await this.serialize(injectable),
			);
		}

		const components = Reflect.getMetadata(MODULE_METADATA.COMPONENTS, target) || [];
		for ( const component of components) {
			if ( this.provider.get(component) ) continue;
			const register = new component(...this.propertyRegister(component));
			this.provider.set(component, register);
			this.component.set(register.customId, register);
			this.log.debug(`Regist @DiscordComponent() ${component.name}`);
		}

		const events = Reflect.getMetadata(MODULE_METADATA.EVENTS, target) || [];
		for ( const handlerConstant of events ) {
			const event = Reflect.getMetadata(DISCORD_EVENT, handlerConstant);
			const handler = new handlerConstant(...this.propertyRegister(handlerConstant));
			if ( !isFunction(handler.listener) ) {
				throw Error(`@DiscordEvent('${event}') ${handlerConstant.name} must be has listener method.`);
			}
			this.log.debug(`Regist @DiscordEvent('${event}') ${handlerConstant.name}`);
			this.app.client.on(event, handler.listener.bind(handler));
		}

		this.commandFactory.scan(target);
	}

	public async register(): Promise<void> {
		const guilds = await this.app.client.guilds.fetch();
        Reflect.defineMetadata(
            DISCORD_OATH_GUILDS,
			guilds,
            this,
        );

		const worker = new PromiseWorker();
		this.commandFactory.guildRegister();
		for ( const guild of guilds.values() ) {
			const commands = this.definedCommandObject.get(guild.name) || [];
			if ( commands.length <= 0 ) continue;

			worker.add(
				this.app.rest.put(
					Routes.applicationGuildCommands(this.clientId, guild.id),
					{
						body: commands
							.map(({ commandRegist: command } ) => {
								const cmd = Reflect.getMetadata(DISCORD_COMMAND, command);
								const provider = new command(...this.propertyRegister(command));
								if ( !isFunction(provider.listener) ) {
									throw Error(`@DiscordCommand('${cmd.name}') ${command.name} is must include listener method.`);
								}
								if ( this.command.get(cmd.name) ) {
									throw Error(`Duplicate @DiscordCommand('${cmd.name}') ${command.name}`)
								}
								this.command.set(cmd.name, provider);
								return cmd;
							})
					},
				)
			)
		} // for ( const guild of guilds.values() )

		await worker.wait();
		this.app.client.on('interactionCreate', this.onInteractionEvent.bind(this));
	}

	private onInteractionEvent(interaction: Interaction): void {
		if ( interaction.isCommand() ) {
			const provider = this.command.get(interaction.commandName);
			if ( provider ) {
				provider.listener.call(provider, interaction);
			}
		} else if (
			interaction.isButton() ||
			interaction.isAutocomplete() ||
			interaction.isContextMenu() ||
			interaction.isSelectMenu()
		) {
			const inter = interaction as MessageComponentInteraction;
			const provider = this.component.get(inter.customId);
			if ( provider ) {
				provider.listener.call(provider, interaction);
			}
		}
	}

	private async attachProvider(inject: InstanceWrapper) {
		if ( inject.injectable ) {
			if ( !isPlainObject(inject.primitive) ) {
				inject.arguments = this.propertyRegister(inject.primitive);
			}
			if ( inject.imports.length > 0 ) {
				for ( const injectable of inject.imports ) {
					await this.attachProvider(
						this.serialize(injectable)
					);
				}
			}
			const instance = await inject.instance;
			if ( instance ) {
				this.provider.set(inject.token, instance);
			}
			return;
		}
		// 생성자일 경우 새 모듈 객체로 인식
		this.scan(inject.primitive as Type<any>);
	}

	private propertyRegister(target: any) {
		const deps = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];
		return deps.map((dep) => {
			const injectable = this.provider.get(dep.param);
			if ( !injectable ) {
				throw Error(`${dep.param} is not defined injectable`);
			}
			return injectable;
		});
	}

	private get clientId() {
		const app = this.app.client.application;
		if ( app ) {
			return app.id;
		}
		return '';
	}

}