import { ModuleMetadata } from '../../..';
import { CommandController2 } from'./command.controller';
import { ReadyController } from '../controllers/ready.controller';
import { DataSourceOptions } from 'typeorm';

export class TypeOrmModule {

	static forRoot(options: DataSourceOptions): ModuleMetadata {
		return {
			commands: [CommandController2],
			events: [ReadyController],
		};
	}

}