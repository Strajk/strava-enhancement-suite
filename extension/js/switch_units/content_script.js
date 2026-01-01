// Dispatch a custom event that the injected main.js can listen for
// This avoids CSP violations from inline script execution
window.dispatchEvent(new CustomEvent('SES_SWITCH_UNITS'));
