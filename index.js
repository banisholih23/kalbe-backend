const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const route = require('./src/index')

const server = app.listen(process.env.PORT || 3306, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('You are connected at' + host + ':' + port)
})

app.use(morgan('dev'))

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())

app.use('/', route)