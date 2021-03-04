const { database } = require('./index')
const mysql = require('mysql')

// setting database mysql
const connection = mysql.createConnection(database)

connection.connect(function (error) {
  if (error) throw error
  console.log('Database has been connected')
})

module.exports = connection