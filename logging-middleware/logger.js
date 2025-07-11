
const logs = [];

function logEvent(eventType, details) {
  const timestamp = new Date().toISOString();
  logs.push({ timestamp, eventType, details });
  // No console.log or browser logging!
}

function getLogs() {
  return [...logs];
}

export default {
  logEvent,
  getLogs,
};
