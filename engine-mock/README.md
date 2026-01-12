# Engine Mock

A mock engine for testing and development purposes. It simulates basic engine functionalities and provides a simple WebSocket interface for interaction.

## Usage

This app uses nodemon to reload on code changes.
To run the engine mock, use the following command:

```bash
pnpm run dev
```

---

## Features

- **Start and stop the engine**
- **Adjust throttle**
- **Calculate torque and power, see this [Observable Notebook](https://observablehq.com/d/b9e2604bfb070048)**
- **Uses engine profile containing a 2d torque map (RPM vs Throttle Position) and a 2d AFR (Air-Fuel Ratio) map**
- **Uses bilinear interpolation for torque and AFR values**
- **Set RPM based on torque and dyno brake load**

---

## Communication

The engine mock uses **WebSockets** to communicate with clients. It listens for commands and sends back engine status updates. The WebSocket server is hosted by the nuxt-app.
adress: `ws://localhost:3000/web-socket`

### Commands

Commands are sent using the `state` message type. The following properties are supported:

| Properties                    | Type    | Values     | Description                                   |
| ----------------------------- | ------- | ---------- | --------------------------------------------- |
| `engineState.started`         | boolean | true,false | Starts the engine if `true`, stops if `false` |
| `engineState.throttlePosPerc` | number  | 0-100      | Sets the throttle position                    |

**Example command message:**

```javascript
{
  type: "state",
  engineState: {
    started: true,
    throttlePosPerc: 50
  }
}
```

> [!NOTE] the websocket servers and clients support partial updates, so you can send only the properties you want to change.

### Updates

Updates are sent using the `update-engine` message type. The engine mock sends the following updates:

| Update                    | Type   | Description               |
| ------------------------- | ------ | ------------------------- |
| `engineState.rpm`         | number | Current RPM of the engine |
| `engineState.torqueFtLbs` | number | Current torque in Ft-Lbs  |
| `engineState.powerHp`     | number | Current power in HP       |

**Example update message:**

```javascript
{
  type: "update-engine",
  engineState: {
    rpm: 3500,
    torqueFtLbs: 400,
    powerHp: 200
  }
}
```
