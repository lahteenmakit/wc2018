const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

//const routes = require('./routes/index');
//const matches = require('./api/matches');

const app = express();
app.use(bodyParser.json());

//Database

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: "3306",
    database: "wc2018"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));

const Match = {
  getAllMatches: (callback) => {
    return db.query('select * from matches', callback);
  },
  getMatchById: (id, callback) => {
    return db.query('select * from matches where matchId=?', [id], callback);
  },
  setMatchResult: (id, homeGoals, awayGoals, callback) => {
    return db.query('update matches set homeGoals=?,awayGoals=? where matchId=?', [homeGoals, awayGoals, id], callback);
  }
};

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
  console.log(req.params)
  Match.setMatchResult(req.params.id, req.params.homeGoals, req.params.awayGoals, (err, rows) => {
    if (err) {
        res.json(err);
    } else {
        res.json(rows);
    }
  });
});
