var FileController = require('../controllers/files')

module.exports = (app) => {
	let fileController = new FileController()

	app.get('/files/*', (req, res) => {
		fileController.getFile(req, res)
	})

	app.post('/files/*', (req, res) => {
		fileController.saveFile(req, res)
	})
}