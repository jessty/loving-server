const router = require('koa-router')()
const Upload = require('../util/upload')
const {checkLogin} = require('../util/check')
const RandomStr = require('../util/randomStr')
const path = require('path')
const fs = require('fs')
const idenModel = require('../lib/idenModel')
const userModel = require('../lib/userModel')


async function idenIDCard(ctx, next) {
  // checkLogin() ? null : ctx.throw(401, '用户未登录')
  let result = await idenModel.checkIdenRec(ctx.session.idUser, 0)

  if(result.length == 1) {
    await idenModel.updateIdenRec(result[0].idIden, {idenStatus: 1})
  }

  let uploadOpt = {
    destination:(req, file, cb) => {
      let dir = path.resolve(__dirname, `../imgs/iimgs/${ctx.session.imgDir}`)

      fs.access(dir, (err) => {
        if(err) {
          fs.mkdir(dir, (err) => {
            if(err) {
              throw err
            } else {
              cb(null, dir)
            }
          })
        } else {
          cb(null, dir)
        }
      })

    },
    filename:(req, file, cb) => {

      let dotIndex = file.originalname.lastIndexOf('.')
      let ext = file.originalname.substr(dotIndex)
      let date = ( Date.now() / 1000 ).toFixed(0)
  
      if(file.fieldname === 'front'){
        cb(null, `front-${date}${ext}`)
        
      } else if(file.fieldname === 'back'){
        cb(null, `back-${date}${ext}`)
      } else {
        let err = new Error('参数错误')
        err.status = 400
        throw err
      }

    },
    limits: {
      fileSize: 10000
    },
    fields: [
      { name: 'front',maxCount:1},
      { name: 'back',maxCount:1},
    ]
  } 

  await Upload(uploadOpt)(ctx, next)

  await next()
  
}
async function afterIdenIDCard(ctx, next) {
  let {front, back} = ctx.req.files

  await idenModel.addIdenRec({
    idUser: ctx.session.idUser,
    frontUrl: front[0].filename,
    backUrl: back[0].filename,
    idenTime: new Date(),
  })

  ctx.status = 200
  ctx.body = {
    msg: '已添加实名认证'
  }
}
// 200下  code:1--无记录  code:2--查询成功
async function getIdenIDCard(ctx, next) {
  let result = await idenModel.getLatestIdenRec(ctx.session.idUser)
  if(result.length) {
    ctx.status = 200
    ctx.body = {
      code: 2,
      msg: '查询成功',
      data: result[0]
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: 1,
      msg: '无记录，未实名认证'
    }
  }
}
function email(){

}

function phone(){

}

router.post('/identify', idenIDCard, afterIdenIDCard)
router.get('/identify', getIdenIDCard)
module.exports = router