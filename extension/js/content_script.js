/* global chrome */

function inject(what) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');

    if (what.startsWith('/')) {
      el.src = chrome.extension.getURL(what);
    } else {
      el.textContent = what;
    }

    el.onerror = reject;
    el.onload = resolve;

    document.head.appendChild(el);
  });
}

chrome.storage.sync.get(null, async (items) => {
  await inject('/pages/options.js');
  await inject('/js/libs/arrive.js');
  await inject('/js/main.js');
  await inject(`window.strava_enhancement_suite = new StravaEnhancementSuite(jQuery, ${JSON.stringify(items)});`);
});
