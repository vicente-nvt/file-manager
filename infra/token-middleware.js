var TokenValidation = require('../services/token-validation')
var config = require('./config')
var HttpStatus = require('http-status-codes')

let checkToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization']

	if (!token) {
		return sendUnauthorized(res)
	}

	if (token.startsWith('Bearer '))
		token = token.slice(7, token.length)

	let tokenValidated = TokenValidation.validate(token, config.secretKey)

	if (!tokenValidated.valid) {
		return sendUnauthorized(res)
	}

	req.decodedToken = tokenValidated.decodedToken

	next()
}

function sendUnauthorized(res) {
	res.sendStatus(HttpStatus.UNAUTHORIZED)
}

module.exports = {
	checkToken: checkToken
}