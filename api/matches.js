var Match = require('../models/Match');
var app = require('../server');

app.get('/matches/:id?', (req, res, next) => {
    console.log('hello')
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
