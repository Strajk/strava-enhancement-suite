const fs = require('fs');
const ejs = require('ejs');

const helpers = require('./helpers');
const pkg = require('./../package.json');

const _options = require('./../extension/pages/options' );
const options = helpers.enhanceOptionsWithImageInfo(_options.default);
const contexts = _options.contexts;


const template = fs.readFileSync('./README.ejs', 'utf-8');
const rendered = ejs.render(template, {
  pkg,
  options,
  contexts,
  filteredByKey: helpers.filteredByKey,
});

fs.writeFileSync('./README.md', rendered);
