const StravaEnhancementSuiteOptions = { // eslint-disable-line no-redeclare
  repeated_segments: {
    title: 'Repeated segments',
    description: 'Show aggregate segment data (fastest, slowest, average, total distance, total elevation, etc.) when segments are repeated within an activity.',
    default: true,
  },
  annual_achievements: {
    title: 'Annual achievements',
    description: 'Changes how yearly achievements (eg. "2015 KOM") are shown on the dashboard feed. "Unhighlight" keeps them visible but without making them stand out so much.',
    default: 'show',
    choices: [
      ['show', 'Show'],
      ['unhighlight', 'Unhighlight'],
      ['hide', 'Hide'],
    ],
  },
  external_links: {
    title: 'External links',
    description: 'Show links to Veloviewer, Race Shape, KOM Club etc. on activity, segment detail and Challenge pages.',
    default: true,
  },
  hide_invite_friends: {
    title: 'Hide "find friends"',
    description: 'Hide social networking buttons, including invitations to invite/find friends on Strava.',
    default: false,
  },
  hide_premium_badges: {
    title: 'Hide Premium badges',
    description: 'Hide \'Premium\' badges.',
    default: false,
  },
  comment_post_on_enter: {
    title: '"Enter" posts comment',
    description: 'Immediately posts comment when pressing the "enter" / "return" key in the edit box rather than adding a new line.',
    default: true,
  },
  hide_challenge_feed_entries: {
    title: 'Challenge feed entries',
    description: 'Hide challenge-related feed entries.',
    default: false,
  },
  hide_club_feed_entries: {
    title: 'Club feed entries',
    description: 'Hide club-related feed entries.',
    default: false,
  },
  hide_goal_feed_entries: {
    title: 'Goal feed entries',
    description: 'Hide goal-related feed entris',
    default: false,
  },
  hide_route_feed_entries: {
    title: 'Route feed entries',
    description: 'Hide route-related feed entries',
    default: false,
  },
  hide_promotion_feed_entries: {
    title: 'Promotion feed entries',
    description: 'Hide promotion-related feed entries.',
    default: false,
  },
  hide_training_plan_feed_entries: {
    title: 'Training plan feed entries',
    description: 'Hide training plan-related feed entries.',
    default: false,
  },
  hide_turbo_trainer_rides: {
    title: 'Hide turbo trainer / virtual rides',
    description: 'Hide Zwift activities or rides in the feed that do not contain a map.',
    default: false,
  },
  side_by_side_running: {
    title: 'Compare running',
    description: 'Changes the default sport for the "Side by Side comparison" module to running.',
    default: false,
  },
  running_cadence: {
    title: 'Running cadence',
    description: 'Show running cadence by default in elevation profile.',
    default: true,
  },
  running_heart_rate: {
    title: 'Running heart rate',
    description: 'Show running heart rate by default in elevation profile.',
    default: true,
  },
  running_gap: {
    title: 'Running Grade Adjusted Pace (GAP)',
    description: 'Show running Grade Adjusted Pace (GAP) by default in elevation profile.',
    default: true,
  },
  variability_index: {
    title: 'Variability Index',
    description: 'Calculate a Variability Index (VI) from the weighted average power and the average power, an indication of how "smooth" a ride was. A VI of 1.0 would mean perfect pacing. (Requires a power meter.)',
    default: true,
  },
  estimated_ftp: {
    title: 'Estimated FTP',
    description: 'Select "Show Estimated FTP" by default on Power Curve.',
    default: true,
  },
  running_tss: {
    title: 'Running TSS',
    description: 'Estimates a run"s Training Stress Score from its Grade Adjusted Pace distribution.',
    default: true,
  },
  hide_blog: {
    title: 'Hide blog links',
    description: 'Hide links to Strava blog on the dashboard.',
    default: false,
  },
  enlarge_on_hover: {
    title: 'Hover actions',
    description: 'Make various elements (Instagram images, maps, avatars, etc.) larger when you run your mouse over them.',
    default: true,
  },
  swap_clubs_and_challenge_module: {
    title: 'Swap club & challenges',
    description: 'Swap the ordering of the "Clubs" and "Challenges" module on the dashboard.',
    default: false,
  },
  hide_yearly_goals: {
    title: 'Hide "Yearly Goals"',
    description: 'Hide the "Yearly Goals" module on the dashboard.',
    default: false,
  },
  hide_upcoming: {
    title: 'Hide "upcoming"',
    description: 'Hide "Upcoming" module on the dashboard if you have no upcoming races, events or goals coming soon. Also hides the "Discover More" sub-module.',
    default: false,
  },
  improve_pagination: {
    title: 'Improve pagination',
    description: 'Add "first" and "last" links to paginated features.',
    default: true,
  },
  improve_upload_activity: {
    title: 'Improve activity upload',
    description: 'Add the ability to automatically "Save & View", CTRL+Enter support, and increase the size of the description boxes to the manual "Upload and Sync Your Activities" manual upload page,',
    default: true,
  },
  hide_calories: {
    title: 'Hide calories',
    description: 'Hide the number of calories burned on your own activity pages.',
    default: false,
  },
  convert_units: {
    title: 'Convert units on hover',
    description: 'Show converted units when you hover your mouse over numbers.',
    default: true,
  },
  show_hidden_efforts: {
    title: 'Show hidden efforts',
    description: 'When there are too many segments/efforts on a particular ride, Strava hides them behind a "Show X hidden efforts" button. Enabling this option shows these efforts by default.',
    default: true,
  },
  sort_starred_segments_first: {
    title: 'Sort starred segments first',
    description: 'Show \'starred\' segments at the top of lists instead of in their geographical order.',
    default: true,
  },
  show_same_activity_flybys: {
    title: 'Show same-activity Flybys only',
    description: 'Show same-activity Flybys only (runs or rides) in the Flyby viewer.',
    default: false,
  },
  separate_notifications: {
    title: 'Separate notifications',
    description: 'Separate notification types for kudos, comments, uploads, challenges, follows, and others',
    default: false, // TODO: Consider enabling after getting some feedback
  },
  keyboard_controls: {
    title: 'Keyboard controls',
    description: 'Enable keyboard controls on the dashboard:\n<br> <kbd>J</kbd> - Up (previous) \n<br> <kbd>K</kbd> - Down (next) \n<br> <kbd>L</kbd> - Kudos (like) \n<br> <kbd>C</kbd> - Comment \n<br> <kbd>Enter</kbd> - Go to activity  (hold shift to open in a new tab/window)\n<br> <kbd>E</kbd> - Edit activity  (hold shift to open in a new tab/window)\n<br> <kbd>U</kbd> - Go to athlete  (hold shift to open in a new tab/window) ',
    default: true,
  },
  show_kudo_all_button: {
    title: 'Show button to give Kudos to all',
    description: 'Show button in the header bar to give Kudos to all displayed activities',
    default: false,
  },
  chart_controls_colors: {
    title: 'Chart controls colors',
    description: 'Add colors to chart legend',
    default: true,
  },
  my_activities_expand_latest_activity: {
    title: 'My Activities: Expand latest activity on page load',
    description: 'When opening My Activities, expand latest activity for editing automatically.',
    default: false,
  },
  training_log_overview: {
    title: 'Training Log: Enhanced Overview',
    description: 'Show stats for all sports in the overview section in Training Log',
    default: true,
  },
  activity_shortcuts: {
    title: 'Activity page: Shortcuts',
    description: 'Allow editing own activity by clicking on it\'s title or pressing `e` key',
    default: true,
  },
  user_shortcut: {
    title: 'User profile: Shortcuts',
    description: 'Add shortcut link for editing own profile',
    default: true,
  },
  activity_edit_ux: {
    title: 'Activity editing page: UX',
    description: 'Autofocus title field; disable autocomplete; allow submitting by `enter`',
    default: true,
  },
  upload_file_ux: {
    title: 'Upload: File: UX',
    description: 'Allow submitting by `enter`',
    default: true,
  },
  upload_manual_ux: {
    title: 'Upload: Manual: UX',
    description: 'Allow submitting by `enter`; allow pre-filling params from URL',
    default: true,
  },
  // TODO: Make it more obvious that this is parent option of all hide_* options
  dashboard_filter: {
    title: 'Dashboard: Filter activities',
    description: 'Allow hiding specific activities (promos, virtual rides, treadmill runs, club events, goal achievements, ...)',
    default: true,
  },
  general_typography: {
    title: 'Enhance typography',
    description: 'Replace `--` with `–`, `->` with `→` and so on',
    default: true,
  },
  search_ux: {
    title: 'Search: UX enhancements',
    description: 'Remember search values in URL',
    default: true,
  },
};

// eslint-disable-next-line no-undef
if (typeof require !== 'undefined' && require.main !== module) module.exports = StravaEnhancementSuiteOptions;
