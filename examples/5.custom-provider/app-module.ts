import { Module } from '../../';
import { ReadyController } from './controllers/ready.controller';
import { InteractionController } from './controllers/interaction.controller';
import { CommandController } from './controllers/command.controller';
import { CustomProvider } from './provider';

@Module({
	imports: [
		CustomProvider.useValue(),
		CustomProvider.useFactory(),
		CustomProvider.useClass(),
	],
	events: [ReadyController, InteractionController],
	commands: [CommandController],
})
export class App {

}