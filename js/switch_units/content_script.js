var s = document.createElement('script');
s.textContent = 'strava_enhancement_suite.switch_units();';
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
