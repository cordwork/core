import { Type } from '../type.interface';
import { Guild } from '../discords/discord-guild.interface';

export interface ModuleMetadata {
  imports?: Type<any>[];
  events?: Type<any>[];
  commands?: Type<any>[];
  guilds?: Guild[];
}
