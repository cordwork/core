import { Client, MessageButton } from 'discord.js';
import { Inject, DISCORD_CLIENT, DiscordComponent } from '../../../';

@DiscordComponent()
export class ComponentClass {
	constructor(
		@Inject(DISCORD_CLIENT) private client: Client,
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