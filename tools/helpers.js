const fs = require('fs');

// TODO: Nicer
function enhanceOptionsWithImageInfo(options) {
  Object.entries(options).forEach(([key, option]) => {
    if (fs.existsSync(`extension/pages/img/${key}.png`)) {
      options[key].image = 'png';
    } else if (fs.existsSync(`extension/pages/img/${key}.gif`)) {
      options[key].image = 'gif';
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

module.exports = {
  enhanceOptionsWithImageInfo,
  filteredByKey,
};
