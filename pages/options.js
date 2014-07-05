DEFAULTS = {
    default_to_my_results: false
  , running_tss: true
  , standard_google_map: false
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
