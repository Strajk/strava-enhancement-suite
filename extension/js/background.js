/* global chrome */

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url.indexOf('.strava.com') > -1) {
    chrome.pageAction.show(tabId);
  }
});
