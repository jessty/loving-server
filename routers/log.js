const Router = require('koa-router')
const userModel = require('../lib/userModel')
const md5 = require('md5')
const {checkLogin} = require('../util/check')
const RandomStr = require('../util/randomStr')
const router = new Router()

async function judgeUserType(ctx, next) {
  let body = ctx.request.body
  let {user, psw} = body
  // 判断是邮箱还是手机注册
  let emailReg = /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/, phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/

  if(emailReg.test(user)) {
    body.email = user
  } else if(phoneReg.test(user)) {
    body.phone = user
  } else {
    ctx.throw(400, '账号格式错误', {code:3})
  }

  await next()
}
function response(ctx, result, otherData) {
  console.log(otherData.msg)
  
  let {
    idUser,
    credit,
    bean,
    rank,
    phone,
    email,
    imgDir,
    avator,
    quote,
    loginTime
  } = result[0]
  let data =  {
    idUser,
    credit,
    bean,
    rank,
    phone,
    email,
    imgDir,
    avator: avator ? avator : 'publicHead.jpg',
    quote: quote ? quote : '等待有缘人',
    loginTime
  }
  let body = Object.assign({data}, otherData)

  ctx.session.idUser = idUser
  ctx.session.imgDir = imgDir
  // ctx.cookies.set('koa:sess',{path:'http://localhost:3000/hello'})
  // ctx.cookies.set('koa:sess.sig',{path:'http://localhost:3000/hello'})
  ctx.status = 200 
  ctx.body = body
}
// 400下：code的含义1--用户已存在  2--密码不一致  3--账号格式错误
async function signup(ctx, next) {
  let signupData = {
    ...ctx.request.body
  }

  let users = await userModel.findUserByPE(signupData.user)

  if(users.length) {
    ctx.throw(400, '用户已存在', {code:1})
  }
  if (signupData.psw !== signupData.confirmPsw || signupData.psw === '') {
    ctx.throw(400, '密码不一致', {code:2})
  }
  // 生成随机字符串，盐
  let salt = RandomStr(8),
    imgDir = RandomStr(8, false),
    time = new Date(signupData.signupTime);
  let newRow = {
    email: signupData.email,
    phone: signupData.phone,
    psw: md5(signupData.psw + salt),
    signupTime: time,
    loginTime: time,
    salt,
    imgDir
  }

  let result = await userModel.signup(newRow)

  response(ctx, result, {msg:'注册成功'})

  await next()
}

// login200下：code的含义：1--登录成功  2--已登录 
// login400下：code的含义：1--账户未注册  2--密码错误
async function login(ctx, next) {
  let loginData = {...ctx.request.body}

  let result = await userModel.findUserByPE(loginData.user)

  if(!result.length) {
    ctx.throw(400, '账户未注册', {code:1})
  }

  let invalid = result[0].psw !== md5(loginData.psw + result[0].salt)

  invalid ? ctx.throw(400, '密码错误', {code:2}) : null

  let loginTime = new Date(loginData.loginTime)
  await userModel.login(result[0].idUser, loginTime)

  response(ctx, result, {
    code: 1,
    msg: '登陆成功'
  })

  await next()
}

async function logout(ctx, next) {
  ctx.session = null
  ctx.body = {
    msg: '退出成功'
  }
  await next()
}

router.get('/signup', (ctx, next) => {
  ctx.body = {
    msg: 'test'
  }
})

router.post('/signup', judgeUserType, signup)
router.post('/login', judgeUserType, login)
router.post('/logout', logout)
module.exports = router