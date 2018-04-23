const db = require('../dbconnection');

const Match = {
  getAllMatches: (callback) => {
    return db.query('select * from matches', callback);
  },
  getMatchById: (id, callback) => {
    return db.query('select * from matches where matchId=?', [id], callback);
  },
  setMatchResult: (id, homeGoals, awayGoals, callback) => {
    var result = homeGoals + '-' + awayGoals;
    return db.query('UPDATE MATCHES SET homeGoals=?,awayGoals=?,result=?,matchEnded=1 WHERE matchId=?;', [homeGoals, awayGoals, result, id], callback);
  }
};

module.exports = Match;
