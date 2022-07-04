import { Client } from 'discord.js';
import { Type } from '../interfaces/type.interface';
import { PROPERTY_DEPS_METADATA, SELF_DECLARED_DEPS_METADATA, DISCORD_CLIENT } from '../constants';

export class ModuleFactory {

	constructor(private client: Client) {

	}

	attach(app: Type<any>): void {
		const providers = Reflect.getMetadata('providers', app);
		Reflect.defineMetadata(
			'providers:real',
			providers.map((provider) => {
				Reflect.defineMetadata(DISCORD_CLIENT, this.client, provider);
				const event = Reflect.getMetadata('event:key', provider);
				const properties = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, provider) || [];

				const real = new provider(
					...properties.map(({ param }) => Reflect.getMetadata(param, provider))
				);

				if ( typeof real.listener !== 'function' ) {
					throw Error(`@DiscordEvent(${event}) ${provider.name} must be has listener method.`)
				}
				this.client.on(event, real.listener.bind(real));
				return;
			}),
			app,
		);
	}

}