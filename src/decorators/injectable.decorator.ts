import { INJECTABLE_WATERMARK } from '../constants';

export function Injectable(id?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_WATERMARK, id || target, target);
  };
}