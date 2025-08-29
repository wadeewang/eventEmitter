import { EventEmitter } from './EventEmitter';
import '@types/jest'

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('constructor', () => {
    it('should create an instance with empty events', () => {
      expect(emitter.eventNames()).toEqual([]);
      expect(emitter.listenerCount('test')).toBe(0);
    });
  });

  describe('on', () => {
    it('should add a listener for an event', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(1);
      expect(emitter.listeners('test')).toContain(listener);
    });

    it('should add multiple listeners for the same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      
      expect(emitter.listenerCount('test')).toBe(2);
      expect(emitter.listeners('test')).toContain(listener1);
      expect(emitter.listeners('test')).toContain(listener2);
    });

    it('should throw error for non-function listener', () => {
      expect(() => {
        emitter.on('test', 'not a function' as any);
      }).toThrow('The listener must be a function');
    });
  });

  describe('once', () => {
    it('should add a one-time listener', () => {
      const listener = jest.fn();
      emitter.once('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(1);
      
      emitter.emit('test');
      expect(listener).toHaveBeenCalledTimes(1);
      
      // Listener should be removed after first emission
      expect(emitter.listenerCount('test')).toBe(0);
    });
  });

  describe('emit', () => {
    it('should call listeners with arguments', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      emitter.emit('test', 'arg1', 'arg2');
      
      expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should return false for non-existent events', () => {
      expect(emitter.emit('nonexistent')).toBe(false);
    });

    it('should return true for events with listeners', () => {
      emitter.on('test', jest.fn());
      expect(emitter.emit('test')).toBe(true);
    });

    it('should handle multiple arguments efficiently', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      emitter.emit('test', 1, 2, 3, 4, 5, 6);
      
      expect(listener).toHaveBeenCalledWith(1, 2, 3, 4, 5, 6);
    });
  });

  describe('removeListener', () => {
    it('should remove a specific listener', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      
      emitter.removeListener('test', listener1);
      
      expect(emitter.listenerCount('test')).toBe(1);
      expect(emitter.listeners('test')).toContain(listener2);
      expect(emitter.listeners('test')).not.toContain(listener1);
    });

    it('should remove all listeners when no function specified', () => {
      emitter.on('test', jest.fn());
      emitter.on('test', jest.fn());
      
      emitter.removeListener('test');
      
      expect(emitter.listenerCount('test')).toBe(0);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      emitter.on('test1', jest.fn());
      emitter.on('test2', jest.fn());
      
      emitter.removeAllListeners('test1');
      
      expect(emitter.listenerCount('test1')).toBe(0);
      expect(emitter.listenerCount('test2')).toBe(1);
    });

    it('should remove all listeners when no event specified', () => {
      emitter.on('test1', jest.fn());
      emitter.on('test2', jest.fn());
      
      emitter.removeAllListeners();
      
      expect(emitter.listenerCount('test1')).toBe(0);
      expect(emitter.listenerCount('test2')).toBe(0);
    });
  });

  describe('eventNames', () => {
    it('should return array of event names', () => {
      emitter.on('event1', jest.fn());
      emitter.on('event2', jest.fn());
      
      const names = emitter.eventNames();
      expect(names).toContain('event1');
      expect(names).toContain('event2');
    });
  });

  describe('listeners', () => {
    it('should return array of listener functions', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      emitter.on('test', listener1);
      emitter.on('test', listener2);
      
      const listeners = emitter.listeners('test');
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener2);
    });

    it('should return empty array for non-existent events', () => {
      expect(emitter.listeners('nonexistent')).toEqual([]);
    });
  });

  describe('listenerCount', () => {
    it('should return correct count of listeners', () => {
      expect(emitter.listenerCount('test')).toBe(0);
      
      emitter.on('test', jest.fn());
      expect(emitter.listenerCount('test')).toBe(1);
      
      emitter.on('test', jest.fn());
      expect(emitter.listenerCount('test')).toBe(2);
    });
  });

  describe('aliases', () => {
    it('should have off alias for removeListener', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      emitter.off('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(0);
    });

    it('should have on method for adding listeners', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      
      expect(emitter.listenerCount('test')).toBe(1);
    });
  });

  describe('context handling', () => {
    it('should use custom context when provided', () => {
      const context = { value: 'test' };
      const listener = jest.fn(function(this: any) {
        expect(this).toBe(context);
      });
      
      emitter.on('test', listener, context);
      emitter.emit('test');
      
      expect(listener).toHaveBeenCalled();
    });

    it('should use emitter as default context', () => {
      const listener = jest.fn(function(this: any) {
        expect(this).toBe(emitter);
      });
      
      emitter.on('test', listener);
      emitter.emit('test');
      
      expect(listener).toHaveBeenCalled();
    });
  });
});
