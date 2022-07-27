import { DiscordCommandMetadata } from '../../interfaces/discords/discord-command.interface';
import { DISCORD_COMMAND } from '../../constants';

export function DiscordCommand(cmd: DiscordCommandMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DISCORD_COMMAND, cmd, target);
  }
}