const fs = require('fs');
const ejs = require('ejs');
const rewire = require('rewire');

const pkg = require('./../package.json');
const options = rewire('./../extension/pages/options.js').__get__('StravaEnhancementSuiteOptions');

const template = fs.readFileSync('./README.ejs', 'utf-8');
const rendered = ejs.render(template, { pkg, options });

fs.writeFileSync('./README.md', rendered);






