import { ClientEvents } from "discord.js";
import { CordWorkClient } from "./cordwork-client";

export interface CordWorkClientEvents extends ClientEvents {
	'CordWork:ready': [client: CordWorkClient];
}