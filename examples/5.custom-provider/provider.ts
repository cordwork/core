export class SubClass {
	constructor(private item: string, ...numbers: number[]) {
		console.log('numbers', numbers);
	}
	method() {
		console.log('item', this.item);
	}
}

export class CustomProvider {

	/**
	 * injecting raw value
	 */
	static useValue() {
		return {
			id: 'custom-provider-value-id',
			useValue: { hi: 'Hello World' },
		};
	}

	/**
	 * inject function (can async function)
	 */
	static useFactory() {
		return {
			id: 'custom-provider-factory-id',
			useFactory: async (a, b) => ({
				hi: 'Hello World',
				factory: true,
			}),
			arguments: [1, '2'],
		};
	}

	/**
	 * inject class
	 */
	static useClass() {
		return {
			id: 'custom-provider-class-id',
			useClass: SubClass,
			arguments: ['sub arguments', 1, 2, 3],
		};
	}
}