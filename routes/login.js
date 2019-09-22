var LoginController = require('../controllers/login')

module.exports = (app) => {
	let loginController = new LoginController()

	app.post('/login', (req, res) => {
		return loginController.login(req, res)
	})
}