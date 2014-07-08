DEFAULTS = {
    comment_post_on_enter: true
  , estimated_ftp: true
  , external_links: true
  , hide_invite_friends: false
  , infinite_scroll: true
  , leaderboard_default: 'overall'
  , repeated_segments: true
  , running_cadence: true
  , running_heart_rate: true
  , running_tss: true
  , side_by_side_running: false
  , standard_google_map: false
  , variability_index: true
};

Strava = unsafeWindow.Strava;
document = unsafeWindow.document;
window = unsafeWindow;
pageView = unsafeWindow.pageView;

var strava_enhancement_suite = new StravaEnhancementSuite(DEFAULTS);
