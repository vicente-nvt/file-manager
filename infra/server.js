var express = require('express')
var bodyParser = require('body-parser')
var consign = require('consign')
var fileUpload = require('express-fileupload')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))

consign()
	.include('./routes')
	.into(app)

module.exports = app