const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addAlbum(values) {

  let sql = 'insert into album set ?;'

  sql =  Sqlstr.format(sql, [values])
  return query(sql)
}

function deleteAlbum(idAlbum) {
  let sql = 'delete from album where idAlbum = ?;'

  sql =  Sqlstr.format(sql, [idAlbum])
  return query(sql)
}
function getAlbumById(idAlbum) {
  let sql = 'select idAlbum, albumName, albumTime from album where idAlbum = ?;'

  sql = Sqlstr.format(sql, [idAlbum])
  return query(sql)
}
function getAlbums(idUser) {
  let sql = 'select idAlbum, albumName, albumTime from album where idUser = ?;'

  sql = Sqlstr.format(sql, [idUser])
  return query(sql)
}

function updateAlbum(idAlbum , values) {
  let sql = 'update album set ? where idAlbum = ?;'

  sql = Sqlstr.format(sql, [values, idAlbum])
  return query(sql)
}

module.exports = {
  addAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
}