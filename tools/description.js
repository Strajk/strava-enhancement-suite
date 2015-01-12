var fs = require('fs');

eval(fs.readFileSync('pages/options.js') + '');

for (var i = 0; i < StravaEnhancementSuiteOptions.length; ++i) {
  var option = StravaEnhancementSuiteOptions[i];

  console.log(' - ' + option.title + ': ' + option.description);
}
