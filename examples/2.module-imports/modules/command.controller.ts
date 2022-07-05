import { DiscordCommand } from '../../..';

@DiscordCommand({
	name: 'ping2',
	description: 'The test command2.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController2 {

	async listener(interaction): Promise<void> {
		interaction.reply('Pong2!');
	}

}