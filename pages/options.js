DEFAULTS = {
};

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(DEFAULTS, function(items) {
  });
});

document.getElementById('save').addEventListener('click', function () {
  chrome.storage.sync.set({
  }, function() {
    var elem = document.getElementById('saved');
    elem.style.display = 'block';
    setTimeout(function() {
      elem.style.display = 'none';
    }, 2000);
  });
});
