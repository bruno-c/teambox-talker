// Delay function call until timeout. Each call resets the timer.
// Useful to minimize trafic to server by sending only latest message
// when there is less activity on the frontend.
function delay(func, timeout) {
  if (func.delayTimeout) clearTimeout(func.delayTimeout);
  func.delayTimeout = setTimeout(func, timeout || 1000);
};