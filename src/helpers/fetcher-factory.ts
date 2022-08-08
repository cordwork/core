import { CordWork } from "../cordwork";
import { Logger } from "tslog";
import { CordWorkClient } from "../cordwork-client";
import { OAuth2Guild } from "discord.js";
import { PromiseWorker } from "./promise-worker";
import { generateChannelKey, generateGuildKey } from "../utils";
export class FetcherFactory {

	private log = new Logger({
		name: 'CordWorkFetchFactory',
		displayFilePath: 'hidden',
		displayFunctionName: false,
	});

	constructor(
		private provider: Map<any, any>,
		private app: CordWork,
	) {

	}

	async fetch(oAuthGuilds: IterableIterator<OAuth2Guild>): Promise<void> {
		const worker = new PromiseWorker();
		for ( const oAuthGuild of oAuthGuilds ) {
			worker.add((async () => {
				const guild = await oAuthGuild.fetch();
				const channels = await guild.channels.fetch();

				let log = `Fetching ${guild.name}(${guild.id})`;

				this.provider.set(generateGuildKey(guild.id), guild);
				this.provider.set(generateGuildKey(guild.name), guild);
				for ( const channel of channels.values() ) {
					this.provider.set(generateChannelKey(guild.id, channel.id, channel.type), channel);
					this.provider.set(generateChannelKey(guild.name, channel.name, channel.type), channel);
					log += `\n - Add channel ${channel.name}(${channel.id})`;
				}
				this.log.debug(log);
			})());
		}
		await worker.wait();
	}

	get client(): CordWorkClient {
		return this.app.client;
	}
}