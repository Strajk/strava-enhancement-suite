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

document.getElementById('save').addEventListener('click', function () {
  var data = {};
  for (x in DEFAULTS) {
    data[x] = document.getElementById(x).checked;
  }

  chrome.storage.sync.set(data, function() {
    var elem = document.getElementById('saved');
    elem.style.display = 'block';
    setTimeout(function() {
      elem.style.display = 'none';
    }, 2000);
  });
});
