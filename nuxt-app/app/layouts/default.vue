<template>
	<div class="layout-default">
		<Header />
		<slot />
		<Footer />
	</div>
</template>

<style scoped>
.layout-default {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

/* Target header element inside the Header child component */
:deep(header) {
	padding: 1rem;
}

/* Target footer element inside the Footer child component */
:deep(footer) {
	padding: 1rem;
	margin-top: auto;
}
</style>
