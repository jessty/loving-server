const fs = require('fs')
const path = require('path')
const Upload = require('./upload')
const RandomStr = require('./randomStr')

module.exports = function(opt) {

  let {
    fields,
    limits,
    cover=false,
    dir
  } = opt

  let uploadOpt = {
    destination:(req, file, cb) => {

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
      let p = path.join(dir,`${filename}${ext}`)

      fs.access(p, (err) => {

        if(cover || err) {
          cb(null, `${filename}${ext}`)
        } else {
          let err = new Error('无法保存图片，可能用户图片总数过多')
          err.status = 500;
          cb(err,'')
        }
      })
    },
    limits,
    fields
  }

  return Upload(uploadOpt)
}