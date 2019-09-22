var express = require('express')
var bodyParser = require('body-parser')
var consign = require('consign')
var configureDatabase = require('./database/middleware')
var config = require('./config')

var app = express()
let databaseConnection = configureDatabase(config.databaseConnectionString)
app.database = databaseConnection.getDatabase()
app.use(bodyParser.raw({ limit: '10gb', type: '*/*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(databaseConnection.checkConnection)

consign()
    .include('./routes')
    .into(app)

module.exports = app