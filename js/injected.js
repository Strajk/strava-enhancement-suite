function StravaEnhancementSuite(options) {
  this.options = options;

  this.comment_post_on_enter();
  this.estimated_ftp();
  this.external_links();
  this.hide_feed_entries();
  this.hide_invite_friends();
  this.infinite_scroll();
  this.leaderboard_default();
  this.manual_upload();
  this.repeated_segments();
  this.pagination();
  this.running_cadence();
  this.running_heart_rate();
  this.running_tss();
  this.side_by_side_running();
  this.standard_google_map();
  this.variability_index();

  this.activity();
  this.flyby();
  this.profile();
};

StravaEnhancementSuite.prototype.activity = function() {
  // Detect whether we are viewing our own activity and to activate the dialog
  var edit_activity = jQuery('.sidenav .edit-activity');

  // Seems to be truncated in size
  jQuery('#heading span.title')
    .css('display', 'inline')
    ;

  // Don't link device name to shop
  jQuery('#heading .activity-stats .device a')
    .contents()
    .unwrap()
    ;

  if (edit_activity.length === 0) {
    return;
  }

  jQuery('#heading h2.activity-name')
    .css('cursor', 'pointer')
    .on('click', function() {
      edit_activity.click();
    })
    ;

  jQuery('body').on('keydown', '.lightbox.edit_activity input[type=text]', function (e) {
    if (e.keyCode === 13) {
      jQuery(this).parents('.lightbox').find('input[type=submit]').click();
    }
  });

  jQuery('body').on('keydown', '.lightbox.edit_activity input[type=text], .lightbox.edit_activity textarea', function (e) {
    if (e.ctrlKey && e.keyCode === 13) {
      jQuery(this).parents('.lightbox').find('input[type=submit]').click();
    }
  });
};

StravaEnhancementSuite.prototype.comment_post_on_enter = function() {
  if (this.options.comment_post_on_enter === false) {
    return;
  }

  jQuery(document).on('keydown', '.comments textarea', function(e) {
    if (e.keyCode !== 13) {
      return true;
    }

    jQuery(this).parents('form').submit();

    return false;
  });
};

StravaEnhancementSuite.prototype.external_links = function() {
  if (this.options.external_links === false) {
    return;
  }

  if (this.defined('pageView')) {
    // Need a little more room to include our links
    jQuery('section#heading h1')
      .css({'width': '40%'})
      ;

    jQuery.each([
        ["Flyby", 'http://labs.strava.com/flyby/viewer/#']
      , ["Veloviewer", 'http://veloviewer.com/activities/']
      , ["Raceshape", 'http://raceshape.com/url.redirect.php?url=http%3A%2F%2Fapp.strava.com%2Factivities%2F']
    ].reverse(), function() {
      jQuery(
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
  }

  // Segment external links
  var m = window.location.pathname.match(/^\/segments\/(\d+)$/);

  if (m !== null) {
    jQuery(
      '<div class="module">' +
        '<h3 class="marginless">External links</h3>' +
        '<ul style="list-style-type: disc; margin: 10px 0 0 25px;">' +
          '<li><a href="http://veloviewer.com/segment/' + m[1] + '">Veloviewer</a></li>' +
          '<li><a href="http://raceshape.com/strava-segments/' + m[1] + '">Race Shape</a></li>' +
        '</ul>' +
      '</div>'
    ).prependTo('.pageContent .sidebar');
  }

  // Link to KOM Club
  jQuery(
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
};

StravaEnhancementSuite.prototype.estimated_ftp = function() {
  if (this.options.estimated_ftp === false) {
    return;
  }

  jQuery('#cpcurve-estimatedCP').click();
};

StravaEnhancementSuite.prototype.hide_feed_entries = function() {
  var that = this;

  setInterval(function() {
    jQuery.each([
        ['hide_challenge_feed_entries', '.challenge, .promo']
      , ['hide_goal_feed_entries', '.performance-goal-created']
    ], function() {
      if (that.options[this[0]]) {
        jQuery('div.feed>.feed-entry').filter(this[1]).remove();
      }
    });

    jQuery('div.feed>.min-view').each(function() {
      var elem = jQuery(this);
      var html = elem.find('.entry-title').html();

      jQuery.each([
          ['hide_route_feed_entries', '> created the route, <']
        , ['hide_club_feed_entries', '> joined <']
        , ['hide_club_feed_entries', '> created <']
      ], function() {
        if ((that.options[this[0]]) && (html.indexOf(this[1]) !== -1)) {
          elem.remove();
        }
      });
    });

    // Remove any days that are now empty
    jQuery('div.feed>.header').each(function() {
      var elem = jQuery(this);

      if (elem.nextUntil('.row.header').not('script').length === 0) {
        elem.remove();
      }
    });

    // Remove social buttons
    if (that.options.hide_invite_friends === true) {
      jQuery('div.feed>.feed-entry .share')
        .hide()
        ;
    }
  }, 1000);
};

StravaEnhancementSuite.prototype.hide_invite_friends = function() {
  if (this.options.hide_invite_friends === false) {
    return;
  }

  // "Invite friends" in navbar
  jQuery('header nav a.find-and-invite')
    .parent('li')
    .hide()
    ;

  // "Share your rides" on profile
  jQuery('.sidebar .section')
    .has('#embed-athlete-widget')
    .hide()
    ;

  // Facebook, Twitter and share logos on activity page
  jQuery('section#heading .social .sharing').hide();

  //// Dashboard

  // "You Should Follow"
  jQuery('.sidebar #suggested-follow-module').hide();

  // "Find Your Friends On Strava"
  jQuery('.sidebar #invite-your-friend-module').hide();

  // Strava blog link in sidebar (currently "Vuelta")
  jQuery('.sidebar .section')
    .has('a[href*=blog\\.strava\\.com]')
    .hide()
    ;

  // FIXME: These are not social networking related

  // Upcoming races, events, goals
  jQuery('.sidebar .section#upcoming-events')
    .not(':has(li)') // Show if we have upcoming events
    .hide()
    ;

  // Discover more races, etc.
  jQuery('.sidebar .section#discover-more').hide();

  // Swap club and challenges
  jQuery('.sidebar #club-module')
    .after(jQuery('.sidebar #challenge-module'))
    ;
};

StravaEnhancementSuite.prototype.infinite_scroll = function() {
  if (this.options.infinite_scroll === false) {
    return;
  }

  var url = window.location.pathname;

  if (url.indexOf('/dashboard') !== 0) {
    return;
  }

  var w = jQuery(window);
  var container = jQuery('.feed-container');

  w.scroll(function() {
    var elem = container.find('a.load-feed');

    if (elem.length === 0) {
      // Can't unbind as we may be waiting for another page to load
      return;
    }

    var offset = 100;
    var elem_top = elem.offset().top;
    var window_top = w.scrollTop();
    var window_bottom = w.height() + window_top;

    if ((elem_top >= window_top + offset) && (elem_top < window_bottom)) {
      elem.click().remove();
    }
  });
};

StravaEnhancementSuite.prototype.leaderboard_default = function() {
  if (this.options.leadeboard_default === 'overall') {
    return;
  }

  if (!this.defined('Strava.Labs.Activities.SegmentLeaderboardView.prototype.render')) {
    return;
  }

  var view = Strava.Labs.Activities.SegmentLeaderboardView;
  var fn = view.prototype.render;

  var leaderboard_default = this.options.leaderboard_default;

  view.prototype.render = function () {
    var result = fn.apply(this, Array.prototype.slice.call(arguments));

    jQuery(this.el)
      .not('.once-only')
      .addClass('once-only')
      .find('.clickable[data-filter=' + leaderboard_default + ']')
      .click()
      ;

    return result;
  };
};

StravaEnhancementSuite.prototype.flyby = function() {
  if (jQuery('#playback-controls').length === 0) {
    return;
  }

  jQuery('<div><input type="checkbox"> Select all</div>')
    .prependTo('#sidebar-checkboxes')
    .find('input')
    .on('change', function() {
      var elem = jQuery(this);

      // Disable some fancy hash handling reload, otherwise calling .change()
      // reloads the page when unselecting.
      window.onhashchange = function() {};

      jQuery('#activity_table input[type=checkbox]')
        .prop('checked', elem.prop('checked'))
        .change()
        ;

      return true;
    })
};

StravaEnhancementSuite.prototype.manual_upload = function() {
  if (window.location.pathname !== '/upload/select') {
    return;
  }

  jQuery('body').on('keydown', '.uploads input[type=text]', function (e) {
    if (e.keyCode === 13) {
      jQuery('footer .save-and-view').click();
    }
  });

  jQuery('body').on('keydown', '.uploads input[type=text], .uploads textarea', function (e) {
    if (e.ctrlKey && e.keyCode === 13) {
      var btn = jQuery('footer .save-and-view');

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
};

StravaEnhancementSuite.prototype.profile = function() {
  if (window.location.pathname.indexOf(jQuery('header .user-menu a').attr('href')) !== 0) {
    return;
  }

  jQuery('<a>')
    .css('font-size', '20px')
    .css('margin-left', '8px')
    .attr('href', '/settings/profile')
    .text('(edit)')
    .appendTo('.page .main h1:first')
    ;

  jQuery('.avatar.avatar-athlete img')
    .wrap('<a href="/settings/profile"></a>')
    ;
};

StravaEnhancementSuite.prototype.pagination = function() {
  if (!this.defined('pagingController')) {
    return;
  }

  setInterval(function() {
    jQuery('.simple.pagination ul.switches')
      .not('.once-only')
      .addClass('once-only')

      // First
      .prepend('<li><span class="button first_page">First</span></li>')
      .find('.first_page')
        .on('click', function() {
          pagingController.page = 1;
          pagingController.paging_adapter.fetch(pagingController.buildOptions());
        })
        .toggleClass('disabled', pagingController.page == 1)
      .end()

      // Last
      .append('<li><span class="button last_page">Last</span></li>')
      .find('.last_page')
        .on('click', function() {
          pagingController.page = pagingController.pageInfo().pages;
          pagingController.paging_adapter.fetch(pagingController.buildOptions());
        })
        .toggleClass('disabled', pagingController.page == pagingController.pageInfo().pages)
      .end()
      ;
  }, 1000);
};

StravaEnhancementSuite.prototype.running_cadence = function() {
  if (this.options.running_cadence === false) {
    return;
  }

  setInterval(function() {
    jQuery('#elevation-profile td[data-type=cadence] .toggle-button')
      .not('.once-only')
      .addClass('once-only')
      .click()
      ;
  }, 1000);
};

StravaEnhancementSuite.prototype.running_heart_rate = function() {
  if (this.options.running_heart_rate === false) {
    return;
  }

  setInterval(function() {
    jQuery('#elevation-profile td[data-type=heartrate] .toggle-button')
      .not('.once-only')
      .addClass('once-only')
      .click()
      ;
  }, 1000);
};

StravaEnhancementSuite.prototype.running_tss = function() {
  if (this.options.running_tss === false) {
    return;
  }

  if (!this.defined('Strava.Labs.Activities.PaceZones.prototype.getPaceZones')) {
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
    jQuery.each(this.paceZones, function (i, item) {
      // Re-parse the time (eg. "23s" / "32:21")
      var parts = item.time.replace('s', '').split(':').reverse();
      var seconds = parts.reduce(function (prev, cur, idx) {
          return prev + (cur * Math.pow(60, idx));
      }, 0);

      // Calculate the contribution to TSS
      tss += TSS_PER_HOUR[item.name] / 3600 * seconds;
    });

    jQuery('#view .inline-stats').append(
      '<li><strong>' + Math.round(tss) + '</strong><div class="label">TSS (estimated)</div></li>'
    );

    return result;
  };
};

StravaEnhancementSuite.prototype.repeated_segments = function() {
  if (this.options.repeated_segments === false) {
    return;
  }

  if (!this.defined('pageView')) {
    return;
  }

  var data = {};
  var that = this;
  var elevation_unit = null;

  // Find total raw times by segment ID
  jQuery.each(pageView.segmentEfforts().models, function() {
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
  jQuery.each(data, function() {
    var sum = 0;
    var max = {
      'seconds': 0,
      'segment_effort_id': null
    };
    var min = {
      'seconds': 99999999,
      'segment_effort_id': null
    };

    jQuery.each(this.times, function() {
      sum += this.seconds;
      max = (this.seconds > max.seconds) ? this : max;
      min = (this.seconds < min.seconds) ? this : min;
    });

    jQuery.extend(this, {
      'max': max,
      'min': min,
      'sum': sum,
      'count': this.times.length,
      'average': Math.floor(sum / this.times.length)
    });
  });

  // Flatten and sort
  data = jQuery.map(data, function(elem) { return elem; });
  data.sort(that.keySort('-starred', '-count', 'title'));

  setInterval(function() {
    var section = jQuery('section.segments-list')
      .not('.collapsed')
      .not('.once-only')
      .addClass('once-only')
      ;

    if (section.length === 0) {
      return;
    }

    var table = jQuery(
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

    jQuery.each(data, function() {
      var row = this;

      // Only add repeated rows
      if (this.count < 2) {
        return;
      }

      var tr = jQuery(
        '<tr>' +
          '<td><div class="starred" style="cursor: default;">★</div></td>' +
          '<td><a class="title" href="#"</a></td>' +
          '<td>' + row.count.toLocaleString() + '</td>' +
          '<td><a href="#" class="min">' + that.toSeconds(row.min.seconds) + '</a></td>' +
          '<td><a href="#" class="max">' + that.toSeconds(row.max.seconds) + '</a></td>' +
          '<td>' + that.toSeconds(row.average) + '</td>' +
          '<td>' + that.toSeconds(row.sum) + '</td>' +
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

      jQuery.each(['min', 'max'], function() {
        var min_max = this;

        tr.find('a.' + min_max).click(function(e) {
          var elem = jQuery(
            'tr[data-segment-effort-id=' + row[min_max].segment_effort_id + ']'
          );

          // Scroll into view. Doesn't work perfectly at the moment if a
          // segment is already open.
          jQuery('html, body').scrollTop(elem.offset().top);

          // Passthrough click
          elem.trigger(e);

          return false;
        });
      });
    })
  }, 1000);
};

StravaEnhancementSuite.prototype.side_by_side_running = function() {
  if (this.options.side_by_side_running === false) {
    return;
  }

  setInterval(function() {
    jQuery('.section.comparison .running-tab')
      .not('.once-only')
      .addClass('once-only')
      .click()
      ;
  }, 1000);
};

StravaEnhancementSuite.prototype.standard_google_map = function() {
  if (this.options.standard_google_map === false) {
    return;
  }

  setInterval(function() {
    jQuery('a.map-type-selector[data-map-type-id=standard]')
      .not('.once-only')
      .addClass('once-only')
      .click()
      .parents('.drop-down-menu') // Close menu
      .click()
      ;
  }, 1000);
};

StravaEnhancementSuite.prototype.switch_units = function() {
  var url = jQuery("a:contains(My Profile)[href^='/athletes/']").attr('href');
  var target = window._measurement_preference == "meters" ? "feet" : "meters";
  var athlete_id = parseInt(url.split('/')[2], 10);

  (new Strava.Athletes.Athlete(url, athlete_id)).save(
    "measurement_preference",
    target,
    {"success": function(x) { window.location.reload(); } }
  );
};

StravaEnhancementSuite.prototype.variability_index = function() {
  if (this.options.variability_index === false) {
    return;
  }

  if (!this.defined('pageView')) {
    return;
  }

  var elem = jQuery('span[data-glossary-term=definition-weighted-average-power]')
    .parents('li');

  var np = parseInt(elem.find('strong').text(), 10);
  var ap = pageView.activity().get('avgWatts');

  jQuery('<li><strong>X</strong><div class="label">Variability Index</div></li>')
    .insertAfter(elem)
    .find('strong')
    .text((np / ap).toFixed(2));
};

// Utilities

StravaEnhancementSuite.prototype.defined = function(val) {
  try {
    eval(val);
    return true;
  } catch (err) {
    return false;
  }
};

StravaEnhancementSuite.prototype.toSeconds = function(s) {
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
};

StravaEnhancementSuite.prototype.keySort = function() {
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
