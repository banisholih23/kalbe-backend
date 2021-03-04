const db = require('../config/mysql')

module.exports = {
  getAllUser: function () {
    return new Promise(function (resolve, reject) {
      db.query('SELECT * FROM user', function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getUserCount: (data = {}) => {
    const sql = `SELECT COUNT(*) as total FROM user
    WHERE name LIKE '${data.search || ""}%' 
    ORDER BY name ${parseInt(data.sort) ? "DESC" : "ASC"}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error));
        }
        resolve(result[0].total);
      });
    });
  },
  createUser: (data) => {
    const sql = "INSERT INTO user SET ?";
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error));
        }
        console.log(result);
        resolve(result.insertId);
      });
    });
  },
  getUserByCondition: (data) => {
    const sql = "SELECT * FROM user WHERE ?";
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error));
        }
        resolve(result);
      });
    });
  },
}