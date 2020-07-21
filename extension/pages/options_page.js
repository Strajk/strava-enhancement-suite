/* global chrome */

$(function() {
  $.extend({
    setOption: function(key, value) {
      var items = {};
      items[key] = value;
      chrome.storage.sync.set(items);
    },
  });

  Object.entries(StravaEnhancementSuiteOptions).forEach(([key, option]) => {
    var ul = $('<ul/>');

    var elem = $('<input type="checkbox">');

    elem.on('change', function() {
      $.setOption(key, elem.prop('checked'));
    });

    chrome.storage.sync.get(key, function(items) {
      var val = items[key];

      elem.prop('checked', (typeof val === 'undefined') ? option.default : val);
    });

    if (option.choices) {
      elem = $('<select>');

      $.each(option.choices, function() {
        $('<option>')
          .attr('value', this[0])
          .text(this[1])
          .appendTo(elem);
      });

      elem.on('change', function() {
        $.setOption(key, elem.val());
      });

      chrome.storage.sync.get(key, function(items) {
        var val = items[key];

        elem.val((typeof val === 'undefined') ? option.default : val);
      });
    }

    // Add control element
    $('<li/>')
      .append(elem)
      .appendTo(ul);

    // Description
    $('<li class="text"/>')
      .html(option.description) // Allow HTML in description
      .appendTo(ul);

    // Image
    if (option.image === true) {
      $('<li><img></li>')
        .find('img')
        .attr('src', 'img/' + key + '.png')
        .end()
        .appendTo(ul);
    }

    $('<section><h3/></section>')
      .find('h3')
      .text(option.title)
      .end()
      .append(ul)
      .appendTo('.content');
  });
});
