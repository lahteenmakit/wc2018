const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection(config.db);


connection.connect(function(err) {
  if (err) {
    console.log('Cannot connect to Database ' + process.env.RDS_DB_NAME + ' on ' + process.env.RDS_HOSTNAME);
    throw err;
  }
  console.log('Connected to Database ' + process.env.RDS_DB_NAME + ' on ' + process.env.RDS_HOSTNAME);
});

module.exports = connection;
