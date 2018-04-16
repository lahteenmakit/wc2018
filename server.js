const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

const connection = mysql.createConnection({
    host: "tuomas-wc2018-dev.cnveufmipyjd.eu-west-1.rds.amazonaws.com",
    user: "tuomas",
    password: "tuomas2018",
    port: "3306"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());
app.listen(3000, () => console.log('Example app listening on port 3000!'));

//mysql stuff here + setup rds in aws

//"tuomas-wc2018-dev.cnveufmipyjd.eu-west-1.rds.amazonaws.com"
