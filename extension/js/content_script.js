/* global chrome, browser */

// TODO: Add unit tests
function convertToBoolOrInput(input) {
  const lower = input.toLowerCase();
  if (['true', 'y', '1'].some(x => lower === x)) return true;
  if (['false', 'n', '0'].some(x => lower === x)) return false;
  return input;
}

function injectJs(what) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');

    if (what.startsWith('//')) { // Only for local development, CWS disallows remote code
      el.src = what;
    } else if (what.startsWith('/')) {
      el.src = chrome.runtime.getURL(what);
    } else {
      // For inline code, we need to be careful about CSP
      // This is only used for data injection, not executable code
      el.textContent = what;
    }

    el.onerror = reject;
    el.onload = resolve;

    document.head.appendChild(el);
  });
}

function injectData(data) {
  // Inject data as a non-executable script element
  return new Promise((resolve) => {
    const el = document.createElement('script');
    el.type = 'application/json';
    el.id = '__SES_OPTIONS__';
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    resolve();
  });
}

function injectCss(what) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('link');
    el.href = chrome.runtime.getURL(what);
    el.type = 'text/css';
    el.rel = 'stylesheet';
    el.onerror = reject;
    el.onload = resolve;
    document.head.appendChild(el);
  });
}

// Guard against multiple executions of content script
if (window.__SES_CONTENT_SCRIPT_LOADED__) {
  console.log('[SES Content Script] Already loaded, skipping');
} else {
  window.__SES_CONTENT_SCRIPT_LOADED__ = true;

  // TODO: Add unit tests
  async function executeInstructionsFromUrl() {
    // /path?__SES.opts.general_typography=true&__SES.opts.blabla=false
    if (window.location.search.includes('__SES')) {
      const urlParamsOrig = new URLSearchParams(window.location.search);
      const urlParamsNew = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParamsOrig) {
        if (!key.startsWith('__SES.')) continue;
        const strippedKey = key.substring('__SES.'.length);
        if (strippedKey.startsWith('opts.')) {
          const opt = strippedKey.substring('opts.'.length);
          const parsedValue = convertToBoolOrInput(value);
          await browser.storage.sync.set({ [opt]: parsedValue });
        }
        urlParamsNew.delete(key);
      }
      const newSearchParams = urlParamsNew.toString();
      const newUrl = window.location.pathname + (newSearchParams ? `?${newSearchParams}` : '');
      history.replaceState(null, null, newUrl);
    }
  }

  (async () => {
    await executeInstructionsFromUrl();
    const options = await browser.storage.sync.get();

    await injectJs('/pages/options.js');

    await injectJs('/js/libs/arrive.js');

    await injectCss('/js/libs/notyf.min.css');
    await injectJs('/js/libs/notyf.umd.js');

    await injectJs('/js/libs/react.development.js');
    await injectJs('/js/libs/react-dom.development.js');
    await injectJs('/js/libs/react-dom-test-utils.development.js');

    await injectJs('/js/main.js');

    // Inject options as JSON data (not executable code, so CSP-safe)
    await injectData(options);

    // Bootstrap the extension
    await injectJs('/js/inject_bootstrap.js');
  })();
}


