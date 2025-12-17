<template>
	<div>
		<span>Power:</span>
		<span>{{ power }} {{ unit }}</span>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		power: number;
		unit?: string;
	}>(),
	{
		unit: 'hp',
	},
);
</script>

<style scoped>
div {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
}
span {
	font-weight: bold;
	font-size: 20px;
}
span:not(:first-child) {
	font-size: 40px;
}
</style>
