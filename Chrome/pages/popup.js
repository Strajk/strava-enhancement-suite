document.getElementById('options').setAttribute(
  'href',
  chrome.runtime.getURL('pages/options.html')
);

document.getElementById('switch_units').addEventListener('click', function() {
  chrome.tabs.executeScript({
    file: 'js/switch_units/content_script.js'
  });
  window.close();
});
