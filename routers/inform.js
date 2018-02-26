const router = require('koa-router')()
const informModel = require('../lib/informModel')
async function getInform(ctx, next) {
  let {idUser} = ctx.query
  let result = await informModel.getInform(ctx.params.table, idUser)

  if(result.length === 1) {
    ctx.status = 200
    ctx.body = {
      code: 2,
      msg: '查询信息成功',
      data: result[0]
    }
  }else {
    ctx.status = 200
    ctx.body = {
      code:1,
      msg: '暂无该信息',
    }
  }
}
async function modifyInform(ctx, next) {
  let body = ctx.request.body
  let idUser = body.idUser
  delete body.idUser
  let result = await informModel.updateInform(ctx.params.table, idUser, body)
  ctx.status = 200
  ctx.body = {
    msg: '信息更新成功'
  }
  await next()
}
async function addInform(ctx, next) {
  await informModel.addInform(ctx.params.table, ctx.request.body)
}
async function checkAccess(ctx, next) {
  let body = ctx.request.body
  console.error('临时设置，方便调试')
  // if(ctx.session.idUser === body.idUser) {
  if(true) {
    await next()
  }else {
    ctx.status = 403
    ctx.body = {
      msg: '无操作权限'
    }
    return
  }
}
router.get('/inform/:table', getInform)
// router.post('/inform/:table',checkAccess, addInform)
router.put('/inform/:table',checkAccess, modifyInform)

module.exports = router