import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDynoStateStore = defineStore('dynoState', () => {
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
			ws.send(JSON.stringify({ type: 'update', data: newValue }));
		}
	}

	if (typeof window !== 'undefined') {
		console.log('Setting up WebSocket connection in dynoState store');
		ws = new WebSocket(`ws://${window.location.host}/web-socket`);
		ws.onopen = (event) => {
			console.log('WebSocket connection opened in dynoState store', event);
		};
		ws.onmessage = (event) => {
			console.log('WebSocket message received in dynoState store:', event);
			const msg = JSON.parse(event.data);
			if (msg.type === 'state' && msg.data) {
				updatingFromWs = true;
				update(msg.data);
				updatingFromWs = false;
			}
		};
		/*if(state.value === null ){
            // Initial fetch
            update
        }*/
	}

	return {
		state,
		update,
	};
});
