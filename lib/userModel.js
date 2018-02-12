const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addUser(data) {
  let sql = 'insert into user set ?;'

  sql = Sqlstr.format(sql, data)
  return query(sql)
}

function updateUser(data) {
  let sql = 'insert into user set ?;'

  return query(sql, data)
}

function getUser(condit) {
  let sql = 'select * from user where ?;'

  return query(sql, condit)
}

module.exports = {
  
  findUserByPE(user) {
    let emailReg = /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/, phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/
    
    let sql = Sqlstr.format(`select * from user where phone=? or email=?;`, [user, user]);

    return query(sql)
  },
  signup(inform) {
    return addUser(inform)
  }
}