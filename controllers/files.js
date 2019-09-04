let FileManager = require('../service/file-manager')
let statusCode = require('./status-code')

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
					.then(() => res.sendStatus(statusCode.CREATED))
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
			.then(() => res.sendStatus(statusCode.NO_CONTENT))
			.catch((error) => dealWithError(res, error))
	}

	deleteFile(req, res) {
		let fileAddress = getFileAddress(req)
		this.fileManager.deleteFile(fileAddress)
			.then(() => res.sendStatus(statusCode.OK))
			.catch((error) =>  dealWithError(res, error))
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
		case 'ENOENT': res.sendStatus(statusCode.NOT_FOUND); break
		case 'EEXIST': res.sendStatus(statusCode.CONFLICT); break
		default: res.status(statusCode.SERVER_ERROR).send(error.code)
	}
}