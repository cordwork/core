import { Injectable, Inject, CordWorkClient } from "../../";

@Injectable()
export class Service {
	constructor(
		@Inject(CordWorkClient) private client: CordWorkClient
	) {}

	service() {
		return this.client?.user?.tag || '';
	}

}