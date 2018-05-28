const express = require('express');
const router = express.Router();

const db = require('../dbconnection');

const League = require('../models/League.js');
const User = require('../models/User.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

function accessToLeague() {
  return (req, res, next) => {
    if(req.isAuthenticated()) {
      League.userIsPartOfLeague(req.user.user_id, req.params.id, (err, rows) => {
        if(err) throw err;
        else {
          var accessToLeague = rows[0]['COUNT(user_id)'] > 0 ? true : false;
          if(!accessToLeague) {
            req.flash('error','You do not have access to this league. If you know the league password, go to My Leagues and join it.');
            res.redirect('/');
          }
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


router.get('/join', (req, res, next) => {
  res.render('league-join');
});

router.post('/join', (req, res, next) => {
  League.getLeagueByNameAndPassword(req.body.leagueName, req.body.leaguePassword, (err, rows) => {
    if(err) throw err;
    else {
      if(rows.length == 0) {
        res.render('league-join', {
          notFound: 'Did not find a league with that name and password.'
        })
      } else {
        var league_id = rows[0].league_id;
        League.addUserToLeague(req.user.user_id, league_id, (err, rows) => {
          if(err) {
            console.log(err);
            switch(err.errno) {
              case 1062:
                req.flash('error','You are already a member of this league. Join a different one.');
                break;
              default:
                req.flash('error', 'Database error');
            }
            res.redirect('/league/join');
          } 
          else {
            res.redirect('/league/' + league_id);
          }
        });
      }
    }
  });
});

router.get('/create', (req, res, next) => {
  res.render('league-create');
});

router.post('/create', (req, res, next) => {
  League.createLeague(req.body.leagueName, req.body.leaguePassword, (err, rows) => {
    if(err) throw err;
    else {
      db.query('SELECT last_insert_id() AS league_id', (error, results, fields) => {
        if(error) throw error;
        else {
          var league_id = results[0].league_id;
          League.addUserToLeague(req.user.user_id, league_id, (err, rows) => {
            if(err) throw err;
            else {
              res.redirect('/league/' + league_id);
            }
          });
        }
      });
    }
  });
});

router.get('/my', (req, res, next) => {
  League.getLeaguesByUser(req.user.user_id, (err, rows) => {
    if(err) throw err;
    else {
      res.render('league-my', {
        leagues: rows
      });
    }
  });
});

router.get('/:id', accessToLeague(), (req, res, next) => {
  League.getUsersInLeague(req.params.id, (err, rows) => {
    if(err) throw err;
    else {
      res.render('league', {
        usersInLeague: rows
      });
    }
  });
});

router.get('/:id/user/:user_id', accessToLeague(), authenticationMiddleware(), (req, res, next) => {
  User.getUsernameById(req.params.user_id, (err, rows) => {
    if(err) {
      res.json(err);
    } else {
      var username = rows[0].username;
      User.getPoints(req.params.user_id, (err, rows) => {
        if(err) {
          res.json(err);
        } else {
          var points = rows[0].points;
          Match.getUserAnswersForMatches(req.params.user_id, (err, rows) => {
            if(err) {
              res.json(err);
            } else {
              var matches = rows;
              //quizDone? 
              QuestionAnswer.getAnswersByUser(req.params.user_id, (err, rows) => {
                if(err) {
                  res.json(err);
                } else {
                  var answers = rows;
                  res.render('user', {
                    username: username,
                    points: points,
                    matches: matches,
                    answers: answers
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});


module.exports = router;