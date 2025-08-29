/**
 * Type definitions
 */
type EventName = string | symbol;
type ListenerFunction = (...args: any[]) => void;
type EventListener = {
  fn: ListenerFunction;
  context: any;
  once: boolean;
};

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 */
class Events {
  [key: string]: EventListener | EventListener[];
}

/**
 * Representation of a single event listener.
 */
class EE implements EventListener {
  constructor(
    public fn: ListenerFunction,
    public context: any,
    public once: boolean = false
  ) {}
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
export class EventEmitter {
  protected _events: Events;
  protected _eventsCount: number;

  constructor() {
    this._events = new Events();
    this._eventsCount = 0;
  }

  /**
   * Add a listener for a given event.
   */
  private addListener(
    event: EventName,
    fn: ListenerFunction,
    context?: any,
    once: boolean = false
  ): EventEmitter {
    if (typeof fn !== 'function') {
      throw new TypeError('The listener must be a function');
    }

    const listener = new EE(fn, context || this, once);
    const evt = prefix ? prefix + String(event) : String(event);

    if (!this._events[evt]) {
      this._events[evt] = listener;
      this._eventsCount++;
    } else if (!(this._events[evt] as EventListener).fn) {
      (this._events[evt] as EventListener[]).push(listener);
    } else {
      this._events[evt] = [this._events[evt] as EventListener, listener];
    }

    return this;
  }

  /**
   * Clear event by name.
   */
  private clearEvent(evt: string): void {
    if (--this._eventsCount === 0) {
      this._events = new Events();
    } else {
      delete this._events[evt];
    }
  }

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  eventNames(): EventName[] {
    const names: EventName[] = [];
    let events: Events;
    let name: string;

    if (this._eventsCount === 0) return names;

    for (name in (events = this._events)) {
      if (has.call(events, name)) {
        names.push(prefix ? name.slice(1) : name);
      }
    }

    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }

    return names;
  }

  /**
   * Return the listeners registered for a given event.
   */
  listeners(event: EventName): ListenerFunction[] {
    const evt = prefix ? prefix + String(event) : String(event);
    const handlers = this._events[evt];

    if (!handlers) return [];
    if ((handlers as EventListener).fn) return [(handlers as EventListener).fn];

    const result: ListenerFunction[] = [];
    for (let i = 0, l = (handlers as EventListener[]).length; i < l; i++) {
      result[i] = (handlers as EventListener[])[i].fn;
    }

    return result;
  }

  /**
   * Return the number of listeners listening to a given event.
   */
  listenerCount(event: EventName): number {
    const evt = prefix ? prefix + String(event) : String(event);
    const listeners = this._events[evt];

    if (!listeners) return 0;
    if ((listeners as EventListener).fn) return 1;
    return (listeners as EventListener[]).length;
  }

  /**
   * Calls each of the listeners registered for a given event.
   */
  emit(event: EventName, ...args: any[]): boolean {
    const evt = prefix ? prefix + String(event) : String(event);

    if (!this._events[evt]) return false;

    const listeners = this._events[evt];
    const len = args.length;

    if ((listeners as EventListener).fn) {
      const listener = listeners as EventListener;
      if (listener.once) {
        this.removeListener(event, listener.fn, undefined, true);
      }

      switch (len) {
        case 0:
          listener.fn.call(listener.context);
          break;
        case 1:
          listener.fn.call(listener.context, args[0]);
          break;
        case 2:
          listener.fn.call(listener.context, args[0], args[1]);
          break;
        case 3:
          listener.fn.call(listener.context, args[0], args[1], args[2]);
          break;
        case 4:
          listener.fn.call(listener.context, args[0], args[1], args[2], args[3]);
          break;
        case 5:
          listener.fn.call(listener.context, args[0], args[1], args[2], args[3], args[4]);
          break;
        default:
          listener.fn.apply(listener.context, args);
      }
    } else {
      const listenerArray = listeners as EventListener[];
      const length = listenerArray.length;

      for (let i = 0; i < length; i++) {
        if (listenerArray[i].once) {
          this.removeListener(event, listenerArray[i].fn, undefined, true);
        }

        switch (len) {
          case 0:
            listenerArray[i].fn.call(listenerArray[i].context);
            break;
          case 1:
            listenerArray[i].fn.call(listenerArray[i].context, args[0]);
            break;
          case 2:
            listenerArray[i].fn.call(listenerArray[i].context, args[0], args[1]);
            break;
          case 3:
            listenerArray[i].fn.call(listenerArray[i].context, args[0], args[1], args[2]);
            break;
          case 4:
            listenerArray[i].fn.call(listenerArray[i].context, args[0], args[1], args[2], args[3]);
            break;
          default:
            listenerArray[i].fn.apply(listenerArray[i].context, args);
        }
      }
    }

    return true;
  }

  /**
   * Add a listener for a given event.
   */
  on(event: EventName, fn: ListenerFunction, context?: any): EventEmitter {
    return this.addListener(event, fn, context, false);
  }

  /**
   * Add a one-time listener for a given event.
   */
  once(event: EventName, fn: ListenerFunction, context?: any): EventEmitter {
    return this.addListener(event, fn, context, true);
  }

  /**
   * Remove the listeners of a given event.
   */
  removeListener(
    event: EventName,
    fn?: ListenerFunction,
    context?: any,
    once?: boolean
  ): EventEmitter {
    const evt = prefix ? prefix + String(event) : String(event);

    if (!this._events[evt]) return this;
    if (!fn) {
      this.clearEvent(evt);
      return this;
    }

    const listeners = this._events[evt];

    if ((listeners as EventListener).fn) {
      const listener = listeners as EventListener;
      if (
        listener.fn === fn &&
        (!once || listener.once) &&
        (!context || listener.context === context)
      ) {
        this.clearEvent(evt);
      }
    } else {
      const listenerArray = listeners as EventListener[];
      const events: EventListener[] = [];
      
      for (let i = 0, length = listenerArray.length; i < length; i++) {
        if (
          listenerArray[i].fn !== fn ||
          (once && !listenerArray[i].once) ||
          (context && listenerArray[i].context !== context)
        ) {
          events.push(listenerArray[i]);
        }
      }

      // Reset the array, or remove it completely if we have no more listeners.
      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        this.clearEvent(evt);
      }
    }

    return this;
  }

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventName): EventEmitter {
    let evt: string;

    if (event) {
      evt = prefix ? prefix + String(event) : String(event);
      if (this._events[evt]) this.clearEvent(evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }

    return this;
  }

  // Alias methods names because people roll like that.
  off = this.removeListener;
}

// Static properties and helper functions
const has = Object.prototype.hasOwnProperty;
let prefix: string | false = '~';

// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
if (Object.create) {
  Events.prototype = Object.create(null);

  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  if (!(new Events() as any).__proto__) prefix = false;
}

// Expose the prefix.
(EventEmitter as any).prefixed = prefix;

// Allow `EventEmitter` to be imported as module namespace.
(EventEmitter as any).EventEmitter = EventEmitter;
