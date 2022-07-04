import { ClientEvents } from 'discord.js';

export function DiscordEvent<K extends keyof ClientEvents>(str: K): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('event:key', str, target);
  }
}