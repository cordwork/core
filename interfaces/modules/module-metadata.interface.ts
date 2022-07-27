import { Type } from '../type.interface';
import { Guild } from '../discords/discord-guild.interface';

export interface ModuleMetadata {
  imports?: any[];
  events?: Type<any>[];
  commands?: Type<any>[];
  guilds?: Guild[];
  components?: Type<any>[];
  extensions?: Type<any>[];
}
