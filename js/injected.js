function StravaEnhancementSuite(options) {
  this.options = options;

  this.default_to_my_results();
  this.running_tss();
  this.standard_google_map();
};

StravaEnhancementSuite.prototype.default_to_my_results = function() {
  if (this.options.default_to_my_results === false) {
    return;
  }

  if (typeof Strava.Labs === 'undefined') {
    return;
  }

  // Default to my results
  var view = Strava.Labs.Activities.SegmentLeaderboardView;
  var fn = view.prototype.render;

  view.prototype.render = function () {
    var elem = jQuery(this.el);
    var result = fn.apply(this, Array.prototype.slice.call(arguments));

    if (!elem.hasClass('once-only')) {
      elem.addClass('once-only').find('.clickable[data-filter=my_results]').click();
    }

    return result;
  };
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

StravaEnhancementSuite.prototype.standard_google_map = function() {
  if (this.options.standard_google_map === false) {
    return;
  }

  var poll = function() {
    var elem = jQuery('a.map-type-selector[data-map-type-id=standard]').click();

    if (elem.length > 0) {
      elem.parents('.drop-down-menu').click();
    } else {
      setTimeout(poll, 1000);
    }
  };

  if (jQuery('#map-canvas').length > 0) {
    poll();
  }
};

StravaEnhancementSuite.prototype.switch_units = function() {
  if (this.options.standard_google_map === false) {
    return;
  }

  var url = jQuery("a:contains(My Profile)[href^='/athletes/']").attr('href');
  var target = window._measurement_preference == "meters" ? "feet" : "meters";
  var athlete_id = parseInt(url.split('/')[2], 10);

  (new Strava.Athletes.Athlete(url, athlete_id)).save(
    "measurement_preference",
    target,
    {"success": function(x) { window.location.reload(); } }
  );
};
