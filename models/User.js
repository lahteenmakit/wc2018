const db = require('../dbconnection');
const Queries = require('./Queries.js');

const User = {
  addUser: (username, email, password, callback) => {
    return db.query(Queries.addUser, [username, email, password], callback);
  },
  addPoints: (points, id, callback) => {
    return db.query(Queries.addPoints, [points, id], callback);
  },
  initQuizAndPoints: (id, callback) => {
    return db.query(Queries.initQuizAndPoints, [id], callback);
  },
  getAllUsers: (callback) => {
    return db.query(Queries.getAllUsers, callback);
  },
  getUsernameById: (id, callback) => {
    return db.query(Queries.getUsernameById, [id], callback);
  },
  getPoints: (id, callback) => {
    return db.query(Queries.getPoints, [id], callback);
  },
  getQuizDone: (id, callback) => {
    return db.query(Queries.getQuizDone, [id], callback);
  },
  setQuizDone: (id, callback) => {
    return db.query(Queries.setQuizDone, [id], callback);
  },
  resetPassword: (id, password, callback) => {
    return db.query(Queries.resetPassword, [password, id], callback);
  }
};

module.exports = User;
