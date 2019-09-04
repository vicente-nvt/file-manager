var FileManager = require('../service/file-manager')

module.exports = class FileController {

	constructor() {
		this.fileManager = new FileManager()
	}

	getFile(req, res) {
		let fileAddress = getFileAddress(req)
		res.download(fileAddress)
	}

	createFile(req, res) {
		let fileAddress = getFileAddress(req)

		let pathThree = fileAddress.split('/')
		let fileName = pathThree[pathThree.length - 1]
		let filePath = fileAddress.replace(fileName, '')

		this.fileManager.createPathIfDoesntExist(filePath)
			.then(() => {
				this.fileManager.writeFile(fileAddress, req.body)
					.then(() => res.sendStatus(201))
					.catch((error) => dealWithError(res, error))
			})
			.catch((error) => {
				dealWithError(res, error)
				return
			})
	}

	overwriteFile(req, res) {
		let fileAddress = getFileAddress(req)
		this.fileManager.overwriteFile(fileAddress, req.body)
			.then(() => res.sendStatus(204))
			.catch((error) => dealWithError(res, error))
	}
}

function getFileAddress(req) {
	let path = req.path
	let fileAddress = path.replace('/files/', '')
	fileAddress = fileAddress.replace(new RegExp('%20', 'g'), ' ')
	return fileAddress
}

function dealWithError(res, error) {
	switch (error.code) {
		case 'ENOENT': res.sendStatus(404); break
		case 'EEXIST': res.sendStatus(409); break
		default: res.status(500).send(error.code)
	}
}