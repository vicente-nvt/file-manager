var fs = require('fs')

function getFileAddress(req) {
	let path = req.path
	let fileAddress = path.replace('/files/', '')
	return fileAddress
}

function writeFile(fileAddress, fileContent, flag) {
	return new Promise((resolve, reject) => {
		fs.writeFileSync(fileAddress, fileContent, { flag: flag }, (error) => {
			reject(error)
		})
		resolve()
	})
}

function createPathIfDoesntExist(filePath) {
	return new Promise((resolve, reject) => {
		fs.mkdirSync(filePath, { recursive: true }, (error) => {
			reject(error)
		})
		resolve()
	})
}

function dealWithError(res, error) {
	switch (error.code) {
	case 'ENOENT': res.sendStatus(404); break
	case 'EEXIST': res.sendStatus(409); break
	default: res.status(500).send(error.code)
	}
}

class FileController {

	getFile(req, res) {
		let path = req.path
		let fileAddress = path.replace('/files/', '')
		res.download(fileAddress)
	}

	createFile(req, res) {
		let fileAddress = getFileAddress(req)

		let pathThree = fileAddress.split('/')
		let fileName = pathThree[pathThree.length - 1]
		let filePath = fileAddress.replace(fileName, '')

		createPathIfDoesntExist(filePath)
			.then(() => {
				writeFile(fileAddress, req.body, 'ax')
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
		writeFile(fileAddress, req.body, 'a')
			.then(() => res.sendStatus(204))
			.catch((error) => dealWithError(res, error))
	}

}

module.exports = FileController