import { Client, ClientOptions } from 'discord.js';
import { Type } from './interfaces/type.interface';
import { ModuleFactory } from './helpers/module-factory';


export class CordWork {

    private token!: string;
    private apps: Type<any>[] = [];
	private client: Client;
    private moduleFactory: ModuleFactory;

	constructor(options: ClientOptions = { intents: [] }) {
		this.client = new Client(options);
        this.moduleFactory = new ModuleFactory(this.client);
	}

    SetToken(token: string): CordWork {
        this.token = token;
        return this;
    }

    AttachApp(module: Type<any>): CordWork {
        this.apps.push(module);
        return this;
    }

    async Launch(): Promise<Client> {
        await this.client.login(this.token);
        for ( const app of this.apps ) {
            this.moduleFactory.attach(app);
        }
        return this.client;
    }

}