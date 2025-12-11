<template>
    <span>{{ power }} {{ unit }}</span>
</template>

<script setup>
    defineProps({
        power: {
            type: Number,
            required: true,
            default: 100
        },
        unit: {
            type: String,
            required: false,
            default: 'hp'
        }
    });
</script>

<style scoped>
span {
    font-weight: bold;
    color: #333;
}
</style>
