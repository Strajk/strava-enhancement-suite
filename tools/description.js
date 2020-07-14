const fs = require('fs');
eval(fs.readFileSync('./extension/pages/options.js', 'utf-8'));

StravaEnhancementSuiteOptions.forEach(option => {
  console.log(' - ' + option.title + ': ' + option.description);
});
