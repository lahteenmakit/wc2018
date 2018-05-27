const express = require('express');
const router = express.Router();

const moment = require('moment');

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
    Match.getNewOfficialResultsAndUserAnswers((err, rows) => {
      if(err) throw err;
      else {
        rows.forEach(element => {
          var points = 0;
          if(element.official_hg == element.user_hg)
            points += pointSystem.goalsCorrectForOneTeam;
          if(element.official_ag == element.user_ag)
            points += pointSystem.goalsCorrectForOneTeam;
          if(element.official_hg > element.official_ag && element.user_hg > element.user_ag)
            points += pointSystem.outcomeCorrect;
          if(element.official_hg == element.official_ag && element.user_hg == element.user_ag)
            points += pointSystem.outcomeCorrect;
          if(element.official_hg < element.official_ag && element.user_hg < element.user_ag)
            points += pointSystem.outcomeCorrect;
          User.addPoints(points, element.user_id, (err, rows) => {
            if(err) throw err;
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
    console.log(category + " " + answers[i])
    QuestionAnswer.setOfficialAnswers(answers[i], category, (err, rows) => {
      if (err) throw err;
    });
  }
  QuestionAnswer.getNewOfficialStandingsAndUserAnswers((err, rows) => {
    if(err) throw err;
    else {
      var standingsArray = [rows[0].official_answer, rows[1].official_answer, rows[2].official_answer];
      rows.forEach(element => {
        var points = 0;
        if(element.official_answer == element.user_answer)
          points += pointSystem.teamAndPlaceCorrect;
        else if(standingsArray.includes(element.user_answer))
          points += pointSystem.onlyTeamCorrect;
        User.addPoints(points, element.user_id, (err, rows) => {
          if(err) throw err;
        });  
      }); 
    req.flash('update', 'Updated official standings');
    res.redirect('/admin');
    } 
  }); 
});

router.get('/scorers', userIsAdmin(), (req, res, next) => {
  res.render('admin-scorers');
});

router.post('/scorers', userIsAdmin(), (req, res, next) => {
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
    QuestionAnswer.getNewOfficialScorersAndUserAnswers((err, rows) => {
      if(err) throw err;
      else {
        rows.forEach((element, index, array) => {
          var points = 0;
          if(element.official_answer == element.user_answer && element.official_cat == 'scorers_topScorer') {
              points += pointSystem.playerCorrect;
              if(array[index+1].official_answer == array[index+1].user_answer)
                points += pointSystem.goalsCorrect;                           
          }
          User.addPoints(points, element.user_id, (err, rows) => {
            if(err) throw err;
          }); 
        });
      req.flash('update', 'Updated official top scorer');
      res.redirect('/admin');
      }
    })
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
          }); 
        });
        req.flash('update', 'Updated official extra question answers');
        res.redirect('/admin');
      }
    });
    
  }
});

module.exports = router;