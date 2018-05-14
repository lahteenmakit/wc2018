const db = require('../dbconnection');
const Queries = require('./Queries.js');

const User = {
  addUser: (username, email, password, callback) => {
    return db.query(Queries.addUser, [username, email, password], callback);
  },
  getAllUsers: (callback) => {
    return db.query(Queries.getAllUsers, callback);
  },
  getUsernameById: (id, callback) => {
    return db.query(Queries.getUsernameById, [id], callback);
  }
};

module.exports = User;
