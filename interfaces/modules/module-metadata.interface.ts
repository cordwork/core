import { Type } from '../type.interface';

export interface ModuleMetadata {
  imports?: Type<any>[];
  providers?: Type<any>[];
}
