var express = require('express')
var bodyParser = require('body-parser')
var consign = require('consign')

var app = express()
app.use(bodyParser.raw({ limit: '10gb', type: '*/*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

consign()
	.include('./routes')
	.into(app)

module.exports = app