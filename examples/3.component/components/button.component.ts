import { MessageButton } from 'discord.js';
import { Inject, DiscordComponent, CordWorkClient } from '../../../';

@DiscordComponent()
export class ComponentClass {
	constructor(
		@Inject(CordWorkClient) private client: CordWorkClient,
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