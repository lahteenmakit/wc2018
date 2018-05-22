const Match = require('../models/Match.js');

const pointSystem = {
	'goalsCorrectForOneTeam': 2,
	'outcomeCorrect': 1,
}

module.exports.addPoints = function() {
	var points = 0;
	Match.getNewOfficialResultsAndUserAnswers((err, rows) => {
		if(err) {
			throw err;
		}
		else {
			console.log(rows)
			for(var i=0; i<rows.length; i++) {
				console.log(rows[i]);
			}
		}
	});
}