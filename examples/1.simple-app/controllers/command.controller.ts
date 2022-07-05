import { DiscordCommand } from '../../../';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController {

	async listener(interaction): Promise<void> {
		interaction.reply('Pong!');
	}
}