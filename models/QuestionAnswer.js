const db = require('../dbconnection');
const Queries = require('./Queries.js');

const QuestionAnswer = {
  insertQuestionsForUsers: (userId, callback) => {
    var questionsArray = [
      [userId, 'standings_champion', 'Champion', 'multipleChoice', ''],
      [userId, 'standings_runnerUp', 'Runner-up', 'multipleChoice', ''],
      [userId, 'standings_thirdPlace', '3rd place', 'multipleChoice', ''],
      [userId, 'scorers_topScorer', 'Top Scorer', 'multipleChoice', ''],
      [userId, 'extras_questions1', 'Extra Question 1', '', ''],
      [userId, 'extras_questions2', 'Extra Question 2', '', ''],
      [userId, 'extras_questions3', 'Extra Question 3', '', ''],
      [userId, 'extras_questions4', 'Extra Question 4', '', ''],
      [userId, 'extras_questions5', 'Extra Question 5', '', '']
    ];
    return db.query(Queries.insertQuestionsForUsers, [questionsArray], callback)
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
