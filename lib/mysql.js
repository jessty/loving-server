const mysql = require('mysql')
const {database:db} = require('../config/default')
// const userModel = require('./userModel')

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})

const query = function(sql) {

  return new Promise((resolve, reject) => {

    pool.getConnection(function(err, connection) {

      if(err) {

        reject(err)

      } else {

        connection.query(sql, (err, rows, fields) => {

          err ? reject(err) : resolve(rows)

          connection.release()
        })
      }

    })
  })
}
const user = 
  'CREATE TABLE IF NOT EXISTS loving.user ('+
    'iduser INT NOT NULL AUTO_INCREMENT, '+
    'psw CHAR(32) NOT NULL, '+
    'salt CHAR(8) NOT NULL, '+
    'credit FLOAT NOT NULL DEFAULT 0, '+
    'bean FLOAT NOT NULL DEFAULT 0, '+
    'rank TINYINT(1) NOT NULL DEFAULT 0, '+
    'phone CHAR(13) NULL, '+
    'email VARCHAR(45) NULL, '+
    'photourl VARCHAR(45) NULL, '+
    'quote VARCHAR(100) NULL, '+
    'signup_time DATETIME(3) NOT NULL, '+
    'login_time DATETIME(3) NULL, '+
    'PRIMARY KEY (iduser));'
  
const createTable = function(sql) {
  return query(sql, []);
}

const initDB = function() {
  createTable(user)
}

module.exports = {
  initDB,
  query,
  createTable,
}