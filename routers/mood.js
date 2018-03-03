const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const SaveFile = require('../util/saveFile')
const check = require('../util/check')
const RandomStr = require('../util/randomStr')
const userModel = require('../lib/userModel')
const imgsModel = require('../lib/imgsModel')
const moodMdl = require('../lib/moodModel')

async function publishMood(ctx, next){
  let saveOpt = {
    fields: [
      {
        name: 'imgs',
        maxCount:5
      }
    ],
    limits: {
      fileSize: 1000000
    },
    dir: path.join(__dirname, '../imgs/user', ctx.session.imgDir)
  }

  await SaveFile(saveOpt)(ctx, async ()=> {
    let {imgs} = ctx.req.files
    let body = ctx.req.body
    body.idUSer = ctx.session.idUser
    console.error('没做图片个数限制')
    let {insertId:idMood} = await moodMdl.addMood(body)
    let idImgs = []
    for(let img of imgs) {
      let {insertId:idImg} = await imgsModel.addImg({
        idBelong: idMood,
        imgUrl: img.filename,
        type: 2
      })
      idImgs.push(idImg)
    }

    idImgs = idImgs.map((idImg) => {
      return {idImg}
    })

    ctx.status = 200
    ctx.body = {
      msg: '发表心情成功',
      data: {
        idMood,
        imgs: idImgs
      }
    }

  })

}

async function deleteMood(ctx, next) {
  let {idMood} = ctx.request.body, {imgDir} = ctx.session
  let {affectedRows} = await moodMdl.deleteMood(idMood)
  if(affectedRows !== 1) {
    ctx.throw(400, '心情不存在')
  }

  let imgs = await imgsModel.getImgs(idMood, 2)
  let basicDir = path.join(__dirname, '../imgs/user', imgDir)
  for(let img of imgs) {
    fs.unlinkSync(path.join(basicDir, img.imgUrl))
  }
  await imgsModel.deleteImgs(idMood, 2)

  ctx.status = 200
  ctx.body = {
    msg: '心情删除成功'
  }
}

async function getMoods(ctx, next){
  let {idUser} = ctx.query;
  let userInforms = await userModel.findUserById(idUser)
  if(userInforms.length !== 1) {
    ctx.throw(400, '用户不存在')
  }

  let {imgDir} = userInforms[0]
  let moods = await moodMdl.getMoods(idUser)
  let result = []
  for(let mood of moods) {
    let imgs = await imgsModel.getImgs(mood.idMood, 2)
    result.push(Object.assign(mood, {imgs}))
  }

  ctx.status = 200
  ctx.body = {
    msg: '获取心情列表成功',
    data: {
      imgDir,
      mood: result
    }
  }

}

router.post('/mood', check.login, publishMood)
router.delete('/mood', check.login, deleteMood)
router.get('/mood', check.authen, getMoods)

module.exports = router
