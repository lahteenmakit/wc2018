const db = require('../dbconnection');
const Queries = require('./Queries.js');

const QuestionAnswer = {
  insertQuestionsForUsers: (userId, callback) => {
    return db.query(Queries.insertQuestionsForUsers, [userId], callback)
  },
  getAnswersByUser: (userId, callback) => {
    return db.query(Queries.getAnswersByUser, [userId], callback)
  },
  getAllQuestions: (callback) => {
    return db.query(Queries.getAllQuestions, callback)
  },
  getExtraQuestions: (callback) => {
    return db.query(Queries.getExtraQuestions, callback)
  },
  setAnswerByUser: (userId, category, answer, callback) => {
    return db.query(Queries.setAnswerByUser, [answer, category, userId], callback)
  },
  userHasAnsweredQuestions: (userId, callback) => {
    return db.query(Queries.userHasAnsweredQuestions, [userId], callback)
  }
};

module.exports = QuestionAnswer;
