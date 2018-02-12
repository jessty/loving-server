const Router = require('koa-router')
const userModel = require('../lib/userModel')
const md5 = require('md5')
const {checkLogin} = require('../middlewares/check')
const RandomStr = require('../util/randomStr')
const router = new Router()

function judgeUserType(ctx, next) {
  let body = ctx.request.body
  let {user, psw} = body
  // delete body.user
  // 判断是邮箱还是手机注册
  let emailReg = /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/, phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/

  if(emailReg.test(user)) {
    body.email = user
  } else if(phoneReg.test(user)) {
    body.phone = user
  } else {
    ctx.status = 400
    ctx.body = { msg: '账号格式错误' }
    return
  }

  next();
}

async function signup(ctx, next) {

  let signupInform = {
    ...ctx.request.body
  }
  let newRow = {};

  let result = await userModel.findUserByPE(signupInform.user)
  console.log(result.length)

  if(result.length) {

    ctx.body = {
      code: 1,
      msg: '用户已存在'
    }

  } else if (signupInform.psw !== signupInform.confirmPsw || signupInform.psw === '') {

    ctx.body = {
      code: 2,
      msg: '密码不一致'
    }

  } else {
    // 生成随机字符串，盐
    let salt = RandomStr(8)
    Object.assign(newRow,{
      email: signupInform.email,
      phone: signupInform.phone,
      psw: md5(signupInform.psw + salt),
      signup_time: new Date(),
      salt
    })

  }

  try {

    await userModel.signup(newRow)
    console.log('注册成功')
    ctx.body = {
      code: 3,
      msg: '注册成功'
    }

  } catch (err) {

    console.error('insert new user error : ', err)
    ctx.status = 500
    ctx.body = { msg: '注册失败' }

  }
}

async function login(ctx, next) {
  let loginData = {...ctx.request.body}

  if(!ctx.session.isNew || ctx.session.psw) {
    ctx.body = {
      code: 2,
      msg: '已登录'
    }
    return
  }

  let result = await userModel.findUserByPE(loginData.user)

  if(!result.length) {
    ctx.body = {
      code: 1,
      msg: '账户未注册'
    }
  } else {
    
    let valid = result[0].psw === md5(loginData.psw + result[0].salt)

    if(valid) {
      ctx.body = {
        code: 3,
        msg: '登录成功'
      }
      Object.assign(ctx.session, result[0]);
      // router.redirect('/signup');
    } else {
      ctx.status = 400
      ctx.body = {
        code: 1,
        msg: '密码错误'
      }
    }
  }

  await next()
}

router.get('/signup', (ctx, next) => {
  // await checkLogin(ctx)
  ctx.body = {
    code:1,
    msg: 'test'
  }
})

router.post('/signup', judgeUserType, signup)
router.post('/login', login)

module.exports = router
