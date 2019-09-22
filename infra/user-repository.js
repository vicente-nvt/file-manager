module.exports = class UserRepository {

	findByUserName(username) {
		return { 
			username: username, 
			password: 'pwd',
			checkPassword: (password) => { return true || password }
		}
	}
}