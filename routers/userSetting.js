const Router = require('koa-router')
const md5 = require('md5')
const check = require('../util/check')
const userModel = require('../lib/userModel')
const RandomStr = require('../util/randomStr')
const settingMdl = require('../lib/settingModel')

async function getSetting(ctx, next){
  let {idUser} = ctx.session;
  let settings = await settingMdl.getSetting(idUser)
  if(settings.length !== 1) {
    ctx.throw(400, '用户不存在')
  }

  ctx.status = 200
  ctx.body = {
    msg: '获取设置信息成功',
    data: settings[0]
  }

}
async function updateSetting(ctx, next){
  let body = ctx.request.body
  let {idUser} = ctx.session
  let {affectedRows} = await settingMdl.updateSetting(idUser, body);
  if(affectedRows === 1)  {

    ctx.status = 200
    ctx.body = {
      msg: '更改设置成功'
    }
  }else{
    ctx.throw(400, '用户不存在')
  }

}

async function resetPsw(ctx, next) {
  let {oldPsw, newPsw, confirmPsw} = ctx.request.body
  let {idUser} = ctx.session
  if(newPsw !== confirmPsw) {
    ctx.throw(400, '密码不一致')
  }
  let userInform = await userModel.findUserById(idUser)
  let {psw, salt} = userInform[0]
  if(md5(oldPsw + salt) === psw) {
    salt = RandomStr(8)
    let newRow = {
      psw: md5(newPsw + salt),
      salt,
    }
    let {affectedRows} = await userModel.updateUser(idUser, newRow);
    if(affectedRows === 1)  {

      ctx.status = 200
      ctx.body = {
        msg: '更改设置成功'
      }
    }else{
      ctx.throw(400, '用户不存在')
    }
  } else {
    ctx.status = 400
    ctx.body = {
      msg: '密码错误'
    }
  }

}

const router = new Router()
const setting = new Router()

router.get('/privacy', getSetting)
router.post('/privacy', updateSetting)
router.post('/psw', resetPsw)

setting.use('/setting', check.login, router.routes(), router.allowedMethods())

module.exports = setting
