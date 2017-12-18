function StravaEnhancementSuite($, options) {
  var defaults = {};
  $.each(StravaEnhancementSuiteOptions, function() {
    defaults[this.name] = this['default'];
  });

  options = $.extend({}, defaults, options);

  $.fn.extend({
    onceOnly: function () {
      return this
        .not('.once-only')
        .addClass('once-only')
        ;
    },
    reverse: function () {
      return this.pushStack(this.get().reverse(), arguments);
    },
    setInterval: function (fn, interval) {
      var that = $(this);
      var prev = undefined;

      $.setInterval(function() {
        var current = $(that.selector).length;

        // Only call our method if we think the items have changed.
        if (current !== prev) {
          fn();
        }

        prev = current;
      }, interval);
    }
  });

  $.extend({
    setInterval: function(fn, interval) {
      // Call immediately, not just after the first interval
      fn();

      setInterval(fn, interval);
    },
    keys: function (obj) {
      var a = [];
      $.each(obj, function(k) { a.push(k) });
      return a;
    },
    always: function (handler) {
      handler();
    },
    option: function (option, handler) {
      if (options[option] !== false) {
        handler();
      }
    },
    defined: function (val) {
      try {
        return typeof eval(val) !== 'undefined';
      } catch (err) {
        return false;
      }
    },
    endsWith: function (haystack, needle) {
      return haystack.length >= needle.length &&
        haystack.substr(haystack.length - needle.length) == needle;
    },
    urlParam: function (name) {
      var m = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

      if (!m) {
          return undefined;
      }
      return decodeURIComponent(m[1]) || undefined;
    },
    convert: function(val, unit) {
      var d = parseFloat(val.replace(/,/g, ''));

      var toNumber = function(x, suffix, digits) {
        return x.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      };

      var toPace = function(x, conv, u1, u2, u3) {
        var secs = $.parseSeconds(x);

        var pace =
            Math.floor((secs * conv) / 60).toFixed(0)
          + ':'
          + (((secs * conv) % 60 < 10) ? '0' : '')
          + ((secs * conv) % 60).toFixed(0)
          ;

        return [
            pace + u1
          , (60 * 60 / secs).toFixed(1) + u2
          , (60 * 60 / secs / conv).toFixed(1) + u3
        ].join(' — ');
      };

      var swimPace = function(x, conv, suffix) {
        var secs = $.parseSeconds(x);

        return Math.floor((secs * conv) / 60).toFixed(0)
          + ':'
          + (((secs * conv) % 60 < 10) ? '0' : '')
          + ((secs * conv) % 60).toFixed(0)
          + suffix
          ;
      };

      switch (unit) {
      case 'km':
        return toNumber(d * 0.621371, 'mi', 1);
      case 'mi':
        return toNumber(d * 1.609344, 'km', 1);
      case 'km/h':
        return toNumber(d * 0.621371, 'mi/h', 1);
      case 'mi/h':
        return toNumber(d * 1.609344, 'km/h', 1);
      case 'm':
        return toNumber(d * 3.2808, 'ft', 0);
      case 'ft':
        return toNumber(d * 0.3048, 'm', 0);
      case '℃':
        return toNumber((d * 1.8) + 32, '℉', 0);
      case '℉':
        return toNumber((d - 32) / 1.8, '℃', 0);
      case '/km':
        return toPace(val, 1.60934, '/mi', 'km/h', 'mi/h');
      case '/mi':
        return toPace(val, 0.621371, '/km', 'mi/h', 'km/h');
      case '/100m':
        return swimPace(val, 0.9144, '/100yds');
      case '/100yds':
        return swimPace(val, 1.0936, '/100m');
      default:
        return '';
      }
    },
    parseSeconds: function(x) {
      return parseInt(x.split(':')[0], 10) * 60 + parseInt(x.split(':')[1], 10);
    },
    toSeconds: function(s) {
      var r = '';
      var hours = Math.floor(s / 3600.0);

      if (hours < 10) {
        r += '0' + hours
      } else {
        r += hours;
      }
      r += ':';

      var minutes = Math.floor((s - (hours * 3600)) / 60.0);
      if (minutes < 10) {
        r += '0' + minutes;
      } else {
        r += minutes;
      }
      r += ':';

      var seconds = s - hours * 3600 - minutes * 60;

      if (seconds - Math.floor(seconds) > 0.0) {
        seconds = seconds.toFixed(1);
      }

      if (seconds < 10) {
        r += '0' + seconds;
      } else {
        r += seconds;
      }

      return r;
    }
  });

  function keySort() {
    var fields = arguments;

    return function(a, b) {
      for (var i = 0; i < fields.length; ++i) {
        var key = fields[i];

        if (key.slice(0, 1) === '-') {
          var val_a = b[key.slice(1)];
          var val_b = a[key.slice(1)];
        } else {
          var val_a = a[key];
          var val_b = b[key];
        }

        if (typeof val_a === 'string') {
          val_a = val_a.trim().toLowerCase();
          val_b = val_b.trim().toLowerCase();
        }

        if (val_a > val_b) {
          return 1;
        }
        if (val_a < val_b) {
          return -1;
        }
      }

      return 0;
    };
  };

  // Methods //////////////////////////////////////////////////////////////////

  // Own activity pages
  $.always(function() {
    // Detect whether we are viewing our own activity and to activate the dialog
    var edit_activity = $('.sidenav .edit-activity');

    // Seems to be truncated in size
    $('#heading span.title')
      .css('display', 'inline')
      ;

    if (edit_activity.length === 0) {
      return;
    }

    // Clicking the activity name launches the dialog
    $('#heading h2.activity-name')
      .css('cursor', 'pointer')
      .on('click', function() {
        edit_activity.click();
      })
      ;

    // Enter whilst editing the name saves the dialog
    $('body').on('keydown', '.lightbox.edit_activity input[type=text]', function (e) {
      if (e.keyCode === 13) {
        $(this)
          .parents('.lightbox')
          .find('input[type=submit]')
          .click()
          ;
      }
    });

    // CTRL+Enter whilst editing the name or description saves the dialog
    $('body').on('keydown', '.lightbox.edit_activity input[type=text], .lightbox.edit_activity textarea', function (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        $(this)
          .parents('.lightbox')
          .find('input[type=submit]')
          .click()
          ;
      }
    });

    $.setInterval(function() {
      // Disable autocomplete on the "Name" dialog
      $('.lightbox.edit_activity input[type=text]')
        .onceOnly()
        .attr('autocomplete', 'off')
        ;

      // Make description boxes bigger by default
      $('.lightbox.edit_activity textarea[name=description]')
        .onceOnly()
        .css('height', 130)
        ;
    }, 1000);
  });

  $.option('show_hidden_efforts', function() {
    $.setInterval(function() {
      $('div.show-hide-segments')
        .onceOnly()
        .find('button')
          .click()
        .end()
        ;
    }, 1000);
  });

  // Manual file upload
  $.always(function() {
    // Ctrl+enter whilst editing the name saves the dialog
    $('body').on('keydown', '.manual-entry input#activity_name, .manual-entry textarea', function (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        $(this)
          .parents('form')
          .find('input[type=submit]')
          .click()
          ;
      }
    });
  });

  // Manual activity input
  $.always(function() {
    if (window.location.pathname !== '/upload/manual') {
      return;
    }

    var type = $.urlParam('type');

    if (type !== undefined) {
      $('.upload-type li[data-value="' + type + '"] a').click().click();
    }

    $.each([
        'name'
      , 'description'
      , 'elapsed_time_hours'
      , 'elapsed_time_minutes'
      , 'elapsed_time_seconds'
      , 'description'
    ], function() {
      var name = this;
      var val = $.urlParam(name);

      if (val === undefined) {
        return;
      }

      var elem = jQuery('form#new_activity input, textarea, select').filter(function () {
        return $(this).attr('name') === 'activity[' + name + ']';
      });

      elem.val(val);

      // Sending a .change() signal ensures that the UI doesn't reset the
      // activity name to (eg.) "Morning Activity" if you adjust the time
      // considerably.
      elem.change();
    });
  });

  // Convert units on hover, etc.
  $.option('convert_units', function() {
    $.setInterval(function() {
      $('abbr.unit, span.unit')
        .onceOnly()
        .filter(function() {
          // Don't convert multi-"1h 30m" units. In this case we think "m"
          // means meters but we just don't support any of these.
          return $(this).siblings('.unit').length === 0;
        })
        .each(function() {
          var elem = $(this)
            .removeAttr('title')
            ;

          var container = elem.parent();

          var val = container
            .clone()
            // Don't remove all children; the value might be wrapped in <strong>
            .children('.unit')
              .remove()
            .end()
            .text()
            ;

          container
            .attr('title', $.convert(val, elem.text()))
            ;
        })
        ;
    }, 1000);
  });

  $.option('sort_starred_segments_first', function() {
    $('table.segments tr')
      .has('.starred.active')
      .reverse()
      .each(function () {
        var elem = $(this);
        elem
          .parents('tbody')
          .prepend(elem)
          ;
      })
      ;
  });

  // Hide calories on your own pages
  $.option('hide_calories', function() {
    if ($('.sidenav .edit-activity').length === 0) {
      return;
    }

    // Premium
    $('.section.more-stats table tr')
      .filter(function () {
          return $(this).find('th').text() === 'Calories';
      })
      .hide()
      ;

    // Non-premium
    $('.section.more-stats div')
      // Label
      .filter(function () {
          return $(this).text() === 'Calories';
      })
      .hide()

      // Value
      .next()
      .hide()
      ;
  });

  // Post comments on 'enter'
  $.option('comment_post_on_enter', function() {
    $(document).on('keydown', '.comments textarea', function(e) {
      if (e.keyCode !== 13) {
        return true;
      }

      $(this)
        .parents('form')
        .submit()
        ;

      return false;
    });
  });

  // Add external links 1/2
  $.option('external_links', function() {
    if (!$.defined('pageView')) {
      return;
    }

    // Need a little more room to include our links
    $('section#heading h1')
      .css({'width': '40%'})
      ;

    $.each([
        ["Veloviewer", 'http://veloviewer.com/activities/']
      , ["Raceshape", 'http://raceshape.com/url.redirect.php?url=http%3A%2F%2Fapp.strava.com%2Factivities%2F']
    ].reverse(), function() {
      $(
        '<div class="button-group">' +
          '<a href="#" class="button title"></a>' +
        '</div>'
      )
        .prependTo('section#heading .social')
        .find('a')
        .text(this[0])
        .css({
            'font-size': '12px'
          , 'line-height': '20px'
        })
        .attr('href', this[1] + pageView.activity().id)
        ;
    });
  });

  // Add external links 2/2
  $.option('external_links', function() {
    // Segment external links
    var m = window.location.pathname.match(/^\/segments\/(\d+)$/);

    if (m !== null) {
      $(
        '<div class="section">' +
          '<h3 class="marginless">External links</h3>' +
          '<ul style="list-style-type: disc; margin: 10px 0 0 25px;">' +
            '<li><a href="http://veloviewer.com/segment/' + m[1] + '">Veloviewer</a></li>' +
            '<li><a href="http://raceshape.com/strava-segments/' + m[1] + '">Race Shape</a></li>' +
            '<li><a href="http://everesting.io/?id=' + m[1] + '">Everesting.io</a></li>' +
          '</ul>' +
        '</div>'
      ).prependTo('.page .sidebar');
    }

    // Link to KOM Club
    $(
      '<li>' +
        '<button>KOM Club</button>' +
      '</li>'
    )
      .appendTo('#challenge-filters')
      .find('button')
      .css('margin-left', '18px')
      .on('click', function (e) {
        e.preventDefault();
        window.location.href = 'http://www.kom.club/';
      })
      ;
  });

  // Estimated FTP
  $.option('estimated_ftp', function() {
    $('#cpcurve-estimatedCP').click();
  });

  // Hide feed entries
  $.always(function() {
    $('div.feed>.feed-entry').setInterval(function() {
      // Match by CSS class
      $.each([
          ['hide_challenge_feed_entries', '.challenge']
        , ['hide_goal_feed_entries', '.performance-goal-created']
        , ['hide_promotion_feed_entries', '.promo, .membership']
      ], function() {
        var filter = this[1];

        $.option(this[0], function() {
          $('div.feed>.feed-entry')
            .filter(filter)
            .remove()
            ;
        });
      });

      // Match by text
      $('div.feed>.min-view').each(function() {
        var elem = $(this);
        var haystack = elem.find('.entry-title').html();

        $.each([
            ['hide_route_feed_entries', '> created the route, <']
          , ['hide_route_feed_entries', '> starred the route, <']
          , ['hide_club_feed_entries', '> joined <']
          , ['hide_club_feed_entries', '> created <']
          , ['hide_training_plan_feed_entries', ' started a training plan: ']
        ], function() {
          var option = this[0];
          var needle = this[1];

          $.option(option, function() {
            if (haystack.indexOf(needle) !== -1) {
              elem.remove();
            }
          });
        });
      });

      $.option('hide_turbo_trainer_rides', function() {
        $('div.feed>.feed-entry')
          .has('.type[title=Ride]')
          .not(':has(.activity-map)')
          .hide()
          ;

        $('div.feed>.feed-entry')
          .has('.type[title="Virtual Ride"]')
          .hide()
          ;

        $('div.feed>.feed-entry')
          .has('.entry-body a:contains("Zwift")')
          .hide()
          ;
      });

      // Remove any days that are now empty
      $('div.feed>.time-header').each(function() {
        var elem = $(this);

        // If it's a <div> it's probably visible
        var entries = elem
          .nextUntil('.time-header')
          .filter('div')
          ;

        if (entries.length === 0) {
          elem.remove();
        }
      });

      $.option('hide_invite_friends', function() {
        // Remove social buttons
        $('div.feed>.feed-entry')
          .find('.share')
            .hide()
          .end()
      });

      $.option('hide_premium_badges', function() {
        // Remove "Premium" badges
        $('.badge.premium')
          .hide()
          ;

        // Navigation
        $('header nav ul li.premium div.icon-strava')
          .hide()
          ;

        // Top of activity page
        $('header h1 div.badge')
          .hide()
          ;

        // Sidebar of profile
        $('div.section.profile .athlete-title .badge')
          .hide()
          ;

        // Tabs on profile
        $('.challenges-completed .badge')
          .hide()
          ;
      });

      $.always(function() {
        var elems = $('div.feed>.feed-entry .featured-achievements li')
          .filter(function() {
            var txt = $(this)
              .find('strong')
              .text()
              ;

            return /^\d+ (KOM|QOM|PR)$/.test(txt);
          })
          ;

        switch (options.annual_achievements) {
        case 'show':
          break;
        case 'unhighlight':
          elems
            .find('strong')
            .css('font-weight', 'normal')
            .text(function(idx, txt) {
              return '(' + txt + ')';
            })
            ;
          break;
        case 'hide':
          elems.hide();
          break;
        }
      });
    }, 1000);
  });

  // Hide shop in top-level navigation
  $.option('hide_shop', function() {
    $('header nav ul.global-nav li a[href*="/store"]')
      .remove()
      ;

    // "Free Strava Mobile app"
    $('#appUpsell')
      .hide()
      ;

    $('.sidebar .section')
      .has('.upsell-copy')
      .hide()
      ;

    // Don't link device name on activity pages to shop
    $('#heading .activity-stats .device a')
      .contents()
      .unwrap()
      ;

    // Shop module in footer
    $('footer .footer-promos .promo')
      .has('a[href*="/store"]')
      .children()
      .hide()
      ;
  });

  // Hide invite friends & social buttons
  $.option('hide_invite_friends', function() {
    // "Invite friends" in navbar
    $('header nav a.find-and-invite')
      .parent('li')
      .hide()
      ;

    // "Share your rides" on profile
    $('.sidebar .section')
      .has('#embed-athlete-widget')
      .hide()
      ;

    // Facebook, Twitter and share logos on activity page
    $('section#heading .social .sharing').hide();

    //// Dashboard

    // "You Should Follow"
    $('.sidebar #suggested-follow-module').hide();

    // "Find Your Friends On Strava"
    $('.sidebar #invite-your-friend-module').hide();
  });

  // Hide blog links
  $.option('hide_blog', function() {
    $.each([
        ['blog.strava.com']
      , ['2014story.strava.com']
      , ['www.strava.com/videos']
    ], function() {
      $('.sidebar .section')
        .has("a[href*='" + this + "']")
        .hide()
        ;
      ;
    });
  });

  $.option('hide_upcoming', function() {
    // Hide "Yearly Goals"
    $('.sidebar .section#yearly-progress-goals')
      .hide()
      ;
  });

  $.option('hide_upcoming', function() {
    // Upcoming races, events, goals
    $('.sidebar .section#upcoming-events')
      .not(':has(li)') // Show if we have upcoming events
      .hide()
      ;

    // Discover more races, etc.
    $('.sidebar .section#discover-more')
      .hide()
      ;
  });

  // Swap club and challenges
  $.option('swap_clubs_and_challenge_module', function() {
    $('.sidebar #club-module')
      .after($('.sidebar #challenge-module'))
      ;
  });

  // Infinite scroll
  $.option('infinite_scroll', function() {
    var url = window.location.pathname;

    if (!(
         (url.indexOf('/dashboard') === 0)
      || (url.indexOf('/clubs/') === 0 && url.indexOf('/recent_activity') > 0)
    )) {
      return;
    }

    var w = $(window);
    var container = $('.feed-container');

    var callback = function() {
      var elem = container
        .find('a.load-feed')
        ;

      if (elem.length === 0) {
        // Can't unbind as we may be waiting for another page to load
        return;
      }

      var offset = 300;
      var elem_top = elem.offset().top;
      var window_top = w.scrollTop();
      var window_bottom = w.height() + window_top;

      if ((elem_top >= window_top + offset) && (elem_top < window_bottom)) {
        elem
          .onceOnly()
          .click()
          ;
      }
    };

    w.scroll(callback);

    // Check on pageload too - we might have removed enough feed entries.
    callback();
  });

  // Upload activity
  $.option('improve_upload_activity', function() {
    if (window.location.pathname !== '/upload/select') {
      return;
    }

    $('body').on('keydown', '.uploads input[type=text]', function (e) {
      if (e.keyCode === 13) {
        $('footer .save-and-view').click();
      }
    });

    $('body').on('keydown', '.uploads input[type=text], .uploads textarea', function (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        var btn = $('footer .save-and-view');

        var poll = function() {
          if (btn.hasClass('disabled')) {
            btn.text("Please wait...");
            setTimeout(poll, 1000);
            return;
          }
          btn.click();
        };

        poll();
      }
    });

    $.setInterval(function() {
      // Make description boxes bigger by default
      $('textarea[name=description]')
        .onceOnly()
        .css('height', 160)
        ;

      // Disable autocomplete on the "Name" dialog
      $('input[type=text]')
        .onceOnly()
        .attr('autocomplete', 'off')
        ;
    }, 1000);
  });

  // Replace "--" with Unicode equivalents
  $.always(function() {
    $('body').on('keyup', '.uploads input[type=text], .lightbox.edit_activity input[type=text], .activities .training-activity-row .edit-col input[type=text], .manual-entry input#activity_name', function (e) {
      var elem = $(this);
      var s = elem
        .val()
        .replace(/\u00A0/g,' ') // for some <textarea> elements
        ;

      $.each({
          " - ": " — "
        , " -- ": " — "
        , " -> ": " → "
        , " > ": " → "
        , " < ": " ← "
        , " <- ": " ← "
        , " <-> ": " ↔ "
        , "(L)": "❤"
      }, function(x, y) {
        if ($.endsWith(s, x)) {
          elem.val(s.substr(0, s.length - x.length) + y);
        }
      });
    });
  });

  // Athlete profile
  $.always(function() {
    var profile_link = $('header .user-menu a');
    if (
         (profile_link.length === 0)
      || (profile_link.attr('href').indexOf(window.location.pathname) !== 0)
    ) {
      return;
    }

    $('<a>')
      .css('font-size', '20px')
      .css('margin-left', '8px')
      .attr('href', '/settings/profile')
      .text('(edit)')
      .appendTo('.page .main h1:first')
      ;

    $('.avatar.avatar-athlete img')
      .wrap('<a href="/settings/profile"></a>')
      ;
  });

  // Improved pagination
  $.option('improve_pagination', function() {
    if (!$.defined('pagingController')) {
      return;
    }

    var c = pagingController;

    $.setInterval(function() {
      $('.simple.pagination ul.switches')
        .onceOnly()

        // First
        .prepend('<li><span class="button first_page">First</span></li>')
        .find('.first_page')
          .on('click', function() {
            c.page = 1;
            c.paging_adapter.fetch(c.buildOptions());
          })
          .toggleClass('disabled', c.page == 1)
        .end()

        // Last
        .append('<li><span class="button last_page">Last</span></li>')
        .find('.last_page')
          .on('click', function() {
            c.page = c.pageInfo().pages;
            c.paging_adapter.fetch(c.buildOptions());
          })
          .toggleClass('disabled', c.page == c.pageInfo().pages)
        .end()
        ;
    }, 1000);
  });

  // Show running cadence by default
  $.option('running_cadence', function() {
    $.setInterval(function() {
      $('#elevation-profile td[data-type=cadence] .toggle-button')
        .onceOnly()
        .click()
        ;
    }, 1000);
  });

  // Show running heart rate by default
  $.option('running_heart_rate', function() {
    $.setInterval(function() {
      $('#elevation-profile td[data-type=heartrate] .toggle-button')
        .onceOnly()
        .click()
        ;
    }, 1000);
  });

  // Caculate running TSS
  $.option('running_tss', function() {
    if (!$.defined('Strava.Labs.Activities.PaceZones.prototype.getPaceZones')) {
      return;
    }

    var TSS_PER_HOUR = {
        'Z1':  55
      , 'Z2':  75
      , 'Z3':  90
      , 'Z4': 100
      , 'Z5': 120
      , 'Z6': 145
    };

    var view = Strava.Labs.Activities.PaceZones;
    var fn = view.prototype.getPaceZones;

    view.prototype.getPaceZones = function () {
      var result = fn.apply(this, Array.prototype.slice.call(arguments));

      var tss = 0;
      $.each(this.paceZones, function (i, item) {
        // Re-parse the time (eg. "23s" / "32:21")
        var parts = item.time.replace('s', '').split(':').reverse();
        var seconds = parts.reduce(function (prev, cur, idx) {
            return prev + (cur * Math.pow(60, idx));
        }, 0);

        // Calculate the contribution to TSS
        tss += TSS_PER_HOUR[item.name] / 3600 * seconds;
      });

      $('#view .inline-stats').append(
        '<li><strong>' + Math.round(tss) + '</strong><div class="label">TSS (estimated)</div></li>'
      );

      return result;
    };
  });

  // Repated segments
  $.option('repeated_segments', function() {
    if (!$.defined('pageView.segmentEfforts')) {
      return;
    }

    var data = {};
    var elevation_unit = null;

    // Calculate for both regular and hidden efforts
    var efforts = $.merge(
        pageView.segmentEfforts().models
      , pageView.segmentEfforts().hiddenSegmentEfforts
    );

    // Find total raw times by segment ID
    $.each(efforts, function() {
      var segment_id = this.attributes.segment_id;

      var m_distance = this.attributes.distance.match(/^([\d\.]+)(.*)/);
      var m_elev_difference = this.attributes.elev_difference.match(/^(\d+)(.*)/);

      data[segment_id] = data[segment_id] || {
        'segment_id': segment_id,
        'times': [],
        'title': this.attributes.name,
        'starred': this.attributes.starred_by_current_athlete,
        'distance': parseFloat(m_distance[1]),
        'distance_unit': m_distance[2],
        'elev_difference': parseInt(m_elev_difference[1], 10),
        'elev_difference_unit': m_elev_difference[2]
      };

      data[segment_id].times.push({
        'seconds': this.attributes.elapsed_time_raw,
        'segment_effort_id': this.id
      });
    });

    // Annotate with aggregate data
    $.each(data, function() {
      var sum = 0;
      var max = {
        'seconds': 0,
        'segment_effort_id': null
      };
      var min = {
        'seconds': 99999999,
        'segment_effort_id': null
      };

      $.each(this.times, function() {
        sum += this.seconds;
        max = (this.seconds > max.seconds) ? this : max;
        min = (this.seconds < min.seconds) ? this : min;
      });

      $.extend(this, {
        'max': max,
        'min': min,
        'sum': sum,
        'count': this.times.length,
        'average': Math.floor(sum / this.times.length)
      });
    });

    // Flatten and sort
    data = $.map(data, function(elem) { return elem; });
    data.sort(keySort('-starred', '-count', 'title'));

    $.setInterval(function() {
      var section = $('section.segments-list')
        .not('.collapsed')
        .onceOnly()
        ;

      if (section.length === 0) {
        return;
      }

      var table = $(
        '<table class="striped">' +
          '<thead>' +
            '<tr>' +
              '<th>&nbsp;</th>' +
              '<th>Name</th>' +
              '<th>Count</th>' +
              '<th>Fastest</th>' +
              '<th>Slowest</th>' +
              '<th>Average</th>' +
              '<th>Total</th>' +
              '<th>Distance</th>' +
              '<th>Elevation</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody></tbody>' +
        '</table>'
      ).appendTo(section);

      $.each(data, function() {
        var row = this;

        // Only add repeated rows
        if (this.count < 2) {
          return;
        }

        var tr = $(
          '<tr>' +
            '<td><div class="starred" style="cursor: default;">★</div></td>' +
            '<td><a class="title" href="#"</a></td>' +
            '<td>' + row.count.toLocaleString() + '</td>' +
            '<td><a href="#" class="min">' + $.toSeconds(row.min.seconds) + '</a></td>' +
            '<td><a href="#" class="max">' + $.toSeconds(row.max.seconds) + '</a></td>' +
            '<td>' + $.toSeconds(row.average) + '</td>' +
            '<td>' + $.toSeconds(row.sum) + '</td>' +
            '<td>' + (row.count * row.distance).toLocaleString() + row.distance_unit + '</td>' +
            '<td>' + (row.count * row.elev_difference).toLocaleString() + row.elev_difference_unit + '</td>' +
          '</tr>'
        ).appendTo(table.find('tbody'));

        tr.find('a.title')
          .attr('href', '/segments/' + row.segment_id)
          .text(row.title)
          ;

        tr.find('.starred')
          .toggleClass('active', row.starred)
          ;

        $.each(['min', 'max'], function() {
          var min_max = this;

          tr.find('a.' + min_max).click(function(e) {
            var elem = $(
              'tr[data-segment-effort-id=' + row[min_max].segment_effort_id + ']'
            );

            // Scroll into view. Doesn't work perfectly at the moment if a
            // segment is already open.
            $('html, body')
              .scrollTop(elem.offset().top)
              ;

            // Passthrough click
            elem.trigger(e);

            return false;
          });
        });
      })
    }, 1000);
  });

  // Show "running" tab by default
  $.option('side_by_side_running', function() {
    $.setInterval(function() {
      $('.section.comparison .running-tab')
        .onceOnly()
        .click()
        ;
    }, 1000);
  });

  // Show the standard Google map, not the terrain one
  $.option('standard_google_map', function() {
    $.setInterval(function() {
      $('a.map-type-selector[data-map-type-id=standard]')
        .onceOnly()
        .click()
        .parents('.drop-down-menu') // Close menu
        .click()
        ;
    }, 1000);
  });

  // Calculate a cycling variability index by default
  $.option('variability_index', function() {
    if (!$.defined('pageView')) {
      return;
    }

    var elem = $('span[data-glossary-term=definition-weighted-average-power]')
      .parents('li');

    var np = parseInt(elem.find('strong').text(), 10);
    var ap = pageView.activity().get('avgWatts');

    $('<li><strong>X</strong><div class="label">Variability Index</div></li>')
      .insertAfter(elem)
      .find('strong')
      .text((np / ap).toFixed(2))
      ;
  });

  $.option('enlarge_on_hover', function() {
    function onHover(src, css, handlerIn, handlerOut) {
      css = $.extend({
          'z-index': 99999
      }, css);

      $('body')
        .on('mouseover', src, function() {
          var elem = $(this);

          typeof handlerIn === 'function' && handlerIn.apply(this);

          elem
            // Save original CSS
            .data('original-css', elem.css($.keys(css)))

            // Apply target CSS
            .css(css)
            ;
        })
        .on('mouseout', src, function() {
          var elem = $(this);

          typeof handlerOut === 'function' && handlerOut.apply(this);

          // Restore original CSS
          elem.css(elem.data('original-css') || {});
        })
        ;
    };

    // Mouseover on feed avatars makes them bigger
    onHover('.feed-entry .avatar-md', {
        'width': 80
      , 'height': 80
      // Use absolute positioning so we don't move stuff out of the way
      , 'position': 'absolute'
    }, function() {
      $(this)
        // Use a higher-resolution bigger image
        .find('img')
          .attr('src', function (i, val) {
            return val.replace('/medium.jpg', '/large.jpg');
          })
        ;
    });

    // Mouseover on map makes them bigger
    var width = 250;
    var height = 135;
    onHover('.feed-entry .activity-map', {
        'width': width
      , 'height': height
      , 'margin-left': 0
    }, function() {
      var elem = $(this);

      elem
        .find('.leaflet-container')
          .css('z-index', 99999)
        .end()
        .find('.leaflet-map-pane')
          .css({
              'margin-top': (height - elem.height()) / 2
            , 'margin-left': (width - elem.width()) / 2
          })
        .end()
        ;
    }, function() {
      $(this)
        .find('.leaflet-container')
          .css('z-index', 'inherit')
        .end()
        .find('.leaflet-map-pane')
          .css({
              'margin-top': 0
            , 'margin-left': 0
          })
        .end()
        ;
    });

    // Mouseover on Instagram images makes them bigger
    onHover('.feed-entry .photostream li', {
        'width': 300
      , 'height': 300
    }, function() {
      $(this)
        // Use a higher-resolution bigger image (if we aren't using the FB CDN)
        .find('img')
          .attr('src', function (i, val) {
            return val.replace('?size=t', '?size=l');
          })
        ;
    });

    // Mouseover on condensed athlete list in feed makes them bigger
    onHover('.feed-entry.challenge .list-athletes img', {
        'width': 60
      , 'height': 60
      , 'position': 'absolute'
    });
  });

  // Fix athlete search forgetting values
  $.always(function() {
    if (window.location.pathname.indexOf('/activities/search') !== 0) {
      return;
    }

    if ($.urlParam('location') === undefined) {
      return;
    }

    $.each([
        'elev_gain'
      , 'distance'
      , 'time'
    ], function() {
      var name = this;

      $('.slider#' + name).slider('values', [
          parseInt($.urlParam(name + '_start'), 10)
        , parseInt($.urlParam(name + '_end'), 10)
      ]);
    });
  });

  // Show same-activity Flybys only (runs or rides) in the Flyby viewer.
  $.option('show_same_activity_flybys', function() {
    if (window.location.pathname.indexOf('/flyby/viewer') !== 0) {
      return;
    }

    $.setInterval(function() {
      // Wait until the activities table is loaded before clicking the button.
      // Strava JS hides a #table_loading div when ready.
      if ($('#table_loading').css('display') !== 'none') {
        return;
      }

      // Click the "Runs only" / "Rides only" checkbox.
      $('input#hide_different_activity_type')
        .onceOnly()
        .click()
        ;
    }, 1000);
  });
}

StravaEnhancementSuite.prototype.switch_units = function() {
  var $ = jQuery;

  var url = $("a:contains(My Profile)[href^='/athletes/']").attr('href');
  var target = window._measurement_preference == 'meters' ? 'feet' : 'meters';
  var athlete_id = parseInt(url.split('/')[2], 10);

  (new Strava.Athletes.Athlete(url, athlete_id)).save(
    'measurement_preference',
    target,
    {'success': function(x) { window.location.reload(); } }
  );
};
