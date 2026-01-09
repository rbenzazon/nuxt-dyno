export default defineNitroPlugin((nitro) => {
	nitro.hooks.hook('error', (error) => {
		console.log('Nitro encountered an error:', error);
	});

	process.on('unhandledRejection', (reason: unknown) => {
		console.error('unhandledRejection event:', reason);
		if ((reason as NodeJS.ErrnoException)?.code === 'ECONNRESET') {
			console.warn('[ws] ECONNRESET handled:', reason);
			// Optionally suppress further logging or take action
		} else {
			console.error('Unhandled Rejection:', reason);
		}
	});

	process.on('uncaughtException', (err: unknown) => {
		console.error('uncaughtException event:', err);
		if ((err as NodeJS.ErrnoException).code === 'ECONNRESET') {
			console.warn('[ws] ECONNRESET handled:', err);
		} else {
			console.error('Uncaught Exception:', err);
		}
	});
	console.log('Server index initialized');
});
