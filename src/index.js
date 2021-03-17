const express = require('express')
const route = express.Router()

const product = require('./routes/product')
const customer = require('./routes/customer')

route.use('/', product)
route.use('/', customer)

module.exports = route