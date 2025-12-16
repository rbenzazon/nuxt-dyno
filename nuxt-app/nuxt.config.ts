// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@pinia/nuxt', '@nuxt/eslint'],

	imports: {
		dirs: ['~/stores'],
	},
	compatibilityDate: '2025-07-15',
	devtools: {
		enabled: true,
		timeline: {
			enabled: true,
		},
	},
	css: ['~/assets/main.css'],
	nitro: {
		experimental: {
			websocket: true,
		},
	},
	/*debug: true,*/
});
