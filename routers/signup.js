const Router = require('koa-router')
// const {userModel} = require('../lib/mysql')
const md5 = require('md5')
const {checkLogin} = require('../middlewares/check')
const moment = require('moment')
const fs = require('fs')
const router = new Router()

router.get('/signup', async(ctx, next) => {
  // await checkLogin(ctx)
  ctx.body = {
    code:1,
    msg: 'test'
  }
})

router.post('/signup', async(ctx, next) => {

  let {body} = ctx.request;
  let signupInform = {
    ...body
  }

  ctx.body = {
    code: 3,
    msg: '注册成功',
    data: signupInform
  }
  // await userModel.findUserByName(signupInform.user)
  //   .then(async (result) => {
  //     console.log(result.length)
  //     if(result.length) {
  //       try {
  //         throw Error('用户已存在')
  //       } catch (err) {
  //         console.log(err)
  //       }

  //       ctx.body = {
  //         code: 1,
  //         msg: '用户已存在'
  //       }
  //     } else if (signupInform.psw !== signupInform.confirmPsw || signupInform.pass === '') {
  //       ctx.body = {
  //         code: 2,
  //         msg: '密码不一致'
  //       }
  //     } else {
  //       // let filename = signupInform.user;
  //       // let dataBuffer = new Buffer()
  //       // await fs.writeFile('../userImgs/' + filename + '.jpg')

  //       console.log('注册成功')
  //       ctx.body = {
  //         code: 3,
  //         msg: '注册成功',
  //         data: signupInform
  //       }
  //     }
  //   })
})

module.exports = router
