module.exports = (app) => {

	app.get('/files/*', (req, res) => {
		let path = req.path
		let fileAddress = path.replace('/files/', '')
		res.download(fileAddress)
	})

	app.post('/files/*', (req, res) => {
		console.log(req.files)
		res.sendStatus(200)
	})

}