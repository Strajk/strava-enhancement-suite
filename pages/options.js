DEFAULTS = {
  default_to_my_results: false,
  running_tss: true,
  standard_google_map: false
};

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(DEFAULTS, function(items) {
    document.getElementById('default_to_my_results').checked = items.default_to_my_results;
    document.getElementById('running_tss').checked = items.running_tss;
    document.getElementById('standard_google_map').checked = items.standard_google_map;
  });
});

document.getElementById('save').addEventListener('click', function () {
  chrome.storage.sync.set({
    default_to_my_results: document.getElementById('default_to_my_results').checked,
    running_tss: document.getElementById('running_tss').checked,
    standard_google_map: document.getElementById('standard_google_map').checked
  }, function() {
    var elem = document.getElementById('saved');
    elem.style.display = 'block';
    setTimeout(function() {
      elem.style.display = 'none';
    }, 2000);
  });
});
