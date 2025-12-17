import type DynoState from '../dyno-state';
import type EngineState from '../engine-state';

export function shallowEqual<T extends DynoState | EngineState>(obj1: T, obj2: T): boolean {
	if (obj1 === obj2) return true;
	if (!obj1 || !obj2) return false;
	const keys1 = Object.keys(obj1) as Array<keyof T>;
	const keys2 = Object.keys(obj2) as Array<keyof T>;
	if (keys1.length !== keys2.length) return false;
	for (const key of keys1) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
}

export function partialEqual<T extends DynoState | EngineState>(partialObj: Partial<T>, fullObj: T): boolean {
	if (!partialObj || !fullObj) return false;
	for (const key of Object.keys(partialObj) as Array<keyof T>) {
		if (partialObj[key] !== fullObj[key]) return false;
	}
	return true;
}
