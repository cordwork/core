import { ClientEvents } from 'discord.js';
import { DISCORD_EVENT } from '../../constants';

export function DiscordEvent<K extends keyof ClientEvents>(str: K): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DISCORD_EVENT, str, target);
  }
}