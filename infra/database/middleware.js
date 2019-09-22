let DatabaseConnection = require('./connection')
let HttpStatus = require('http-status-codes')

module.exports = (databaseConnectionString) => {
	let databaseConnection = new DatabaseConnection(databaseConnectionString)

	let checkConnection = (req, res, next) => {
		databaseConnection.checkConnection()
			.then(() => {
				next()
			})
			.catch((error) => {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
			})
	}

	let getDatabase = () => {
		return databaseConnection.getDatabase()
	}

	return {
		checkConnection: checkConnection,
		getDatabase: getDatabase
	}
}