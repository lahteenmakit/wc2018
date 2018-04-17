const db = require('../dbconnection');

const Match = {
  getAllMatches: (callback) => {
    return db.query('select * from matches', callback);
  },
  getMatchById: (id, callback) => {
    console.log('hello');
    return db.query('select * from matches where matchId=?', [id], callback);
  }
};

module.exports = Match;
