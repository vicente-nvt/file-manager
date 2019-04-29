var FileController = require('../controllers/files')

module.exports = (app) => {
	let fileController = new FileController()

	app.get('/files/*', (req, res) => {
		fileController.getFile(req, res)
	})

	app.post('/files/*', (req, res) => {
		fileController.createFile(req, res)
	})

	app.put('/files/*', (req, res) => {
		fileController.overwriteFile(req, res)
	})
}