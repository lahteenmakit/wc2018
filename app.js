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
const flash = require('connect-flash');

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
app.use(flash());
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


/*app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {expires:false}
}));*/
//var server = require('http').Server(app);


//app.use(express.static('frontend'));



/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/frontend/login.html');
});

app.post('/register', (req, res) => {
  res.sendFile(__dirname + '/frontend/registrationComplete.html');
});

app.get('/standings', (req, res) => {
  res.sendFile(__dirname + '/frontend/finalStandings.html');
});

app.get('/scorers', (req, res) => {
  res.sendFile(__dirname + '/frontend/scorers.html');
});

app.get('/extras', (req, res) => {
  res.sendFile(__dirname + '/frontend/extras.html');
});*/

//server.listen(3000, () => console.log('Example app listening on port 3000!'));

/*app.get('/participiants', (req, res, next) => {
  Participiant.getAllParticipiants((err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});

app.put('/addParticipiantPoints/:id?', (req, res, next) => {
  Participiant.addParticipiantPoints(req.params.id, req.query.points, (err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});*/

/*app.get('/teams', (req, res, next) => {
  Team.getAllTeams((err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});*/

/*app.get('/teamStats/:id?', (req, res, next) => {
  Team.getTeamStats(req.params.id, (err, rows) => {
    if (err) {
        res.json(err);
    } else {
      var teamStats = {};
      teamStats['teamName'] = req.params.id;
      teamStats['group'] = rows[0].groupNumber;
      console.log(rows);

      var playedMatches = rows.filter(element => element.matchEnded);
      var goalsFor = 0, goalsAgainst = 0;
      teamStats['matchesPlayed'] = playedMatches.length;

      console.log(playedMatches);
      teamStats['matchesWon'] = playedMatches.filter(element => {
        return (element.homeTeam == teamStats['teamName'] && element.homeGoals > element.awayGoals)
        || ((element.awayTeam == teamStats['teamName'] && element.awayGoals > element.homeGoals));
      }).length;

      teamStats['matchesLost'] = playedMatches.filter(element => {
        return (element.homeTeam == teamStats['teamName'] && element.homeGoals < element.awayGoals)
        || ((element.awayTeam == teamStats['teamName'] && element.awayGoals < element.homeGoals));
      }).length;

      teamStats['matchesDrawn'] = playedMatches.filter(element => {
        return (element.homeTeam == teamStats['teamName'] && element.homeGoals == element.awayGoals)
        || ((element.awayTeam == teamStats['teamName'] && element.awayGoals == element.homeGoals));
      }).length;

      playedMatches.forEach(element => {
        //change to ternary operator
        if(element.homeTeam == teamStats['teamName']) {
          goalsFor += element.homeGoals;
          goalsAgainst += element.awayGoals;
        }
        if(element.awayTeam == teamStats['teamName']) {
          goalsFor += element.awayGoals;
          goalsAgainst += element.homeGoals;
        }
      });

      teamStats['goalsFor'] = goalsFor;
      teamStats['goalsAgainst'] = goalsAgainst;
      teamStats['goalDifference'] = teamStats['goalsFor'] - teamStats['goalsAgainst'];
      teamStats['points'] = teamStats['matchesWon'] * 3 + teamStats['matchesDrawn'];

      res.json(teamStats);
    }
  });
});*/

/*app.get('/matches/:id?', (req, res, next) => {
    if(req.params.id) {
      Match.getMatchById(req.params.id, (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
      });
    } else {
      Match.getAllMatches( (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
      });
    }
});

app.put('/addResult/:id?', (req, res, next) => {
  if(req.params.id) {
    Match.setMatchResult(req.params.id, req.query.homeGoals, req.query.awayGoals, (err, rows) => {
      if (err) {
          res.json(err);
      } else {
          res.json(rows);
      }
    });
  } else {
    var success = '';
    var error = '';
    req.body.forEach((element) => {
      Match.setMatchResult(element.matchId, USERID , element.homeGoals, element.awayGoals, (err, rows) => {
        if (err) {
            error += err;
        } else {
            success += rows;
        }
      });
    });
    error != '' ? res.json(error) : res.json(success);
  }
});*/

module.exports = app;
