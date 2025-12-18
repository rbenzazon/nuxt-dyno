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
			<h3 @click="toggleCollapse">RPM Curve</h3>
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

function toggleCollapse(event: Event) {
	console.log('toggle');

	const h3 = event.currentTarget as HTMLElement;
	h3.classList.toggle('collapsed');
	h3.parentElement?.classList.toggle('collapsed');
}
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
	color: var(--secondary-color);
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
	grid-column: span 3;
}
.layout > *.collapsed > :nth-child(2) {
	display: none;
}
:deep(.item span) {
	color: var(--secondary-color);
}
h3 {
	text-align: left;
	cursor: pointer;
}
/* collapse arrow on the right of h3 */
h3::after {
	content: '';
	float: right;
	border: solid var(--secondary-color);
	border-width: 0 2px 2px 0;
	display: inline-block;
	padding: 4px;
	transform: rotate(-135deg);
	margin-top: 6px;
}
h3.collapsed::after {
	transform: rotate(45deg);
}
</style>
