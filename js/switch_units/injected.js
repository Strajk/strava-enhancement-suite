(function() {
  var url = jQuery("a:contains(My Profile)[href^='/athletes/']").attr('href');
  var target = window._measurement_preference == "meters" ? "feet" : "meters";
  var athlete_id = parseInt(url.split('/')[2], 10);

  (new Strava.Athletes.Athlete(url, athlete_id)).save(
    "measurement_preference",
    target,
    {"success": function(x) { window.location.reload(); } }
  );
})();
