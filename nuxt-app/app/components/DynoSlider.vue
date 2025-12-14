<template>
	<div class="dyno-slider">
		<label>{{ label }}</label>
		<input v-model="localValue" type="range" :min="min" :max="max" :step="step" @input="onInput" />
		<span>{{ value }}</span>
	</div>
</template>
<script setup>
const props = defineProps({
	value: {
		type: Number,
		required: true,
	},
	min: {
		type: Number,
		required: false,
		default: 0,
	},
	max: {
		type: Number,
		required: false,
		default: 100,
	},
	step: {
		type: Number,
		required: false,
		default: 1,
	},
	label: {
		type: String,
		required: false,
		default: '',
	},
});

const emit = defineEmits(['update:value']);

const localValue = computed({
	get() {
		return props.value;
	},
	set(value) {
		emit('update:value', value);
	},
});

function onInput(event) {
	const newValue = Number(event.target.value);
	localValue.value = newValue;
}
</script>
<style scoped>
.dyno-slider {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
.dyno-slider input[type='range'] {
	width: 80%;
	margin: 10px 0;
}
span {
	font-size: 1.2em;
	font-weight: bold;
}
label {
	font-size: 1em;
	margin-bottom: 5px;
}
span {
	color: var(--text-color);
}
</style>
