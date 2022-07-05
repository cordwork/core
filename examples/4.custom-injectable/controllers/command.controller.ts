import { DiscordCommand, Inject } from '../../../';
import { Service } from '../service.controller';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController {

	constructor(
		@Inject('service') private service: Service,
	) {
	}

	async listener(interaction): Promise<void> {
		interaction.reply(`Reply from ${this.service.service()}`);
	}
}