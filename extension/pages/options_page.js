/* global chrome */

// TODO: Nicer
function enhanceOptionsWithImageInfo(options) {
  let counter = Object.keys(options).length;

  return new Promise(function (resolve, reject) {

    function cb(key, val) {
      options[key].image = val;
      counter--;
      if (counter === 0) resolve(); // resolve after "receiving" all callbacks
    }

    chrome.runtime.getPackageDirectoryEntry(storageRootEntry => {
      Object.entries(options).forEach(([key, option]) => {
        storageRootEntry.getFile(`pages/img/${key}.png`, { create: false },
          cb.bind(undefined, key, true),
          cb.bind(undefined, key, false),
        );
      });
    });

  });
}

function storageGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, items => resolve(items[key]));
  });
}

function storageSet(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

(async () => {
  await enhanceOptionsWithImageInfo(StravaEnhancementSuiteOptions);

  for (const [key, option] of Object.entries(StravaEnhancementSuiteOptions)) {
    const val = await storageGet(key);
    const ul = $('<ul/>');

    let control;
    if (option.choices) {
      control = $('<select>');
      $.each(option.choices, function() {
        $('<option>')
          .attr('value', this[0])
          .text(this[1])
          .appendTo(control);
      });
      control.on('change', () => storageSet(key, control.val()));
      control.val((typeof val === 'undefined') ? option.default : val);
    } else {
      control = $('<input type="checkbox">');
      control.on('change', () => storageSet(key, control.prop('checked')));
      control.prop('checked', (typeof val === 'undefined') ? option.default : val);
    }

    // Add control element
    $('<li/>').append(control).appendTo(ul);

    // Description
    $('<li class="text" />').html(option.description).appendTo(ul);

    // Image
    if (option.image === true) {
      $(`<li><img src="img/${key}.png"></li>`).appendTo(ul);
    }

    $(`<section><h3>${option.title}</h3></section>`).append(ul)
      .appendTo('.content');
  }
})();
