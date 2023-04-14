export default class EventBus {
  events: Record<string, any[]>;

  constructor() {
    this.events = {};
  }

  emit(eventName: string, data: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn: (...args: any) => any) => {
        fn(data);
      });
    }
  }

  on(eventName: string, fn: (...args: any) => any) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName: string, fn: (...args: any) => any) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}
