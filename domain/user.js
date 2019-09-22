module.exports = class User {

	constructor(username, password, email) {
		this.username = username
		this.password = password
		this.email = email
	}

	checkPassword(incomingPassword) {
		return this.password === incomingPassword
	}
}