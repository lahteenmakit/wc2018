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
  getNewOfficialStandingsAndUserAnswers: (callback) => {
    return db.query(Queries.getNewOfficialStandingsAndUserAnswers, callback)
  },
  getNewOfficialScorersAndUserAnswers: (callback) => {
    return db.query(Queries.getNewOfficialScorersAndUserAnswers, callback)
  },
  getNewOfficialExtrasAndUserAnswers: (callback) => {
    return db.query(Queries.getNewOfficialExtrasAndUserAnswers, callback)
  },
  setAnswerByUser: (userId, category, answer, callback) => {
    return db.query(Queries.setAnswerByUser, [answer, category, userId], callback)
  },
  setOfficialAnswers: (answer, category, callback) => {
    return db.query(Queries.setOfficialAnswers, [answer, category], callback)
  },
  userHasAnsweredQuestions: (userId, callback) => {
    return db.query(Queries.userHasAnsweredQuestions, [userId], callback)
  }
};

module.exports = QuestionAnswer;
