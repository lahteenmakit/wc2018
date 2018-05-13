const hbs = require('handlebars');

hbs.registerHelper('addOne', (value, options) => {
  return parseInt(value) + 1;
});
