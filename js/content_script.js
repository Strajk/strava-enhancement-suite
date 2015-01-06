// Requires syncing with pages/options.js
DEFAULTS = {
    comment_post_on_enter: true
  , enlarge_on_hover: true
  , estimated_ftp: true
  , external_links: true
  , flyby_select_all: true
  , hide_blog: false
  , hide_challenge_feed_entries: false
  , hide_club_feed_entries: false
  , hide_goal_feed_entries: false
  , hide_route_feed_entries: false
  , hide_promotion_feed_entries: false
  , hide_shop: false
  , hide_invite_friends: false
  , hide_upcoming: false
  , improve_pagination: true
  , improve_upload_activity: true
  , infinite_scroll: true
  , repeated_segments: true
  , running_cadence: true
  , running_heart_rate: true
  , running_tss: true
  , side_by_side_running: false
  , standard_google_map: false
  , swap_clubs_and_challenge_module: false
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
