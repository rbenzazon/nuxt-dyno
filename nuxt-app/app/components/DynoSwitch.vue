<template>
	<div class="container">
		<label>{{ label }}</label>
		<label class="switch">
			<input v-model="isOn" type="checkbox" @change="emitChange" />
			<span class="slider" />
		</label>
	</div>
</template>
<script setup>
const props = defineProps({
	value: {
		type: Boolean,
		required: true,
	},
	label: {
		type: String,
		required: false,
		default: '',
	},
});

const emit = defineEmits(['update:value']);

const isOn = computed({
	get() {
		return props.value;
	},
	set(value) {
		emit('update:value', value);
	},
});

function emitChange() {
	emit('update:value', isOn.value);
}
</script>
<style scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
}
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}
.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.4s;
	border-radius: 34px;
}
.slider:before {
	position: absolute;
	content: '';
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	transition: 0.4s;
	border-radius: 50%;
}
input:checked + .slider {
	background-color: #2196f3;
}
input:checked + .slider:before {
	transform: translateX(26px);
}
label {
	font-family: 'Vipnagorgialla', sans-serif;
	font-size: 20px;
	margin-right: 10px;
}
</style>
