# Engine Mock

A mock engine for testing and development purposes. It simulates basic engine functionalities and provides a simple WebSocket interface for interaction.

---

## Features

- **Start and stop the engine**
- **Adjust throttle**
- **Set RPM based on throttle position**

---

## Communication

The engine mock uses **WebSockets** to communicate with clients. It listens for commands and sends back engine status updates. The WebSocket server is hosted by the nuxt-app.
adress: `ws://localhost:3000/web-socket`

### Commands

Commands are sent using the `state` message type. The following properties are supported:

| Properties                   | Type    | Values     | Description                                   |
|------------------------------|---------|------------|-----------------------------------------------|
| `engineState.started`        | boolean | true,false | Starts the engine if `true`, stops if `false` |
| `engineState.throttlePosPerc`| number  | 0-100      | Sets the throttle position                    |

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

### Updates

Updates are sent using the `update-engine` message type. The engine mock sends the following updates:

| Update              | Type    | Description                |
|---------------------|---------|----------------------------|
| `engineState.rpm`   | number  | Current RPM of the engine  |

**Example update message:**
```javascript
{
  type: "update-engine",
  engineState: {
    rpm: 3500
  }
}
```