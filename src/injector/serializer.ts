import { Type } from '../interfaces/type.interface';
import { isPlainObject } from '../utils/shared.utils';
import { INJECTABLE_WATERMARK, MODULE_METADATA } from '../constants';
import { InstanceWrapper } from './instance-wrapper';
import { InjectableInstance } from '../interfaces/injectable-instance.interface';

type ModuleTypes = keyof typeof MODULE_METADATA;

export type ModuleSerializer = {
	[key in ModuleTypes]: () => any;
}

export class Serializer {

	static Serialize(module: Type<any>|InjectableInstance): InstanceWrapper {
		/*
		if ( isPlainObject(module) ) {
			// plain object일 경우 직렬화된 즉시 사용 객체로 인식
			return module as InjectableInstance;
		}
		*/
		const watermark = Reflect.getMetadata(INJECTABLE_WATERMARK, module);
		if ( watermark ) {
			return new InstanceWrapper(module, watermark);
		}
		return new InstanceWrapper(module);
	}

}
