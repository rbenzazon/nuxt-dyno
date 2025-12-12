// server/api/dyno-state.get.ts
import DynoState from '../dyno-state';
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
	const state = DynoState.getInstance();
	// Return a JSON representation of the singleton (customize as needed)
	return state;
});
