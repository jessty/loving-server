const {query} = require('./mysql')
const Sqlstr = require('sqlstring')
const removeId = require('../util/removeId')

async function getLikeState(idLiking, idLiked, type) {
  let sql1 = `set @idLike =0, @likeNum=0;`
  await query(sql1)

  let sql2 = `call getLikeState (?, ?, ?, @idLike, @likeNum);`
  sql2 = Sqlstr.format(sql2, [idLiking, idLiked, type])
  await query(sql2)

  let sql3 = `select @idLike as idLike, @likeNum as likeNum;`
  return query(sql3)
}

function addLike(values) {
  removeId(values)

  let sql = 'insert into likes set ?;'
  sql = Sqlstr.format(sql, values)
  return query(sql)
}

function deleteLike(idLike) {
  let sql = 'delete from like where idLike = ?;'

  sql = Sqlstr.format(sql, [idLike])
  return query(sql)
}

module.exports = {
  getLikeState,
  addLike,
  deleteLike
}