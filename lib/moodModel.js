const {query} = require('./mysql')
const Sqlstr = require('sqlstring')
function addMood(values) {

  let sql = 'insert into mood set ?;'

  sql =  Sqlstr.format(sql, [values])
  return query(sql)
}

function deleteMood(idMood) {
  let sql = 'delete from mood where idMood = ?;'

  sql = Sqlstr.format(sql, [idMood])
  return query(sql)
}

function getMoods(idUser) {
  let sql = 'select idMood, mood, moodTime from mood where idUser = ?;'

  sql = Sqlstr.format(sql, [idUser])
  return query(sql)
}

function updateMood(idUser , values) {
  let sql = 'update mood set ? where idUser = ?;'

  sql = Sqlstr.format(sql, [values, idMood])
  return query(sql)
}

module.exports = {
  addMood,
  deleteMood,
  getMoods,
  updateMood
}