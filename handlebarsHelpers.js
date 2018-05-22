const hbs = require('handlebars');

hbs.registerHelper('addOne', (value, options) => {
  return parseInt(value) + 1;
});

hbs.registerHelper('getRank', (value, options) => {
	var suffix = '';
	var number = parseInt(value) + 1;
	switch(number) {
		case 1:
			suffix = 'st'
			break;
		case 2:
			suffix = 'nd'
			break;
		case 3:
			suffix = 'rd'
			break;
		default:
			suffix = 'th'
	}
  	return number+suffix;
});

hbs.registerHelper('parseImgFileName', (value, options) => {
  return value.toLowerCase() + '.png';
});
