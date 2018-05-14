const Queries = {
  /**USERS**/
  addUser: "INSERT INTO users(username, email, password) VALUES (?, ?, ?);",
  getAllUsers: "SELECT * FROM users;",
  getUsernameById: "SELECT username FROM users WHERE user_id=?;",

  /**MATCHES**/
  getAllMatches: "SELECT * FROM matches;",
  getGroupStageMatches: "SELECT * FROM matches WHERE stage='group' AND user_id=1;",
  setMatchResultForUser: "UPDATE matches SET homeGoals=?,awayGoals=?,matchEnded=1 WHERE user_id=? AND matchNumber=?;",
  insertMatchesForUsers:  "INSERT INTO matches(user_id,matchNumber,stage,date,location,homeTeam,awayTeam,groupNumber,homeGoals,awayGoals,matchEnded) VALUES ?",

  /*QUESTIONS AND ANSWERS*/
  getAnswersByUser: "SELECT FROM questionsAndAnswers WHERE user_id=?;",
  getAllQuestions: "SELECT DISTINCT question FROM questionsAndAnswers;",
  getExtraQuestions: "SELECT DISTINCT question FROM questionsAndAnswers WHERE category REGEXP 'extras*';",
  setAnswerByUser: "UPDATE questionsAndAnswers SET answer=? WHERE category=? AND user_id=?;",
  userHasAnsweredQuestions: "SELECT COUNT(1) FROM questionsAndAnswers WHERE user_id=?",
  insertQuestionsForUsers: "INSERT INTO questionsAndAnswers (user_id, category, question, questionType, answer) VALUES ?"
}

module.exports = Queries;
