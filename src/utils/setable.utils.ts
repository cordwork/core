/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

const GLOBAL_SETABLE_KEY = '__cordwork_setable_global__';

export class Setable {
	static mapTable: Map<string, Map<any, any>> = new Map();
	static table: Map<string, any> = new Map();

	static Get(name: string = GLOBAL_SETABLE_KEY): any {
		if ( !this.table.has(name) ) {
			if ( !this.mapTable.has(name) ) {
				this.mapTable.set(name, new Map());
			}
			const map = this.mapTable.get(name) as Map<any, any>;
			const constructor = class extends SetableCore {
				public _map: Map<any, any> = map;
			}
			this.table.set(name, constructor);
		}
		return this.table.get(name);
	}
}

export abstract class SetableCore {
	abstract _map: Map<any, any>;

	public set(key: any, value: any): void {
		this._map.set(key, value);
	}

	public get(key: any): any {
		return this._map.get(key);
	}

	public delete(key: any): boolean {
		return this._map.delete(key);
	}

	public clear(): void {
		return this._map.clear();
	}

	public forEach(callbackfn: (value: any, key: any, map: Map<any, any>) => void, thisArg?: any) {
		return this._map.forEach(callbackfn);
	}

	public has(key: any): boolean {
		return this._map.has(key);
	}

	public get size(): number {
		return this._map.size;
	}
}