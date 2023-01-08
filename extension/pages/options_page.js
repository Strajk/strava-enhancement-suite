/* global chrome */

// Only for easier local development when opening options.html directly in the browser
let onerror; // eslint-disable-line no-redeclare
if (!chrome.runtime.getPackageDirectoryEntry && !chrome.storage) {
  chrome.runtime.getPackageDirectoryEntry = (cb) => cb({ getFile: (path, opts, ok) => ok() });
  chrome.storage = { sync: { get: (key, cb) => cb(''), set: () => '' } };
  onerror = 'this.style.display="none"';
}

// TODO: Nicer
function enhanceOptionsWithImageInfo(options) {
  let counter = Object.keys(options).length * 2; // 2 checks for each file, once for png, once for gif

  return new Promise(function (resolve, reject) {

    function cb(key, val) {
      if (val) options[key].image = val;
      counter--;
      if (counter === 0) resolve(); // resolve after "receiving" all callbacks
    }

    chrome.runtime.getPackageDirectoryEntry(storageRootEntry => {
      Object.entries(options).forEach(([key, option]) => {
        storageRootEntry.getFile(`pages/img/${key}.png`, { create: false },
          cb.bind(undefined, key, 'png'),
          cb.bind(undefined, key, undefined),
        );
        storageRootEntry.getFile(`pages/img/${key}.gif`, { create: false },
          cb.bind(undefined, key, 'gif'),
          cb.bind(undefined, key, undefined),
        );
      });
    });

  });
}

function filteredByKey (obj, x) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => {
      return val.context === x;
    }),
  );
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

  for (const [ctxKey, ctx] of Object.entries(StravaEnhancementSuiteOptionsContexts)) {
    const options = filteredByKey(StravaEnhancementSuiteOptions, ctx);

    $(`<h2>${ctx.title}</h2>`).appendTo('.content');

    for (const [key, option] of Object.entries(options)) {
      if (option.internal) continue;

      const val = await storageGet(key);
      const $section = $('<section class="feature" />');

      const $header = $('<label class="header" />');

      $(`<h3 title="${key}">${option.title}</h3>`).appendTo($header);

      let control;
      if (option.removed) {
        // Don't show controls for removed options
      } else if (option.choices) {
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
      $('<div class="meta" />').append(control).appendTo($header);

      // Header to section
      $header.appendTo($section);

      // Removed
      if (option.removed) {
        $('<div class="note bug" />').html(option.removed).appendTo($section);
      }

      // Description
      if (option.note) {
        $(`<div class="note ${option.note.type}" />`).html(option.note.text).appendTo($section);
      }

      // Description
      if (option.description) {
        $('<div class="description" />').html(option.description).appendTo($section);
      }

      // Image
      if (option.image) {
        $(`<img src="img/${key}.${option.image}" onerror=${onerror}>`).appendTo($section);
      }

      $section.appendTo('.content');
    }

  }

})();
