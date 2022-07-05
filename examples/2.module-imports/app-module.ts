import { Module } from '../..';
import { SubModule } from './modules/sub.module';
import { CommandController } from './controllers/command.controller';

@Module({
	imports: [SubModule],
	commands: [CommandController],
})
export class App {

}