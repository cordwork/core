<p align="center">
  <img src="https://avatars.githubusercontent.com/u/108444461" width="120" alt="Cordwork Logo" />
</p>

<p align="center">
  A progressive <a href="https://nodejs.org/">Node.js</a> framework for building efficient and scalable <a href="https://discord.js.org/">Discord.js</a> applications.
</p>


## Description

Cordwork is a framework for building Discord bots like [NestJS](https://nestjs.com/). It will help make the project more cohesive and massive.


## Getting Started

### Install
```
$ npm install @cordwork/core
```

### tsconfig.json
```json
...
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
...
```

### main.ts
```typescript
import { CordWork } from '@cordwork/core';
import { App } from './app.module';

async function bootstrap() {
	const client = await new CordWork()
		.SetToken(process.env.BOT_TOKEN || '')
		.AttachApp(App)
		.Launch();
}
bootstrap();
```

* To check out the [example](/examples/).


## Module

Cordwork is a collection of modules. The program starts from the top-level module. Can add modules to modules.

### app.module.ts

```typescript
import { Module } from '@cordwork/core';

@Module({
  imports?: Type<any>[],
  events?: Type<any>[],
  commands?: Type<any>[],
  guilds?: Guild[],
  components?: Type<any>[],
  extensions?: Type<any>[],
})
export class App {

}
```

## Controller

Controller is an object that manages message components([Button](https://discordjs.guide/interactions/buttons.html), [Slect Menus](https://discordjs.guide/interactions/select-menus.html), etc...), [event handlers](https://discordjs.guide/creating-your-bot/event-handling.html), and [slash commands](https://discordjs.guide/interactions/slash-commands.html).

### Slash Commands
```typescript
import { DiscordCommand } from '@coredwork/core';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: ['my guild name'],
})
export class CommandController {

	async listener(interaction): Promise<void> {
		interaction.reply('Pong!');
	}
}
```

### Event Handler
```typescript
import { Inject, DiscordEvent, DISCORD_CLIENT, CordWorkClient } from '@cordwork/core';

@DiscordEvent('ready')
export class ReadyController {

	constructor(
		@Inject(DISCORD_CLIENT) private client: CordWorkClient
	) {

	}

	async listener(): Promise<void> {
		console.log(`Logged in as ${this.client?.user?.tag}!`);
		const application = this.client.application;
		if ( application ) {
			console.log('client id', application.id);
		}
	}

}
```

### Message Component

```typescript
import { MessageButton } from 'discord.js';
import { Inject, DISCORD_CLIENT, DiscordComponent, CordWorkClient } from '@cordwork/core';

@DiscordComponent()
export class ComponentClass {
	constructor(
		@Inject(DISCORD_CLIENT) private client: CordWorkClient,
	) {}

	create(): MessageButton {
		return new MessageButton()
			.setCustomId('mybutton')
			.setLabel(`LABEL ${this.client?.user?.tag}`)
			.setStyle('PRIMARY');
	}

	listener(interaction): void {
		interaction.reply('button click');
	}
}
```