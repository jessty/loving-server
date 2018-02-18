const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addIdenRec(data) {
  let sql = 'insert into identify set ?;'

  sql = Sqlstr.format(sql, data)
  return query(sql)
}
module.exports = {
  addIdenRec
}