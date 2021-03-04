const express = require('express')
const route = express.Router()

const user = require('./routes/user')

route.use('/', user)

module.exports = route