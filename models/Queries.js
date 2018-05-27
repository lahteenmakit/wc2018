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

  /**LEAGUES**/
  createLeague: "INSERT INTO leagues (name, password) VALUES (?, ?);",
  addUserToLeague: "INSERT INTO users_leagues (user_id, league_id) VALUES (?, ?);",
  getLeagueByNameAndPassword: "SELECT * FROM leagues WHERE name=? AND password=?;",
  getLeaguesByUser: `SELECT users_leagues.user_id, users_leagues.league_id, leagues.name
                     FROM users_leagues
                     INNER JOIN leagues
                     ON users_leagues.league_id=leagues.league_id
                     AND users_leagues.user_id = ?
                     ORDER BY leagues.name ASC;`,
  getUsersInLeague: `SELECT users_leagues.user_id, users_leagues.league_id, users.username, users.points, leagues.name AS league_name
                      FROM users_leagues
                      INNER JOIN users
                      ON users_leagues.user_id=users.user_id
                      AND league_id=?
                      INNER JOIN leagues
                      ON users_leagues.league_id=leagues.league_id
                      ORDER BY users.points DESC;`,
  userIsPartOfLeague: "SELECT COUNT(user_id) FROM users_leagues WHERE user_id=? AND league_id=?;",
  userIsPartOfAnyLeague: "SELECT COUNT(user_id) FROM users_leagues WHERE user_id=?;",

  /**MATCHES**/
  getAllMatches: "SELECT * FROM matches;",
  getGroupStageMatches: "SELECT * FROM matches_base WHERE stage='group';",
  setMatchResultForUser: "UPDATE matches SET homeGoals=?,awayGoals=?,matchEnded=? WHERE user_id=? AND matchNumber=?;",
  setOfficialMatchResult: "UPDATE matches_base SET homeGoals=?,awayGoals=?,matchEnded=? WHERE matchNumber=?;",
  insertMatchesForUsers: `INSERT INTO matches (user_id, matchNumber, stage, date, location, homeTeam, awayTeam, groupNumber)
                         SELECT ?, matchNumber, stage, date, location, homeTeam, awayTeam, groupNumber
                         FROM matches_base;`,
  getUserAnswersForMatches: "SELECT homeTeam, awayTeam, homeGoals, awayGoals FROM matches WHERE user_id=? AND stage='group';",
  getNewOfficialResultsAndUserAnswers: `SELECT matches_base.matchNumber AS official_mn, matches_base.homeGoals AS official_hg, matches_base.awayGoals AS official_ag, 
                                               matches.homeGoals AS user_hg, matches.awayGoals AS user_ag, matches.user_id AS user_id
                                        FROM matches_base
                                        INNER JOIN matches
                                        ON matches_base.matchNumber=matches.matchNumber
                                        AND matches_base.matchEnded=1
                                        AND matches.matchEnded=0;`,
                                        

  /**TEAMS**/
  getAllTeams: `SELECT DISTINCT matches.homeTeam AS team, teams.flagFileName
                FROM matches
                INNER JOIN teams
                ON matches.homeTeam=teams.name
                AND matches.user_id=1
                ORDER BY matches.homeTeam ASC;`,

  /**PLAYERS**/
  getAllPlayers: "SELECT * FROM players;",

  /**QUESTIONS AND ANSWERS**/
  getAnswersByUser: "SELECT * FROM questionsAndAnswers WHERE user_id=?;",
  getAllQuestions: "SELECT DISTINCT question FROM questionsAndAnswers;",
  getExtraQuestions: "SELECT DISTINCT question,category FROM questionsAndAnswers WHERE category REGEXP 'extras*';",
  getNewOfficialStandingsAndUserAnswers: `SELECT questionsAndAnswers_base.category AS official_cat, questionsAndAnswers_base.answer AS official_answer, questionsAndAnswers.answer AS user_answer, questionsAndAnswers.user_id
                                  FROM questionsAndAnswers_base
                                  INNER JOIN questionsAndAnswers
                                  ON questionsAndAnswers_base.category=questionsAndAnswers.category
                                  AND questionsAndAnswers_base.category REGEXP 'standings*';`,
  getNewOfficialScorersAndUserAnswers: `SELECT questionsAndAnswers_base.category AS official_cat, questionsAndAnswers_base.answer AS official_answer, questionsAndAnswers.answer AS user_answer, questionsAndAnswers.user_id
                                        FROM questionsAndAnswers_base
                                        INNER JOIN questionsAndAnswers
                                        ON questionsAndAnswers_base.category=questionsAndAnswers.category
                                        AND questionsAndAnswers_base.category REGEXP 'scorers*';`,
  getNewOfficialExtrasAndUserAnswers: `SELECT questionsAndAnswers_base.category AS official_cat, questionsAndAnswers_base.answer AS official_answer, questionsAndAnswers.answer AS user_answer, questionsAndAnswers.user_id
                                        FROM questionsAndAnswers_base
                                        INNER JOIN questionsAndAnswers
                                        ON questionsAndAnswers_base.category=questionsAndAnswers.category
                                        AND questionsAndAnswers_base.category REGEXP 'extras*';`,                                                                      
  setAnswerByUser: "UPDATE questionsAndAnswers SET answer=? WHERE category=? AND user_id=?;",
  setOfficialAnswers: "UPDATE questionsAndAnswers_base SET answer=? WHERE category=?;",
  userHasAnsweredQuestions: "SELECT COUNT(1) FROM questionsAndAnswers WHERE user_id=?;",
  insertQuestionsForUsers: "INSERT INTO questionsAndAnswers (user_id, category, question, questionType, answer) " +
                           "SELECT ?, category, question, questionType, answer " +
                           "FROM questionsAndAnswers_base;"
}

module.exports = Queries;
