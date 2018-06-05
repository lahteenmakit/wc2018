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
const Match = require('../models/Match.js');
const QuestionAnswer = require('../models/QuestionAnswer.js');

/*router.get('/', (req, res, next) => {
  req.isAuthenticated() ? console.log(req.user) : console.log('User not Authenticated');
  res.render('home', {title: 'Home'});
});*/

router.get('/', (req, res, next) => {
  req.isAuthenticated() ? console.log(req.user) : console.log('User not Authenticated');
  Match.getUserAnswersForMatches(req.user.user_id, (err, rows) => {
    if(err) {
      res.json(err);
    } else {
      var today = moment('16/06/2018', 'DD/MM/YYYY').format('DD/MM/YYYY');
      var matchesToday = rows.filter(element => {
        return element.date.split(' ')[0] == today;
      });
      console.log(matchesToday)
      res.render('home2', {
        title: 'Home',
        matches: matchesToday
      });
    }
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Registration'});
});


router.get('/login', (req, res, next) => {
  res.render('login');
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

module.exports = router;
