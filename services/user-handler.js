let crypto = require('crypto')

module.exports = class UserHandler {

	constructor(userRepository, salt) {
		this.userRepository = userRepository,
		this.salt = salt
	}

	validateUser(username, password) {
		let user = this.userRepository.findByUserName(username)
		
		let hash = crypto.createHmac('sha256', this.salt)
		let hashedPassword = hash.update(password).digest('hex')

		return user.checkPassword(hashedPassword)
	}
}