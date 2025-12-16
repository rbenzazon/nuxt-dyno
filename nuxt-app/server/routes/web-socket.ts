import EngineState from '~~/shared/engine-state';
import DynoState from '~~/shared/dyno-state';
import { UPDATE_DYNO, UPDATE_ENGINE } from '~~/shared/app-state';
import { partialEqual } from '~~/shared/utils/equal';
import { CaptureFrame } from '~~/shared/types/capture-frame';
import { capturedFrames } from '~~/server/captured-frames';

let dirty = true;
const rps = 30;
const refreshRate = 1000 / rps;
const peers = new Set<any>();
const engineState = EngineState.getInstance();
const dynoState = DynoState.getInstance();

const lastFrames: Array<CaptureFrame> = [];

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
				if (dynoState.isCapturing) {
					const frame = {
						timestamp: Date.now(),
						engineState: { ...engineState },
					};
					capturedFrames.push(frame);
					lastFrames.push(frame);
				}
				dirty = true;
			} else if (msg.type === UPDATE_DYNO && msg.data && !partialEqual(msg.data, dynoState)) {
				// Clear captured frames when starting a new capture session
				if (msg.data.isCapturing === true && dynoState.isCapturing === false) {
					capturedFrames.length = 0;
					sendPeers({ type: 'clearFrames' });
				}
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
setInterval(() => {
	if (dirty) {
		sendPeers({ type: 'state', data: { engineState, dynoState } });
		dirty = false;
	}
	if (lastFrames.length > 0) {
		sendPeers({ type: 'frame', data: lastFrames });
		lastFrames.length = 0;
	}
}, refreshRate);

function sendPeers(message: any) {
	peers.forEach((peer) => {
		peer.send(JSON.stringify(message));
	});
}

export default webSocket;
