<template>
    <span>{{ afr }}</span>
</template>

<script setup>
    //add afr prop
    defineProps({
        afr: {
            type: Number,
            required: false,
            default: 13.2
        }
    });
</script>

<style scoped>
span {
    font-weight: bold;
    color: #333;
}

</style>
