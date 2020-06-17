function inject(content, callback) {
  var elem = document.createElement('script');

  if (content.indexOf('/') === 0) {
    elem.src = chrome.extension.getURL(content);
  } else {
    elem.textContent = content;
  }

  elem.onload = function () {
    this.parentNode.removeChild(this);
    typeof callback === 'function' && callback.apply(this);
  };

  (document.head || document.documentElement).appendChild(elem);
};

chrome.storage.sync.get(null, function(items) {
  inject('/pages/options.js', function() {
    inject('/js/libs/arrive.js', function() {
      inject('/js/main.js', function() {
        inject(
            'var strava_enhancement_suite = '
          + 'new StravaEnhancementSuite(jQuery, ' + JSON.stringify(items) + ');'
        );
      });
    });
  });
});
