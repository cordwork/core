import { Inject, DiscordEvent, CordWorkClient } from '../../../';

@DiscordEvent('ready')
export class ReadyController {

	constructor(
		@Inject(CordWorkClient) private client: CordWorkClient
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