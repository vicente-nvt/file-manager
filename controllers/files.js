let FileManager = require('../services/file-manager')
let HttpStatus = require('http-status-codes')

module.exports = class FileController {

    constructor() {
        this.fileManager = new FileManager()
    }

    getFile(req, res) {
        let fileAddress = getFileAddress(req)
        return res.download(fileAddress)
    }

    createFile(req, res) {
        let fileAddress = getFileAddress(req)
        let filePath = getFilePath(fileAddress)

        return this.fileManager.createPathIfDoesntExist(filePath)
            .then(() => {
                this.fileManager.writeFile(fileAddress, req.body)
                    .then(() => res.sendStatus(HttpStatus.CREATED))
                    .catch((error) => dealWithError(res, error))
            })
            .catch((error) => {
                dealWithError(res, error)
            })
    }

    overwriteFile(req, res) {
        let fileAddress = getFileAddress(req)
        return this.fileManager.overwriteFile(fileAddress, req.body)
            .then(() => res.sendStatus(HttpStatus.NO_CONTENT))
            .catch((error) => dealWithError(res, error))
    }

    deleteFile(req, res) {
        let fileAddress = getFileAddress(req)
        return this.fileManager.deleteFile(fileAddress)
            .then(() => res.sendStatus(HttpStatus.OK))
            .catch((error) => dealWithError(res, error))
    }

    moveFile(req, res) {
        let address
        try {
            address = JSON.parse(req.body.toString())
        } catch (exception) {
            res.send(HttpStatus.BAD_REQUEST)
            return
        }

        let { from, to } = getPathsInUserFolder(req.decodedToken.username, address)
        let newFilePath = getFilePath(to)

        return this.fileManager.createPathIfDoesntExist(newFilePath)
            .then(() => {
                this.fileManager.moveFile(from, to)
                    .then(() => res.sendStatus(HttpStatus.NO_CONTENT))
                    .catch((error) => dealWithError(res, error))
            })
            .catch((error) => dealWithError(res, error))
    }
}

function getPathsInUserFolder(username, address) {
    return  {
        from: `./${username}${address.from}`,
        to: `./${username}${address.to}`,
    }
}

function getFileAddress(req) {
    let path = req.path
    let username = req.decodedToken.username
    let fileAddress = path.replace('/files/', `${username}/`)
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
        case 'ENOENT': res.sendStatus(HttpStatus.NOT_FOUND); break
        case 'EEXIST': res.sendStatus(HttpStatus.CONFLICT); break
        default: res.status(HttpStatus.SERVER_ERROR).send(error.code)
    }
}