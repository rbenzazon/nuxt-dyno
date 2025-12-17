import { defineStore } from 'pinia';
import { ref } from 'vue';

import { UPDATE_ENGINE } from '~~/shared/app-state';
import { shallowEqual } from '~~/shared/utils/equal';
import { addMessageListener, sendMessage } from './websocket-client';
import type EngineState from '~~/shared/engine-state';
import type { MessagePayload } from '~~/shared/types/message';

export const useEngineStateStore = defineStore('engineState', () => {
	const state = ref<EngineState>({});
	let updatingFromWs = false;

	function update(newValue: Partial<EngineState>) {
		state.value = { ...state.value, ...newValue };
		if (!updatingFromWs) {
			sendMessage({ type: UPDATE_ENGINE, data: newValue });
		}
	}

	if (typeof window !== 'undefined') {
		addMessageListener((payload: MessagePayload) => {
			if (payload.type === 'state' && !shallowEqual(payload.data.engineState, state.value)) {
				updatingFromWs = true;
				update(payload.data.engineState);
				updatingFromWs = false;
			}
		});
	}

	return {
		state,
		update,
	};
});
