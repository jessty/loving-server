const mysql = require('mysql')
const Sqlstring = require('sqlstring')
const {database:db} = require('../config/default')

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})

const query = function(sql, values) {

  return new Promise((resolve, reject) => {

    pool.getConnection(function(err, connection) {

      if(err) {

        reject(err)

      } else {

        sql = Sqlstring.escape(sql, values)

        connection.query(sql, (err, rows, fields) => {

          err ? reject(err) : resolve(rows)

          connection.release()
        })
      }

    })
  })
}

const createTable = function(sql) {
  return query(sql, []);
}

const initDB = function() {
  createTable()
}
const userModel = {
  findUserByName(){
    return new Promise()
  }
}

module.exports = {
  query,
  createTable,
  userModel
}