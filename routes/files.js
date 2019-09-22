var FileController = require('../controllers/files')
var tokenMiddleware = require('../infra/token-middleware')

module.exports = (app) => {
	let fileController = new FileController()

	app.all('/files/*', tokenMiddleware.checkToken, (req, res, next) => {
		next()
	})

	app.get('/files/*', (req, res) => {
		fileController.getFile(req, res)
	})

	app.post('/files/*', (req, res) => {
		fileController.createFile(req, res)
	})

	app.put('/files/*', (req, res) => {
		fileController.overwriteFile(req, res)
	})

	app.delete('/files/*', (req, res) => {
		fileController.deleteFile(req, res)
	})

	app.patch('/files/move', (req, res) => {
		fileController.moveFile(req, res)
	})
}