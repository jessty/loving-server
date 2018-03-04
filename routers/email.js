const Router = require('koa-router')
const emailMdl = require('../lib/emailModel')
const check = require('../util/check')

async function addEmail(ctx, next) {
  let body = ctx.request.body
  body.emlFrom = ctx.session.idUser
  body.emlType = 1
  body.emlFromState = 1
  body.emlToState = 0
  let {insertId} = await emailMdl.addEmail(body)

  ctx.status = 200
  ctx.body = {
    msg:'邮件发送成功',
    data: {
      idEmail: insertId
    }
  }
}
async function deleteEmail(ctx, next) {
  let {idEmail} = ctx.request.body
  let {idUser} = ctx.session
  let {type} = ctx.params

  if(type!='sent' && type!='received'){
    ctx.throw(400, 'url所指向的服务不存在')
  }

  let result = await emailMdl.deleteEmail(type, idEmail, idUser)

  if(result.changedRows === 1){
    ctx.status = 200
    ctx.body = {
      msg: '邮件删除成功',
    }
  }else {
    ctx.throw(400, '邮件不存在')
  }
}

async function getEmails(ctx, next) {
  let {idUser} = ctx.session
  let {type} = ctx.params
  if(type!='sent' && type!='received'){
    ctx.throw(400, 'url所指向的服务不存在')
  }
  let emails = await emailMdl.getEmails(type, idUser)

  ctx.status = 200
  ctx.body = {
    msg:'获取邮件列表成功',
    data: emails
  }
}

async function readEmail(ctx, next) {
  let {idEmail} = ctx.query
  let {idUser} = ctx.session
  let {type} = ctx.params

  if(type!='sent' && type!='received'){
    ctx.throw(400, 'url所指向的服务不存在')
  }
  
  let result = await emailMdl.getDetail(type, idEmail, idUser)
  if(result.length !== 1){
    ctx.throw(400, '邮件不存在')
  }
  let email = result[0]

  if(type === 'received' && email.emlState === 0){
    emailMdl.readEmail(idEmail)
    email.emlState = 1
  }

  let emails = [email]
  while(email.emlFollowing != null) {
    email = (await emailMdl.getDetail(type, email.emlFollowing, idUser))[0]
    emails.push(email)
  }

  ctx.status = 200
  ctx.body = {
    msg:'获取邮件成功',
    data: emails
  }
}

const router = new Router()
const email = new Router()

router.get('/:type/list', getEmails)
router.get('/:type/detail', readEmail)
router.post('/', addEmail)
router.delete('/:type', deleteEmail)

email.use('/email', check.login, router.routes())

module.exports = email