const db = require('../dbconnection');
const Queries = require('./Queries.js');

const Player = {
  getAllPlayers: (callback) => {
    return db.query(Queries.getAllPlayers, callback);
  }
};

module.exports = Player;