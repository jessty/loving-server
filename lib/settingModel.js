const {query} = require('./mysql')
const Sqlstr = require('sqlstring')
function addSetting(values) {

  let sql = 'insert into setting set ?;'

  sql =  Sqlstr.format(sql, [values])
  return query(sql)
}

function getSetting(idUser) {
  let sql = 'select * from setting where idUser = ?;'

  sql = Sqlstr.format(sql, [idUser])
  return query(sql)
}

function updateSetting(idUser , values) {
  removeId(values)
  
  let sql = 'update setting set ? where idUser = ?;'

  sql = Sqlstr.format(sql, [values, idUser])
  return query(sql)
}

module.exports = {
  addSetting,
  getSetting,
  updateSetting
}