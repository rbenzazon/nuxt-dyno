// Express app that simulates an engine and interacts with ws://localhost:3000/web-socket
import express from 'express';
import WebSocket from 'ws';
import { torqueAt } from './torque-curve.mjs';

const app = express();
const PORT = 4000; // Engine mock HTTP port (not used for ws)

import { profiles } from './engine-profile.mjs';
const currentProfile = profiles['small-block-350-v1'];
const maxRpm = currentProfile.rpm[currentProfile.rpm.length - 1];
// Engine state
let started = false;
let throttlePosPerc = 0;
let rpm = 0;
let ws;
let dynoLoadLbFt = 0;

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
				const dynoState = msg.data.dynoState;
				if (typeof engineState.started === 'boolean') started = engineState.started;
				if (typeof engineState.throttlePosPerc === 'number') throttlePosPerc = engineState.throttlePosPerc;
				if (typeof dynoState.loadlbft === 'number') dynoLoadLbFt = dynoState.loadlbft;
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
	let torqueFigures;
	let engineTorque = 0;
	let powerHp = 0;
	// Engine simulation: if started, calculate torque and integrate dyno load
	if (started) {
		// Clamp rpm to non-negative before using in torqueAt
		rpm = Math.max(100, rpm);
		// Interpolate dyno load: dynoLoadLbFt is the load at 10000 rpm
		const dynoLoad = dynoLoadLbFt * (rpm / maxRpm);
		// Get engine torque at current throttle and rpm
		try {
			torqueFigures = torqueAt(currentProfile, throttlePosPerc, rpm);
		} catch (e) {
			console.error('Error calculating torque:', e);
			return;
		}
		engineTorque = torqueFigures.torque;
		// Calculate net torque after dyno load (simple subtraction)
		const netTorque = engineTorque - dynoLoad;
		// Convert net torque to angular acceleration (alpha = torque / inertia)
		// For simplicity, assume inertia = 1, so alpha = netTorque
		// Update rpm: rpm += alpha * k (k is a scaling factor for realism)
		const k = 0.2; // scaling factor for effect
		rpm += netTorque * k;
		// Add a small friction/drag term to prevent runaway rpm
		rpm -= rpm * 0.005;
		/*console.log(
			`Engine running - Throttle: ${throttlePosPerc}%, RPM: ${Math.round(rpm)}`,
			`Torque: ${engineTorque?.toFixed(1)} lb-ft, DynoLoad: ${dynoLoad.toFixed(1)} lb-ft`,
		);*/
	} else {
		rpm += (0 - rpm) * 0.05;
	}
	// Clamp rpm to [0, maxRpm] after update
	rpm = Math.max(0, Math.min(maxRpm, rpm));
	//console.log(`Engine state - Started: ${started}, Throttle: ${throttlePosPerc}%, RPM: ${Math.round(rpm)}, Torque: ${engineTorque?.toFixed(1)}, DynoLoad: ${dynoLoadLbFt}`);
	// Calculate power (HP) and torque (lb-ft)
	const torqueFtLbs = engineTorque; // already in lb-ft
	// Power (HP) = (Torque (lb-ft) * RPM) / 5252
	powerHp = (torqueFtLbs * rpm) / 5252;
	// Send update to Nuxt app
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(
			JSON.stringify({
				type: 'update-engine',
				data: {
					rpm: Math.round(rpm),
					torqueFtLbs: Number(torqueFtLbs.toFixed(2)),
					powerHp: Number(powerHp.toFixed(2)),
					afr: Number(torqueFigures?.afr?.toFixed(1)) || null,
				},
			}),
		);
	}
}, 30); // per second

// Optionally, expose a simple HTTP endpoint for health/debug
app.get('/', (req, res) => {
	res.json({ started, throttlePosPerc, rpm: Math.round(rpm) });
});

app.listen(PORT, () => {
	console.log(`Engine mock listening on http://localhost:${PORT}`);
});

function cleanup(signal) {
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.close();
		console.log('WebSocket connection closed gracefully.', signal);
	}
	process.exit(0);
}

process.on('SIGINT', () => cleanup('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => cleanup('SIGTERM')); // Termination signal
process.on('exit', () => cleanup('exit')); // Process exit
