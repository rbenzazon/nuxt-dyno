<template>
	<div>
		<span>AFR:</span>
		<span>{{ afr }}</span>
	</div>
</template>

<script setup>
//add afr prop
defineProps({
	afr: {
		type: Number,
		required: false,
		default: 13.2,
	},
});
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
