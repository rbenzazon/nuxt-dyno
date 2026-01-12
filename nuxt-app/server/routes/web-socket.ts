import EngineState from '~~/shared/engine-state';
import DynoState from '~~/shared/dyno-state';
import { CLEAR_FRAMES, FRAME, STATE, UPDATE_DYNO, UPDATE_ENGINE } from '~~/shared/app-state';
import { partialEqual } from '~~/shared/utils/equal';
import type { CaptureFrame } from '~~/shared/types/capture-frame';
import type { MessagePayload, UpdateMessage } from '~~/shared/types/message';
import { capturedFrames } from '~~/server/captured-frames';
import type { AdapterInternal, Peer } from 'crossws';

let dirty = true;
const rps = 60;
const refreshRate = 1000 / rps;
const peers = new Set<Peer<AdapterInternal>>();
const engineState = EngineState.getInstance();
const dynoState = DynoState.getInstance();

const lastFrames: Array<CaptureFrame> = [];

let lastUpdateMsgTimeStamp: number = Date.now();
let updateMsgTime: number = 0;
let lastFrameMsgTimeStamp: number = Date.now();
let frameMsgTime: number = 0;

const webSocket = defineWebSocketHandler({
	open(peer) {
		peers.add(peer);
		console.log('[ws] open');
		peer.send(JSON.stringify({ type: STATE, refreshTime: updateMsgTime, data: { engineState, dynoState } }));
	},

	async message(peer, message) {
		try {
			const msg: UpdateMessage = await message.json();
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
					sendPeers({ type: CLEAR_FRAMES });
				}
				Object.assign(dynoState, msg.data);
				dirty = true;
			}
		} catch (error) {
			console.error('Error processing message:', error);
		}
	},

	close(peer) {
		peers.delete(peer);
		console.log('[ws] close');
	},

	error(_, error) {
		console.log('[ws] error', error);
	},
});
setInterval(() => {
	if (dirty) {
		updateMsgTime = Math.min(Date.now() - lastUpdateMsgTimeStamp, 100);
		sendPeers({ type: STATE, refreshTime: updateMsgTime, data: { engineState, dynoState } });
		lastUpdateMsgTimeStamp = Date.now();
		dirty = false;
	}
	if (lastFrames.length > 0) {
		frameMsgTime = Math.min(Date.now() - lastFrameMsgTimeStamp, 100);
		sendPeers({ type: FRAME, refreshTime: frameMsgTime, data: lastFrames });
		lastFrameMsgTimeStamp = Date.now();
		lastFrames.length = 0;
	}
}, refreshRate);

function sendPeers(message: MessagePayload) {
	peers.forEach((peer) => {
		peer.send(JSON.stringify(message));
	});
}

export default webSocket;
