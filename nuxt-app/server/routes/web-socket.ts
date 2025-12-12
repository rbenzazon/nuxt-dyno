import DynoState from "~~/server/dyno-state";

let dirty = true;
const rps = 30;
const refreshRate = 1000/rps;
const peers = new Set<any>();
const dynoState = DynoState.getInstance();

const webSocket = defineWebSocketHandler({
  open(peer) {
    peers.add(peer);
    console.log("[ws] open", peer);
    peer.send(JSON.stringify({ type: 'state', data: dynoState }));
  },

  async message(peer, message) {
    console.log("[ws] message", peer, message);
    try {
      const msg:any = await message.json();
      if (msg.type === 'update' && msg.data) {
        Object.assign(dynoState, msg.data);
        dirty = true;
      }
    } catch (error) {
      console.error('Error processing message:', error)
    }
  },

  close(peer, event) {
    peers.delete(peer);
    console.log("[ws] close", peer, event);
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
console.log("WebSocket handler initialized");
setInterval(() => {
  if (dirty) {
    console.log("broadcasting updated dynoState to peers",peers.size);
    const dynoState = DynoState.getInstance();
    peers.forEach((peer) => {
      peer.send(JSON.stringify({ type: 'state', data: dynoState }));
    });
    dirty = false;
  }
}, refreshRate);


export default webSocket;

