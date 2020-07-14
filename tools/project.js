const fs = require('fs');
eval(fs.readFileSync('./extension/pages/options.js', 'utf-8'));

console.log(fs.readFileSync('tools/project_header.rst', 'utf-8'));

StravaEnhancementSuiteOptions.forEach(option => {
  console.log(option.title);
  console.log('    ' + option.description);
});

console.log(fs.readFileSync('tools/project_footer.rst', 'utf-8'));
