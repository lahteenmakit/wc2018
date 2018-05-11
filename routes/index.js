const express = require('express');
const router = express.Router();

const User = require('../models/User.js');

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Registration' });
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  User.addUser(req.body, (err, result, rows) => {
    if(err)
      throw err;
    else
      res.render('register', {title: 'Registration Complete'});
  });
});

module.exports = router;
