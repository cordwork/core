import { DiscordEvent } from '../../../';


@DiscordEvent('interactionCreate')
export class InteractionController {

	async listener(interaction): Promise<void> {
		//console.log('interaction', interaction);
	}

}