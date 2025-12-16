import type EngineState from '../engine-state';

export type CaptureFrame = {
	timestamp: number;
	engineState: EngineState;
};
