import DynoState from '~~/shared/dyno-state';
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
	const state = DynoState.getInstance();
	// Return a JSON representation of the singleton (customize as needed)
	return state;
});
