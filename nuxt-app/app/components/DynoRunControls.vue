<template>
	<h2>Controls</h2>
	<div class="layout">
		<button :class="{ capturing: isRunning, item: true }" @click="toggleCapture">{{ buttonText }}</button>
		<DynoSwitch v-model:value="started" label="Engine Started" />
		<DynoSlider v-model:value="throttle" label="Throttle" />
		<DynoSwitch v-model:value="isFanOn" label="Fan" />
		<DynoSlider v-model:value="load" :max="maxLoadlbft" label="Load lb-ft" />
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { maxLoadlbft } from '~~/shared/dyno';


const startText = 'Start Capture';
const stopText = 'Stop Capture';
const isRunning = ref(false);
const buttonText = computed(() => (isRunning.value ? stopText : startText));
const started = ref(false);
const throttle = ref(0);
const isFanOn = ref(false);
const load = ref(0);

const engineState = useEngineStateStore();
const dynoState = useDynoStateStore();

const debounceMap = new Map();

function debounceLocalUpdate(store,localRef,val) {
	if(debounceMap.has(store)){
		clearTimeout(debounceMap.get(store));
	}else{
		const timeoutId = setTimeout(() => {
			if (val !== undefined && val !== localRef.value) {
				localRef.value = val;
			}
			debounceMap.delete(store);
		}, 100);
		debounceMap.set(store, timeoutId);
	}
}

function syncRefWithStore(localRef, store, storeKey) {
  // Local -> Store
  watch(localRef, (val) => {
    store.update({ [storeKey]: val });
  });
  // Store -> Local
  watch(
    () => store.state?.[storeKey],
    (val) => {
      debounceLocalUpdate(store, localRef, val);
    }
  );
}

const toggleCapture = () => {
	isRunning.value = !isRunning.value;
	console.log(isRunning.value ? 'Capture started' : 'Capture stopped');
};

syncRefWithStore(started, engineState, 'started');
syncRefWithStore(throttle, engineState, 'throttlePosPerc');
syncRefWithStore(isFanOn, dynoState, 'isFanOn');
syncRefWithStore(isRunning, dynoState, 'isCapturing');
syncRefWithStore(load, dynoState, 'loadlbft');

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
