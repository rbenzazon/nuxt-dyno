import { defineStore } from 'pinia';
import { ref } from 'vue';

import { STATE, UPDATE_ENGINE } from '~~/shared/app-state';
import { shallowEqual } from '~~/shared/utils/equal';
import { addMessageListener, sendMessage } from './websocket-client';
import type EngineState from '~~/shared/engine-state';
import type { MessagePayload } from '~~/shared/types/message';

export const useEngineStateStore = defineStore('engineState', () => {
	const state = ref<EngineState>({});
	const serverRefreshRate = ref<number>(100);
	const clientRefreshRate = ref<number>(100);
	const lastClientUpdateTime = ref<number>(Date.now());

	let updatingFromWs = false;

	function update(newValue: Partial<EngineState>) {
		state.value = { ...state.value, ...newValue };
		if (!updatingFromWs) {
			clientRefreshRate.value = Math.min(Date.now() - lastClientUpdateTime.value, 100);
			lastClientUpdateTime.value = Date.now();
			console.log('Engine store update', clientRefreshRate.value);
			sendMessage({ type: UPDATE_ENGINE, refreshTime: clientRefreshRate.value, data: newValue });
		}
	}

	if (typeof window !== 'undefined') {
		addMessageListener((payload: MessagePayload) => {
			if (payload.type === STATE) {
				serverRefreshRate.value = payload.refreshTime;
				if (!shallowEqual(payload.data.engineState, state.value)) {
					updatingFromWs = true;
					update(payload.data.engineState);
					updatingFromWs = false;
				}
			}
		});
	}

	return {
		state,
		serverRefreshRate,
		clientRefreshRate,
		update,
	};
});
