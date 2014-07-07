DEFAULTS = {
    comment_post_on_enter: true
  , estimated_ftp: true
  , external_links: true
  , hide_invite_friends: false
  , infinite_scroll: true
  , leaderboard_default: 'overall'
  , running_cadence: true
  , running_heart_rate: true
  , running_tss: true
  , side_by_side_running: false
  , standard_google_map: false
  , variability_index: true
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
