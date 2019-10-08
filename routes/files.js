var FileController = require('../controllers/files')
var tokenMiddleware = require('../infra/token-middleware')

module.exports = (app) => {
    let fileController = new FileController()

    app.all('/files/*', tokenMiddleware.checkToken, (req, res, next) => {
        next()
    })

    app.get('/files/*', (req, res) => {
        return fileController.getFile(req, res)
    })

    app.post('/files/*', (req, res) => {
        return fileController.createFile(req, res)
    })

    app.put('/files/*', (req, res) => {
        return fileController.overwriteFile(req, res)
    })

    app.delete('/files/*', (req, res) => {
        return fileController.deleteFile(req, res)
    })

    app.patch('/files/move', (req, res) => {
        return fileController.moveFile(req, res)
    })
}