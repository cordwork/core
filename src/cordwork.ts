import { Client, ClientOptions } from 'discord.js';
import { Type } from './interfaces/type.interface';
import { wait } from './utils/shared.utils';
import { REST } from '@discordjs/rest';
import { CordWorkClient } from './cordwork-client';
import { CordWorkContainer } from './injector/container';
import { Serializer } from './injector/serializer';


// 순서: import -> 나머지 이벤트 순

export class CordWork {

    private token!: string;
    private app!: Type<any>;
    private container!: CordWorkContainer;
	public readonly client: CordWorkClient;
    public readonly rest: REST = new REST({ version: '9' });

	constructor(options: ClientOptions = { intents: [] }) {
		this.client = new CordWorkClient(options);
	}

    SetToken(token: string): CordWork {
        this.token = token;
        this.rest.setToken(token);
        return this;
    }

    SetAppModule(module: Type<any>): CordWork {
        this.app = module;
        return this;
    }

    /**
     * 로그인 전에 모듈 어테치가 되어야 이벤트를 로스없이 받을 수 있다.
     * @returns 
     */
    async Launch(): Promise<Client> {

        if ( !this.app ) {
            throw Error('You need set app module');
        }


        await this.initialize();
        await this.client.login(this.token);
		await this.waitReady();
        await this.container.register();

        return this.client;
    }

    private async initialize() {
        this.container = new CordWorkContainer(
            this.app,
            Serializer.Serialize,
            this,
        );
        await this.container.scan();
    }

	private async waitReady() {
		if ( !this.client.isReady ) {
			await wait(100);
		}
	}

}