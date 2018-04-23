const db = require('../dbconnection');

const Team = {
  getAllTeams: (callback) => {
    return db.query("select distinct homeTeam from matches where not homeTeam ='' ", callback);
  },
  getTeamStats: (id, callback) => {
    return db.query("select * from matches where homeTeam=? OR awayTeam=?", [id,id], callback);
  }
};

module.exports = Team;
