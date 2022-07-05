import { Module } from '../../..';
import { CommandController2 } from'./command.controller';
import { ReadyController } from '../controllers/ready.controller';

@Module({
	commands: [CommandController2],
	events: [ReadyController],
})
export class SubModule {

}