import { Injectable, Inject, DISCORD_CLIENT, CordWorkClient } from "../../";

@Injectable('service')
export class Service {
	constructor(
		@Inject(DISCORD_CLIENT) private client: CordWorkClient
	) {}

	service() {
		return this.client?.user?.tag || '';
	}

}