/* eslint-disable no-console */
var app = require('./infra/server')

app.listen(3000, () => {
    console.log('Server online')
})