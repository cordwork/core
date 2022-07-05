import { Client } from 'discord.js';
import { Inject, DiscordEvent, DISCORD_CLIENT } from '../../../';

@DiscordEvent('ready')
export class ReadyController {

	constructor(
		@Inject(DISCORD_CLIENT) private client: Client
	) {

	}

	async listener(): Promise<void> {
		console.log(`Logged in as ${this.client?.user?.tag}!`);
		const application = this.client.application;
		if ( application ) {
			console.log('client id', application.id);
		}
	}

}