function StravaEnhancementSuite(options) {
  this.options = options;

  this.comment_post_on_enter();
  this.default_to_my_results();
  this.estimated_ftp();
  this.hide_invite_friends();
  this.infinite_scroll();
  this.running_cadence();
  this.running_tss();
  this.side_by_side_running();
  this.standard_google_map();
  this.variability_index();

  this.edit_profile();
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

StravaEnhancementSuite.prototype.default_to_my_results = function() {
  if (this.options.default_to_my_results === false) {
    return;
  }

  if (typeof Strava.Labs === 'undefined') {
    return;
  }

  var view = Strava.Labs.Activities.SegmentLeaderboardView;
  var fn = view.prototype.render;

  view.prototype.render = function () {
    var result = fn.apply(this, Array.prototype.slice.call(arguments));

    jQuery(this.el)
      .not('.once-only')
      .addClass('once-only')
      .find('.clickable[data-filter=my_results]')
      .click()
      ;

    return result;
  };
};

StravaEnhancementSuite.prototype.estimated_ftp = function() {
  if (this.options.estimated_ftp === false) {
    return;
  }

  jQuery('#cpcurve-estimatedCP').click();
};

StravaEnhancementSuite.prototype.hide_invite_friends = function() {
  if (this.options.hide_invite_friends === false) {
    return;
  }

  // "You Should Follow" on dashboard
  jQuery('#suggested-follow-module').hide();

  // "Find Your Friends On Strava" on dashboard
  jQuery('#invite-your-friend-module').hide();

  // "Invite friends" in navbar
  jQuery('header nav a.find-and-invite').parent('li').hide();

  // "Share your rides" on profile
  jQuery('a#embed-athlete-widget').parent('section').hide();
};

StravaEnhancementSuite.prototype.infinite_scroll = function() {
  if (this.options.infinite_scroll === false) {
    return;
  }

  if (window.location.pathname.indexOf('/dashboard') !== 0) {
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

StravaEnhancementSuite.prototype.edit_profile = function() {
  if (window.location.pathname.indexOf(jQuery('header .user-menu a').attr('href')) !== 0) {
    return;
  }

  jQuery('<a>')
    .css('font-size', '20px')
    .css('margin-left', '8px')
    .attr('href', '/settings/profile')
    .text('(edit)')
    .appendTo('.pageContent h1:first');
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

StravaEnhancementSuite.prototype.running_tss = function() {
  if (this.options.running_tss === false) {
    return;
  }

  if (typeof Strava.Labs === 'undefined') {
    return;
  }

  var TSS_PER_HOUR = {
    'Z1':  60,
    'Z2': 100,
    'Z3': 120,
    'Z4': 200,
    'Z5': 300,
    'Z6': 600
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

StravaEnhancementSuite.prototype.side_by_side_running = function() {
  if (this.options.side_by_side_running === false) {
    return;
  }

  setInterval(function() {
    jQuery('section.comparison .running-tab')
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

  if (typeof pageView === 'undefined') {
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
