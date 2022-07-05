import { Client } from 'discord.js';
import { Injectable, Inject, DISCORD_CLIENT } from "../../";

@Injectable('service')
export class Service {
	constructor(
		@Inject(DISCORD_CLIENT) private client: Client
	) {}

	service() {
		return this.client?.user?.tag || '';
	}

}