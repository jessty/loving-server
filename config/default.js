const db = require('./dbConfig')
const config = {
  port: 3000,
  database: {
    host: db.host,
    port: db.port,
    database: db.database,
    user: db.user,
    password: db.password
  }
}

module.exports = config