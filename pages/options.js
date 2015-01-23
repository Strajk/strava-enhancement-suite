var StravaEnhancementSuiteOptions = [
    {
      "name": "repeated_segments"
    , "title": "Repeated segments"
    , "description": "Show aggregate segment data (fastest, slowest, average, total distance, total elevation, etc.) when segments are repeated within an activity."
    , "image": true
    , "default": true
  }
  , {
      "name": "annual_achievements"
    , "title": "Annual achievements"
    , "description": "Changes how yearly achievements (eg. \"2015 KOM\") are shown on the dashboard feed. \"Unhighlight\" keeps them visible but without making them stand out so much."
    , "image": false
    , "default": "show"
    , "choices": [
        ["show", "Show"]
      , ["unhighlight", "Unhighlight"]
      , ["hide", "Hide"]
    ]
  }
  , {
      "name": "infinite_scroll"
    , "title": "Infinite scroll"
    , "description": "Automatically load more dashboard entries when reaching the bottom."
    , "image": true
    , "default": true
  }
  , {
      "name": "external_links"
    , "title": "External links"
    , "description": "Show links to Strava Labs Flyby, Veloviewer, Race Shape, KOM Club etc. on activity, segment detail and Challenge pages."
    , "image": true
    , "default": true
  }
  , {
      "name": "hide_invite_friends"
    , "title": "Hide \"find friends\""
    , "description": "Hide social networking buttons, including invitations to invite/find friends on Strava."
    , "image": true
    , "default": false
  }
  , {
      "name": "comment_post_on_enter"
    , "title": "\"Enter\" posts comment"
    , "description": "Immediately posts comment when pressing the \"enter\" / \"return\" key in the edit box rather than adding a new line."
    , "image": true
    , "default": true
  }
  , {
      "name": "hide_challenge_feed_entries"
    , "title": "Challenge feed entries"
    , "description": "Hide challenge-related feed entries."
    , "image": true
    , "default": false
  }
  , {
      "name": "hide_club_feed_entries"
    , "title": "Club feed entries"
    , "description": "Hide club-related feed entries."
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_goal_feed_entries"
    , "title": "Goal feed entries"
    , "description": "Hide goal-related feed entris"
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_route_feed_entries"
    , "title": "Route feed entries"
    , "description": "Hide route-related feed entries"
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_promotion_feed_entries"
    , "title": "Promotion feed entries"
    , "description": "Hide promotion-related feed entries."
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_training_plan_feed_entries"
    , "title": "Training plan feed entries"
    , "description": "Hide training plan-related feed entries."
    , "image": false
    , "default": false
  }
  , {
      "name": "side_by_side_running"
    , "title": "Compare running"
    , "description": "Changes the default sport for the \"Side by Side comparison\" module to running."
    , "image": true
    , "default": false
  }
  , {
      "name": "running_cadence"
    , "title": "Running cadence"
    , "description": "Show running cadence by default in elevation profile."
    , "image": true
    , "default": true
  }
  , {
      "name": "running_heart_rate"
    , "title": "Running heart rate"
    , "description": "Show running heart rate by default in elevation profile."
    , "image": true
    , "default": true
  }
  , {
      "name": "variability_index"
    , "title": "Variability Index"
    , "description": "Calculate a Variability Index (VI) from the weighted average power and the average power, an indication of how \"smooth\" a ride was. A VI of 1.0 would mean perfect pacing."
    , "image": true
    , "default": true
  }
  , {
      "name": "estimated_ftp"
    , "title": "Estimated FTP"
    , "description": "Select \"Show Estimated FTP\" by default on Power Curve."
    , "image": true
    , "default": true
  }
  , {
      "name": "running_tss"
    , "title": "Running TSS"
    , "description": "Estimates a run\"s Training Stress Score from its Grade Adjusted Pace distribution."
    , "image": true
    , "default": true
  }
  , {
      "name": "standard_google_map"
    , "title": "Standard Google Map"
    , "description": "Prefer the \"Standard\" Google map over the \"Terrain\" view."
    , "image": true
    , "default": false
  }
  , {
      "name": "hide_shop"
    , "title": "Hide shop links"
    , "description": "Hide links to the Strava store in the header, footer and on activity pages."
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_blog"
    , "title": "Hide blog links"
    , "description": "Hide links to Strava blog on the dashboard."
    , "image": false
    , "default": false
  }
  , {
      "name": "flyby_select_all"
    , "title": "Add \"Select all\" to Flyby"
    , "description": "Add an option to show/hide all \"Flyby\" rides at once."
    , "image": false
    , "default": true
  }
  , {
      "name": "enlarge_on_hover"
    , "title": "Hover actions"
    , "description": "Make various elements (Instagram images, maps, avatars, etc.) larger when you run your mouse over them."
    , "image": false
    , "default": true
  }
  , {
      "name": "swap_clubs_and_challenge_module"
    , "title": "Swap club & challenges"
    , "description": "Swap the ordering of the \"Clubs\" and \"Challenges\" module on the dashboard."
    , "image": false
    , "default": false
  }
  , {
      "name": "hide_upcoming"
    , "title": "Hide \"upcoming\""
    , "description": "Hide \"Upcoming\" module on the dashboard if you have no upcoming races, events or goals coming soon. Also hides the \"Discover More\" sub-module."
    , "image": false
    , "default": false
  }
  , {
      "name": "improve_pagination"
    , "title": "Improve pagination"
    , "description": "Add \"first\" and \"last\" links to paginated features."
    , "image": false
    , "default": true
  }
  , {
      "name": "improve_upload_activity"
    , "title": "Improve activity upload"
    , "description": "Add the ability to automatically \"Save & View\", CTRL+Enter support, and increase the size of the description boxes to the manual \"Upload and Sync Your Activities\" manual upload page,"
    , "image": false
    , "default": true
  }
  , {
      "name": "hide_calories"
    , "title": "Hide calories"
    , "description": "Hide the number of calories burned on your own activity pages."
    , "image": false
    , "default": false
  }
  , {
      "name": "convert_units"
    , "title": "Convert units on hover"
    , "description": "Show converted units when you hover your mouse over numbers."
    , "image": false
    , "default": true
  }
]
