// Z: core\event-bus.js
// Event Bus: In-memory event dispatcher
const { evaluateRules } = require('./rule-engine');

const subscribers = [evaluateRules];

function emitEvent(event) {
  console.log('📡 Event received:', event.type);
  subscribers.forEach((fn) => fn(event));
}

function subscribe(handler) {
  subscribers.push(handler);
}

module.exports = { emitEvent, subscribe };
