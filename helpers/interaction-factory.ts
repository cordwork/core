import { Interaction, CommandInteraction } from 'discord.js';
import { DISCORD_COMMAND, DISCORD_COMPONENT } from '../constants';
import { CordWorkClient } from '../cordwork';

export class InteractionFactory {
	constructor(
		private client: CordWorkClient,
	) {
		this.onInteractionCreate = this.onInteractionCreate.bind(this);
	}

	onInteractionCreate(interaction: Interaction): void {
		if ( interaction.isCommand() ) {
			const provider
				= Reflect.getMetadata(`${DISCORD_COMMAND}/${interaction.commandName}`, this.client);
			if ( provider ) {
				provider.listener.call(provider, interaction);
			}
		}
		if ( (interaction as any).customId ) {
			const id = (interaction as any).customId;
			const provider = Reflect.getMetadata(`${DISCORD_COMPONENT}/${id}`, this.client);
			provider.listener.call(provider, interaction);
		}
	}
}