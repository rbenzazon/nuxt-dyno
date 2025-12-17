<template>
	<div>
		<span>AFR:</span>
		<span>{{ afr }}</span>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		afr?: number;
	}>(),
	{
		afr: 14.7,
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
	color: #333;
}
span:not(:first-child) {
	font-size: 40px;
}
</style>
