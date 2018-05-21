const db = require('../dbconnection');
const Queries = require('./Queries.js');

const League = {
  createLeague: (name, password, callback) => {
    return db.query(Queries.createLeague, [name, password], callback);
  },
  addUserToLeague: (user_id, league_id, callback) => {
    return db.query(Queries.addUserToLeague, [user_id, league_id], callback);
  },
  getLeagueByNameAndPassword: (name, password, callback) => {
    return db.query(Queries.getLeagueByNameAndPassword, [name, password], callback);
  }
};

module.exports = League;
