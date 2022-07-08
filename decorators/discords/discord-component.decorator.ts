import { DISCORD_CLIENT, COMPONENT_ID, SELF_DECLARED_DEPS_METADATA, DISCORD_COMPONENT } from '../../constants';
import { CordWorkClient, } from '../../cordwork';
import { Type } from '../../interfaces/type.interface';

export function DiscordComponent(componentId?: string) {
  return (target: Type<any>) => {
	if ( !componentId ) {
	  componentId = `${Date.now()}-${target.name}`;
	}
	const newConstructor = class extends target {
		constructor(client: CordWorkClient, ...args: any[]) {
			super(...args);
			if ( typeof super.create !== 'function' )  {
				throw Error(`@DiscordComponent('${componentId}') ${target.name} is must include create method.`);
			}
			if ( typeof super.listener !== 'function' ) {
				throw Error(`@DiscordComponent('${componentId}') ${target.name} is must include listener method.`);
			}

			this.create(); // Actions on information that has already been generated.
		}

		create() {
			this.component = super.create();
			if ( !this.component.customId ) {
				throw Error(`@DiscordComponent('${componentId}') ${target.name} is must set customId when create component.`);
			}
			Reflect.defineMetadata(`${DISCORD_COMPONENT}/${this.component.customId}`, this, this.client);
			return this.component;
		}
	};

	const targetDependencies = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target);
	targetDependencies.push({ index: -1, param: DISCORD_CLIENT });
	Reflect.defineMetadata(SELF_DECLARED_DEPS_METADATA, targetDependencies, newConstructor);
	Reflect.defineMetadata(COMPONENT_ID, componentId, newConstructor);

	return newConstructor as Type<any>;
  }
}