const {query} = require('./mysql')
const Sqlstr = require('sqlstring')
function getMyMood(idUser) {
  let sql = 'select * from ?? where idUser = ?;'

  sql = Sqlstr.format(sql, [idUser])
  return query(sql)
}
function updateMyMood(idUser , values) {
  let sql = 'update ?? set ? where idUser = ?;'

  sql = Sqlstr.format(sql, [table, values, idUser])
  return query(sql)
}
function addInform(table, values) {

  let sql = 'insert into ?? set ?;'

  sql =  Sqlstr.format(sql, [table, values])
  return query(sql)
}
module.exports = {
  getInform,
  updateInform,
  addInform
}