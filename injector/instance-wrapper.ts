import { Type } from '../interfaces/type.interface';
import { InjectableInstance } from '../interfaces/injectable-instance.interface';
import { INJECTABLE_WATERMARK } from '../constants';
import { v4 as uuid } from 'uuid';
import {
	isUndefined,
	isPlainObject,
	isFunction,
} from '../utils/shared.utils';

/**
 * TODO: id 는 any 가 아닌 InjectKey 가 가능한 객체를 선언해야 함.
 */

export class InstanceWrapper implements InjectableInstance {
	private _instance: any;
	private useRandomId = false;
	private _id: any;
	private _args: any[] = [];

	constructor(
		private module: Type<any>|InjectableInstance,
		id?: any,
	) {
		if ( isUndefined(id) ) {
			this.useRandomId = true;
			id = uuid();
		}
		this._id = id;

		if ( isPlainObject(this.module) ) {
			Object.assign(this, this.module);
		}
	}

	createInstance(...args: any[]): any {
		this._instance = new (this.module as Type<any>)(...args);
		return this._instance;
	}

	get id(): any {
		return this._id;
	}

	get token(): any {
		return this.useRandomId ? this.primitive : this.id;
	}

	get instance(): any {
		return (async() => {
			if ( isPlainObject(this.primitive) ) {
				const primitive = this.primitive as InjectableInstance;
				if ( isFunction(primitive?.useFactory) ) {
					const factory = primitive.useFactory as (...args: any[]) => any;
					return await factory();
				} else if ( !isUndefined(primitive?.useClass) ) {
					return await new primitive.useClass();
				} else if ( !isUndefined(primitive.useValue) ) {
					return primitive.useValue;
				}
			}
			
			return this._instance || this.createInstance(...this._args);
		})();
	}

	get injectable(): boolean {
		return !!Reflect.getMetadata(INJECTABLE_WATERMARK, this.primitive) || isPlainObject(this.primitive);
	}

	get primitive(): Type<any>|InjectableInstance {
		return this.module;
	}

	set arguments(args: any[]) {
		this._args = args;
	}
}