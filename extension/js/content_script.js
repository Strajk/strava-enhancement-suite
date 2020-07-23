/* global chrome */

function injectJs(what) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');

    if (what.startsWith('//')) { // Only for local development, CWS disallows remote code
      el.src = what;
    } else if (what.startsWith('/')) {
      el.src = chrome.extension.getURL(what);
    } else {
      el.textContent = what;
    }

    el.onerror = reject;
    el.onload = resolve;

    document.head.appendChild(el);
  });
}

function injectCss(what) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('link');
    el.href = chrome.extension.getURL(what);
    el.type = 'text/css';
    el.rel = 'stylesheet';
    el.onerror = reject;
    el.onload = resolve;
    document.head.appendChild(el);
  });
}

chrome.storage.sync.get(null, async (items) => {
  await injectJs('/pages/options.js');

  await injectJs('/js/libs/jquery.js'); // jQuery is not present on new, react-only pages, e.g. Training Log
  await injectJs('/js/libs/arrive.js');

  await injectCss('/js/libs/notyf.min.css');
  await injectJs('/js/libs/notyf.umd.js');

  await injectJs('/js/libs/react.development.js');
  await injectJs('/js/libs/react-dom.development.js');
  await injectJs('/js/libs/react-dom-test-utils.development.js');

  await injectJs('/js/main.js');

  await injectJs(`window.strava_enhancement_suite = new StravaEnhancementSuite(jQuery, ${JSON.stringify(items)});`);
});
