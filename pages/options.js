DEFAULTS = {
    default_to_my_results: false
  , hide_invite_friends: false
  , infinite_scroll: true
  , running_tss: true
  , side_by_side_running: false
  , standard_google_map: false
  , variability_index: true
};

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(DEFAULTS, function(items) {
    for (x in DEFAULTS) {
      document.getElementById(x).checked = items[x];
    }
  });
});

for (x in DEFAULTS) {
  document.getElementById(x).addEventListener('change', function () {
    var data = {};
    for (x in DEFAULTS) {
      data[x] = document.getElementById(x).checked;
    }

    chrome.storage.sync.set(data);
  });
}
