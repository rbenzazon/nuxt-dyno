import { STATE } from '~~/shared/app-state';
import type { MessagePayload, StateMessage, UpdateMessage } from '~~/shared/types/message';

/**
 * WebSocket client for communicating with the server.
 * Allows adding message listeners and sending update messages.
 * Caches the latest state message to provide to new listeners.
 * Establishes a WebSocket connection to the server on module load.
 * Serves as the unique WebSocket client instance for the application.
 * @module websocket-client
 */

const listeners: ((payload: MessagePayload) => void)[] = [];
let ws: WebSocket | null = null;
let currentStateCache: StateMessage | null = null;

export function addMessageListener(listener: (payload: MessagePayload) => void) {
	listeners.push(listener);
	if (currentStateCache) {
		listener(currentStateCache);
	}
}
export function sendMessage(message: UpdateMessage) {
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}

if (typeof window !== 'undefined') {
	ws = new WebSocket(`ws://${window.location.host}/web-socket`);
	ws.onopen = (event) => {
		console.log('WebSocket connection opened', event);
	};

	ws.onmessage = (event) => {
		const msg = JSON.parse(event.data);
		if (msg.type) {
			if (msg.type === STATE) {
				currentStateCache = msg;
			}
			listeners.forEach((listener) => {
				listener(msg);
			});
		}
	};
}
