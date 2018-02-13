const router = require('koa-router')()
const multer = require('koa-multer')
const {checkLogin} = require('../util/check')
const RandomStr = require('../util/randomStr')
const path = require('path')

function IDCard(req, res, next) {
  console.log(123,req,res);
  // checkLogin() ? null : ctx.throw(401, '用户未登录')

  // let {frontData, backData} = ctx.request.body
  // let datas = [frontData, backData]

  // datas.forEach((data, i) => {
  //   data = data.replace(/^data:image\/\w+;base64,/, "")
  //   let buf = new Buffer(data, 'base64')
  //   getBaseImgUrl()
  //   let filename = RandomStr(5,false)
  // })
  // frontData = frontData.replace(/^data:image\/\w+;base64,/, "")
  // backData = backData.replace(/^data:image\/\w+;base64,/, "")

  // let frontBuf = new Buffer(frontData, 'base64')
  // let backBuf = new Buffer(backData, 'base64')
  


}

function email(){

}

function phone(){

}
let dest = path.resolve(__dirname, '../imgs')
const upload = multer()

router.post('/identify', upload.array(), IDCard)
module.exports = router