const multer = require('koa-multer')
const path = require('path')

/*opt={destination,filename,fields,limits}
 *
 */
const upload = function (opt) {
  let {
    destination,
    filename = (req, file, cb) => {
      cb(null, file.originalname)
    },
    fields = [],
    limits = {}
  } = opt;

  let storage = multer.diskStorage({
    destination,
    filename
  })
  let up = multer({storage, limits})
  console.log('upload', up)
  return up.fields(fields)
}

module.exports = upload
