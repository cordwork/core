import {
  PROPERTY_DEPS_METADATA,
  SELF_DECLARED_DEPS_METADATA,
  COMPONENT_ID,
} from '../constants';
import { isUndefined } from '../utils/shared.utils';
import { Type } from '../interfaces/type.interface';
import { propertyRegister } from '../utils/property.utils';


export function Inject<T = any>(token?: T) {
  return (target: object, key: string | symbol, index?: number) => {
    const type = token || Reflect.getMetadata('design:type', target, key);
    
    if (!isUndefined(index)) {
      let dependencies =
      Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];
      
      dependencies = [...dependencies, { index, param: type }];
      Reflect.defineMetadata(SELF_DECLARED_DEPS_METADATA, dependencies, target);
      return;
    }
    let properties =
    Reflect.getMetadata(PROPERTY_DEPS_METADATA, target.constructor) || [];
    
    properties = [...properties, { key, type }];
    Reflect.defineMetadata(
      PROPERTY_DEPS_METADATA,
      properties,
      target.constructor,
    );
  };
}

export const InjectComponent = (component: Type<any>) => {
  return (target: object, key: string | symbol, index?: number) => {
    let dependencies =
    Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];
    
    dependencies = [...dependencies, { index, param: component, component: true }];
    Reflect.defineMetadata(SELF_DECLARED_DEPS_METADATA, dependencies, target);
  };
}