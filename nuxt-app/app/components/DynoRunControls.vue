<template>
	<h2>Controls</h2>
	<div class="layout">
		<button :class="{ capturing: isRunning, item: true }" @click="toggleCapture">{{ buttonText }}</button>
		<DynoSwitch v-model:value="started" label="Engine Started" />
		<DynoSlider v-model:value="throttle" label="Throttle" />
		<DynoSwitch v-model:value="isFanOn" label="Fan" />
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const startText = 'Start Capture';
const stopText = 'Stop Capture';
const isRunning = ref(false);
const buttonText = computed(() => (isRunning.value ? stopText : startText));
const started = ref(false);
const throttle = ref(0);
const isFanOn = ref(false);

const engineState = useEngineStateStore();
const dynoState = useDynoStateStore();

// Sync started -> store
watch(started, (val) => {
	engineState.update({ ...engineState.state, started: val });
});

// Sync store -> started (for remote/server updates)
watch(
	() => engineState.state?.started,
	(val) => {
		if (typeof val === 'boolean' && val !== started.value) {
			started.value = val;
		}
	},
);

watch(throttle, (val) => {
	engineState.update({ ...engineState.state, throttlePosPerc: val });
});

watch(
	() => engineState.state?.throttlePosPerc,
	(val) => {
		if (typeof val === 'number' && val !== throttle.value) {
			throttle.value = val;
		}
	},
);

watch(isFanOn, (val) => {
	dynoState.update({ ...dynoState.state, isFanOn: val });
});

watch(
	() => dynoState.state?.isFanOn,
	(val) => {
		if (typeof val === 'boolean' && val !== isFanOn.value) {
			isFanOn.value = val;
		}
	},
);

const toggleCapture = () => {
	isRunning.value = !isRunning.value;
	console.log(isRunning.value ? 'Capture started' : 'Capture stopped');
};

watch(isRunning, (val) => {
	dynoState.update({ ...dynoState.state, isCapturing: val });
});

watch(
	() => dynoState.state?.isCapturing,
	(val) => {
		if (typeof val === 'boolean' && val !== isRunning.value) {
			isRunning.value = val;
		}
	},
);
</script>

<style scoped>
button {
	padding: 10px 20px;
	font-size: 32px;
	font-family: 'Vipnagorgialla', sans-serif;
	cursor: pointer;
	background-color: var(--primary-color);
	color: var(--text-color);
	border: none;
	border-radius: 5px;
}
.capturing {
	/* red */
	background-color: var(--error-color);
}
.layout {
	/*grid*/
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
	margin: 1rem;
}
:deep(.container) {
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
	background-color: #f0f0f0;
}
:deep(.container span) {
	color: var(--secondary-color);
}
:deep(.container label) {
	color: var(--secondary-color);
}
</style>
