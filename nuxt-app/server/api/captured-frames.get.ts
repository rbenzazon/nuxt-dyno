import { capturedFrames } from '~~/server/captured-frames';
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
	return capturedFrames;
});
