var jwt = require('jsonwebtoken')

module.exports = class TokenValidation {

    static validate(token, secretKey) {
        return jwt.verify(token, secretKey, (error, decoded) => {
            return {
                valid: error ? false : true,
                decodedToken: decoded
            }
        })
    }
}