import type EngineState from '../engine-state';
import type DynoState from '../dyno-state';
import type { CaptureFrame } from './capture-frame';
import type { UPDATE_DYNO, UPDATE_ENGINE, STATE, FRAME, CLEAR_FRAMES } from '../app-state';

export type MessagePayload = StateMessage | FrameMessage | ClearFramesMessage;

export type StateMessage = {
	type: typeof STATE;
	data: {
		dynoState: DynoState;
		engineState: EngineState;
	};
};

export type UpdateMessage = UpdateDyno | UpdateEngine;

type FrameMessage = {
	type: typeof FRAME;
	data: CaptureFrame[];
};

type ClearFramesMessage = {
	type: typeof CLEAR_FRAMES;
};

type UpdateDyno = {
	type: typeof UPDATE_DYNO;
	data: Partial<DynoState>;
};

type UpdateEngine = {
	type: typeof UPDATE_ENGINE;
	data: Partial<EngineState>;
};
