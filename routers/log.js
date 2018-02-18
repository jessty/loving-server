const Router = require('koa-router')
const userModel = require('../lib/userModel')
const md5 = require('md5')
const {checkLogin} = require('../util/check')
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
    ctx.throw(400, '账号格式错误', {code:3})
    // return
  }

  next();
}
// 400下：code的含义1--用户已存在  2--密码不一致  3--账号格式错误
async function signup(ctx, next) {

  let signupInform = {
    ...ctx.request.body
  }

  let result = await userModel.findUserByPE(signupInform.user)

  if(result.length) {
    ctx.throw(400, '用户已存在', {code:1})
  } 
  if (signupInform.psw !== signupInform.confirmPsw || signupInform.psw === '') {
    ctx.throw(400, '密码不一致', {code:2})
  }

  // 生成随机字符串，盐
  let salt = RandomStr(8), img_dir = RandomStr(8, false);
  let newRow = {
    email: signupInform.email,
    phone: signupInform.phone,
    psw: md5(signupInform.psw + salt),
    signup_time: new Date(),
    salt,
    img_dir
  }

  await userModel.signup(newRow)
  console.log('注册成功')
  console.error('返回404？？')
  ctx.status = 200
  ctx.body = {
    msg: '注册成功'
  }
}

// login200下：code的含义：1--登录成功  2--已登录 
// login400下：code的含义：1--账户未注册  2--密码错误
async function login(ctx, next) {
  let loginData = {...ctx.request.body}

  if(!ctx.session.isNew || ctx.session.iduser) {
    ctx.body = {
      code: 2,
      msg: '已登录',
    }
    return
  }

  let result = await userModel.findUserByPE(loginData.user)

  if(!result.length) {
    ctx.throw(400, '账户未注册', {code:1})
  }

  let invalid = result[0].psw !== md5(loginData.psw + result[0].salt)

  invalid ? ctx.throw(400, '密码错误', {code:2}) : null

  await userModel.login(result[0].iduser)

  ctx.body = {
    code: 1,
    msg: '登录成功'
  }
  ctx.session.iduser = result[0].iduser
  // Object.assign(ctx.session, {iduser: result[0].iduser});

  next()
}

function logout(ctx, next) {
  ctx.session = null
  ctx.body = {
    msg: '退出成功'
  }
  next()
}

router.get('/signup', (ctx, next) => {
  ctx.body = {
    msg: 'test'
  }
})

router.post('/signup', judgeUserType, signup)
router.post('/login', login)
router.post('/logout', logout)
module.exports = router