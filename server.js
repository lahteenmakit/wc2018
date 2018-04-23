const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const Match = require('./models/Match.js');
const Team = require('./models/Team.js');

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/teams', (req, res, next) => {
  Team.getAllTeams((err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});

app.get('/teamStats/:id?', (req, res, next) => {
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
});

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
  console.log(req.query.homeGoals)
  Match.setMatchResult(req.params.id, req.query.homeGoals, req.query.awayGoals, (err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});