const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.listen(3000, () => console.log('Example app listening on port 3000!'));

//mysql stuff here + setup rds in aws
