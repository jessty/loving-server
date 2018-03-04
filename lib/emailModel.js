const {query} = require('./mysql')
const Sqlstr = require('sqlstring')

function addEmail(values) {

  let sql = 'insert into email set ?;'

  sql =  Sqlstr.format(sql, [values])
  return query(sql)
}

function deleteEmail(type, idEmail, idUser) {
  let sql = ''
  if(type === 'sent') {
    sql = 'update email set emlFromState = 2 where idEmail = ? and emlFrom = ?;'
  }else {
    sql = 'update email set emlToState = 2 where idEmail = ? and emlTo = ?;'
  }

  sql = Sqlstr.format(sql, [idEmail, idUser])
  return query(sql)
}

function getEmails(type, idUser) {
  let sql = ''
  if(type === 'sent') {
    sql = `
    select idEmail, emlTitle, emlFrom, emlTo, emlTime, emlType, emlFromState emlState, emlFollowing
    from email 
    where emlFrom = ? and emlFromState <> 2
    order by emlTime desc;`
  }else {
    sql = `
    select idEmail, emlTitle, emlFrom, emlTo, emlTime, emlType, emlToState emlState, emlFollowing
    from email 
    where emlTo = ? and emlToState <> 2
    order by emlTime desc;`
  }

  sql = Sqlstr.format(sql, [idUser])
  return query(sql)
}

function readEmail(idEmail) {
  let sql = 'update email set emlToState = 1 where idEmail = ?;'

  sql = Sqlstr.format(sql, [idEmail])
  return query(sql)
}

function getDetail(type, idEmail, idUser) {
  let sql = ``

  if(type==='sent'){
    sql = `select idEmail, emlTitle, emlFrom, emlTo, emlTime, emlContent, emlType, emlFromState emlState, emlFollowing
    from email
    where idEmail = ?` + (idUser ?` and emlFrom = ?` :'' )
    
  }else {
    sql = `select idEmail, emlTitle, emlFrom, emlTo, emlTime, emlContent, emlType, emlToState emlState, emlFollowing
    from email
    where idEmail = ?` + (idUser ?` and emlTo = ?` : '')
  }

  sql = Sqlstr.format(sql, [idEmail, idUser])
  return query(sql)
}

module.exports = {
  addEmail,
  deleteEmail,
  getEmails,
  readEmail,
  getDetail
  // updateMood
}