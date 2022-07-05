import { Client, ClientOptions } from 'discord.js';
import { Type } from './interfaces/type.interface';
import { ModuleFactory } from './helpers/module-factory';
import { wait } from './utils/shared.utils';
import { REST } from '@discordjs/rest';
import { DISCORD_OATH_GUILDS } from './constants';


export class CordWork {

    private token!: string;
    private apps: Type<any>[] = [];
	private client: Client;
    private restClient: REST;
    private moduleFactory: ModuleFactory;

	constructor(options: ClientOptions = { intents: [] }) {
		this.client = new Client(options);
        this.restClient = new REST({ version: '9' });
        this.moduleFactory = new ModuleFactory(this.client, this.restClient);
	}

    SetToken(token: string): CordWork {
        this.token = token;
        this.restClient.setToken(token);
        return this;
    }

    AttachApp(module: Type<any>): CordWork {
        this.apps.push(module);
        return this;
    }

    async Launch(): Promise<Client> {
        for ( const app of this.apps ) {
            await this.moduleFactory.attach(app);
        }
        await this.client.login(this.token);
		await this.waitReady();
        Reflect.defineMetadata(
            DISCORD_OATH_GUILDS,
            await this.client.guilds.fetch(),
            this.client,
        );
        await this.moduleFactory.commandRegister();
        return this.client;
    }

	private async waitReady() {
		if ( !this.client.isReady ) {
			await wait(100);
		}
	}

}