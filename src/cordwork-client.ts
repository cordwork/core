import { Client, Awaitable } from 'discord.js';
import { CordWorkClientEvents } from './cordwork-event';

export class CordWorkClient extends Client {
	public on<K extends keyof CordWorkClientEvents>(event: K, listener: (...args: CordWorkClientEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof CordWorkClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this {
		return super.on(event as string, listener);
	}

	public once<K extends keyof CordWorkClientEvents>(event: K, listener: (...args: CordWorkClientEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof CordWorkClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this {
		return super.once(event as string, listener);
	}

	public emit<K extends keyof CordWorkClientEvents>(event: K, ...args: CordWorkClientEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof CordWorkClientEvents>, ...args: unknown[]): boolean {
		return super.emit(event as string, ...args);
	}
        
    public off<K extends keyof CordWorkClientEvents>(event: K, listener: (...args: CordWorkClientEvents[K]) => Awaitable<void>): this;
    public off<S extends string | symbol>(
      event: Exclude<S, keyof CordWorkClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this {
		return super.off(event as string, listener);
	}
      
    public removeAllListeners<K extends keyof CordWorkClientEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof CordWorkClientEvents>): this {
		return super.removeAllListeners(event as string);
	}
}
