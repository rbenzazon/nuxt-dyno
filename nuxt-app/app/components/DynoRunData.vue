<template>
	<h2>Engine data</h2>
	<div class="layout">
		<div class="item">
			<RpmRun :rpm="rpm" :max="maxRpm" />
		</div>
		<div class="item">
			<PowerRun :power="100" />
		</div>
		<div class="item">
			<AFRRun :afr="13.2" />
		</div>
		<div class="item-3fr">
			<DynoCurve :points="rpmPoints" :max-y="maxRpm" />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useCapturedFramesStore } from '~~/app/stores/captured-frames';
import { useDynoStateStore } from '~~/app/stores/dyno-state';

const dynoState = useDynoStateStore();
const capturedFramesStore = useCapturedFramesStore();
const engineState = useEngineStateStore();

const rpm = ref(0);

function formatRpmData(frames: CaptureFrame[]) {
	const rpmData = frames.map((frame) => {
		return { x: frame.timestamp, y: frame.engineState?.rpm || 0 };
	});
	return rpmData;
}

watch(
	() => engineState.state?.rpm,
	(val) => {
		if (typeof val === 'number') {
			rpm.value = val;
		}
	},
);

const maxRpm = computed(() => {
	return dynoState.state.engineMaxRpm || 6000;
});

const rpmPoints = computed(() => {
	const points = formatRpmData(capturedFramesStore.frames);
	return points;
});
</script>
<style scoped>
.layout {
	/*grid*/
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
	margin: 1rem;
}
.item {
	background-color: #f0f0f0;
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
}
.item-3fr {
	background-color: #f0f0f0;
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
	grid-column: span 3;
}
:deep(.item span) {
	color: var(--secondary-color);
}
</style>
