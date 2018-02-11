const {query} = require('./mysql')


module.exports = {
  addUser(data) {
    let sql = 'insert into user values ?, ?, ?'

    return query(sql, data)
  },
  updateUser(data) {
    let sql = 'insert into user values ?, ?, ?'

    return query(sql, data)
  },
  getUser() {
    let sql = 'insert into user values ?, ?, ?'

    return query(sql, data)
  }
}