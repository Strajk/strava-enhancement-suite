$(function() {
  $.extend({
    setOption: function(key, value) {
      var items = {}
      items[key] = value;
      chrome.storage.sync.set(items);
    }
  });

  $.each(StravaEnhancementSuiteOptions, function(idx, option) {
    var ul = $('<ul/>')

    var elem = $('<input type="checkbox">');

    elem.on('change', function() {
      $.setOption(option.name, elem.prop('checked'));
    });

    chrome.storage.sync.get(option.name, function(items) {
      var val = items[option.name];

      elem.prop('checked', (typeof val === 'undefined') ? option.default : val);
    });

    if (option.choices) {
      elem = $('<select>');

      $.each(option.choices, function() {
        $('<option>')
          .attr('value', this[0])
          .text(this[1])
          .appendTo(elem)
          ;
      });

      elem.on('change', function() {
        $.setOption(option.name, elem.val());
      });

      chrome.storage.sync.get(option.name, function(items) {
        var val = items[option.name];

        elem.val((typeof val === 'undefined') ? option.default : val);
      });
    }

    // Add control element
    $('<li/>')
      .append(elem)
      .appendTo(ul)
      ;

    // Description
    $('<li class="text"/>')
      .html(option.description) // Allow HTML in description
      .appendTo(ul)
      ;

    // Image
    if (option.image === true) {
      $('<li><img></li>')
        .find('img')
          .attr('src', 'img/' + option.name + '.png')
        .end()
        .appendTo(ul)
        ;
    }

    $('<section><h3/></section>')
      .find('h3')
        .text(option.title)
      .end()
      .append(ul)
      .appendTo('.content')
      ;
  });
});
