const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    port: process.env.RDS_PORT,
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to Database!');
});

module.exports = connection;
