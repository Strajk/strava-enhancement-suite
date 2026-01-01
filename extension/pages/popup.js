/* global chrome, browser */

document.getElementById('options').setAttribute(
  'href',
  chrome.runtime.getURL('pages/options.html'),
);

document.getElementById('switch_units').addEventListener('click', async function() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['js/switch_units/content_script.js'],
  });
  window.close();
  return false;
});
