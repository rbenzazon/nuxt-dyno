import EngineState from '~~/shared/engine-state';
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
	const state = EngineState.getInstance();
	// Return a JSON representation of the singleton (customize as needed)
	return state;
});
