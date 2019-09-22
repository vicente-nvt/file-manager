var jwt = require('jsonwebtoken')

module.exports = class TokenGeneration {

    static generate(username, secretKey) {
        return jwt.sign({username: username}, secretKey, { expiresIn: '24h'} )
    }
}