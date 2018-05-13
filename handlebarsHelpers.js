const hbs = require('handlebars');

hbs.registerHelper('addOne', (value, options) => {
  return parseInt(value) + 1;
});

hbs.registerHelper('eachWithTeamOptionListSort', (array, options) => {
  console.log(array)
  array.sort((a, b) => {
    if (a.homeTeam < b.homeTeam)
      return -1;
    if (a.homeTeam > b.homeTeam)
      return 1;
    return 0;
  });
});
