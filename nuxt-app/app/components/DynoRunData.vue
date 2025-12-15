<template>
	<h2>Engine data</h2>
	<div class="layout">
		<div class="item">
			<RpmRun :rpm="rpm" />
		</div>
		<div class="item">
			<PowerRun :power="100" />
		</div>
		<div class="item">
			<AFRRun :afr="13.2" />
		</div>
	</div>
</template>
<script setup>
import { ref, watch } from 'vue';

const rpm = ref(0);

const engineState = useEngineStateStore();

watch(
	() => engineState.state?.rpm,
	(val) => {
		if (typeof val === 'number') {
			rpm.value = val;
		}
	},
);
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
:deep(.item span) {
	color: var(--secondary-color);
}
</style>
