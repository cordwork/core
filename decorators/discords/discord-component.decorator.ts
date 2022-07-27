import { DISCORD_CLIENT, COMPONENT_ID, SELF_DECLARED_DEPS_METADATA, DISCORD_COMPONENT } from '../../constants';
import { Type } from '../../interfaces/type.interface';

export function DiscordComponent(componentId?: string) {
  return (target: Type<any>) => {
	if ( !componentId ) {
	  componentId = `${Date.now()}-${target.name}`;
	}
	const newConstructor = class extends target {
		constructor(...args: any[]) {
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
			return this.component;
		}

		get customId() {
			return this.component?.customId;
		}
	};

	Reflect.defineMetadata(COMPONENT_ID, componentId, newConstructor);
	return newConstructor as Type<any>;
  }
}