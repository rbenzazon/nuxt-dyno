import EngineState from '~~/server/engine-state';
import DynoState from '~~/server/dyno-state';
import { UPDATE_DYNO, UPDATE_ENGINE } from '~~/shared/app-state';
import { partialEqual } from '~~/shared/utils/equal';

let dirty = true;
const rps = 30;
const refreshRate = 1000 / rps;
const peers = new Set<any>();
const engineState = EngineState.getInstance();
const dynoState = DynoState.getInstance();

const webSocket = defineWebSocketHandler({
	open(peer) {
		peers.add(peer);
		console.log('[ws] open');
		peer.send(JSON.stringify({ type: 'state', data: { engineState, dynoState } }));
	},

	async message(peer, message) {
		try {
			const msg: any = await message.json();
			if (msg.type === UPDATE_ENGINE && msg.data && !partialEqual(msg.data, engineState)) {
				Object.assign(engineState, msg.data);
				dirty = true;
			} else if (msg.type === UPDATE_DYNO && msg.data && !partialEqual(msg.data, dynoState)) {
				Object.assign(dynoState, msg.data);
				dirty = true;
			}
		} catch (error) {
			console.error('Error processing message:', error);
		}
	},

	close(peer, event) {
		peers.delete(peer);
		console.log('[ws] close');
	},

	error(peer, error) {
		console.log('[ws] error');
	},
});
console.log('WebSocket handler initialized');
setInterval(() => {
	if (dirty) {
		peers.forEach((peer) => {
			peer.send(JSON.stringify({ type: 'state', data: { engineState, dynoState } }));
		});
		dirty = false;
	}
}, refreshRate);

export default webSocket;
