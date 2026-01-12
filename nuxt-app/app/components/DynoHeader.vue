<script setup lang="ts">
import FPSMonitor from './FPSMonitor.vue';
</script>

<template>
	<header>
		<h1>Nuxt Dyno</h1>
		<nav>
			<NuxtLink to="/">Home</NuxtLink>
			<NuxtLink to="/run">Run</NuxtLink>
			<FPSMonitor />
		</nav>
	</header>
</template>

<style scoped>
/*
use only variables for colors
*/
header {
	background-color: var(--bg-color);
	color: var(--primary-color);
	padding: 1rem;
}
h1 {
	font-size: 1.5rem;
	margin: 0;
}
nav {
	display: flex;
	flex-direction: row;
}
:deep(nav > *) {
	color: var(--secondary-color);
	margin-right: 1rem;
	font-size: 16px;
	text-decoration: none;
}
nav > *:hover {
	text-decoration: underline;
}
</style>
