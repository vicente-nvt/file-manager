var User = require('../domain/user')

module.exports = class UserRepository {

    constructor(databaseConnection) {
        let userSchema = databaseConnection.Schema({
            username: { type : String, required: true },
            password: { type: String, required: true},
            email: { type: String, required: true }
        })

        this.User = databaseConnection.model('User', userSchema)
    }

    findByUserName(username) {
        return new Promise((resolve, reject) => {
            this.User.findOne({ 'username': username })
                .then((foundUser) => {
                    let user = new User(
                        foundUser.username,
                        foundUser.password,
                        foundUser.email
                    )
                    resolve(user)
                })
                .catch(error => reject(error))
        })
    }
}