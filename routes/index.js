const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../dbconnection');

const User = require('../models/User.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

router.get('/', (req, res, next) => {
  req.isAuthenticated() ? console.log(req.user) : console.log('User not Authenticated');
  res.render('home', {title: 'Home'});
});

//Quiz stuff. Write a function. quizDoneAlreadyYesOrNo(). don't show quiz if done already for user.
router.get('/quiz/matches', authenticationMiddleware(), (req, res, next) => {
  Match.getAllMatches( (err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('quiz-matches', {
        matches: rows
      });
    }
  });
});

router.post('/quiz/matches', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    if(i.includes('homeGoals')) {
      var match = {};
      match['matchId'] = i.split('-')[0];
      /*match['userId'] = User.getUsernameById(req.user, (err, rows) => {
        if (err) {
            error += err;
        } else {
            success += rows;
        }
      });*/
      match['userId'] = 'test';
      match['homeGoals'] = answers[i];
    } else {
      match['awayGoals'] = answers[i];
      Match.setMatchResult(match.matchId, match.userId, match.homeGoals, match.awayGoals, (err, rows) => {
        if (err) {
            error += err;
        } else {
            success += rows;
        }
      });
    }
    console.log(match);
  }
  error != '' ? res.json(error) : res.redirect('/quiz/standings');
});

router.get('/quiz/standings', authenticationMiddleware(), (req, res, next) => {
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

router.post('/quiz/standings', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  QuestionAnswer.userHasAnsweredQuestions(req.user.user_id, (err, rows) => {
    if (err) {
      error += err;
    } else {
      if(rows[0]['count(1)'] == 0) {
        QuestionAnswer.setStadingsAnswersByUser(req.user.user_id, answers.champion, answers.runnerUp, answers.thirdPlace, (err, rows) => {
          if (err) {
              error += err;
          } else {
              success += rows;
          }
        });
      } else {
        QuestionAnswer.updateStadingsAnswersByUser(req.user.user_id, answers.champion, answers.runnerUp, answers.thirdPlace, (err, rows) => {
          if (err) {
              error += err;
          } else {
              success += rows;
          }
        });
      }
    }
  });
  error != '' ? res.json(error) : res.redirect('/quiz/scorers');
});

router.get('/quiz/scorers', authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-scorers');
});

router.post('/quiz/scorers', authenticationMiddleware(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  QuestionAnswer.userHasAnsweredQuestions(req.user.user_id, (err, rows) => {
    if (err) {
      error += err;
    } else {
      if(rows[0]['count(1)'] == 0) {
        QuestionAnswer.setTopScorerAnswersByUser(req.user.user_id, answers.answer, (err, rows) => {
          if (err) {
              error += err;
          } else {
              success += rows;
          }
        });
      } else {
        QuestionAnswer.updateTopScorerAnswersByUser(req.user.user_id, answers.answer, (err, rows) => {
          if (err) {
              error += err;
          } else {
              success += rows;
          }
        });
      }
    }
  });
  error != '' ? res.json(error) : res.redirect('/quiz/extras');
});

//Tähän jäätiin
router.get('/quiz/extras', authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-extras');
});

router.post('/quiz/extras', authenticationMiddleware(), (req, res, next) => {
  res.redirect('/quiz/done');
});

router.get('/quiz/done', authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-done');
});

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Registration'});
});

router.get('/profile', authenticationMiddleware(), (req, res, next) => {
  res.render('profile', {title: 'Profile'});
});

router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
})
);

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

router.post('/register', (req, res, next) => {
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 2-100 characters long.').len(2, 100);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
  req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

  const errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      title: 'Registration Error',
      errors: errors
    });
  } else {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      User.addUser(req.body.username, req.body.email, hash, (err, results, fields) => {
        if(err) throw err;
        else {
          db.query('select last_insert_id() as user_id', (error, results, fields) => {
            if(error) {
              console.log('Error while querying database');
              throw error;
            }

            const user_id = results[0];

            console.log(user_id)
            req.login(user_id, (err) => {
              res.redirect('/');
            })
          });
        }
      });
    });
  }
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
	  if (req.isAuthenticated())
      return next();
	  res.redirect('/login')
	}
}

module.exports = router;
