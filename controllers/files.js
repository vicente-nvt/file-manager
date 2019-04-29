var fs = require('fs')

class FileController {

	getFile(req, res) {
		let path = req.path
		let fileAddress = path.replace('/files/', '')
		res.download(fileAddress)
	}

	saveFile(req, res) {
		let path = req.path
		let fileAddress = path.replace('/files/', '')

		let pathThree = fileAddress.split('/')
		let fileName = pathThree[pathThree.length - 1]
		let filePath = fileAddress.replace(fileName, '')

		this.createPathIfDoesntExist(filePath)
			.then(() => {
				this.writeFile(fileAddress, req, res)
			})
			.catch((error) => {
				this.dealWithError(res, error)
				return
			})
	}

	dealWithError(res, error) {
		res.status(500).send({ error: error })
	}

	writeFile(fileAddress, req, res) {
		fs.writeFile(fileAddress, req.body, (error) => {
			if (error) {
				this.dealWithError(res, error)
				return
			}
			res.sendStatus(201)
		})
	}

	createPathIfDoesntExist(filePath) {
		return new Promise((resolve, reject) => {
			fs.mkdirSync(filePath, { recursive: true }, (error) => {
				reject(error)
			})
			resolve()
		})
	}
}


module.exports = FileController