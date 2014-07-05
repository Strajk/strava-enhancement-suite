DEFAULTS = {
  default_to_my_results: false
};

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(DEFAULTS, function(items) {
    document.getElementById('default_to_my_results').checked = items.default_to_my_results;
  });
});

document.getElementById('save').addEventListener('click', function () {
  chrome.storage.sync.set({
    default_to_my_results: document.getElementById('default_to_my_results').checked
  }, function() {
    var elem = document.getElementById('saved');
    elem.style.display = 'block';
    setTimeout(function() {
      elem.style.display = 'none';
    }, 2000);
  });
});
