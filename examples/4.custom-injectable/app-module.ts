import { Module } from '../../';
import { ReadyController } from './controllers/ready.controller';
import { InteractionController } from './controllers/interaction.controller';
import { CommandController } from './controllers/command.controller';
import { Service } from './service.controller';

@Module({
	events: [ReadyController, InteractionController],
	commands: [CommandController],
	extensions: [Service],
})
export class App {

}