<template>
	<span class="container">
		<span>Server : {{ serverFPS }}</span>
		<span>Engine : {{ clientEngineFPS }}</span>
		<span>Dyno : {{ clientDynoFPS }}</span>
	</span>
</template>

<script setup lang="ts">
import { useEngineStateStore } from '~~/app/stores/engine-state';
import { useDynoStateStore } from '~~/app/stores/dyno-state';

const engineState = useEngineStateStore();
const dynoState = useDynoStateStore();

const serverFPS = ref('0');
const clientEngineFPS = ref('0');
const clientDynoFPS = ref('0');

const serverRefreshRateLastValues = ref([0, 0, 0, 0, 0, 0]);
const clientEngineRefreshRateLastValues = ref([0, 0, 0, 0, 0, 0]);
const clientDynoRefreshRateLastValues = ref([0, 0, 0, 0, 0, 0]);

watch(
	() => engineState.clientRefreshRate,
	(val) => {
		clientEngineRefreshRateLastValues.value.shift();
		clientEngineRefreshRateLastValues.value.push(val);
		const avg =
			clientEngineRefreshRateLastValues.value.reduce((a, b) => a + b, 0) /
			clientEngineRefreshRateLastValues.value.length;
		clientEngineFPS.value = String(Math.round(1000 / Math.max(Math.round(avg), 1))).padStart(3, '0');
	},
);
watch(
	() => dynoState.clientRefreshRate,
	(val) => {
		clientDynoRefreshRateLastValues.value.shift();
		clientDynoRefreshRateLastValues.value.push(val);
		const avg =
			clientDynoRefreshRateLastValues.value.reduce((a, b) => a + b, 0) / clientDynoRefreshRateLastValues.value.length;

		clientDynoFPS.value = String(Math.round(1000 / Math.max(Math.round(avg), 1))).padStart(3, '0');
	},
);
watch(
	() => engineState.serverRefreshRate,
	(val) => {
		serverRefreshRateLastValues.value.shift();
		serverRefreshRateLastValues.value.push(val);
		const avg = serverRefreshRateLastValues.value.reduce((a, b) => a + b, 0) / serverRefreshRateLastValues.value.length;
		serverFPS.value = String(Math.round(1000 / Math.max(Math.round(avg), 1))).padStart(3, '0');
	},
);
</script>
<style scoped>
/* put the container to the right of the nav but keep it in the same row */
.container {
	margin-left: auto;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
	font-family: 'Consolas', 'Courier New', monospace;
}
.container > * {
	margin: 2px 0 2px 10px;
}
</style>
