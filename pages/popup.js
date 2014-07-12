document.getElementById('options').setAttribute(
  'href',
  chrome.runtime.getURL('pages/options.html')
);

document.getElementById('switch_units').addEventListener('click', function() {
  chrome.tabs.executeScript({
    file: 'js/switch_units/content_script.js'
  });
  window.close();
  return false;
});

document.getElementById('donate').addEventListener('click', function() {
  document.getElementById('paypal-form').submit();
  window.close();
  return false;
});
