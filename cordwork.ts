import { Client } from 'discord.js';

export class Module {

}

export class CordWorkStatic {

    private token!: string;
    private apps: Module[] = [];
    private client: Client = new Client();

    SetToken(token: string) {
        this.token = token;
        return this;
    }

    AttachApp(module: Module) {
        this.apps.push(module);
        return this;
    }

    Launch() {
        this.client.login(this.token);
    }

}

export const CordWork = new CordWorkStatic();