// Requires syncing with js/content_script.js
DEFAULTS = {
    annual_achievements: 'show'
  , comment_post_on_enter: true
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

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(DEFAULTS, function(items) {
    for (x in DEFAULTS) {
      var elem = document.getElementById(x);

      elem.value = items[x];

      if ((elem.tagName === 'INPUT') && (elem.getAttribute('type') === 'checkbox')) {
        elem.checked = items[x];
      }
    }
  });
});

for (x in DEFAULTS) {
  document.getElementById(x).addEventListener('change', function () {
    var data = {};
    for (x in DEFAULTS) {
      var elem = document.getElementById(x);

      data[x] = elem.value;

      if ((elem.tagName === 'INPUT') && (elem.getAttribute('type') === 'checkbox')) {
        data[x] = elem.checked;
      }
    }

    chrome.storage.sync.set(data);
  });
}
