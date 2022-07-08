import { MessageButton } from 'discord.js';
import { Inject, DISCORD_CLIENT, DiscordComponent, CordWorkClient } from '../../../';

@DiscordComponent()
export class ComponentClass {
	constructor(
		@Inject(DISCORD_CLIENT) private client: CordWorkClient,
	) {}

	create(): MessageButton {
		return new MessageButton()
			.setCustomId('mybutton')
			.setLabel(`LABEL ${this.client?.user?.tag}`)
			.setStyle('PRIMARY');
	}

	listener(interaction): void {
		interaction.reply('button click');
	}
}