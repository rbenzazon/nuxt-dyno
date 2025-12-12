<template>
	<div>
		<span>Power:</span>
		<span>{{ power }} {{ unit }}</span>
	</div>
</template>

<script setup>
defineProps({
	power: {
		type: Number,
		required: true,
		default: 100,
	},
	unit: {
		type: String,
		required: false,
		default: 'hp',
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
