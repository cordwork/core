import { Type } from './type.interface';

export interface InjectableInstance<T = any> {
	primitive: Type<T>|InjectableInstance;
	instance: T;
	token: string;
	id: string;
	arguments: any[];
	imports: any[];
	useFactory?: (...args: any[]) => any;
	useValue?: any;
	useClass?: new (...args: any[]) => any;
}