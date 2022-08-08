import { CordWorkClientEvents } from '../../cordwork-event';
import { DISCORD_EVENT } from '../../constants';

export function DiscordEvent<K extends keyof CordWorkClientEvents>(str: K): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DISCORD_EVENT, str, target);
  }
}