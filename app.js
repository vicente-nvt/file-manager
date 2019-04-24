/* eslint-disable no-console */
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
	console.log('Server online')
})

app.get('/files/', (req, res) => {
	let path = req.body.path
	let fileName = req.body.filename
	let fileDirectory = path + '/' + fileName

	res.download(fileDirectory)
})