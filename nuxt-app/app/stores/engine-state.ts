import { defineStore } from 'pinia';
import { ref } from 'vue';

import { UPDATE_ENGINE } from '~~/shared/app-state';

export const useEngineStateStore = defineStore('engineState', () => {
	const state = ref(null);
	let updatingFromWs = false;
	let ws: WebSocket | null = null;

	function update(newValue: any) {
		if (state.value === null) {
			state.value = newValue;
		} else {
			Object.assign(state.value, newValue);
		}
		if (!updatingFromWs && ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: UPDATE_ENGINE, data: newValue }));
		}
	}

	if (typeof window !== 'undefined') {
		console.log('Setting up WebSocket connection in engineState store');
		ws = new WebSocket(`ws://${window.location.host}/web-socket`);
		ws.onopen = (event) => {
			console.log('WebSocket connection opened in engineState store', event);
		};
		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.type === 'state' && msg.data) {
				updatingFromWs = true;
				update(msg.data.engineState);
				updatingFromWs = false;
			}
		};
	}

	return {
		state,
		update,
	};
});
