<template>
	<main>
		<h1>Dyno run</h1>
		<DynoRunData />
		<DynoRunControls />
		{{ dynoStateStore.state }}
	</main>
</template>
<script setup>
const dynoStateStore = useDynoStateStore();
console.log('DynoRun.vue dynoStateStore:', dynoStateStore.state);
</script>

<style scoped>
h1 {
	text-align: center;
	font-size: 2rem;
}
main {
	padding: 1rem;
}
</style>
