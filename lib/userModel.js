const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addUser(data) {
  let sql = 'insert into user set ?;'

  sql = Sqlstr.format(sql, data)
  return query(sql)
}

function updateUser(data) {
  
  let sql = 'insert into user set ?;update user set'

  return query(sql, data)
}

function getUser(condit) {
  let sql = 'select * from user where ?;'

  return query(sql, condit)
}

module.exports = {
  
  findUserByPE(user) {
    
    let sql = Sqlstr.format(`select * from user where phone=? or email=?;`, [user, user]);

    return query(sql)
  },

  signup(inform) {
    return addUser(inform)
  },
  
  login(iduser) {
    let sql = Sqlstr.format('update user set login_time=? where iduser=?', [new Date(), iduser])
    return query(sql)
  }
}