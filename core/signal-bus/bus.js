// Z: core/signal-bus/bus.js
const listeners = new Set();

export const sanctuaryBus = {
  emit(signal) {
    listeners.forEach((fn) => fn(signal));
  },
  on(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
