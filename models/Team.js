const db = require('../dbconnection');
const Queries = require('./Queries.js');

const Team = {
  getAllTeams: (callback) => {
    return db.query(Queries.getAllTeams, callback);
  }
};

module.exports = Team;
