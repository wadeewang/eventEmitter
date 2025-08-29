import { EventEmitter} from './EventEmitter';

// Example 1: Basic usage
console.log('=== Basic EventEmitter Usage ===');

const emitter = new EventEmitter();

// Add event listeners
emitter.on('message', (msg: string) => {
  console.log('Received message:', msg);
});

emitter.on('data', (data: any) => {
  console.log('Received data:', data);
});

// Emit events
emitter.emit('message', 'Hello, World!');
emitter.emit('data', { id: 1, name: 'John' });

// Example 2: Once listener
console.log('\n=== Once Listener Example ===');

emitter.once('welcome', (name: string) => {
  console.log(`Welcome ${name}! This will only fire once.`);
});

emitter.emit('welcome', 'Alice');
emitter.emit('welcome', 'Bob'); // This won't fire

// Example 3: Remove listeners
console.log('\n=== Remove Listener Example ===');

const goodbyeHandler = (name: string) => {
  console.log(`Goodbye ${name}!`);
};

emitter.on('goodbye', goodbyeHandler);
emitter.emit('goodbye', 'Charlie');

// Remove the specific listener
emitter.removeListener('goodbye', goodbyeHandler);
emitter.emit('goodbye', 'David'); // This won't fire

// Example 4: Event names and listener count
console.log('\n=== Event Information ===');

console.log('Event names:', emitter.eventNames());
console.log('Listeners for "message":', emitter.listenerCount('message'));
console.log('Listeners for "data":', emitter.listenerCount('data'));

// Example 5: Custom context
console.log('\n=== Custom Context Example ===');

const context = { name: 'CustomContext' };

emitter.on('context', function(this: any, data: string) {
  console.log(`Context: ${this.name}, Data: ${data}`);
}, context);

emitter.emit('context', 'test data');

// Example 6: Remove all listeners
console.log('\n=== Remove All Listeners ===');

console.log('Before removal - Event names:', emitter.eventNames());
emitter.removeAllListeners();
console.log('After removal - Event names:', emitter.eventNames());
