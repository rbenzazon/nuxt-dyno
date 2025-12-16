import { defineStore } from 'pinia';
import { ref } from 'vue';

import { UPDATE_DYNO } from '~~/shared/app-state';
import { shallowEqual } from '~~/shared/utils/equal';
import { addMessageListener, sendMessage } from './websocket-client';
import type DynoState from '~~/shared/dyno-state';

export const useDynoStateStore = defineStore('dynoState', () => {
	const state = ref<DynoState>({});
	let updatingFromWs = false;

	function update(newValue: any) {
		state.value = { ...state.value, ...newValue };
		if (!updatingFromWs) {
			sendMessage({ type: UPDATE_DYNO, data: newValue });
		}
	}

	if (typeof window !== 'undefined') {
		addMessageListener(async (payload: any) => {
			if (payload.type === 'state' && !shallowEqual(payload.data.dynoState, state.value)) {
				updatingFromWs = true;
				await sleep(0); // must be used to let vue properly update reactivity
				update(payload.data.dynoState);
				updatingFromWs = false;
			}
		});
	}

	return {
		state,
		update,
	};
});

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
