const hbs = require('handlebars');

hbs.registerHelper('addOne', (value, options) => {
  return parseInt(value) + 1;
});

hbs.registerHelper('parseImgFileName', (value, options) => {
  return value.toLowerCase() + '.png';
});
