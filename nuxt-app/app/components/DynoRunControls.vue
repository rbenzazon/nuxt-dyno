<template>
    <button @click="toggleCapture" :class="{ capturing: isRunning }">{{ buttonText }}</button>

</template>

<script setup>
    const startText = "Start Capture";
    const stopText = "Stop Capture";
    const isRunning = ref(false);
    const buttonText = computed(() => isRunning.value ? stopText : startText);


    const toggleCapture = () => {
        isRunning.value = !isRunning.value;
        console.log(isRunning.value ? "Capture started" : "Capture stopped");
    };
</script>

<style scoped>
button {
    padding: 10px 20px;
    font-size: 32px;
    font-family: "Vipnagorgialla", sans-serif;
    cursor: pointer;
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    border-radius: 5px;
}
.capturing {
    /* red */
    background-color: var(--error-color);
}
</style>
