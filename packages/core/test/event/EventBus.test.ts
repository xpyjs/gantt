import { describe, expect, it, vi } from 'vitest';
import { EventBus, EventName, ErrorType } from '../../src/event';

describe('EventBus', () => {
  describe('on / emit', () => {
    it('should register and fire a listener', () => {
      const bus = new EventBus();
      const cb = vi.fn();
      bus.on(EventName.LOADED, cb);
      bus.emit(EventName.LOADED);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('should pass args to listeners', () => {
      const bus = new EventBus();
      const cb = vi.fn();
      bus.on('custom-event', cb);
      bus.emit('custom-event', 1, 'two', { three: 3 });
      expect(cb).toHaveBeenCalledWith(1, 'two', { three: 3 });
    });

    it('should fire multiple listeners for the same event', () => {
      const bus = new EventBus();
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      bus.on('my-event', cb1);
      bus.on('my-event', cb2);
      bus.emit('my-event');
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('should fire listeners in registration order', () => {
      const bus = new EventBus();
      const order: number[] = [];
      bus.on('ord', () => order.push(1));
      bus.on('ord', () => order.push(2));
      bus.on('ord', () => order.push(3));
      bus.emit('ord');
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe('off', () => {
    it('should remove a specific listener', () => {
      const bus = new EventBus();
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      bus.on('ev', cb1);
      bus.on('ev', cb2);
      bus.off('ev', cb1);
      bus.emit('ev');
      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('should be safe to remove a non-existent listener', () => {
      const bus = new EventBus();
      const cb = vi.fn();
      expect(() => bus.off('nope', cb)).not.toThrow();
    });

    it('should be safe to off an event with no listeners', () => {
      const bus = new EventBus();
      expect(() => bus.off('nonexistent')).not.toThrow();
    });

    it('should remove ALL instances of a duplicate callback', () => {
      const bus = new EventBus();
      const cb = vi.fn();
      bus.on('dup', cb);
      bus.on('dup', cb);
      bus.emit('dup');
      expect(cb).toHaveBeenCalledTimes(2);
      // off filters by identity, removing all matching instances
      bus.off('dup', cb);
      bus.emit('dup');
      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe('offAll', () => {
    it('should remove all listeners across all events', () => {
      const bus = new EventBus();
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      bus.on('a', cb1);
      bus.on('b', cb2);
      bus.offAll();
      bus.emit('a');
      bus.emit('b');
      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).not.toHaveBeenCalled();
    });

    it('should allow re-subscription after offAll', () => {
      const bus = new EventBus();
      const cb = vi.fn();
      bus.on('e', cb);
      bus.offAll();
      bus.on('e', cb);
      bus.emit('e');
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe('EventName enum', () => {
    it('should contain expected event names', () => {
      expect(EventName.LOADED).toBe('loaded');
      expect(EventName.DATA_UPDATE).toBe('data-update');
      expect(EventName.TASK_SELECTED).toBe('task_selected');
      expect(EventName.ERROR).toBe('error');
    });
  });

  describe('ErrorType enum', () => {
    it('should contain expected error types', () => {
      expect(ErrorType.LINK_CYCLE).toBe('LINK_CYCLE');
      expect(ErrorType.MOVE_INVALID_TARGET).toBe('MOVE_INVALID_TARGET');
      expect(ErrorType.TASK_NOT_FOUND).toBe('TASK_NOT_FOUND');
      expect(ErrorType.LINK_SAME).toBe('LINK_SAME');
    });
  });
});
