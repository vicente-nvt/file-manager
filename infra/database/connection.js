var mongoose = require('mongoose')

class DatabaseConnection {

    constructor(databaseConnectionString) {
        this.database = mongoose
        this.databaseConnectionString = databaseConnectionString
    }

    connectDatabase() {
        return this.database.connect(this.databaseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, })
    }

    checkConnection() {
        return new Promise(async (resolve, reject) => {
            if (this.database.connection.readyState === 1)
                resolve()
            else {
                this.connectDatabase()
                    .then(() => { resolve() })
                    .catch((error) => { reject(error) })
            }
        })
    }

    getDatabase() {
        return this.database
    }
}

module.exports = DatabaseConnection