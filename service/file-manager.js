var fs = require('fs')

module.exports = class FileManager {

	overwriteFile(fileAddress, fileContent) {
		return writeFile(fileAddress, fileContent, 'w')
	}

	writeFile(fileAddress, fileContent) {
		return writeFile(fileAddress, fileContent, 'ax')
	}

	createPathIfDoesntExist(filePath) {
		return new Promise((resolve, reject) => {
			fs.mkdirSync(filePath, { recursive: true }, (error) => {
				reject(error)
			})
			resolve()
		})
	}

	deleteFile(filePath) {
		return new Promise((resolve, reject) => {
			fs.unlinkSync(filePath, (error) => {
				reject(error)
			})
			resolve()
		})
	}
}

function writeFile(fileAddress, fileContent, flag) {
	return new Promise((resolve, reject) => {
		fs.writeFileSync(fileAddress, fileContent, {
			flag: flag
		}, (error) => {
			reject(error)
		})
		resolve()
	})
}