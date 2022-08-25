import { COMPONENT_ID } from '../../constants';
import { Type } from '../../interfaces/type.interface';

export function DiscordComponent(customId: string) {
  return (target: Type<any>) => {
	const componentContructor = class extends target {
		constructor(...args: any[]) {
			super(...args);
			if ( typeof super.create !== 'function' )  {
				throw Error(`@DiscordComponent('${customId}') ${target.name} is must include create method.`);
			}
			if ( typeof super.listener !== 'function' ) {
				throw Error(`@DiscordComponent('${customId}') ${target.name} is must include listener method.`);
			}

			this.create(); // Actions on information that has already been generated.
		}

		create(...args) {
			this.component = super.create(...args);
			this.component.customId = customId;
			this.component.custom_id = customId;
			if ( this.component?.data ) {
				this.component.data.customId = customId;
				this.component.data.custom_id = customId;
			}
			return this.component;
		}

		get customId() {
			return this.component?.customId;
		}
	};
	const newConstructor = componentContructor;
	Reflect.defineMetadata(COMPONENT_ID, customId, newConstructor);
	return newConstructor as Type<any>;
  }
}