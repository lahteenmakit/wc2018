const express = require('express');
const router = express.Router();

const moment = require('moment');

const User = require('../models/User.js');
const League = require('../models/League.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

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
        var today = moment();
        var matchDate = moment(element.date, 'DD/MM/YYYY hh:mm');
        return element.matchEnded == 0 && today.diff(matchDate, 'hours') > 0;
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
    req.flash('update', 'Updated official match results');
    res.redirect('/admin');
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
    QuestionAnswer.setOfficialAnswers(category, answers[i], (err, rows) => {
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
    req.flash('update', 'Updated official standings');
    res.redirect('/admin');
  }
});

router.get('/scorers', userIsAdmin(), (req, res, next) => {
  res.render('admin-scorers');
});

router.post('/scorers', (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i; 
    QuestionAnswer.setOfficialAnswers(category, answers[i], (err, rows) => {
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
    req.flash('update', 'Updated official top scorer');
    res.redirect('/admin');
  }
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

router.post('/extras', (req, res, next) => {
  var answers = req.body;
  var success = '', error = '';
  for(var i in answers) {
    var category = i; 
    QuestionAnswer.setOfficialAnswers(category, answers[i], (err, rows) => {
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
    req.flash('update', 'Updated official extra question answers');
    res.redirect('/admin');
  }
});

module.exports = router;