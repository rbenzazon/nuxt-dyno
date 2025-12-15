# NUXT-DYNO
Experiment with a simple dyno control and data app using Nuxt 4, Pinia, and WebSockets.
## Setup
1. Clone the repository
```bash
git clone https://github.com/rbenzazon/nuxt-dyno.git
```
2. Install Nuxt app dependencies
```bash
cd nuxt-dyno/nuxt-app
pnpm install
```
3. Install engine simulation server dependencies
```bash
cd ../engine-mock
pnpm install
```
(for stackblitz users, run `npm install` instead of `pnpm install` since pnpm install fails)
## Running the Application
1. Start the Nuxt application
```bash
cd nuxt-app
pnpm dev
```
2. Start the engine simulation server:
on a new terminal window, run
```bash
cd engine-mock
pnpm start
```
3. Open your browser and navigate to `http://localhost:3000` to access the Nuxt Dyno application.
## Features
- Real-time engine data display (RPM, Throttle).
- Controls to start/stop the engine, adjust throttle, and toggle the fan.
- WebSocket communication for real-time updates.
## Technologies Used
- Nuxt 4
- Pinia for state management
- WebSockets for real-time communication
- TypeScript
- Express (for the engine simulation server)


