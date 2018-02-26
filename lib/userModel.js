const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

async function initUser(values) {
  let datas = [
    values.email,
    values.phone,
    values.psw,
    values.salt,
    values.imgDir,
    values.signupTime,
    values.loginTime
  ]
  
  let sql1 = `set @result = 0;`
  await query(sql1)

  let sql2 = `call initUser (?, ?, ?, ?, ?, ?, ?, @result);`
  sql2 = Sqlstr.format(sql2, datas)
  await query(sql2)

  let sql3 = `select * from user where idUser = @result;`
  return query(sql3)
}

function updateUser(idUser, values) {
  let sql = 'update user set ? where idUser = ?;'

  sql = Sqlstr.format(sql, [values, idUser])
  return query(sql)
}

function getUser(id) {
  let sql = Sqlstr.format('select * from user where idUser = ?;', [id])

  return query(sql)
}

module.exports = {
  
  findUserByPE(user) {
    
    let sql = Sqlstr.format(`select * from user where phone=? or email=?;`, [user, user]);

    return query(sql)
  },
  findUserById(id) {

    return getUser(id)
  },
  signup(values) {

    return initUser(values)
  },
  
  login(idUser, loginTime) {
    
    return updateUser(idUser, {loginTime})
  }
}