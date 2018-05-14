const db = require('../dbconnection');

const QuestionAnswer = {
  getStadingsAnswersByUser: (userId, callback) => {
    return db.query('select answer_champion,answer_runnerup,answer_thirdplace from questionsAndAnswers where user_id=?;', [userId], callback)
  },
  getTopScorerAnswersByUser: (userId, callback) => {
    return db.query('select answer_topScorer from questionsAndAnswers where user_id=?;', [userId], callback)
  },
  getExtraQuestionsAnswersByUser: (userId, callback) => {
    return db.query('select extra1_answer,extra2_answer,extra3_answer,extra4_answer,extra5_answer from questionsAndAnswers where user_id=?;', [userId], callback)
  },
  getAllExtraQuestions: (callback) => {
    return db.query('select extra1_question,extra2_question,extra3_question,extra4_question,extra5_question from questionsAndAnswers;', callback)
  },
  setStadingsAnswersByUser: (userId, answer1, answer2, answer3, callback) => {
    return db.query('insert into questionsAndAnswers (answer_champion,answer_runnerup,answer_thirdplace,user_id) values (?,?,?,?);', [answer1, answer2, answer3, userId], callback)
  },
  setTopScorerAnswersByUser: (userId, answer, callback) => {
    return db.query('insert into questionsAndAnswers (answer_topScorer,user_id) values(?,?);', [answer, userId], callback)
  },
  setExtraQuestionAnswersByUser: (userId, answer1, answer2, answer3, answer4, answer5, callback) => {
    return db.query('insert into questionsAndAnswers (extra1_answer,extra2_answer,extra3_answer,extra4_answer,extra5_answer,user_id) values (?,?,?,?,?,?);', [answer1, answer2, answer3, answer4, answer5, userId], callback)
  },
  updateStadingsAnswersByUser: (userId, answer1, answer2, answer3, callback) => {
    return db.query('update questionsAndAnswers set answer_champion=?,answer_runnerup=?,answer_thirdplace=? where user_id=?;', [answer1, answer2, answer3, userId], callback)
  },
  updateTopScorerAnswersByUser: (userId, answer, callback) => {
    return db.query('update questionsAndAnswers set answer_topScorer=? where user_id=?;', [answer, userId], callback)
  },
  updateExtraQuestionAnswersByUser: (userId, answer1, answer2, answer3, answer4, answer5, callback) => {
    return db.query('update questionsAndAnswers set extra1_answer=?,extra2_answer=?,extra3_answer=?,extra4_answer=?,extra5_answer=? where user_id=?;', [answer1, answer2, answer3, answer4, answer5, userId], callback)
  },
  userHasAnsweredQuestions: (userId, callback) => {
    return db.query('select count(1) from questionsAndAnswers where user_id=?', [userId], callback)
  }
};

module.exports = QuestionAnswer;
