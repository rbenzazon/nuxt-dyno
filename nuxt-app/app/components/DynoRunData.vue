<template>
	<div class="run-data-layout">
		<div class="run-item">
			<RpmRun :rpm="3500" />
		</div>
		<div class="run-item">
			<PowerRun :power="100" />
		</div>
		<div class="run-item">
			<AFRRun :afr="13.2" />
		</div>
	</div>
</template>
<style scoped>
.run-data-layout {
	/*grid*/
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
	margin: 1rem;
}
.run-item {
	background-color: #f0f0f0;
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
}
</style>
