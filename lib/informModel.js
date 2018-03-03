const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function getInform(table, idUser) {
  let sql = 'select * from ?? where idUser = ?;'

  sql = Sqlstr.format(sql, [table, idUser])
  return query(sql)
}

function updateInform(table, idUser , values) {
  removeId(values)

  let sql = 'update ?? set ? where idUser = ?;'

  sql = Sqlstr.format(sql, [table, values, idUser])
  return query(sql)
}

function search(idUser, rank, iden, values) {
  let tempValues = []
  let sql = `
  select * 
  from search as a
    left outer join 
    (select idLiked idUser,count(idLike) likeNum from likes where likeType = 1 group by idLiked) as b
  using (idUser)
  where idUser <> ? and needRank <= ? and needIden <= ?`
  for(let p in values) {
    sql += ' and ' + p + '=?'
    tempValues.push(values[p])
  }

  sql = Sqlstr.format(sql, [idUser, rank, iden, ...tempValues])
  return query(sql)
}
module.exports = {
  getInform,
  updateInform,
  search
}