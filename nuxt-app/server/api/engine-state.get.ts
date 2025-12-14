// server/api/dyno-state.get.ts
import EngineState from '../engine-state';
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
	const state = EngineState.getInstance();
	// Return a JSON representation of the singleton (customize as needed)
	return state;
});
