const router = require('koa-router')()
const Upload = require('../util/upload')
const {checkLogin} = require('../util/check')
const RandomStr = require('../util/randomStr')
const path = require('path')
const fs = require('fs')
const userModel = require('../lib/userModel')
const imgsModel = require('../lib/imgsModel')
const albumMdl = require('../lib/albumModel')

async function create(ctx, next){
  let body = ctx.request.body

  let {insertId} = await albumMdl.addAlbum(body)

  ctx.status = 200
  ctx.body = {
    msg: '添加相册成功',
    data: {
      idAlbum: insertId
    }
  }

}
function saveImgs(ctx, cover=false) {
  let dir = ''
  let uploadOpt = {
    destination:(req, file, cb) => {
      dir = path.resolve(__dirname, `../imgs/user/${ctx.session.imgDir}`)

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
      let filename = RandomStr(8, false)
      let p = path.resolve(dir,`${filename}${ext}`)
      // let p = path.resolve(dir,'BhjqwljO.jpg')
      fs.access(p, (err) => {

        if(cover || err) {
          cb(null, `${filename}${ext}`)
          // cb(null, 'BhjqwljO.jpg')
        } else {
          ctx.throw(500, '无法保存图片，可能用户图片总数过多')
        }
      })
    },
    limits: {
      fileSize: 1000000
    },
    fields: [
      { name: 'imgs',maxCount:5},
    ]
  }

  return Upload(uploadOpt)
}
async function addImg(ctx, next){

  await saveImgs(ctx)(ctx, async ()=> {
    let {imgs} = ctx.req.files
    let {idAlbum} = ctx.req.body
    console.error('没做图片个数限制')
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

async function afterAddImg(ctx, next) {
  // let {imgs} = ctx.req.files
  //   let {idAlbum} = ctx.req.body
  //   console.error('没做图片个数限制')
  //   let imgs = []
  //   for(let img of imgs) {
  //     let {insertId} = await imgsModel.addImg({
  //       idBelong: idAlbum,
  //       imgUrl: img.filename,
  //       type: 1
  //     })
  //     imgs.push(insertId)
  //   }
  //   imgs = imgs.map((img) => {
  //     return {idImg: img}
  //   })
  //   ctx.status = 200
  //   ctx.body = {
  //     msg: '图片添加成功',
  //     data: imgs
  //   }
}

async function deleteImg(ctx, next) {
  let {idImg, imgUrl} = ctx.request.body
  let p = path.resolve(__dirname, '../imgs/user', ctx.session.imgDir, imgUrl)

  fs.unlink(p, (err) => {
    if(err) {
      ctx.throw(500, '文件删除失败')
    }
  })

  await imgsModel.deleteImgById(idImg)

  ctx.status = 200
  ctx.body = {
    msg:'图片删除成功'
  }
}
async function deleteAlbum(ctx, next) {
  let {idAlbum} = ctx.request.body, {imgDir} = ctx.session
  await albumMdl.deleteAlbum(idAlbum)
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
  await saveImgs(ctx, true)(ctx, async () => {
    let {imgs} = ctx.req.files
    let {idimg} = ctx.req.body
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



router.post('/album/create', create)
router.post('/album/addImg', addImg, afterAddImg)
router.delete('/album/', deleteAlbum)
router.delete('/album/img', deleteImg)
router.get('/album', getAlbums)
router.put('/album/img', updateImg)

module.exports = router