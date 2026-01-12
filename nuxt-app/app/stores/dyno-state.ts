import { defineStore } from 'pinia';
import { ref } from 'vue';

import { STATE, UPDATE_DYNO } from '~~/shared/app-state';
import { shallowEqual } from '~~/shared/utils/equal';
import { addMessageListener, sendMessage } from './websocket-client';
import type DynoState from '~~/shared/dyno-state';
import type { MessagePayload } from '~~/shared/types/message';

export const useDynoStateStore = defineStore('dynoState', () => {
	const state = ref<DynoState>({});
	const serverRefreshRate = ref<number>(100);
	const clientRefreshRate = ref<number>(100);
	const lastClientUpdateTime = ref<number>(Date.now());

	let updatingFromWs = false;

	function update(newValue: Partial<DynoState>) {
		state.value = { ...state.value, ...newValue };
		if (!updatingFromWs) {
			clientRefreshRate.value = Math.min(Date.now() - lastClientUpdateTime.value, 100);
			lastClientUpdateTime.value = Date.now();
			sendMessage({ type: UPDATE_DYNO, refreshTime: clientRefreshRate.value, data: newValue });
		}
	}

	if (typeof window !== 'undefined') {
		addMessageListener(async (payload: MessagePayload) => {
			if (payload.type === STATE) {
				serverRefreshRate.value = payload.refreshTime;
				if (!shallowEqual(payload.data.dynoState, state.value)) {
					updatingFromWs = true;
					await sleep(0); // must be used to let vue properly update reactivity
					update(payload.data.dynoState);
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

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
