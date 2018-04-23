const db = require('../dbconnection');

const Participiant = {
  getAllParticipiants: (callback) => {
    return db.query('select * from participiants', callback);
  },
  addParticipiantPoints: (id, points, callback) => {
    return db.query('UPDATE participiants SET points=?+points WHERE id=?;', [points, id], callback);
  }
};

module.exports = Participiant;
