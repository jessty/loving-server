const idenMdl = require('../lib/idenModel')
const settingMdl = require('../lib/settingModel')
const userType = ['任何人', '注册用户', 'vip用户']

const login = async (ctx, next) => {
  // 失效的情况没加
  if(ctx.session.isNew || !ctx.session.idUser) {
    ctx.throw(401, '用户尚未登录')
  }else {
    await next()
  }
}
const authen = async (ctx, next) => {

  let {idUser, rank=0} = ctx.session
  let {idUser: targetId} = ctx.query

  targetId ? null : ctx.throw(400, 'url参数错误')

  if(idUser === parseInt(targetId)) {

    await next()

  }else {

    let setting = await settingMdl.getSetting(targetId)

    if(setting.length !== 1) {
      ctx.throw(400, '用户不存在')
    }

    let {'0': {needIden, needRank}} = setting

    if(needIden === 1) {
      let idenRec = await idenMdl.checkIdenRec(idUser, 3)
      idenRec.length === 0 ? ctx.throw(403, '用户只把信息开放给实名用户') : null;
    }

    if(rank < needRank) {
      ctx.throw(403, '用户只把信息开放给' + userType[needRank])
    }

    await next()
  }
}

module.exports = {
  login,
  authen
}