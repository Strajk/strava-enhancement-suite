/* global chrome */
/* eslint-env serviceworker */

// In Manifest V3, action (formerly pageAction) is always shown by default
// If we want to show/hide it, we can use chrome.action.enable/disable
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url && tab.url.indexOf('.strava.com') > -1) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
});
