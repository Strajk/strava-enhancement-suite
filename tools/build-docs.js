const fs = require('fs');
const ejs = require('ejs');

const pkg = require('./../package.json');

const _options = require('./../extension/pages/options.js');
const options = enhanceOptionsWithImageInfo(_options.default);
const contexts = _options.contexts;


const template = fs.readFileSync('./README.ejs', 'utf-8');
const rendered = ejs.render(template, {
  pkg,
  options,
  contexts,
  filteredByKey,
});

fs.writeFileSync('./README.md', rendered);

// TODO: Nicer
function enhanceOptionsWithImageInfo(options) {
  Object.entries(options).forEach(([key, option]) => {
    if (fs.existsSync(`extension/pages/img/${key}.png`)) {
      options[key].image = true;
    }
  });
  return options;
}

/* TODO: DRY*/
function filteredByKey (obj, x) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => {
      return val.context === x;
    }),
  );
}
