const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

const db = require('../dbconnection');
const Queries = require('../models/Queries.js');

const User = require('../models/User.js');
const League = require('../models/League.js');
const Match = require('../models/Match.js');
const Team = require('../models/Team.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

var points = require('../controllers/points.js')

router.get('/', (req, res, next) => {
  req.isAuthenticated() ? console.log(req.user) : console.log('User not Authenticated');
  res.render('home', {title: 'Home'});
});

router.get('/quiz/start', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
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

router.get('/quiz/matches', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
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

router.post('/quiz/matches', authenticationMiddleware(), (req, res, next) => {
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

router.get('/quiz/standings', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
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

router.get('/quiz/scorers', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
  res.render('quiz-scorers');
});

router.post('/quiz/scorers', authenticationMiddleware(), (req, res, next) => {
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

router.get('/quiz/extras', getQuizDone(), authenticationMiddleware(), (req, res, next) => {
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

router.post('/quiz/extras', authenticationMiddleware(), (req, res, next) => {
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

router.get('/quiz/done', authenticationMiddleware(), (req, res, next) => {
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

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Registration'});
});

router.get('/profile', authenticationMiddleware(), (req, res, next) => {
  User.getUsernameById(req.user.user_id, (err, rows) => {
    if(err) {
      res.json(err);
    } else {
      var username = rows[0].username;
      User.getPoints(req.user.user_id, (err, rows) => {
        if(err) {
          res.json(err);
        } else {
          var points = rows[0].points;
          Match.getUserAnswersForMatches(req.user.user_id, (err, rows) => {
            if(err) {
              res.json(err);
            } else {
              var matches = rows;
              //quizDone? 
              QuestionAnswer.getAnswersByUser(req.user.user_id, (err, rows) => {
                if(err) {
                  res.json(err);
                } else {
                  var answers = rows;
                  res.render('profile', {
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


router.get('/league/join', (req, res, next) => {
  res.render('league-join');
});

router.post('/league/join', (req, res, next) => {
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
            res.redirect('/leagues/' + league_id);
          }
        });
      }
    }
  });
});


router.get('/league/create', (req, res, next) => {
  res.render('league-create');
});

router.post('/league/create', (req, res, next) => {
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
              res.redirect('/leagues/' + league_id);
            }
          });
        }
      });
    }
  });
});

router.get('/league/my', (req, res, next) => {
  League.getLeaguesByUser(req.user.user_id, (err, rows) => {
    if(err) throw err;
    else {
      res.render('league-my', {
        leagues: rows
      });
    }
  });
});

router.get('/leagues/:id', accessToLeague(), (req, res, next) => {
  League.getUsersInLeague(req.params.id, (err, rows) => {
    console.log(rows)
    if(err) throw err;
    else {
      res.render('league', {
        usersInLeague: rows
      });
    }
  });
});

function accessToLeague() {
  return (req, res, next) => {
    if(req.isAuthenticated()) {
      console.log(req.params.id)
      League.userIsPartOfLeague(req.user.user_id, req.params.id, (err, rows) => {
        if(err) throw err;
        else {
          console.log(rows)
          var accessToLeague = rows[0]['COUNT(user_id)'] > 0 ? true : false;
          console.log(accessToLeague)
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

router.get('/admin', (req, res, next) => {

  res.render('admin');
});

router.get('/admin/matches', (req, res, next) => {
    Match.getGroupStageMatches((err, rows) => {
    if (err) {
      res.json(err);
    } else {
      var matchesToShow = rows.filter((element) => {
        var today = moment('17/06/2018 12:00', 'DD/MM/YYYY hh:mm');
        var matchDate = moment(element.date, 'DD/MM/YYYY hh:mm');
        return element.matchEnded == 0 && today.diff(matchDate, 'hours') > 0;
      });
      res.render('admin-matches', {
        matches: matchesToShow
      });
    }
  });
});

router.post('/admin/matches', (req, res, next) => {
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
    points.addPoints();
    req.flash('update', 'Updated official match results');
    res.redirect('/admin');
  }
});  

router.get('/admin/questions', (req, res, next) => {
  
  res.render('admin-questions');
});


router.get('/login', (req, res, next) => {
  res.render('login', {error: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
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
        if(err) {
          console.log(err);
          req.flash('error','A user already exists with that username and/or E-mail. Try another username and/or E-mail.');
          res.redirect('/register');
        }
        else {
          db.query('select last_insert_id() as user_id', (error, results, fields) => {
            if(error) {
              console.log('Error while querying database');
              throw error;
            }

            const user_id = results[0];

            console.log('User: ' + user_id.user_id)
            req.login(user_id, (err) => {
              Match.insertMatchesForUsers(user_id.user_id, (error, rows) => {
                if(error) throw error;
              });
              QuestionAnswer.insertQuestionsForUsers(user_id.user_id, (error, rows) => {
                if(error) throw error;
              });
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
