# EventEmitter

A TypeScript implementation of EventEmitter based on Node.js EventEmitter interface. This is a class-based implementation that provides a robust event handling system.

## Features

- **Event-driven architecture**: Subscribe to and emit custom events
- **Multiple listeners**: Support for multiple listeners per event
- **One-time listeners**: `once()` method for listeners that auto-remove after first emission
- **Context binding**: Custom context support for listener functions
- **Efficient argument handling**: Optimized for common argument counts
- **TypeScript support**: Full type definitions included
- **Node.js compatibility**: Follows Node.js EventEmitter API

## Installation

```bash
npm install
```

## Usage

### Basic Example

```typescript
import { EventEmitter } from "./src";

const emitter = new EventEmitter();

// Add event listeners
emitter.on("message", (msg: string) => {
  console.log("Received:", msg);
});

emitter.on("data", (data: any) => {
  console.log("Data:", data);
});

// Emit events
emitter.emit("message", "Hello World!");
emitter.emit("data", { id: 1, name: "John" });
```

### One-time Listeners

```typescript
// This listener will only fire once
emitter.once("welcome", (name: string) => {
  console.log(`Welcome ${name}!`);
});

emitter.emit("welcome", "Alice"); // Fires
emitter.emit("welcome", "Bob"); // Won't fire
```

### Custom Context

```typescript
const context = { name: "CustomContext" };

emitter.on(
  "event",
  function (this: any, data: string) {
    console.log(`Context: ${this.name}, Data: ${data}`);
  },
  context
);

emitter.emit("event", "test data");
```

### Remove Listeners

```typescript
const handler = (data: string) => console.log(data);

emitter.on("test", handler);
emitter.emit("test", "Hello"); // Fires

emitter.removeListener("test", handler);
emitter.emit("test", "World"); // Won't fire
```

### Remove All Listeners

```typescript
// Remove all listeners for a specific event
emitter.removeAllListeners("eventName");

// Remove all listeners for all events
emitter.removeAllListeners();
```

### Event Information

```typescript
// Get all event names
const events = emitter.eventNames();

// Get listener count for an event
const count = emitter.listenerCount("eventName");

// Get all listeners for an event
const listeners = emitter.listeners("eventName");
```

## API Reference

### Constructor

```typescript
new EventEmitter();
```

Creates a new EventEmitter instance.

### Methods

#### `on(event, listener, context?)`

- `event`: Event name (string or symbol)
- `listener`: Function to be called when event is emitted
- `context`: Optional context for the listener function

#### `once(event, listener, context?)`

Same as `on()`, but the listener is automatically removed after the first emission.

#### `emit(event, ...args)`

- `event`: Event name to emit
- `...args`: Arguments to pass to listeners
- Returns: `true` if the event had listeners, `false` otherwise

#### `removeListener(event, listener?, context?, once?)`

- `event`: Event name
- `listener`: Specific listener function to remove
- `context`: Only remove listeners with this context
- `once`: Only remove one-time listeners

#### `removeAllListeners(event?)`

- `event`: Optional event name. If not provided, removes all listeners.

#### `eventNames()`

Returns an array of event names that have registered listeners.

#### `listeners(event)`

Returns an array of listener functions for the specified event.

#### `listenerCount(event)`

Returns the number of listeners for the specified event.

### Aliases

- `addListener` is an alias for `on`
- `off` is an alias for `removeListener`

## Building

```bash
# Build the project
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## TypeScript

This project is written in TypeScript and includes full type definitions. The main export is the `EventEmitter` class:

```typescript
import { EventEmitter } from "./src";

// Type-safe event handling
emitter.on("user:created", (user: User) => {
  // user is properly typed
  console.log(user.name);
});
```

## Browser Compatibility

The EventEmitter class is designed to work in both Node.js and browser environments. It includes compatibility code for older browsers that don't support `Object.create(null)`.

## License

MIT
