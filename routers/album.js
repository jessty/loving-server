const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const SaveFile = require('../util/saveFile')
const check = require('../util/check')
const RandomStr = require('../util/randomStr')
const userModel = require('../lib/userModel')
const imgsModel = require('../lib/imgsModel')
const albumMdl = require('../lib/albumModel')

async function create(ctx, next){
  let body = ctx.request.body
  body.idUser = ctx.session.idUser
  let {insertId} = await albumMdl.addAlbum(body)

  ctx.status = 200
  ctx.body = {
    msg: '添加相册成功',
    data: {
      idAlbum: insertId
    }
  }

}

async function addImg(ctx, next){
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
    let {idAlbum} = ctx.req.body
    console.error('没做图片个数限制')
    let {length} = await albumMdl.getAlbumById(idAlbum)
    if(length === 0) {
      ctx.throw(400, '相册不存在')
    }

    let idImgs = []
    for(let img of imgs) {
      let {insertId} = await imgsModel.addImg({
        idBelong: idAlbum,
        imgUrl: img.filename,
        type: 1
      })
      idImgs.push(insertId)
    }
    idImgs = idImgs.map((idImg) => {
      return {idImg}
    })
    ctx.status = 200
    ctx.body = {
      msg: '图片添加成功',
      data: idImgs
    }
  })

}

async function deleteImg(ctx, next) {
  let {idImg} = ctx.request.body
  let {'0': {imgUrl}} = await imgsModel.getImgById(idImg)
  let p = path.join(__dirname, '../imgs/user', ctx.session.imgDir, imgUrl)

  try {
    fs.accessSync(p)
  }catch(err) {
    ctx.throw(400, '文件不存在')
  }

  try {
    fs.unlinkSync(p)
  } catch(err) {
    ctx.throw(500, '文件删除失败')
  }

  await imgsModel.deleteImgById(idImg)

  ctx.status = 200
  ctx.body = {
    msg:'图片删除成功'
  }
}

async function deleteAlbum(ctx, next) {
  let {idAlbum} = ctx.request.body, {imgDir} = ctx.session
  let {affectedRows} = await albumMdl.deleteAlbum(idAlbum)
  if(affectedRows !== 1) {
    ctx.throw(400, '相册不存在')
  }

  let imgs = await imgsModel.getImgs(idAlbum, 1)
  let basicDir = path.resolve(__dirname, '../imgs/user', imgDir)
  for(let img of imgs) {
    fs.unlinkSync(path.resolve(basicDir, img.imgUrl))
  }
  await imgsModel.deleteImgs(idAlbum, 1)

  ctx.status = 200
  ctx.body = {
    msg: '相册删除成功'
  }
}

async function getAlbums(ctx, next){
  let {idUser} = ctx.query;
  let userInforms = await userModel.findUserById(idUser)
  if(userInforms.length !== 1) {
    ctx.throw(400, '用户不存在')
  }
  let {imgDir} = userInforms[0]
  let albums = await albumMdl.getAlbums(idUser)
  let result = []
  for(let album of albums) {
    let imgs = await imgsModel.getImgs(album.idAlbum, 1)
    result.push(Object.assign(album, {imgs}))
  }

  ctx.status = 200
  ctx.body = {
    msg: '获取相册信息成功',
    data: {
      imgDir,
      albums: result
    }
  }

}

async function updateImg(ctx, next) {

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
    cover: true,
    dir: path.join(__dirname, '../imgs/user', ctx.session.imgDir)
  }

  await SaveFile(saveOpt)(ctx, async () => {
    let {imgs} = ctx.req.files
    let {idImg} = ctx.req.body
    let result = await imgsModel.getImgById(idImg)
    if(result.length === 0) {
      ctx.throw(400, '图片不存在')
    }
    let p = path.resolve(__dirname, '../imgs/user', ctx.session.imgDir, result[0].imgUrl)
    fs.unlinkSync(p)

    console.error('没做图片个数限制')
    for(let img of imgs) {
      await imgsModel.updateImg(idImg, {
        imgUrl: img.filename
      })
    }

    ctx.status = 200
    ctx.body = {
      msg: '图片更改成功'
    }
  })
}

const router = new Router({
  prefix: '/album'
})

router.post('/create', check.login, create)
router.post('/img', check.login, addImg)
router.delete('/', check.login, deleteAlbum)
router.delete('/img', check.login, deleteImg)
router.get('/all',check.authen, getAlbums)
router.put('/img', check.login, updateImg)


module.exports = router

