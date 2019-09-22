let HttpStatus = require('http-status-codes')
let UserHandler = require('../services/user-handler')
let TokenGeneration = require('../services/token-generation')
let UserRepository = require('../infra/user-repository')
let config = require('../infra/config')

module.exports = class LoginController {

    constructor(databaseConnection) {
        let userRepository = new UserRepository(databaseConnection)
        this.userHandler = new UserHandler(userRepository, config.salt)
    }

    login(req, res) {
        let loginData
        try {
            loginData = JSON.parse(req.body.toString())
        }
        catch (exception) {
            return sendBadRequest(res)
        }

        if (!(loginData.usr && loginData.pwd)) {
            return sendBadRequest(res)
        }

        this.userHandler.validateUser(loginData.usr, loginData.pwd)
            .then((loginIsValid) => {
                if (!loginIsValid) {
                    res.sendStatus(HttpStatus.FORBIDDEN)
                    return
                }

                let token = TokenGeneration.generate(loginData.usr, config.secretKey)

                res.status(HttpStatus.OK).send({token: token})
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
            })
    }
}

function sendBadRequest(res){
    res.sendStatus(HttpStatus.BAD_REQUEST)
    return
}