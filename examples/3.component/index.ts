import { CordWork } from '../../';
import { App } from './app-module';

async function bootstrap() {
	const client = await new CordWork()
		.SetToken(process.env.BOT_TOKEN || '')
		.AttachApp(App)
		.Launch();
}
bootstrap();