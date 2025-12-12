<template>
	<button @click="toggleCapture" :class="{ capturing: isRunning }">{{ buttonText }}</button>
	<DynoSwitch v-model:value="started" label="Engine Started" />
	<DynoSlider v-model:value="throttle" label="Throttle" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const startText = 'Start Capture';
const stopText = 'Stop Capture';
const isRunning = ref(false);
const buttonText = computed(() => (isRunning.value ? stopText : startText));
const started = ref(false);
const throttle = ref(0);

const dynoState = useDynoStateStore();

// Sync started -> store
watch(started, (val) => {
	dynoState.update({ ...dynoState.state, started: val });
});

// Sync store -> started (for remote/server updates)
watch(
	() => dynoState.state?.started,
	(val) => {
		if (typeof val === 'boolean' && val !== started.value) {
			started.value = val;
		}
	},
);

watch(throttle, (val) => {
	dynoState.update({ ...dynoState.state, throttlePosPerc: val });
});

watch(
	() => dynoState.state?.throttlePosPerc,
	(val) => {
		if (typeof val === 'number' && val !== throttle.value) {
			throttle.value = val;
		}
	},
);

const toggleCapture = () => {
	isRunning.value = !isRunning.value;
	console.log(isRunning.value ? 'Capture started' : 'Capture stopped');
};
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
</style>
