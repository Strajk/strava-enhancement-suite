const fs = require('fs');
const ejs = require('ejs');

const pkg = require('./../package.json');
const options = require('./../extension/pages/options.js');

const template = fs.readFileSync('./README.ejs', 'utf-8');
const rendered = ejs.render(template, { pkg, options });

fs.writeFileSync('./README.md', rendered);
