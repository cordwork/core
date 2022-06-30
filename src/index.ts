// Function returning never must not have a reachable end point
function error(message: string): never {
	throw new Error(message);
}

// Inferred return type is never
export function fail() {
	return error("Something failed");
}

// Function returning never must not have a reachable end point
export function infiniteLoop(): { _?: never } {
	return {
		'_': new Error('test'),
	}
}

export function success() {
	return true;
}
