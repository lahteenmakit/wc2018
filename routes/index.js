const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../dbconnection');

const User = require('../models/User.js');

router.get('/', (req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', {title: 'Home'});
});

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Registration'});
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
        if(err)
          throw err;
        else {
          db.query('select last_insert_id() as user_id', (error, results, fields) => {
            if(error) throw error;

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

module.exports = router;
