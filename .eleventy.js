module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({'extension/pages/options.css': 'styles/options.css'});
  eleventyConfig.addPassthroughCopy({'extension/pages/img': 'img'});
};
