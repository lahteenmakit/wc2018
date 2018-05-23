const express = require('express');
const router = express.Router();

const User = require('../models/User.js');
const League = require('../models/League.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

router.get('/start', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  League.userIsPartOfAnyLeague(req.user.user_id, (err, rows) => {
    if(err) throw err;
    else {
      var userIsPartOfLeague = rows[0]['COUNT(user_id)'] > 0 ? true : false;  
      res.render('quiz-start', {
        partOfLeague: userIsPartOfLeague
      });
    }
  });
});

router.get('/matches', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  Match.getGroupStageMatches((err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('quiz-matches', {
        matches: rows
      });
    }
  });
});

router.post('/matches', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    if(i.includes('homeGoals')) {
      var match = {};
      match['matchNumber'] = i.split('-')[0];
      match['homeGoals'] = answers[i];
    } else {
      match['awayGoals'] = answers[i];
      Match.setMatchResultForUser(match.homeGoals, match.awayGoals, req.user.user_id, match.matchNumber, (err, rows) => {
        if (err) {
            error += err;
        } else {
            success += rows;
        }
      });
    }
  }
  error != '' ? res.json(error) : res.redirect('/quiz/standings');
});

router.get('/standings', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  Team.getAllTeams( (err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('quiz-standings', {
        teams: rows
      });
    }
  });
});

router.post('/standings', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i;
    QuestionAnswer.setAnswerByUser(req.user.user_id, category, answers[i], (err, rows) => {
      if (err) {
          error += err;
      } else {
          success += rows;
      }
    });
  }
  error != '' ? res.json(error) : res.redirect('/quiz/scorers');
});

router.get('/scorers', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-scorers');
});

router.post('/scorers', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i;
    QuestionAnswer.setAnswerByUser(req.user.user_id, category, answers[i], (err, rows) => {
      if (err) {
          error += err;
      } else {
          success += rows;
      }
    });
  }
  error != '' ? res.json(error) : res.redirect('/quiz/extras');
});

router.get('/extras', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  QuestionAnswer.getExtraQuestions((err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('quiz-extras', {
        questions: rows
      });
    }
  });
});

router.post('/extras', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i;
    QuestionAnswer.setAnswerByUser(req.user.user_id, category, answers[i], (err, rows) => {
      if (err) {
          error += err;
      } else {
          success += rows;
      }
    });
  }
  if(error) {
    res.json(error);
  } else {
    User.setQuizDone(req.user.user_id, (err, rows) => {
      if(err) throw err;
      else res.redirect('/quiz/done');
    });
  }
});

router.get('/done', authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-done')
});

function getQuizDone() {
  return (req, res, next) => {
    if(req.isAuthenticated()) {
      User.getQuizDone(req.user.user_id, (err, rows) => {
        if(err) throw err;
        else {
          var quizDone = rows[0].quizDone;
          if(quizDone == 1)
            res.redirect('/quiz/done');
          else {
            return next();
          }
        }
      });
    } else {
      res.redirect('/login');
    }
  }
}

function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login')
  }
}

module.exports = router;