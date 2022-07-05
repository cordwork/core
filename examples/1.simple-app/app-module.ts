import { Module } from '../../';
import { ReadyController } from './controllers/ready.controller';
import { InteractionController } from './controllers/interaction.controller';
import { CommandController } from './controllers/command.controller';

@Module({
	events: [ReadyController, InteractionController],
	commands: [CommandController],
})
export class App {

}