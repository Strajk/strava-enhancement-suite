DEFAULTS = {
    default_to_my_results: false
  , running_tss: true
  , standard_google_map: false
};

chrome.storage.sync.get(DEFAULTS, function(items) {
  var outer = document.createElement('script');
  outer.src = chrome.extension.getURL('js/injected.js');
  outer.onload = function() {
    this.parentNode.removeChild(this);

    var inner = document.createElement('script');
    inner.textContent = 'var strava_enhancement_suite = new StravaEnhancementSuite(' + JSON.stringify(items) + ');';
    inner.onload = function () {
      this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(inner);
  };
  (document.head || document.documentElement).appendChild(outer);
});
