export default defineNitroPlugin((nitro) => {

  nitro.hooks.hook('error', (error) => {
    console.log('Nitro encountered an error:', error);
  });
  

  process.on('unhandledRejection', (reason: any) => {
    console.error('unhandledRejection event:', reason);
    if (reason && reason.code === 'ECONNRESET') {
      console.warn('[ws] ECONNRESET handled:', reason);
      // Optionally suppress further logging or take action
    } else {
      console.error('Unhandled Rejection:', reason);
    }
  });

  process.on('uncaughtException', (err: any) => {
    console.error('uncaughtException event:', err);
    if (err.code === 'ECONNRESET') {
      console.warn('[ws] ECONNRESET handled:', err);
    } else {
      console.error('Uncaught Exception:', err);
    }
  });
  console.log('Server index initialized');
});