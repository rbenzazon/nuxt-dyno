// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		// pinia plugin
		'@pinia/nuxt',
	],

	imports: {
		dirs: ['~/stores'],
	},
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: ['~/assets/global.css'],
	nitro: {
		experimental: {
			websocket: true,
		},
	},
});
