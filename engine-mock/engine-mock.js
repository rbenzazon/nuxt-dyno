// engine-mock.js
// Express app that simulates an engine and interacts with ws://localhost:3000/web-socket

const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 4000; // Engine mock HTTP port (not used for ws)

// Engine state
let started = false;
let throttlePosPerc = 0;
let rpm = 0;
let ws;

// Connect to the Nuxt app's WebSocket
function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3000/web-socket');

  ws.on('open', () => {
    console.log('Connected to Nuxt WebSocket');
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'state' && msg.data) {
        const engineState = msg.data.engineState;
        if (typeof engineState.started === 'boolean') started = engineState.started;
        if (typeof engineState.throttlePosPerc === 'number') throttlePosPerc = engineState.throttlePosPerc;
      }
    } catch (e) {
      console.error('Error parsing ws message:', e);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed, reconnecting in 1s...');
    setTimeout(connectWebSocket, 1000);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}

connectWebSocket();

// Engine simulation loop
setInterval(() => {
  // Simple simulation: if started, rpm increases with throttle, else drops to 0
  if (started) {
    // Target rpm is 1000 + throttlePosPerc * 14 (max 15,000)
    const targetRpm = 1000 + throttlePosPerc * 140;
    // Smoothly approach target rpm
    rpm += (targetRpm - rpm) * 0.1;
  } else {
    rpm += (0 - rpm) * 0.2;
  }
  rpm = Math.max(0, Math.min(15000, rpm));
  //console.log(`Engine state - Started: ${started}, Throttle: ${throttlePosPerc}%, RPM: ${Math.round(rpm)}`);
  // Send update to Nuxt app
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'update-engine', data: { rpm: Math.round(rpm) } }));
  }
}, 100);

// Optionally, expose a simple HTTP endpoint for health/debug
app.get('/', (req, res) => {
  res.json({ started, throttlePosPerc, rpm: Math.round(rpm) });
});

app.listen(PORT, () => {
  console.log(`Engine mock listening on http://localhost:${PORT}`);
});
