const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addIdenRec(values) {
  let sql = 'insert into identify set ?;'

  sql = Sqlstr.format(sql, values)
  return query(sql)
}
function updateIdenRec(idIden, values) {
  let sql = `update identify set ? where idIden = ?;`

  sql = Sqlstr.format(sql, [values, idIden])
  return query(sql)
}
function checkIdenRec(idUser, status) {
  let sql = `select idUser, idIden, idenTime from identify where idUser = ? and idenStatus = ?;`

  sql = Sqlstr.format(sql, [idUser, status])
  return query(sql)
}
function getLatestIdenRec(idUser) {
  let sql = `select * from identify where idUser = ? and idenTime = (select max(idenTime) from identify where idUser = ?);`
  
  sql = Sqlstr.format(sql, [idUser, idUser])
  return query(sql)
}
module.exports = {
  addIdenRec,
  checkIdenRec,
  updateIdenRec,
  getLatestIdenRec
}