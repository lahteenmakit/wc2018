const express = require('express');
const router = express.Router();

const User = require('../models/User.js');
const League = require('../models/League.js');
const Match = require('../models/Match.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

router.get('/', authenticationMiddleware(), (req, res, next) => {
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
              User.getQuizDone(req.user.user_id, (err, rows) => {
                if(err) throw err;
                else {
                  var quizDone = rows[0].quizDone;
                  QuestionAnswer.getAnswersByUser(req.user.user_id, (err, rows) => {
                    if(err) {
                      res.json(err);
                    } else {
                      var answers = rows;
                      res.render('profile', {
                        username: username,
                        points: points,
                        matches: matches,
                        answers: answers,
                        quizDone: quizDone
                      });
                    }
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

function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login')
  }
}

module.exports = router;
