import { Client, ClientEvents } from 'discord.js';
import { Awaitable } from './shared.interface';

export interface DiscordEventAbstarct<K extends keyof ClientEvents> {
	client: Client;
	listener: (...args: ClientEvents[K]) => Awaitable<void>;
}