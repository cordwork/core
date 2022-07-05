import { Module } from '../../';
import { ReadyController } from './controllers/ready.controller';
import { CommandController } from './controllers/command.controller';
import { ComponentClass } from './components/button.component';

@Module({
	events: [ReadyController],
	commands: [CommandController],
	components: [ComponentClass],
})
export class App {

}