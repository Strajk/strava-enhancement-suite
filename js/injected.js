function StravaEnhancementSuite(options) {
  this.options = options;

  this.default_to_my_results();
};

StravaEnhancementSuite.prototype.default_to_my_results = function() {
  if (this.options.default_to_my_results === false) {
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
