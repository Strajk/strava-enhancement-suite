// This script initializes the Strava Enhancement Suite in the page context
// It reads options from a JSON script element injected by the content script

(function () {
  'use strict';

  // Guard against multiple executions - check and set flag immediately
  if (window.__SES_INITIALIZING__ || window.strava_enhancement_suite) {
    console.log('[SES] Already initialized or initializing, skipping');
    return;
  }

  // Set flag immediately to prevent race conditions
  window.__SES_INITIALIZING__ = true;

  if (typeof window.StravaEnhancementSuite !== 'function') {
    console.error('[SES] StravaEnhancementSuite class not found. Make sure main.js is loaded first.');
    window.__SES_INITIALIZING__ = false;
    return;
  }

  // Function to initialize the extension
  function initializeExtension() {
    // Get options from the injected JSON script element
    let options = {};
    const optionsElement = document.getElementById('__SES_OPTIONS__');
    if (optionsElement) {
      try {
        options = JSON.parse(optionsElement.textContent);
        // Clean up the element after reading
        optionsElement.remove();
      } catch (error) {
        console.error('[SES] Failed to parse options:', error);
      }
    }

    // Initialize the extension
    try {
      window.strava_enhancement_suite = new window.StravaEnhancementSuite(window.jQuery, options);
      console.log('[SES] Strava Enhancement Suite initialized successfully');
    } catch (error) {
      console.error('[SES] Failed to initialize:', error);
      window.__SES_INITIALIZING__ = false;
    }
  }

  // Wait for jQuery to be available
  function waitForJQuery(callback) {
    if (typeof window.jQuery !== 'undefined') {
      // jQuery is already loaded, wait for DOM ready
      window.jQuery(document).ready(callback);
    } else {
      // jQuery not yet loaded, poll for it
      console.log('[SES] Waiting for jQuery to load...');
      const checkInterval = setInterval(function () {
        if (typeof window.jQuery !== 'undefined') {
          clearInterval(checkInterval);
          console.log('[SES] jQuery loaded, proceeding with initialization');
          window.jQuery(document).ready(callback);
        }
      }, 50); // Check every 50ms

      // Timeout after 10 seconds
      setTimeout(function () {
        if (typeof window.jQuery === 'undefined') {
          clearInterval(checkInterval);
          console.error('[SES] Timeout waiting for jQuery to load');
        }
      }, 10000);
    }
  }

  // Start waiting for jQuery and then initialize
  waitForJQuery(initializeExtension);

  // Listen for external commands from the extension popup
  window.addEventListener('SES_SWITCH_UNITS', function() {
    if (window.strava_enhancement_suite && typeof window.strava_enhancement_suite.switch_units === 'function') {
      window.strava_enhancement_suite.switch_units();
    } else {
      console.warn('[SES] switch_units called but extension not ready yet');
    }
  });
})();

