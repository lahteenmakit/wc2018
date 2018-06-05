const hbs = require('handlebars');
const moment = require('moment');

hbs.registerHelper('addOne', (value, options) => {
  return parseInt(value) + 1;
});

hbs.registerHelper('isOne', (value, options) => {
  return parseInt(value) == 1 ? true : false;
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
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

hbs.registerHelper('tournamentStarted', (options) => {
	var startDate = moment('14/06/2017', 'DD/MM/YYYY');
	var today = moment();
	if(today >= startDate) {
		return options.fn(this);
	}
	else
		return options.inverse(this);
});

hbs.registerHelper('stringFirstPart', (value) => {
  return value.split(': ')[0];
});

hbs.registerHelper('stringSecondPart', (value) => {
  return value.split(': ')[1];
});

hbs.registerHelper('splitDateGetTime', (value) => {
  return value.split(' ')[1];
});


hbs.registerHelper('tournamentNotStarted', (options) => {
	var startDate = moment('14/06/2017', 'DD/MM/YYYY');
	var today = moment();
	if(today < startDate) {
		return options.fn(this);
	}
	else
		return options.inverse(this);
});

var PLAYER_OPT_GROUP = '';

hbs.registerHelper('newOptGroup', (currentValue) => {
	console.log(PLAYER_OPT_GROUP)
	console.log(currentValue)
	if(PLAYER_OPT_GROUP != currentValue) {
		PLAYER_OPT_GROUP = currentValue;
		return true;
	}
	return false;
});
