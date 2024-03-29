import { CordWorkClientEvents } from "./cordwork-event";

export const MODULE_METADATA = {
  IMPORTS: 'imports',
  EVENTS: 'events',
  COMMANDS: 'commands',
  GUILDS: 'guilds',
  COMPONENTS: 'components',
};
export const CORDWORK_EVENTS: Record<string, keyof CordWorkClientEvents> = {
  READY: 'CordWork:ready',
};
export const PARAMTYPES_METADATA = 'design:paramtypes';
export const SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';
export const OPTIONAL_DEPS_METADATA = 'optional:paramtypes';
export const PROPERTY_DEPS_METADATA = 'self:properties_metadata';
export const OPTIONAL_PROPERTY_DEPS_METADATA = 'optional:properties_metadata';
export const SCOPE_OPTIONS_METADATA = 'scope:options';
export const INJECTABLE_WATERMARK = '__injectable__';
export const COMPONENT_ID = 'component-id';
export const DISCORD_CLIENT = 'discord:client';
export const DISCORD_COMMAND = 'discord:command';
export const DISCORD_EVENT = 'discord:event';
export const DISCORD_OATH_GUILDS = 'discord:guilds';
export const DISCORD_COMPONENT = 'discord:component';
export const CORDWORK_MODULE_TYPE = 'cordwork:module:type';