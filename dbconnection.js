const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    port: process.env.RDS_PORT
});


connection.connect(function(err) {
  if (err) {
    console.log('Cannot connect to Database ' + process.env.RDS_DB_NAME + ' on ' + process.env.RDS_HOSTNAME);
    throw err;
  }
  console.log('Connected to Database ' + process.env.RDS_DB_NAME + ' on ' + process.env.RDS_HOSTNAME);
});

module.exports = connection;
