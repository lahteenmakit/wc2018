const db = require('../dbconnection');

const User = {
  addUser: (object, callback) => {
    return db.query('insert into users(username, email, password) values (?, ?, ?)', [object.username, object.email, object.password], callback);
  },

  getAllUsers: (callback) => {
    return db.query('select * from users', callback);
  }

  /*addParticipiantPoints: (id, points, callback) => {
    return db.query('UPDATE participiants SET points=?+points WHERE id=?;', [points, id], callback);
  }*/
};

module.exports = User;
