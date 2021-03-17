const express = require('express')
const Route = express.Router()

const user = require('../controllers/product')

Route.get('/product', user.getAllProduct)

module.exports = Route