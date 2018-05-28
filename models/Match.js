const db = require('../dbconnection');
const Queries = require('./Queries.js');

const Match = {
  addUserPointsForMatch: (points, user_id, matchNumber, callback) => {
    return db.query(Queries.addUserPointsForMatch, [points, user_id, matchNumber], callback);
  },
  getAllMatches: (callback) => {
    return db.query(Queries.getAllMatches, callback);
  },
  getGroupStageMatches: (callback) => {
    return db.query(Queries.getGroupStageMatches, callback);
  },
  getUserAnswersForMatches: (user_id, callback) => {
    return db.query(Queries.getUserAnswersForMatches, [user_id], callback);
  },
  getNewOfficialResultsAndUserAnswers: (callback) => {
    return db.query(Queries.getNewOfficialResultsAndUserAnswers, callback);
  },
  setOfficialMatchResult: (homeGoals, awayGoals, matchNumber, callback) => {
    var matchEnded = 1;
    return db.query(Queries.setOfficialMatchResult, [homeGoals, awayGoals, matchEnded, matchNumber], callback);
  },
  setMatchResultForUser: (homeGoals, awayGoals, user_id, matchNumber, callback) => {
    var matchEnded = (user_id == 1) ? 1 : 0;
    return db.query(Queries.setMatchResultForUser, [homeGoals, awayGoals, matchEnded, user_id, matchNumber], callback);
  },
  insertMatchesForUsers: (user_id, callback) => {
    return db.query(Queries.insertMatchesForUsers, [user_id], callback);
  }
};

module.exports = Match;
