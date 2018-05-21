const config = {
	db: {
		host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
		user: process.env.RDS_USERNAME || process.env.DB_USER,
		password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
		database: process.env.RDS_DB_NAME || process.env.DB_NAME
	}
}

module.exports = config;