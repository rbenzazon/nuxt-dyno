<template>
	<div class="container">
		<label>{{ label }}</label>
		<input v-model="localValue" type="range" :min="min" :max="max" :step="step" @input="onInput" />
		<span>{{ value }}</span>
	</div>
</template>
<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
	}>(),
	{
		min: 0,
		max: 100,
		step: 1,
		label: '',
	},
);

const emit = defineEmits(['update:value']);

const localValue = computed({
	get() {
		return Number(props.value);
	},
	set(value) {
		emit('update:value', Number(value));
	},
});

function onInput(event: Event) {
	const newValue = Number((event.target as HTMLInputElement).value);
	localValue.value = newValue;
}
</script>
<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
.container input[type='range'] {
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
</style>
