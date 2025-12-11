<template>
  <header>
    <h1>Nuxt Dyno</h1>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/run">Run</NuxtLink>
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
nav a {
  color: var(--secondary-color);
  margin-right: 1rem;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
}
</style>
