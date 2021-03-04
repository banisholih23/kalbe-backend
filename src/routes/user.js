const express = require('express')
const Route = express.Router()

const user = require('../controllers/user')

Route.get('/user', user.getAllUsers)
Route.post('/register', user.createUser)
Route.post('/login', user.loginUser)

module.exports = Route