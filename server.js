const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const Match = require('./models/Match.js');
const Team = require('./models/Team.js');
//const Participiant = require('./models/Participiant.js')

const app = express();
var server = require('http').Server(app);
//var io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/standings', (req, res) => {
  res.sendFile(__dirname + '/frontend/finalStandings.html');
});

app.get('/scorers', (req, res) => {
  res.sendFile(__dirname + '/frontend/scorers.html');
});

app.get('/extras', (req, res) => {
  res.sendFile(__dirname + '/frontend/extras.html');
});

server.listen(3000, () => console.log('Example app listening on port 3000!'));

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

app.get('/teams', (req, res, next) => {
  Team.getAllTeams((err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});

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

app.get('/matches/:id?', (req, res, next) => {
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
  Match.setMatchResult(req.params.id, req.query.homeGoals, req.query.awayGoals, (err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});
