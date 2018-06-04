const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const flash = require('express-flash');

const moment = require('moment');
const _ = require('lodash');

const User = require('../models/User.js');
const League = require('../models/League.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');
const pointSystem = require('../pointSystem.js');

function userIsAdmin() {
  return (req, res, next) => {
    if(!req.isAuthenticated())
      res.redirect('/login');
    else if(req.user.user_id == 1)
      return next();
    res.redirect('/');
  }
}

router.get('/', userIsAdmin(), (req, res, next) => {
  res.render('admin');
});

router.get('/matches', userIsAdmin(), (req, res, next) => {
    Match.getGroupStageMatches((err, rows) => {
    if (err) {
      res.json(err);
    } else {
      var matchesToShow = rows.filter((element) => {
        return element.matchEnded == 0;
      });
      res.render('admin-matches', {
        matches: matchesToShow
      });
    }
  });
});

router.post('/matches', userIsAdmin(), (req, res, next) => {
  var success = '', error = '';
  var results = req.body;
  for(var i in results) {
    if(i.includes('homeGoals')) {
      var match = {};
      match['matchNumber'] = i.split('-')[0];
      match['homeGoals'] = results[i];
    } else {
      match['awayGoals'] = results[i];
      Match.setOfficialMatchResult(match.homeGoals, match.awayGoals, match.matchNumber, (err, rows) => {
        if (err) {
            error += err;
        } else {
            success += rows;
        }
      });
    }
  }
  if(error != '') {
    res.json(error)
  }
  else {
    Match.getNewOfficialResultsAndUserAnswers((err, rows) => {
      if(err) throw err;
      else {
        rows.forEach(element => {
          var points = 0;
          var bonus = 0;
          if(element.official_hg == element.user_hg) {
            points += pointSystem.goalsCorrectForOneTeam;
            bonus++;
          }
          if(element.official_ag == element.user_ag) {
            points += pointSystem.goalsCorrectForOneTeam;
            bonus++;
          }
          if(element.official_hg > element.official_ag && element.user_hg > element.user_ag) {
            points += pointSystem.outcomeCorrect;
            bonus++;
          }
          if(element.official_hg == element.official_ag && element.user_hg == element.user_ag) {
            points += pointSystem.outcomeCorrect;
            bonus++;
          }
          if(element.official_hg < element.official_ag && element.user_hg < element.user_ag) {
            points += pointSystem.outcomeCorrect;
            bonus++;
          }
          if(bonus == 3) {
            points += pointSystem.matchBonusPoint;
          }
          User.addPoints(points, element.user_id, (err, rows) => {
            if(err) throw err;
            Match.addUserPointsForMatch(points, element.user_id, element.official_mn, (err, rows) => {
              if(err) throw err;
            });
          });
        });
        req.flash('update', 'Updated official match results');
        res.redirect('/admin');
      }
    });
  }
});

router.get('/standings', userIsAdmin(), (req, res, next) => {
  Team.getAllTeams( (err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('admin-standings', {
        teams: rows
      });
    }
  });
});

router.post('/standings', userIsAdmin(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i;
    QuestionAnswer.setOfficialAnswers(answers[i], category, (err, rows) => {
      if (err) throw err;
    });
  }
  QuestionAnswer.getNewOfficialStandingsAndUserAnswers((err, rows) => {
    if(err) throw err;
    else {
      var official = _.uniq(_.map(rows, 'official_answer'));
      rows.forEach(element => {
        var points = 0;
        if(element.official_answer == element.user_answer)
          points += pointSystem.teamAndPlaceCorrect;
        else if(official.includes(element.user_answer))
          points += pointSystem.onlyTeamCorrect;
        User.addPoints(points, element.user_id, (err, rows) => {
          if(err) throw err;
          QuestionAnswer.addUserPointsForQuestion(points, element.user_id, element.official_cat, (err, rows) => {
              if(err) throw err;
          });
        });
      });
    req.flash('update', 'Updated official standings');
    res.redirect('/admin');
    }
  });
});

router.get('/scorers', userIsAdmin(), (req, res, next) => {
  QuestionAnswer.getUserAnswersForScorers((err, rows) => {
    if(err) throw err;
    else {
      res.render('admin-scorers', {
        scorers: rows
      });
    }
  });
});

router.post('/scorers', userIsAdmin(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';

  var users = Object.keys(answers);
  users.forEach(element => {
    var points = parseInt(answers[element]);
    console.log(element + " " + points);
    User.addPoints(points, element, (err, rows) => {
      if(err) throw err;
      QuestionAnswer.addUserPointsForQuestion(points, element, 'scorers_topScorer', (err, rows) => {
          if(err) throw err;
      });
    });
  });
  req.flash('update', 'Updated scorer points');
  res.redirect('/admin');
});

router.get('/extras', userIsAdmin(), (req, res, next) => {
  QuestionAnswer.getExtraQuestions((err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.render('admin-extras', {
        questions: rows
      });
    }
  });
});

router.post('/extras', userIsAdmin(), (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i;
    QuestionAnswer.setOfficialAnswers(answers[i], category, (err, rows) => {
      if (err) {
          error += err;
      } else {
          success += rows;
      }
    });
  }
  if(error != '') {
    res.json(error)
  }
  else {
    QuestionAnswer.getNewOfficialExtrasAndUserAnswers((err, rows) => {
      if(err) throw err;
      else {
        rows.forEach(element => {
          var points = 0;
          if(element.official_answer == element.user_answer)
            points += pointSystem.extraQuestionCorrect;
            User.addPoints(points, element.user_id, (err, rows) => {
              if(err) throw err;
              QuestionAnswer.addUserPointsForQuestion(points, element.user_id, element.official_cat, (err, rows) => {
                if(err) throw err;
              });
          });
        });
        req.flash('update', 'Updated official extra question answers');
        res.redirect('/admin');
      }
    });

  }
});

router.get('/reset/user', userIsAdmin(), (req, res, next) => {
  res.render('admin-resetuser');
});

router.post('/reset/user', userIsAdmin(), (req, res, next) => {
  req.checkBody('password', 'Password must be between 2-100 characters long.').len(2, 100);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

  const errors = req.validationErrors();

  if(errors) {
    res.render('admin-resetuser', {
      title: 'Registration Error',
      errors: errors
    });
  }
  else {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      User.resetPassword(req.body.user_id, hash, (err, rows) => {
        if(err) throw err;
        else {
          req.flash('update', 'User ' + req.body.user_id + ' password was changed successfully.')
          res.redirect('/admin');
        }
      })
    });
  }
});

module.exports = router;
