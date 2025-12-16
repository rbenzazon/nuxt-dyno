const listeners: ((payload: any) => void)[] = [];
let ws: WebSocket | null = null;
let currentStateCache: any = null;

export function addMessageListener(listener: (payload: any) => void) {
	listeners.push(listener);
	if (currentStateCache) {
		listener(currentStateCache);
	}
}
export function sendMessage(message: any) {
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
			if (msg.type === 'state') {
				currentStateCache = msg;
			}
			listeners.forEach((listener) => {
				listener(msg);
			});
		}
	};
}
