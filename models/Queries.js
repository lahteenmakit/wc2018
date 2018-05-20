const Queries = {
  /**USERS**/
  addUser: "INSERT INTO users(username, email, password, points, quizDone) VALUES (?, ?, ?, 0, 0);",
  addPoints: "UPDATE users SET points = points + ? WHERE user_id=?;",
  initQuizAndPoints: "UPDATE users SET points=0,quizDone=0 WHERE user_id=?;",
  getAllUsers: "SELECT * FROM users;",
  getUsernameById: "SELECT username FROM users WHERE user_id=?;",
  getPoints: "SELECT points FROM users WHERE user_id=?;",
  getQuizDone: "SELECT quizDone FROM users WHERE user_id=?;",
  setQuizDone: "UPDATE users SET quizDone=1 WHERE user_id=?;",

  /**MATCHES**/
  getAllMatches: "SELECT * FROM matches;",
  getGroupStageMatches: "SELECT * FROM matches WHERE stage='group' AND user_id=1;",
  setMatchResultForUser: "UPDATE matches SET homeGoals=?,awayGoals=?,matchEnded=? WHERE user_id=? AND matchNumber=?;",
  insertMatchesForUsers: "INSERT INTO matches (user_id, matchNumber, stage, date, location, homeTeam, awayTeam, groupNumber, homeGoals, awayGoals, matchEnded) " +
                         "SELECT ?, matchNumber, stage, date, location, homeTeam, awayTeam, groupNumber, homeGoals, awayGoals, matchEnded " +
                         "FROM matches_base;",
  getUserAnswersForMatches: "SELECT homeTeam, awayTeam, homeGoals, awayGoals FROM matches WHERE user_id=? AND stage='group';",

  /**TEAMS**/
  getAllTeams: `SELECT DISTINCT matches.homeTeam AS team, teams.flagFileName
                FROM matches
                INNER JOIN teams
                ON matches.homeTeam=teams.name
                AND matches.user_id=1
                ORDER BY matches.homeTeam ASC;`,

  /**QUESTIONS AND ANSWERS**/
  getAnswersByUser: "SELECT * FROM questionsAndAnswers WHERE user_id=?;",
  getAllQuestions: "SELECT DISTINCT question FROM questionsAndAnswers;",
  getExtraQuestions: "SELECT DISTINCT question,category FROM questionsAndAnswers WHERE category REGEXP 'extras*';",
  setAnswerByUser: "UPDATE questionsAndAnswers SET answer=? WHERE category=? AND user_id=?;",
  userHasAnsweredQuestions: "SELECT COUNT(1) FROM questionsAndAnswers WHERE user_id=?",
  insertQuestionsForUsers: "INSERT INTO questionsAndAnswers (user_id, category, question, questionType, answer) " +
                           "SELECT ?, category, question, questionType, answer " +
                           "FROM questionsAndAnswers_base;"
}

module.exports = Queries;
