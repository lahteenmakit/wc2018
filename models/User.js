const db = require('../dbconnection');

const User = {
  addUser: (username, email, password, callback) => {
    return db.query('insert into users(username, email, password) values (?, ?, ?)', [username, email, password], callback);
  },
  getAllUsers: (callback) => {
    return db.query('select * from users', callback);
  },
  getUsernameById: (id, callback) => {
    return db.query('select username from users where user_id=?', [id], callback);
  }
};

module.exports = User;
