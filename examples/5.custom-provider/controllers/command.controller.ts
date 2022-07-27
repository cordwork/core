import { DiscordCommand, Inject } from '../../../';
import { SubClass } from '../provider';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController {

	constructor(
		@Inject('custom-provider-value-id') private value: any,
		@Inject('custom-provider-factory-id') private factoryValue: any,
		@Inject('custom-provider-class-id') private classValue: SubClass,
	) {
		console.log('value', this.value);
		console.log('factoryValue', this.factoryValue);
		console.log('classValue', this.classValue);
		this.classValue.method()
	}

	async listener(interaction): Promise<void> {
		interaction.reply('Pong!');
	}
}