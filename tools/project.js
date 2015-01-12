var fs = require('fs');

function load(filename) {
  return fs.readFileSync(filename) + '';
}

eval(load('pages/options.js'));

console.log(load('tools/project_header.rst'));

for (var i = 0; i < StravaEnhancementSuiteOptions.length; ++i) {
  var option = StravaEnhancementSuiteOptions[i];

  console.log(option.title)
  console.log('    ' + option.description);
}

console.log(load('tools/project_footer.rst'));
