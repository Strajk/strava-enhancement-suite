DEFAULTS = {
    comment_post_on_enter: true
  , default_to_my_results: false
  , estimated_ftp: true
  , external_links: true
  , hide_invite_friends: false
  , infinite_scroll: true
  , running_cadence: true
  , running_heart_rate: true
  , running_tss: true
  , side_by_side_running: false
  , standard_google_map: false
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
