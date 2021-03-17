const db = require('../config/mysql')

module.exports = {
  getAllProduct: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT * FROM produk', function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
}