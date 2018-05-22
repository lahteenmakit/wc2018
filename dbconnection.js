const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection(config.db);


connection.connect(function(err) {
	var db = process.env.RDS_DB_NAME || process.env.DB_NAME;
	var host = process.env.RDS_HOSTNAME || process.env.DB_HOST;
	  if (err) {
	    console.log('Cannot connect to Database ' + db + ' on ' + host);
	    throw err;
	  }
 	  console.log('Connected to Database ' + db + ' on ' + host);
});

module.exports = connection;
