const router = require('koa-router')()
const Upload = require('../util/upload')
const {checkLogin} = require('../util/check')
const RandomStr = require('../util/randomStr')
const path = require('path')
const idenModel = require('../lib/idenModel')

async function IDCard(ctx, next) {
  // checkLogin() ? null : ctx.throw(401, '用户未登录')
  let {front, back} = ctx.req.files
  // let front_url = files[0].fieldname === 'front' ? files[0].filename : undefined
  // let back_url = files[1].fieldname === 'back' ? files[1].filename : undefined

  await idenModel.addIdenRec({
    iduser: ctx.session.iduser,
    front_url: front[0].filename,
    back_url: back[0].filename,
    iden_time: new Date(),
  })

  ctx.status = 200
  ctx.body = {
    msg: '已添加实名认证'
  }
}

function email(){

}

function phone(){

}
let uploadOpt = {
  destination: path.resolve(__dirname, '../imgs/iimgs'),
  filename(req, file, cb) {
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
    // console.log('req', req, file)
  },
  limits: {
    fileSize: 1000000
  },
  fields: [
    { name: 'front',maxCount:1},
    { name: 'back',maxCount:1},
  ]
}

router.post('/identify', Upload(uploadOpt), IDCard)
module.exports = router