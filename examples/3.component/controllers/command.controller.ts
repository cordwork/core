import { MessageActionRow, MessageButton } from 'discord.js';
import { DiscordCommand, Component, InjectComponent } from '../../../';
import { ComponentClass } from '../components/button.component';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController {

	constructor(
		@InjectComponent(ComponentClass) private component: Component<MessageButton>,
	) {}

	async listener(interaction): Promise<void> {
		interaction.reply({
			content: 'pong',
			components: [
				new MessageActionRow()
				.addComponents(this.component.create())
			]
		});
	}
}