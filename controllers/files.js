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
		let filePath = getFilePath(fileAddress)

		this.fileManager.createPathIfDoesntExist(filePath)
			.then(() => {
				this.fileManager.writeFile(fileAddress, req.body)
					.then(() => res.sendStatus(statusCode.CREATED))
					.catch((error) => dealWithError(res, error))
			})
			.catch((error) => {
				dealWithError(res, error)
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
			.catch((error) => dealWithError(res, error))
	}

	moveFile(req, res) {
		let address = JSON.parse(req.body.toString())
		let newFilePath = getFilePath(address.to)

		this.fileManager.createPathIfDoesntExist(newFilePath)
			.then(() => {
				this.fileManager.moveFile(address.from, address.to)
					.then(() => res.send(statusCode.NO_CONTENT))
					.catch((error) => dealWithError(res, error))
			})
			.catch((error) => dealWithError(res, error))
	}
}

function getFileAddress(req) {
	let path = req.path
	let fileAddress = path.replace('/files/', '')
	fileAddress = decodeURIComponent(fileAddress)
	fileAddress = fileAddress.replace(new RegExp('%20', 'g'), ' ')
	return fileAddress
}

function getFilePath(fileAddress) {
	let pathThree = fileAddress.split('/')
	let fileName = pathThree[pathThree.length - 1]
	let filePath = fileAddress.replace(fileName, '')
	return filePath
}

function dealWithError(res, error) {
	switch (error.code) {
		case 'ENOENT': res.sendStatus(statusCode.NOT_FOUND); break
		case 'EEXIST': res.sendStatus(statusCode.CONFLICT); break
		default: res.status(statusCode.SERVER_ERROR).send(error.code)
	}
}