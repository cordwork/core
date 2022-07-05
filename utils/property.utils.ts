import { SELF_DECLARED_DEPS_METADATA } from '../constants';

export function propertyRegister(target): any[] {
	const properties = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];
	return properties
		.map((property) => {
			if ( property.component ) {
				return new property.param(
					...propertyRegister(property.param)
				);
			}
			return Reflect.getMetadata(property.param, target);
		})
		.sort((a, b) => {
			if ( a.index === b.index ) return 0;
			return a.index > b.index ? 1 : -1;
		});
}