const db = require('../dbconnection');
const Queries = require('./Queries.js');

const Match = {
  getAllMatches: (callback) => {
    return db.query(Queries.getAllMatches, callback);
  },
  getGroupStageMatches: (callback) => {
    return db.query(Queries.getGroupStageMatches, callback);
  },
  setMatchResultForUser: (homeGoals, awayGoals, user_id, matchNumber, callback) => {
    var matchEnded = (user_id == 1) ? 1 : 0;
    console.log(user_id + "   " + matchEnded)
    return db.query(Queries.setMatchResultForUser, [homeGoals, awayGoals, matchEnded, user_id, matchNumber], callback);
  },
  insertMatchesForUsers: (user_id, callback) => {
    return db.query(Queries.insertMatchesForUsers, [user_id], callback);
  }
};

module.exports = Match;
