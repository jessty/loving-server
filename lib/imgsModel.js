const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

// type 1--相册 2--心情 3--实名认证
function addImg(values) {

  let sql = 'insert into imgs set ?;'

  sql =  Sqlstr.format(sql, [values])
  return query(sql)
}

function deleteImgById(idImg) {
  let sql = 'delete from imgs where idImg = ?;'

  sql =  Sqlstr.format(sql, [idImg])
  return query(sql)
}

function deleteImgs(idBelong, type) {
  let sql = 'delete from imgs where idBelong = ? and type = ?;'

  sql =  Sqlstr.format(sql, [idBelong, type])
  return query(sql)
} 

function getImgs(idBelong, type) {
  let sql = 'select idImg, imgUrl from imgs where idBelong = ? and type = type;'

  sql = Sqlstr.format(sql, [idBelong, type])
  return query(sql)
}

function updateImg(idImg , values) {
  let sql = 'update ?? set imgs where idImg = ?;'

  sql = Sqlstr.format(sql, [values, idImg])
  return query(sql)
}

module.exports = {
  addImg,
  deleteImgById,
  deleteImgs,
  getImgs,
  updateImg,
}