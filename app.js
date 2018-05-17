const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

require('dotenv').config();

const db = require('./dbconnection');

const Match = require('./models/Match.js');
const Team = require('./models/Team.js');

const exphbs  = require('express-handlebars');
const hbs = require('handlebars');
const hbsHelpers = require('./handlebarsHelpers.js')
const fs = require('fs');

const index = require('./routes/index.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressValidator());
app.use('/public', express.static(__dirname + '/public'));

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'ioasndaisdnamdlaksmdaskmdaslkmd',
  resave: false,
  store: sessionStore,
  saveUninitialized: false
  //cookie: { secure: true } if https then uncomment
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', index);

passport.use(new LocalStrategy((username, password, done) => {
  db.query('select user_id,password from users where username=?', [username], (err, results, fields) => {
    if(err)
      done(err)
    if(results.length === 0 )
      done(null, false)
    else {
      const hash = results[0].password.toString();
      bcrypt.compare(password, hash, (err, response) => {
        if(response === true) {
          return done(null, {user_id: results[0].user_id})
        } else {
          return done(null, false);
        }
      });
    }
  });
  }
));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

module.exports = app;
