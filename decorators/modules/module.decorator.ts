import { ModuleMetadata } from '../../interfaces/modules/module-metadata.interface';
import { CORDWORK_MODULE_TYPE, MODULE_METADATA } from '../../constants';

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(CORDWORK_MODULE_TYPE, MODULE_METADATA.IMPORTS, target);
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
}
