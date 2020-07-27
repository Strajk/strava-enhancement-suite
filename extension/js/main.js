const notyf = new window.Notyf({ duration: 5000, dismissable: true });

const StravaEnhancementSuiteHelpers = {
  keySort: (...keys) => function (a, b) {
    for (const key of keys) {
      let valA, valB;
      if (key.startsWith('-')) {
        valA = b[key.slice(1)];
        valB = a[key.slice(1)];
      } else {
        valA = a[key];
        valB = b[key];
      }

      // TODO: Verify that it works for localized strings
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
      if (typeof valA === 'string') {
        valA = valA.trim().toLowerCase();
        valB = valB.trim().toLowerCase();
      }

      if (valA > valB) {
        return 1;
      }
      if (valA < valB) {
        return -1;
      }
    }
    return 0;
  },
  formatSecondsToHhMm: x => {
    x = x / 60; // seconds to minutes
    const h = Math.floor((x / 60));
    const m = Math.round(((x / 60) - h) * 60);
    const mm = ('00' + m).substring(String(m).length); // pad
    return `${h}h${mm}m`;
  },
  notify: (message, type = 'success') => {
    // TODO: Consider reusing existing notifications from Strava website
    // BUT: I was not able to make styling work properly
    // AND: It seems that styles are not loaded on new react-only pages at all
    /*
      const alert = new window.Strava.Ui.AlertView({
        persist: true, // dismissTime
        messageSubject: 'Subject',
        messageBody: 'BODY',
        alertType: 'info',
        className: 'info',
      });
      alert.show();
    */
    notyf.open({ message, type });
  },
  // TODO: Automate or at least verify
  activities: {
    alpine_ski: 'Alpine Ski',
    backcountry_ski: 'Backcountry Ski',
    canoeing: 'Canoe',
    crossfit: 'Crossfit',
    e_bike_ride: 'E-Bike Ride',
    elliptical: 'Elliptical',
    golf: 'Golf',
    handcycle: 'Handcycle',
    hike: 'Hike',
    ice_skate: 'Ice Skate',
    inline_skate: 'Inline Skate',
    kayaking: 'Kayaking',
    kitesurf: 'Kitesurf',
    nordic_ski: 'Nordic Ski',
    ride: 'Ride',
    rock_climbing: 'Rock Climb',
    roller_ski: 'Roller Ski',
    rowing: 'Rowing',
    run: 'Run',
    sail: 'Sail',
    skateboard: 'Skateboard',
    snowboard: 'Snowboard',
    snowshoe: 'Snowshoe',
    soccer: 'Soccer',
    stair_stepper: 'Stair-Stepper',
    stand_up_paddling: 'Stand Up Paddling',
    surfing: 'Surfing',
    swim: 'Swim',
    velomobile: 'Velomobile',
    virtual_ride: 'Virtual Ride',
    virtual_run: 'Virtual Run',
    walk: 'Walk',
    water_sport: 'Water Sport',
    weight_training: 'Weight Training',
    wheelchair: 'Wheelchair',
    windsurf: 'Windsurf',
    winter_sport: 'Winter Sport',
    workout: 'Workout',
    yoga: 'Yoga',
  },
};

function StravaEnhancementSuite($, options) {
  const helpers = StravaEnhancementSuiteHelpers;

  // Options
  const defaults = {};
  Object.entries(StravaEnhancementSuiteOptions).forEach(([key, val]) => {
    defaults[key] = val.default;
  });
  options = Object.assign({}, defaults, options);

  this.options = options; // make available for debugging purposes

  $.fn.extend({
    onceOnly: function () {
      return this
        .not('.__STRAVA_ENHANCEMENT_SUITE__once-only')
        .addClass('__STRAVA_ENHANCEMENT_SUITE__once-only');
    },
    reverse: function () {
      return this.pushStack(this.get().reverse(), arguments);
    },

    // For debugging
    clickFake: function () {
      return this.css('outline', '3px solid red');
    },
  });

  $.extend({
    keys: function (obj) {
      var a = [];
      $.each(obj, function(k) { a.push(k); });
      return a;
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
          + ((secs * conv) % 60).toFixed(0);
        return [
          pace + u1,
          (60 * 60 / secs).toFixed(1) + u2,
          (60 * 60 / secs / conv).toFixed(1) + u3,
        ].join(' — ');
      };

      var swimPace = function(x, conv, suffix) {
        var secs = $.parseSeconds(x);

        return Math.floor((secs * conv) / 60).toFixed(0)
          + ':'
          + (((secs * conv) % 60 < 10) ? '0' : '')
          + ((secs * conv) % 60).toFixed(0)
          + suffix;
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
        r += '0' + hours;
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
    },
  });


  // Methods //////////////////////////////////////////////////////////////////

  // Own activity page
  $.option('activity_shortcuts', function() {
    // Detect whether we are viewing our own activity and to activate the dialog
    var edit_activity = $('a[title="Edit this activity"]');

    if (edit_activity.length === 0) {
      return;
    }

    // Edit activity by clicking on it's name
    $('.activity-name')
      .css('cursor', 'pointer')
      .on('click', function() {
        location.pathname = edit_activity.attr('href');
      });

    // Edit activity by pressing "e"
    $('body').on('keydown', function (e) {
      if (e.key === 'e') {
        location.pathname = edit_activity.attr('href');
      }
    });
  });

  $.option('submit_forms_with_keyboard', function() {
    function bind(selectors, cb) {
      $(document).on('keydown', selectors.join(', '), function(ev) {
        if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') {
          cb(this);
          return false;
        }
      });
    }

    // Comments
    bind([
      '.comments textarea',
    ], el => {
      // Click of Post button instead of submitting is important,
      // cause click handler also takes care of textarea clearing and possibly other stuff
      // Note: Verify both on dashboard and activity page
      $(el).parents('form').find('button:first').click();
    });


    // Activity editing
    if (/^\/activities\/\d+\/edit$/.test(window.location.pathname)) {
      bind([
        '#edit-activity #activity_name',
        '#edit-activity #activity_description',
      ], el => {
        $('#edit-activity').submit();
      });
    }

    // Training editing
    if (window.location.pathname.startsWith('/athlete/training')) {
      bind([
        '.table-activity-edit #name',
        '.table-activity-edit #description',
      ], el => {
        $(el).closest('form').find('button[type=submit]').click();
      });
    }

    // Upload: File
    if (window.location.pathname === '/upload/select') {
      const submit = () => { // eslint-disable-line no-inner-declarations
        const btn = $('footer .save-and-view');
        function poll() {
          if (btn.hasClass('disabled')) {
            btn.text('Please wait...');
            setTimeout(poll, 1000);
          }
          btn.click();
        }
        poll();
      };
      bind([
        '.uploads input[type=text]',
        '.uploads textarea',
      ], el => {
        submit();
      });
    }

    // Upload: Manual
    if (window.location.pathname === '/upload/manual') {
      bind([
        '.manual-entry input#activity_name',
        '.manual-entry textarea',
      ], el => {
        $(el)
          .closest('form')
          .find('input[type=submit]')
          .click();
      });
    }

  });


  // Own activity page: editing
  $.option('activity_edit_ux', function() {
    if (location.pathname.startsWith('/activities') && location.pathname.endsWith('/edit')) {

      $('#edit-activity #activity_name').onceOnly()
        .attr('autocomplete', 'off')
        .focus();

    } else if (location.pathname === '/athlete/training') {

      $('table.activities').on('click', '.quick-edit', function(ev) {
        $(ev.target).parents('tr').find('.edit-col input[name=name]').focus();
      });

    }
  });

  $.option('keyboard_controls', function () {
    /*
    * Up (previous)  – J
    * Down (next)    – K
    * Kudos (like)   – L
    * Comment        – C
    * Go to activity – Enter (hold shift to open in new tab/window)
    * Edit activity  – E (hold shift to open in new tab/window)
    * Go to athlete  – U (hold shift to open in new tab/window)
    */
    if (!location.pathname.startsWith('/dashboard')) return;

    let activeEntry;

    // .activity without id would match also group activity, just [id^="Activity-"] would match comment threads
    // :visible will omit activities hidden by other features on this extensions (eg. virtual rides)
    const selector = '.activity[id^="Activity-"]:visible';
    const setActiveEntry = (el) => {
      if (activeEntry) activeEntry.style.outline = '0';
      activeEntry = el;
      activeEntry.style.outline = '1px solid #F9531E'; // Strava brand orange
      // native `scrollIntoView` not possible due to header with fixed position
      const absoluteOffset = $(activeEntry).offset().top; // Cannot use .offsetTop as that is relative to it's positioned parent, not whole window
      window.scroll(0, absoluteOffset - (55 + 10)); // 55 ~ header height, 10 - padding
    };

    $(document).on('keydown', function (ev) {
      if (
        document.activeElement && (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.isContentEditable // not needed atm, but future proof
        )
      ) return true; // Do not handle

      if (['j', 'k'].includes(ev.key)) {
        if (!activeEntry) {
          const firstVisible = $(selector).toArray().find(x => $(x).offset().top > window.scrollY);
          setActiveEntry(firstVisible);
        } else {
          const all = $(selector).toArray();
          const currentIndex = all.indexOf(activeEntry);
          if (
            (ev.key === 'k' && currentIndex === 0) || // first, cannot go up
            (ev.key === 'j' && currentIndex === (all.length - 1)) // last, cannot go down
          ) return false;
          const target = all[currentIndex + (ev.key === 'j' ? 1 : -1)];
          if (!target) return console.error('Next active element not found (this should not happen)', { all, currentIndex });
          setActiveEntry(target);
        }
      }

      if (activeEntry && ev.key === 'l') {
        $(activeEntry).find('.btn-kudo').click();
      }

      if (activeEntry && ev.key === 'c') {
        $(activeEntry).find('.btn-comment').click();
        return false; // Prevent "c" in the textarea
      }

      if (activeEntry && ev.key === 'Enter') {
        const href = $(activeEntry).find('.title-text a').attr('href');
        if (ev.shiftKey) {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      }

      if (activeEntry && ev.key === 'e') {
        const href = $(activeEntry).find('.title-text a').attr('href') + '/edit';
        if (ev.shiftKey) {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      }

      if (activeEntry && ev.key === 'u') {
        const href = $(activeEntry).find('a.entry-owner').attr('href');
        if (ev.shiftKey) {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      }
    });

  });


  $.option('show_hidden_efforts', function() {
    // Beware: Do not watch directly for #show-hidden-efforts, as Strava website uses
    // .html() to update page after showing hidden efforts,
    // which causes observer to fire again, and again, and again
    // `#segments` will fire correctly just once
    document.arrive('#segments', { existing: true }, function() {
      $('#show-hidden-efforts').onceOnly().click();
    });
  });

  $.option('upload_manual_ux', function() {
    if (window.location.pathname !== '/upload/manual') return;

    const urlParams = new URLSearchParams(window.location.search);

    Object.entries({
      distance: 'input',
      distance_unit: 'select',
      elapsed_time_hours: 'input',
      elapsed_time_minutes: 'input',
      elapsed_time_seconds: 'input',
      elev_gain: 'input',
      elevation_unit: 'select',
      type: 'select',
      start_date: 'input',
      start_time_of_day: 'input',
      name: 'input',
      commute: 'toggle',
      trainer: 'toggle', // Ride: Indoor Cycling, Run: Treadmill, Swim: Pool
      bike_id: 'TODO',
      athlete_gear_id: 'TODO',
      description: 'input',
      visibility: 'radio',
      perceived_exertion: 'TODO',
      // TODO
      // workout_type:
      // workout_type_run: 0: Default, 1: Race, 2: Long Run, 3: Workout
      // workout_type_ride: 10: Default, 11: Race, 12: Workout
    }).forEach(([key, type]) => {
      const val = urlParams.get(key);
      if (val === null) return;

      const el = $(`#new_activity [name="activity[${key}]"]`);
      switch (type) {
        case 'input':
          el.val(val);
          el.change(); // send signal to ensure UI consistency, important when adjusting time, to trigger Name update (eg. Morning Run)
          break;
        case 'select':
          el.siblings('.options').find(`li[data-value="${val}"] a`).click().click(); // Double click required
          break;
        case 'toggle':
          el
            .closest('.input-field')
            .find('[type=checkbox]')
            .prop('checked', val === 'true');
          break;
        case 'radio':
          $(`#new_activity [name="activity[${key}]"][value=${val}]`).click();
          break;
        case 'TODO':
          helpers.notify(`Setting "${key}" via URL params is not supported yet`, 'error');
          break;
      }
    });
  });

  // Convert units on hover, etc.
  $.option('convert_units', function() {
    document.arrive('abbr.unit, span.unit', { existing: true }, function() {
      $(this)
        .onceOnly()
        .filter((i, el) => {
          // Don't convert multi-"1h 30m" units. In this case we think "m"
          // means meters but we just don't support any of these.
          return $(el).siblings('.unit').length === 0;
        })
        .each((i, el) => {
          $(el).removeAttr('title');
          var container = $(el).parent();
          var unit = $(el).text().trim(); // " km" -> "km"
          var val = container
            .clone()
            .children('.unit') // Don't remove all children; the value might be wrapped in <strong>
            .remove()
            .end()
            .text();

          container.attr('title', $.convert(val, unit));
        });
    });
  });

  $.option('sort_starred_segments_first', function() {
    document.arrive('table.segments', { existing: true }, function() {
      $(this)
        .find('tr')
        .has('.starred.active')
        .reverse()
        .each((i, el) => $(el).parents('tbody').prepend(el));
    });
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
      .hide();

    // Non-premium
    $('.section.more-stats div')
      // Label
      .filter(function () {
        return $(this).text() === 'Calories';
      })
      .hide()

      // Value
      .next()
      .hide();
  });

  // External links
  $.option('external_links', function() {
    if ($.defined('pageView')) { // Activity page

      const items = [
        [ 'VeloViewer', 'http://veloviewer.com/activities/$ID' ],
        [ 'myWindsock', 'https://mywindsock.com/activity/$ID/' ],
        [ 'Power-Meter.cc', 'https://power-meter.cc/activities/$ID/power-analysis' ],
      ].map(function([title, href]) {
        return `<li><a href="${href.replace('$ID', window.pageView.activity().id)}" target="_blank">${title}</a></li>`;
      }).join('');

      // Need a little more room to include our links
      $('section#heading h2').css({ width: '40%' });
      $(`
        <div class="drop-down-menu">
          <a class="selection" style="padding-right: 30px;">External links</a>
          <ul class="options" style="right: 0px;">
            ${items}
          </ul>
        </div>
      `).prependTo('section#heading .social');

    } else if ($.defined('segmentId')) { // Segment page

      const items = [
        ['VeloViewer', 'https://veloviewer.com/segments/$ID'],
        ['myWindsock', 'https://mywindsock.com/segments/$ID/'],
        ['Everesting', 'https://everesting.cc/app/lap-calculator/?id=$ID'],
      ].map(function ([title, href]) {
        return `<li><a href="${href.replace('$ID', window.segmentId)}" target="_blank">${title}</a></li>`;
      }).join('');

      $(`
        <ul style="list-style-type: disc; margin: 10px 0 0 25px;">
          ${items}
        </ul>
      `).appendTo('.container .sidebar .section:last');

    } else if (location.pathname === '/challenges') { // Challenges page

      $('<a class="text-caption1" href="https://www.kom.club" target="_blank">KOM Club</a>')
        .appendTo('[class^="ChallengesRow--section-title-container"]:first'); // "Recommended For You" heading – not perfect place, but there's no better one

    }
  });

  // Estimated FTP
  $.option('estimated_ftp', function() {
    $('#cpcurve-estimatedCP').click(); // Check checkbox for "Show Estimated FTP" at /athlete/analysis
  });

  // Hide feed entries
  $.option('dashboard_filter', function() {
    let filters = [];
    [
      // TODO: hide_route_feed_entries
      ['hide_challenge_feed_entries', ['.challenge']],
      ['hide_promotion_feed_entries', ['.promo, .membership']],
      ['hide_club_feed_entries', ['.club']],
      ['hide_goal_feed_entries', ['.performance-goal-created']], // Seems deprecated, adjusting perf goals are no longer broadcasted to others
      ['hide_turbo_trainer_rides', ['.activity', ':has(.icon-ride)', ':not(:has(.activity-map))']],
      ['hide_turbo_trainer_rides', ['.activity', ':has(.icon-virtualride)']],
      ['hide_turbo_trainer_rides', ['.activity', ':has(.enhanced-tag)']], // TODO: Explain selector
    ].forEach(([option, optionFilters]) => {
      $.option(option, () => {
        filters.push(optionFilters);
      });
    });

    document.arrive('#dashboard-feed .feed-entry', { existing: true }, function() {
      // Whole feed entry filtering
      // ---
      for (let optionFilters of filters) {
        if (
          optionFilters.every(filter => $(this).is(filter))
        ) {
          $(this).hide();
          return; // entry was matched and hidden, so exit for-loop and whole callback
        }
      }

      // Achievements
      // ---
      const achiementElems = $(this)
        .find('.featured-achievements li')
        .filter(function() {
          var txt = $(this).find('strong').text();
          return /^\d+ (KOM|QOM|PR)$/.test(txt);
        });
      switch (options.annual_achievements) {
        case 'show':
          break;
        case 'unhighlight':
          achiementElems
            .find('strong')
            .css('font-weight', 'normal')
            .text(function(idx, txt) {
              return '(' + txt + ')';
            });
          break;
        case 'hide':
          achiementElems.hide();
          break;
      }
    });
  });

  // Hide invite friends & social buttons
  $.option('hide_invite_friends', function() {
    // Navbar: "Find friends"
    $('.user-nav .options li').has('.find-and-invite').hide(); // @CHECKED 2020-06-19

    // My profile: "Share your Runs/Rides"
    $('.sidebar .section').has('#embed-athlete-widget').hide(); // @CHECKED 2020-06-19

    // Activity: Header: Facebook, Twitter and share icons
    $('#heading .social .sharing').hide(); // @CHECKED 2020-06-19

    // Dashboard: Suggested Friends
    // TODO: Consider this as a separate option
    $('.sidebar #suggested-follows').hide(); // @CHECKED 2020-06-19

    document.arrive([
      '.feed-entry .share', // Athlete: Feed entry
      '.media-actions .share', // Dashboard: Feed entry
      '.training-activity-row .share', // My activities: Activity row
    ].join(', '), { existing: true }, function () {
      $(this).hide(); // @CHECKED 2020-06-19
    });
  });

  $.option('hide_upcoming', function() {
    // @DEPRECATED: Seems not needed anymore
    // Hide "Yearly Goals"
    $('.sidebar .section#yearly-progress-goals')
      .hide();
  });

  $.option('hide_upcoming', function() {
    // @DEPRECATED: Seems not needed anymore
    // Upcoming races, events, goals
    $('.sidebar .section#upcoming-events')
      .not(':has(li)') // Show if we have upcoming events
      .hide();

    // Discover more races, etc.
    $('.sidebar .section#discover-more')
      .hide();
  });

  // Swap club and challenges
  $.option('swap_clubs_and_challenge_module', function() {
    $('.sidebar #your-clubs').after($('.sidebar #your-challenges'));
  });

  // Upload activity
  $.option('improve_upload_activity', function() {
    if (window.location.pathname !== '/upload/select') return;

    const titleSelector = '.uploads input[type=text]';
    const descriptionSelector = '.uploads textarea';

    document.arrive(titleSelector, { existing: true }, function() {
      $(this).onceOnly().attr('autocomplete', 'off');
    });

    document.arrive(descriptionSelector, { existing: true }, function() {
      $(this).onceOnly().css('height', 160);
    });

  });

  $.option('general_typography', function() {
    const selectors = [
      '.uploads', // https://www.strava.com/upload/select
      '.manual-entry', // https://www.strava.com/upload/manual
      '#edit-activity', // https://www.strava.com/activities/ID/edit
      '.table-activity-edit', // https://www.strava.com/athlete/training
    ].map(x => `${x} input[type=text], ${x} textarea`).join(', ');

    $('body').on(
      'keyup',
      selectors,
      function() {
        const el = $(this);
        const text = el.val().replace(/\u00A0/g, ' '); // for some <textarea> elements, NO-BREAK-SPACE
        $.each({
          ' - ': ' — ',
          ' -- ': ' — ',
          ' -> ': ' → ',
          ' > ': ' → ',
          ' < ': ' ← ',
          ' <- ': ' ← ',
          ' <-> ': ' ↔ ',
          '(L)': '❤',
        }, (x, y) => {
          if (text.endsWith(x)) {
            let value = text.substr(0, text.length - x.length) + y;
            el.val(value);
          }
        });
      });
  });

  // Improved pagination
  // Seems like old pagination is only on this one page: https://www.strava.com/athlete/training
  $.option('improve_pagination', function() {
    if (!$.defined('pagingController')) return;

    const ctrl = window.pagingController;

    document.arrive('.simple.pagination ul.switches', { existing: true }, function() {
      $(this)

        // First
        .prepend('<li><span class="btn btn-default btn-sm first_page">First</span></li>')
        .find('.first_page')
        .on('click', function() {
          ctrl.page = 1;
          ctrl.paging_adapter.fetch(ctrl.buildOptions());
        })
        .toggleClass('disabled', ctrl.page === 1)
        .end()

        // Last
        .append('<li><span class="btn btn-default btn-sm last_page">Last</span></li>')
        .find('.last_page')
        .on('click', function() {
          ctrl.page = ctrl.pageInfo().pages;
          ctrl.paging_adapter.fetch(ctrl.buildOptions());
        })
        .toggleClass('disabled', ctrl.page === ctrl.pageInfo().pages)
        .end();
    });
  });

  // Show running cadence by default
  $.option('running_cadence', function() {
    document.arrive('#elevation-profile td[data-type=cadence] .toggle-button:not(.active)', { existing: true }, function() {
      $(this).click();
    });
  });

  // Show running heart rate by default
  $.option('running_heart_rate', function() {
    document.arrive('#elevation-profile td[data-type=heartrate] .toggle-button:not(.active)', { existing: true }, function() {
      $(this).click();
    });
  });

  // Show running GAP by default
  $.option('running_gap', function() {
    document.arrive('#elevation-profile td[data-type=grade_adjusted_pace] .toggle-button:not(.active)', { existing: true }, function() {
      $(this).click();
    });
  });

  // Caculate running TSS
  $.option('running_tss', function() {
    if (!$.defined('Strava.Labs.Activities.PaceZones.prototype.getPaceZones')) {
      return;
    }

    var TSS_PER_HOUR = {
      Z1: 55,
      Z2: 75,
      Z3: 90,
      Z4: 100,
      Z5: 120,
      Z6: 145,
    };

    var view = window.Strava.Labs.Activities.PaceZones;
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
        '<li><strong>' + Math.round(tss) + '</strong><div class="label">TSS (estimated)</div></li>',
      );

      return result;
    };
  });

  // Repeated segments
  $.option('repeated_segments', function() {
    if (!$.defined('pageView.segmentEfforts')) {
      return;
    }

    var data = {};

    // Calculate for both regular and hidden efforts
    var efforts = [
      ...window.pageView.segmentEfforts().models,
      ...window.pageView.segmentEfforts().hiddenSegmentEfforts,
    ];

    // Find total raw times by segment ID
    $.each(efforts, function() {
      var segment_id = this.attributes.segment_id;

      var m_distance = this.attributes.distance.match(/^([\d.]+)(.*)/);
      var m_elev_difference = this.attributes.elev_difference.match(/^(\d+)(.*)/);

      data[segment_id] = data[segment_id] || {
        segment_id: segment_id,
        times: [],
        title: this.attributes.name,
        starred: this.attributes.starred_by_current_athlete,
        distance: parseFloat(m_distance[1]),
        distance_unit: m_distance[2],
        elev_difference: parseInt(m_elev_difference[1], 10),
        elev_difference_unit: m_elev_difference[2],
      };

      data[segment_id].times.push({
        seconds: this.attributes.elapsed_time_raw,
        segment_effort_id: this.id,
      });
    });

    // Annotate with aggregate data
    $.each(data, function() {
      var sum = 0;
      var max = {
        seconds: 0,
        segment_effort_id: null,
      };
      var min = {
        seconds: 99999999,
        segment_effort_id: null,
      };

      $.each(this.times, function() {
        sum += this.seconds;
        max = (this.seconds > max.seconds) ? this : max;
        min = (this.seconds < min.seconds) ? this : min;
      });

      $.extend(this, {
        max: max,
        min: min,
        sum: sum,
        count: this.times.length,
        average: Math.floor(sum / this.times.length),
      });
    });

    if (!Object.values(data).some(x => x.count > 1)) return; // No repeated segment effort, do not continue

    // Flatten and sort
    var dataFlatAndSorted = Object.values(data).sort(helpers.keySort('-starred', '-count', 'title'));

    document.arrive('.segments-list', { existing: true }, function() {
      var section = $(this)
        .not('.collapsed')
        .onceOnly();

      if (section.length === 0) {
        return;
      }

      var table = $(`
        <table class="striped">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
              <th>Count</th>
              <th>Fastest</th>
              <th>Slowest</th>
              <th>Average</th>
              <th>Total</th>
              <th>Distance</th>
              <th>Elevation</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `).appendTo(section);

      dataFlatAndSorted.forEach((row) => {
        // Only add repeated rows
        if (row.count < 2) {
          return;
        }

        var tr = $(`
          <tr>
            <td><div class="starred" style="cursor: default;">★</div></td>
            <td><a class="title" href="#"</a></td>
            <td>${row.count.toLocaleString()}</td>
            <td><a href="#" class="min">${$.toSeconds(row.min.seconds)}</a></td>
            <td><a href="#" class="max">${$.toSeconds(row.max.seconds)}</a></td>
            <td>${$.toSeconds(row.average)}</td>
            <td>${$.toSeconds(row.sum)}</td>
            <td>${(row.count * row.distance).toLocaleString()}${row.distance_unit}</td>
            <td>${(row.count * row.elev_difference).toLocaleString()}${row.elev_difference_unit}</td>
          </tr>
        `).appendTo(table.find('tbody'));

        tr.find('a.title')
          .attr('href', '/segments/' + row.segment_id)
          .text(row.title);
        tr.find('.starred')
          .toggleClass('active', row.starred);
        $.each(['min', 'max'], function() {
          var min_max = this;

          tr.find('a.' + min_max).click(function(e) {
            var elem = $(
              'tr[data-segment-effort-id=' + row[min_max].segment_effort_id + ']',
            );

            // Scroll into view. Doesn't work perfectly at the moment if a
            // segment is already open.
            $('html, body').scrollTop(elem.offset().top);

            // Passthrough click
            elem.trigger(e);

            return false;
          });
        });
      });
    });
  });

  // Show "running" tab by default
  $.option('side_by_side_running', function() {
    if (!location.pathname.startsWith('/athletes/')) return;

    const selector = '.section.comparison';
    $(selector).leave('.spinner', function() {
      $(selector)
        .find('.running-tab :visible') // :visible will cause not selecting anything when running comparison is already selected
        .first() // As switcher is duplicated on each tab, and just hidden, it's important to select just the first one to avoid clicking multiple times
        .onceOnly()
        .click();
    });
  });

  // Calculate a cycling variability index by default
  $.option('variability_index', function() {
    if (!$.defined('pageView')) {
      return;
    }

    var elem = $('span[data-glossary-term=definition-weighted-average-power]')
      .parents('li');

    var np = parseInt(elem.find('strong').text(), 10);
    var ap = window.pageView.activity().get('avgWatts');

    $('<li><strong>X</strong><div class="label"><a href="https://science4performance.com/2017/04/20/strava-ride-statistics/">Variability Index</a></div></li>')
      .insertAfter(elem)
      .find('strong')
      .text((np / ap).toFixed(2));
  });

  $.option('enlarge_on_hover', function() {
    function onHover(src, css, handlerIn, handlerOut) {
      css = $.extend({
        'z-index': 99999,
      }, css);

      $('body')
        .on('mouseover', src, function() {
          var elem = $(this);

          typeof handlerIn === 'function' && handlerIn.apply(this);

          elem
            // Save original CSS
            .data('original-css', elem.css($.keys(css)))

            // Apply target CSS
            .css(css);
        })
        .on('mouseout', src, function() {
          var elem = $(this);

          typeof handlerOut === 'function' && handlerOut.apply(this);

          // Restore original CSS
          elem.css(elem.data('original-css') || {});
        });
    }

    // Mouseover on feed avatars makes them bigger
    onHover('.feed-entry .avatar-md', {
      width: 80,
      height: 80,
    }, function() {
      $(this)
        // Use a higher-resolution bigger image
        .find('img')
        .attr('src', function (i, val) {
          return val.replace('/medium.jpg', '/large.jpg');
        })
        .css({ width: 80,height: 80 });
    }, function(){
      $(this)
        .find('img')
        .css({ width: '',height: '' });
    });

    // Mouseover on map makes them bigger
    var width = $('.feed-entry .entry-images').width();
    var height = 360;
    onHover('.feed-entry .activity-map .entry-image-wrapper', {
      width: width,
      height: height,
      'margin-left': 0,
    }, function() {
      var elem = $(this);

      elem
        .find('.leaflet-container')
        .css('z-index', 99999)
        .end()
        .find('.leaflet-map-pane')
        .css({
          'margin-top': (height - elem.height()) / 2,
          'margin-left': (width - elem.width()) / 2,
        })
        .end();
    }, function() {
      $(this)
        .find('.leaflet-container')
        .css('z-index', 'inherit')
        .end()
        .find('.leaflet-map-pane')
        .css({
          'margin-top': 0,
          'margin-left': 0,
        })
        .end();
    });

    // Mouseover on Instagram images makes them bigger
    onHover('.feed-entry .photostream li', {
      width: 300,
      height: 300,
    }, function() {
      $(this)
        // Use a higher-resolution bigger image (if we aren't using the FB CDN)
        .find('img')
        .attr('src', function (i, val) {
          return val.replace('?size=t', '?size=l');
        });
    });

    // Mouseover on condensed athlete list in feed makes them bigger
    onHover('.feed-entry.challenge .list-athletes img', {
      width: 60,
      height: 60,
      position: 'absolute',
    });
  });

  // Fix athlete search forgetting values
  $.option('search_ux', function() {
    if (window.location.pathname.indexOf('/activities/search') !== 0) {
      return;
    }

    if ($.urlParam('location') === undefined) {
      return;
    }

    $.each([
      'elev_gain',
      'distance',
      'time',
    ], function() {
      var name = this;

      $('.slider#' + name).slider('values', [
        parseInt($.urlParam(name + '_start'), 10),
        parseInt($.urlParam(name + '_end'), 10),
      ]);
    });
  });

  // Show same-activity Flybys only (runs or rides) in the Flyby viewer.
  $.option('show_same_activity_flybys', function() {
    if (!window.location.pathname.startsWith('/flyby/viewer')) {
      return;
    }

    document.arrive('#table_loading', { existing: true, fireOnAttributesModification: true }, function() {
      // Wait until the activities table is loaded before clicking the button.
      // Strava JS hides a #table_loading div when ready.
      if (this.style.display === 'none') {
        // Click the "Runs only" / "Rides only" checkbox.
        $('input#hide_different_activity_type').onceOnly().click();
      }
    });
  });

  $.option('chart_controls_colors', function () {
    const COLORS = {
      pace: '#34ACE4',
      cadence: '#f0f',
      heartrate: '#DD0447',
      grade_adjusted_pace: '#6633cc',
      temp: '#00f',
    };

    document.arrive('#chart-controls', { existing: true }, function () {
      $(this).find('td[data-type]').each((i, el) => {
        const type = el.getAttribute('data-type');
        $(el).find('> .label').css('color', COLORS[type]);
      });
    });
  });

  // Show button for giving a kudo to all open activities.
  $.option('show_kudo_all_button', function () {
    if (!location.pathname.startsWith('/dashboard')) return;

    const selector = 'button.js-add-kudo';
    document.arrive(selector, { existing: true }, (newEl) => {

      // Only run the following code once for every bulk update
      // TODO: Consider creating an issue or asking for a best practice https://github.com/uzairfarooq/arrive/issues
      const all = Array.from(document.querySelectorAll(selector));
      const allCount = all.length;
      if (all.indexOf(newEl) !== allCount - 1) return;

      if (!$.defined('kudosAllCount')) { // This relies on browser exposing all elements with ID to window
        $('<button/>', {
          class: 'btn',
          style: 'margin-left: 8px;',
          html: 'Give Kudos to all (<span id="kudosAllCount">${count}</span>)',
          on: {
            click: () => {
              $(selector).click();
              $('#kudosAllCount').text(0);
            },
          },
        }).wrap('<li class="nav-item"></li>')
          .parent() // reference <li> instead of the <button>
          .insertBefore('#notifications');
      }

      $('#kudosAllCount').text(allCount);
    });
  });

  $.option('hide_premium_badges', function() {
    // Only keep "Subscriber" line right under the name on athlete's page
    const selectors = [
      '.avatar-badge', // badge over the top-right corner of avatar profiles
      '.badge.premium', // activity page: prefixed to activity name
      '.icon-badge-premium', // suffixed to athlete name
      '.icon-badge-premium', // Club leaderboard
      '.icon-premium', // Card title prefixes (e.g. Relative effort card on dashboard)
    ];
    const css = `${selectors.join(', ')} { display: none; }`;
    $(`<style>${css}</style>`).appendTo(document.head);
  });


  $.option('my_activities_expand_latest_activity', function() {
    if (window.location.pathname !== '/athlete/training') return;

    // Table rows are loaded asynchronously, we need to wait for a row
    document.arrive('table.activities .training-activity-row', { existing: true, onceOnly: true }, () => {
      $('table.activities .quick-edit:first').click();
    });

  });

  $.option('training_log_overview', function() {
    function getReactElement(dom) {
      for (const prop in dom) {
        // Requires injected ReactDOM, probably even dev version
        // noinspection JSUnfilteredForInLoop
        if (prop.startsWith('__reactInternalInstance$')) {
          const val = dom[prop];
          return {
            node: val.stateNode,
            props: val.return.memoizedProps, // .return is probably not universal, as it's probably caused some wrapper component
          };
        }
      }
    }

    if (!window.location.pathname.includes('/training/log')) return;

    // https://www.strava.com/athletes/5041066/training/log?v2=true
    document.arrive('[class^="Calendar--calendar-row-container--"]', { existing: true, fireOnAttributesModification: true }, (el) => {
      if (el.getAttribute('data-display-type') === 'empty') return;

      const overviewEl = el.querySelector('[class^="WeekOverview--sidebar-container--"]');
      const { props } = getReactElement(overviewEl);
      const totals = props.entry.totals_by_sport;

      if (!totals) return; // No activities for specific date range

      const formatDistance = x => x ? `${Math.round(x / 1000)}km`: '';
      const formatElevation = x => x ? `${x}m` : '';
      const formatTime = x => x ? helpers.formatSecondsToHhMm(x) : '';

      const sports = Array.from(new Set(['run', 'ride', 'swim'].concat(Object.keys(totals)))); // TODO: Refactor to prioritySort function
      const items = sports.map(sport => {
        const total = totals[sport];
        if (!total) return;
        return `
          <div style="margin-bottom: 8px;">
            <div class="text-caption2" style="color: #6d6d78; margin-bottom: 3px;">${helpers.activities[sport]}</div>
            <div style="font-size: 12px;" class="text-light">
              <span style="margin-right: 5px;">${formatTime(total.moving_time)}</span>
              <span style="margin-right: 5px;">${formatDistance(total.distance)}</span>
              <span>${formatElevation(total.elev_gain)}</span>
            </div>
          </div>
        `;
      });

      $(`<div>${items.join('')}</div> `).appendTo(overviewEl);
    });
  });


  $.option('separate_notifications', function() {
    // Sadly, it's not possible to reuse existing icons from the website as they mix and match various styles :(
    const ICONS = {
      kudo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none"><path fill="#606065" d="M19.9,8.9 C19.9,7.8 19.1,6.7 17.8,6.7 L12.5,6.7 C12.8,5.6 13.2,4 13,3.1 C12.7,1.3 10.6,0.5 10.4,0.4 C10.3,0.4 10.2,0.3 10,0.3 C9.8,0.3 9.7,0.3 9.5,0.4 C9.2,0.5 9.1,0.8 9,1.1 L8.5,3.9 L4.7,10.9 L0.6,12.3 C0.2,12.5 1.11022302e-16,13 0.1,13.5 L2.1,21 C2.2,21.3 2.4,21.5 2.6,21.6 C2.7,21.7 2.9,21.7 3,21.7 C3.1,21.7 3.3,21.7 3.4,21.6 L8.2,19.7 L15.5,19.7 C15.6,19.7 15.6,19.7 15.7,19.7 C15.7,19.7 15.8,19.7 15.8,19.7 C15.8,19.7 15.8,19.7 15.9,19.7 C16.8,19.5 17.5,18.7 17.6,17.7 L18,14.7 C18.8,14.1 19.2,13.3 19.2,12.4 C19.2,12 19.1,11.5 18.9,11.1 C19.6,10.6 19.9,9.8 19.9,8.9 Z M3.1,20.8 L1.1,13.3 L4.2,12.3 L6.4,19.5 L3.1,20.8 Z M18.1,10.6 C18,10.7 17.9,10.8 17.9,11 C17.9,11.1 17.9,11.3 18,11.4 C18.2,11.6 18.3,12.1 18.3,12.5 C18.3,13.1 18,13.7 17.3,14 C17.2,14.1 17.1,14.2 17.1,14.4 L16.6,17.6 C16.5,18.3 16,18.8 15.3,18.8 L8,18.8 L7.2,19.1 L5.1,11.9 L5.5,11.8 L9.5,4.3 L10,1.3 C10,1.3 11.8,2 12,3.3 C12.2,4.6 11,7.8 11,7.8 L17.8,7.8 C18.5,7.8 18.9,8.4 18.9,9 C18.9,9.4 18.8,10.1 18.1,10.6 Z" transform="translate(2)"/><path fill="#2D2D32" d="M19.9,9 C19.9,7.9 19.1,6.8 17.8,6.8 L12.5,6.8 C12.9,5.6 13.3,4.1 13.1,3.1 C12.8,1.3 10.7,0.5 10.5,0.4 C10.4,0.4 10.3,0.3 10.1,0.3 C9.9,0.3 9.8,0.3 9.6,0.4 C9.3,0.5 9.2,0.8 9.1,1.1 L8.6,3.9 L4.8,10.9 L0.7,12.3 C0.2,12.5 1.11022302e-16,13 0.1,13.5 L2.1,21 C2.2,21.3 2.4,21.5 2.6,21.6 C2.7,21.7 2.9,21.7 3,21.7 C3.1,21.7 3.3,21.7 3.4,21.6 L8.2,19.7 L15.5,19.7 C15.6,19.7 15.6,19.7 15.7,19.7 C15.7,19.7 15.8,19.7 15.8,19.7 C15.8,19.7 15.8,19.7 15.9,19.7 C16.8,19.5 17.5,18.7 17.6,17.7 L18,14.7 C18.8,14.1 19.2,13.3 19.2,12.4 C19.2,12 19.1,11.5 18.9,11.1 C19.6,10.6 19.9,9.8 19.9,9 Z M3.1,20.8 L1.1,13.3 L4.2,12.3 L6.4,19.5 L3.1,20.8 Z M18.1,10.6 C18,10.7 17.9,10.8 17.9,10.9 C17.9,11 17.9,11.2 18,11.3 C18.2,11.5 18.3,12 18.3,12.4 C18.3,13 18,13.6 17.3,13.9 C17.2,14 17.1,14.1 17.1,14.3 L16.6,17.5 C16.5,18.2 16,18.7 15.3,18.7 L8,18.7 L7.2,19 L5.1,11.8 L5.5,11.7 L9.5,4.2 L10,1.2 C10,1.2 11.8,1.9 12,3.2 C12.2,4.5 11,7.7 11,7.7 L17.8,7.7 C18.5,7.7 18.9,8.3 18.9,8.9 C18.9,9.4 18.8,10.1 18.1,10.6 Z" transform="translate(2 24)"/><path fill="#FFF" d="M19.9,9 C19.9,7.9 19.1,6.8 17.8,6.8 L12.5,6.8 C12.9,5.6 13.3,4.1 13.1,3.1 C12.8,1.3 10.7,0.5 10.5,0.4 C10.4,0.4 10.3,0.3 10.1,0.3 C9.9,0.3 9.8,0.3 9.6,0.4 C9.3,0.5 9.2,0.8 9.1,1.1 L8.6,3.9 L4.8,10.9 L0.7,12.3 C0.2,12.5 1.11022302e-16,13 0.1,13.5 L2.1,21 C2.2,21.3 2.4,21.5 2.6,21.6 C2.7,21.7 2.9,21.7 3,21.7 C3.1,21.7 3.3,21.7 3.4,21.6 L8.2,19.7 L15.5,19.7 C15.6,19.7 15.6,19.7 15.7,19.7 C15.7,19.7 15.8,19.7 15.8,19.7 C15.8,19.7 15.8,19.7 15.9,19.7 C16.8,19.5 17.5,18.7 17.6,17.7 L18,14.7 C18.8,14.1 19.2,13.3 19.2,12.4 C19.2,12 19.1,11.5 18.9,11.1 C19.6,10.6 19.9,9.8 19.9,9 Z M3.1,20.8 L1.1,13.3 L4.2,12.3 L6.4,19.5 L3.1,20.8 Z M18.1,10.6 C18,10.7 17.9,10.8 17.9,10.9 C17.9,11 17.9,11.2 18,11.3 C18.2,11.5 18.3,12 18.3,12.4 C18.3,13 18,13.6 17.3,13.9 C17.2,14 17.1,14.1 17.1,14.3 L16.6,17.5 C16.5,18.2 16,18.7 15.3,18.7 L8,18.7 L7.2,19 L5.1,11.8 L5.5,11.7 L9.5,4.2 L10,1.2 C10,1.2 11.8,1.9 12,3.2 C12.2,4.5 11,7.7 11,7.7 L17.8,7.7 C18.5,7.7 18.9,8.3 18.9,8.9 C18.9,9.4 18.8,10.1 18.1,10.6 Z" transform="translate(2 48)"/><path fill="#FC4C01" d="M4 11.2L.9 12.3C.4 12.5.1 13 .3 13.5L2.3 21C2.4 21.3 2.6 21.5 2.8 21.6 2.9 21.7 3.1 21.7 3.2 21.7 3.3 21.7 3.5 21.7 3.6 21.6L6.8 20.3 4 11.2zM19.8 8.9C19.8 7.8 18.7 6.8 18 6.8L11.6 6.8C12 5.8 12.6 3.9 12.4 2.8 12.1 1.2 10.4.4 10.3.3 10.2.2 10 .2 9.9.3 9.8.4 9.7.5 9.6.7L9.2 3.4 5.3 10.8C5.3 10.8 5.2 10.8 5.2 10.8L4.8 10.9 7.6 20 8.3 19.7 15.4 19.7C16.4 19.7 17.4 18.7 17.6 17.5L18 14.8C18 14.7 18.1 14.6 18.2 14.5 18.9 13.9 19.2 13.2 19.2 12.4 19.2 12.1 19.1 11.6 18.9 11.4 18.8 11.3 18.8 11.2 18.8 11 18.8 10.8 18.9 10.7 19 10.7 19.4 10.4 19.8 9.6 19.8 8.9z" transform="translate(2 72)"/></g></svg>',
      comment: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none"><g fill="#606065" transform="translate(3 3)"><rect width="10" height="1" x="4" y="5"/><rect width="5" height="1" x="4" y="9"/><path d="M17,0 L1,0 C0.4,0 0,0.4 0,1 L0,14 C0,14.6 0.4,15 1,15 L5.6,15 L8.3,17.7 C8.7,18.1 9.3,18.1 9.7,17.7 L12.4,15 L17,15 C17.6,15 18,14.6 18,14 L18,1 C18,0.4 17.6,0 17,0 Z M17,14 L12,14 L9,17 L6,14 L1,14 L1,1 L17,1 L17,14 Z"/></g><g fill="#2D2D32" transform="translate(3 27)"><rect width="10" height="1" x="4" y="5"/><rect width="5" height="1" x="4" y="9"/><path d="M17,0 L1,0 C0.4,0 0,0.4 0,1 L0,14 C0,14.6 0.4,15 1,15 L5.6,15 L8.3,17.7 C8.7,18.1 9.3,18.1 9.7,17.7 L12.4,15 L17,15 C17.6,15 18,14.6 18,14 L18,1 C18,0.4 17.6,0 17,0 Z M17,14 L12,14 L9,17 L6,14 L1,14 L1,1 L17,1 L17,14 Z"/></g><g fill="#FFF" transform="translate(3 51)"><rect width="10" height="1" x="4" y="5"/><rect width="5" height="1" x="4" y="9"/><path d="M17,0 L1,0 C0.4,0 0,0.4 0,1 L0,14 C0,14.6 0.4,15 1,15 L5.6,15 L8.3,17.7 C8.7,18.1 9.3,18.1 9.7,17.7 L12.4,15 L17,15 C17.6,15 18,14.6 18,14 L18,1 C18,0.4 17.6,0 17,0 Z M17,14 L12,14 L9,17 L6,14 L1,14 L1,1 L17,1 L17,14 Z"/></g><path fill="#FC4C01" d="M17,0 L1,0 C0.4,0 0,0.4 0,1 L0,14 C0,14.6 0.4,15 1,15 L5.6,15 L8.3,17.7 C8.7,18.1 9.3,18.1 9.7,17.7 L12.4,15 L17,15 C17.6,15 18,14.6 18,14 L18,1 C18,0.4 17.6,0 17,0 Z M9,10.2 L4,10.2 L4,9 L9,9 L9,10.2 Z M14,6.2 L4,6.2 L4,5 L14,5 L14,6.2 Z" transform="translate(3 75)"/></g></svg>',
      upload: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none" fill-rule="evenodd"><g transform="translate(3 3)"><path stroke="#606065" d="M0,9 C0,13.9704545 4.02913636,18 9,18 C13.9712727,18 18,13.9704545 18,9 C18,4.02970909 13.9712727,0 9,0 C4.02913636,0 0,4.02970909 0,9 Z" transform="matrix(1 0 0 -1 0 18)"/><polygon fill="#606065" fill-rule="nonzero" points="10 5.794 10 15 8 15 8 5.865 4.414 9.451 3 8.036 7.621 3.415 7.621 3.414 9.035 2 15.071 8.036 13.657 9.451 10 5.794"/></g><g transform="translate(3 27)"><path stroke="#2D2D32" d="M0,9 C0,13.9704545 4.02913636,18 9,18 C13.9712727,18 18,13.9704545 18,9 C18,4.02970909 13.9712727,0 9,0 C4.02913636,0 0,4.02970909 0,9 Z" transform="matrix(1 0 0 -1 0 18)"/><polygon fill="#2D2D32" fill-rule="nonzero" points="10 5.794 10 15 8 15 8 5.865 4.414 9.451 3 8.036 7.621 3.415 7.621 3.414 9.035 2 15.071 8.036 13.657 9.451 10 5.794"/></g><path fill="#FFF" fill-rule="nonzero" d="M11,0 C17.076,0 22,4.9252 22,11 C22,17.075 17.076,22 11,22 C4.9245,22 0,17.075 0,11 C0,4.9252 4.9245,0 11,0 Z M11.035,4 L9.6206,5.4142 L9.6213,5.415 L5,10.036 L6.4142,11.451 L10,7.8647 L10,17 L12,17 L12,7.7937 L15.657,11.451 L17.071,10.036 L11.035,4 Z" transform="translate(1 49)"/><g fill-rule="nonzero" transform="translate(1 73)"><path fill="#FC5200" d="M0,11 C0,17.075 4.9245,22 11,22 C17.076,22 22,17.075 22,11 C22,4.9252 17.076,0 11,0 C4.9245,0 0,4.9252 0,11 Z" transform="matrix(1 0 0 -1 0 22)"/><polygon fill="#FFF" points="11.959 7.794 11.959 17 9.971 17 9.971 7.865 6.406 11.451 5 10.036 9.594 5.415 9.593 5.414 11 4 17 10.036 15.594 11.451 11.959 7.794"/></g></g></svg>',
      trophy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none"><path fill="#606065" d="M22.5,2 L19.5,2 L19.5,1 C19.5,0.4 19.1,0 18.5,0 L5.5,0 C4.9,0 4.5,0.4 4.5,1 L4.5,2 L1.5,2 C0.9,2 0.5,2.4 0.5,3 L0.5,6 C0.6,8.2 2.3,9.9 4.5,10 L4.6,10 C5.1,13.4 8,16 11.5,16 L11.5,18 L8.5,18 C8.1,18 7.8,18.2 7.6,18.5 L6.6,20.5 C6.4,21 6.5,21.6 7,21.8 C7.2,22 7.3,22 7.5,22 L16.5,22 C17.1,22 17.5,21.5 17.5,21 C17.5,20.8 17.5,20.7 17.4,20.6 L16.4,18.6 C16.2,18.3 15.9,18.1 15.5,18.1 L12.5,18.1 L12.5,16.1 C15.9,16.1 18.9,13.5 19.4,10.1 L19.5,10.1 C21.7,10 23.4,8.3 23.5,6.1 L23.5,3 C23.5,2.4 23.1,2 22.5,2 Z M15.5,19 L16.5,21 L7.5,21 L8.5,19 L15.5,19 Z M4.5,9 C2.9,8.9 1.6,7.6 1.5,6 L1.5,3 L4.5,3 L4.5,9 Z M12,15 C8.6,15.2 5.7,12.6 5.5,9.2 C5.5,9 5.5,8.8 5.5,8.5 L5.5,1 L18.5,1 L18.5,8.5 C18.7,11.9 16.1,14.8 12.7,15 C12.4,15 12.2,15 12,15 Z M22.5,6 C22.4,7.6 21.1,8.9 19.5,9 L19.5,3 L22.5,3 L22.5,6 Z" transform="translate(0 1)"/><path fill="#2D2D32" d="M22.5,2 L19.5,2 L19.5,1 C19.5,0.4 19.1,0 18.5,0 L5.5,0 C4.9,0 4.5,0.4 4.5,1 L4.5,2 L1.5,2 C0.9,2 0.5,2.4 0.5,3 L0.5,6 C0.6,8.2 2.3,9.9 4.5,10 L4.6,10 C5.1,13.4 8,16 11.5,16 L11.5,18 L8.5,18 C8.1,18 7.8,18.2 7.6,18.5 L6.6,20.5 C6.4,21 6.5,21.6 7,21.8 C7.2,22 7.3,22 7.5,22 L16.5,22 C17.1,22 17.5,21.5 17.5,21 C17.5,20.8 17.5,20.7 17.4,20.6 L16.4,18.6 C16.2,18.3 15.9,18.1 15.5,18.1 L12.5,18.1 L12.5,16.1 C15.9,16.1 18.9,13.5 19.4,10.1 L19.5,10.1 C21.7,10 23.4,8.3 23.5,6.1 L23.5,3.1 C23.5,2.4 23.1,2 22.5,2 Z M15.5,19 L16.5,21 L7.5,21 L8.5,19 L15.5,19 Z M4.5,9 C2.9,8.9 1.6,7.6 1.5,6 L1.5,3 L4.5,3 L4.5,9 Z M12,15 C8.6,15.2 5.7,12.6 5.5,9.2 C5.5,9 5.5,8.8 5.5,8.5 L5.5,1 L18.5,1 L18.5,8.5 C18.7,11.9 16.1,14.8 12.7,15 C12.4,15 12.2,15 12,15 Z M22.5,6 C22.4,7.6 21.1,8.9 19.5,9 L19.5,3 L22.5,3 L22.5,6 Z" transform="translate(0 25)"/><path fill="#FFF" d="M22.5,2 L19.5,2 L19.5,1 C19.5,0.4 19.1,0 18.5,0 L5.5,0 C4.9,0 4.5,0.4 4.5,1 L4.5,2 L1.5,2 C0.9,2 0.5,2.4 0.5,3 L0.5,6 C0.6,8.2 2.3,9.9 4.5,10 L4.6,10 C5.1,13.4 8,16 11.5,16 L11.5,18 L8.5,18 C8.1,18 7.8,18.2 7.6,18.6 L6.6,20.6 C6.4,21.1 6.5,21.7 7,21.9 C7.2,22 7.3,22 7.5,22 L16.5,22 C17.1,22 17.5,21.5 17.5,21 C17.5,20.8 17.5,20.7 17.4,20.6 L16.4,18.6 C16.2,18.3 15.9,18.1 15.5,18 L12.5,18 L12.5,16 C15.9,16 18.9,13.4 19.4,10 L19.5,10 C21.7,9.9 23.4,8.2 23.5,6 L23.5,3 C23.5,2.4 23.1,2 22.5,2 Z M15.5,19 L16.5,21 L7.5,21 L8.5,19 L15.5,19 Z M4.5,9 C2.9,8.9 1.6,7.6 1.5,6 L1.5,3 L4.5,3 L4.5,9 Z M12,15 C8.6,15.2 5.7,12.6 5.5,9.2 C5.5,9 5.5,8.8 5.5,8.5 L5.5,1 L18.5,1 L18.5,8.5 C18.7,11.9 16.1,14.8 12.7,15 C12.4,15 12.2,15 12,15 Z M22.5,6 C22.4,7.6 21.1,8.9 19.5,9 L19.5,3 L22.5,3 L22.5,6 Z" transform="translate(0 49)"/><path fill="#FC4C01" d="M22.5,2 L19.5,2 L19.5,1 C19.5,0.4 19.1,0 18.5,0 L5.5,0 C4.9,0 4.5,0.4 4.5,1 L4.5,2 L1.5,2 C0.9,2 0.5,2.4 0.5,3 L0.5,6 C0.6,8.2 2.3,9.9 4.5,10 L4.6,10 C5.1,13.4 8,16 11.5,16 L11.5,18 L8.5,18 C8.1,18 7.8,18.2 7.6,18.6 L6.6,20.6 C6.4,21.1 6.5,21.7 7,21.9 C7.2,22 7.3,22 7.5,22 L16.5,22 C17.1,22 17.5,21.5 17.5,21 C17.5,20.8 17.5,20.7 17.4,20.6 L16.4,18.6 C16.2,18.3 15.9,18.1 15.5,18 L12.5,18 L12.5,16 C15.9,16 18.9,13.4 19.4,10 L19.5,10 C21.7,9.9 23.4,8.2 23.5,6 L23.5,3 C23.5,2.4 23.1,2 22.5,2 Z M4.5,9 C2.9,8.9 1.6,7.6 1.5,6 L1.5,3 L4.5,3 L4.5,9 Z M22.5,6 C22.4,7.6 21.1,8.9 19.5,9 L19.5,3 L22.5,3 L22.5,6 Z" transform="translate(0 73)"/></g></svg>',
      avatar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none"><g fill="#606065" transform="translate(3 3)"><path d="M9,10 C5.8,10 1,11.1 1,14 C0.9,15.3 1.3,16.6 2.1,17.7 C2.3,17.9 2.6,18 2.9,18 L15.2,18 C15.5,18 15.8,17.9 16,17.7 C16.8,16.6 17.2,15.4 17.1,14 C17,11.1 12.2,10 9,10 Z"/><circle cx="9" cy="4" r="4"/></g><g fill="#2D2D32" transform="translate(3 27)"><path d="M9,10 C5.8,10 1,11.1 1,14 C0.9,15.3 1.3,16.6 2.1,17.7 C2.3,17.9 2.6,18 2.9,18 L15.2,18 C15.5,18 15.8,17.9 16,17.7 C16.8,16.6 17.2,15.4 17.1,14 C17,11.1 12.2,10 9,10 Z"/><circle cx="9" cy="4" r="4"/></g><g fill="#FFF" transform="translate(3 51)"><path d="M9,10 C5.8,10 1,11.1 1,14 C0.9,15.3 1.3,16.6 2.1,17.7 C2.3,17.9 2.6,18 2.9,18 L15.2,18 C15.5,18 15.8,17.9 16,17.7 C16.8,16.6 17.2,15.4 17.1,14 C17,11.1 12.2,10 9,10 Z"/><circle cx="9" cy="4" r="4"/></g><g fill="#FC4C01" transform="translate(3 75)"><path d="M9,10 C5.8,10 1,11.1 1,14 C0.9,15.3 1.3,16.6 2.1,17.7 C2.3,17.9 2.6,18 2.9,18 L15.2,18 C15.5,18 15.8,17.9 16,17.7 C16.8,16.6 17.2,15.4 17.1,14 C17,11.1 12.2,10 9,10 Z"/><circle cx="9" cy="4" r="4"/></g></g></svg>',
      ellipsis: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="96" viewBox="0 0 24 96"><g fill="none"><path fill="#606065" d="M.4 2C.4 1.5.6 1 1 .6 1.4.2 1.9 0 2.4 0 2.9 0 3.4.2 3.8.6 4.2 1 4.4 1.5 4.4 2 4.4 2.5 4.2 3 3.8 3.4 3.4 3.8 2.9 4 2.4 4 1.9 4 1.4 3.8 1 3.4.6 3 .4 2.5.4 2zM6 2C6 1.5 6.2 1 6.6.6 7 .2 7.5 0 8 0 8.5 0 9 .2 9.4.6 9.8 1 10 1.4 10 2 10 2.6 9.8 3 9.4 3.4 9 3.8 8.5 4 8 4 7.5 4 7 3.8 6.6 3.4 6.2 3 6 2.5 6 2zM11.6 2C11.6 1.5 11.8 1 12.2.6 12.6.2 13.1 0 13.6 0 14.1 0 14.6.2 15 .6 15.4 1 15.6 1.5 15.6 2 15.6 2.5 15.4 3 15 3.4 14.6 3.8 14.1 4 13.6 4 13.1 4 12.6 3.8 12.2 3.4 11.8 3 11.6 2.5 11.6 2z" transform="translate(4 10)"/><path fill="#2D2D32" d="M.4 2C.4 1.5.6 1 1 .6 1.4.2 1.9 0 2.4 0 2.9 0 3.4.2 3.8.6 4.2 1 4.4 1.5 4.4 2 4.4 2.5 4.2 3 3.8 3.4 3.4 3.8 2.9 4 2.4 4 1.9 4 1.4 3.8 1 3.4.6 3 .4 2.5.4 2zM6 2C6 1.5 6.2 1 6.6.6 7 .2 7.5 0 8 0 8.5 0 9 .2 9.4.6 9.8 1 10 1.4 10 2 10 2.6 9.8 3 9.4 3.4 9 3.8 8.5 4 8 4 7.5 4 7 3.8 6.6 3.4 6.2 3 6 2.5 6 2zM11.6 2C11.6 1.5 11.8 1 12.2.6 12.6.2 13.1 0 13.6 0 14.1 0 14.6.2 15 .6 15.4 1 15.6 1.5 15.6 2 15.6 2.5 15.4 3 15 3.4 14.6 3.8 14.1 4 13.6 4 13.1 4 12.6 3.8 12.2 3.4 11.8 3 11.6 2.5 11.6 2z" transform="translate(4 34)"/><path fill="#FFF" d="M.4 2C.4 1.5.6 1 1 .6 1.4.2 1.9 0 2.4 0 2.9 0 3.4.2 3.8.6 4.2 1 4.4 1.5 4.4 2 4.4 2.5 4.2 3 3.8 3.4 3.4 3.8 2.9 4 2.4 4 1.9 4 1.4 3.8 1 3.4.6 3 .4 2.5.4 2zM6 2C6 1.5 6.2 1 6.6.6 7 .2 7.5 0 8 0 8.5 0 9 .2 9.4.6 9.8 1 10 1.4 10 2 10 2.6 9.8 3 9.4 3.4 9 3.8 8.5 4 8 4 7.5 4 7 3.8 6.6 3.4 6.2 3 6 2.5 6 2zM11.6 2C11.6 1.5 11.8 1 12.2.6 12.6.2 13.1 0 13.6 0 14.1 0 14.6.2 15 .6 15.4 1 15.6 1.5 15.6 2 15.6 2.5 15.4 3 15 3.4 14.6 3.8 14.1 4 13.6 4 13.1 4 12.6 3.8 12.2 3.4 11.8 3 11.6 2.5 11.6 2z" transform="translate(4 58)"/><path fill="#FC4C01" d="M.4 2C.4 1.5.6 1 1 .6 1.4.2 1.9 0 2.4 0 2.9 0 3.4.2 3.8.6 4.2 1 4.4 1.5 4.4 2 4.4 2.5 4.2 3 3.8 3.4 3.4 3.8 2.9 4 2.4 4 1.9 4 1.4 3.8 1 3.4.6 3 .4 2.5.4 2zM6 2C6 1.5 6.2 1 6.6.6 7 .2 7.5 0 8 0 8.5 0 9 .2 9.4.6 9.8 1 10 1.4 10 2 10 2.6 9.8 3 9.4 3.4 9 3.8 8.5 4 8 4 7.5 4 7 3.8 6.6 3.4 6.2 3 6 2.5 6 2zM11.6 2C11.6 1.5 11.8 1 12.2.6 12.6.2 13.1 0 13.6 0 14.1 0 14.6.2 15 .6 15.4 1 15.6 1.5 15.6 2 15.6 2.5 15.4 3 15 3.4 14.6 3.8 14.1 4 13.6 4 13.1 4 12.6 3.8 12.2 3.4 11.8 3 11.6 2.5 11.6 2z" transform="translate(4 82)"/></g></svg>',
    };

    const data = {
      kudos: { icon: ICONS.kudo, list: [] },
      comments: { icon: ICONS.comment, list: [] },
      uploads: { icon: ICONS.upload, list: [] },
      challenges: { icon: ICONS.trophy, list: [] },
      follows: { icon: ICONS.avatar, list: [] },
      other: { icon: ICONS.ellipsis, list: [] },
    };

    $('#notifications li.unread').each((i, el) => {
      const link = el.querySelector('a');
      const href = link.getAttribute('href');

      if (href.endsWith('#kudos')) {
        data.kudos.list.push(el);
      } else if (href.endsWith('#comments')) {
        data.comments.list.push(el);
      } else if (href.startsWith('/activities/')) {
        data.uploads.list.push(el);
      } else if (href.startsWith('/challenges/')) {
        data.challenges.list.push(el);
      } else if (href.startsWith('/athletes/')) {
        data.follows.list.push(el);
      } else {
        // examples:
        // sb created club event "/clubs/INT/group_events/INT
        data.other.list.push(el);
      }
    });

    $('#notifications-count').hide(); // hide "original" notifications counter
    $('#notifications .app-icon-wrapper') // prepare DOM for new element
      .css('display', 'inline-flex')
      .css('vertical-align', 'unset');

    const counter = $('<span id="notifications-counts" style="display: inline-flex;"/>');

    Object.entries(data).forEach(([key, val]) => {
      if (!val.list.length) return;
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      $(`
        <span style="margin-right: 8px;">
          <span
            class="app-icon icon-dark icon-sm"
            style="background-image: url(data:image/svg+xml;base64,${btoa(val.icon)}); background-position-y: 0%"
            title="${capitalized}"
          />
          <strong style="display: block; margin-top: 2px;">${val.list.length}</strong>
        </span>
      `).appendTo(counter);
    });


    $('#notifications-button').prepend(counter);

    // Un-highlight after "reading"
    $(document).on('mousedown', '#notifications-button', function() { // TODO: Investigate why 'click' is not working
      setTimeout(() => {
        counter.fadeOut();
      }, 1500);
    });

  });
}

// noinspection JSUnusedGlobalSymbols
StravaEnhancementSuite.prototype.switch_units = function() {

  var url = jQuery('a:contains(My Profile)[href^=\'/athletes/\']').attr('href');
  var target = window._measurement_preference === 'meters' ? 'feet' : 'meters';
  var athlete_id = parseInt(url.split('/')[2], 10);

  (new window.Strava.Athletes.Athlete(url, athlete_id)).save(
    'measurement_preference',
    target,
    { success: () => { window.location.reload(); } },
  );
};

// eslint-disable-next-line no-undef
if (typeof require !== 'undefined' && require.main !== module) module.exports = { default: StravaEnhancementSuite, helpers: StravaEnhancementSuiteHelpers };
