const db = require('../dbconnection');
const Queries = require('./Queries.js');

const League = {
  createLeague: (name, password, callback) => {
    return db.query(Queries.createLeague, [name, password], callback);
  },
  addUserToLeague: (user_id, league_id, callback) => {
    return db.query(Queries.addUserToLeague, [user_id, league_id], callback);
  },
  userIsPartOfLeague: (user_id, league_id, callback) => {
    return db.query(Queries.userIsPartOfLeague, [user_id, league_id], callback);
  },
  userIsPartOfAnyLeague: (user_id, callback) => {
    return db.query(Queries.userIsPartOfAnyLeague, [user_id], callback);
  },
  getLeagueByNameAndPassword: (name, password, callback) => {
    return db.query(Queries.getLeagueByNameAndPassword, [name, password], callback);
  },
  getLeaguesByUser: (user_id, callback) => {
  	return db.query(Queries. getLeaguesByUser, [user_id], callback);
  },
  getUsersInLeague: (league_id, callback) => {
  	return db.query(Queries. getUsersInLeague, [league_id], callback);
  },
};

module.exports = League;
