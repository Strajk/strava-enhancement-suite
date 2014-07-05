document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('options').setAttribute(
    'href',
    chrome.runtime.getURL('pages/options.html')
  );
});
