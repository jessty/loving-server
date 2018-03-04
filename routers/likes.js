const Router = require('koa-router')
const likeMdl = require('../lib/likesModel')
const check = require('../util/check')

async function toggleLike(ctx, next) {
  let {idLiked, likeType, likeTime} = ctx.request.body
  let {idUser} = ctx.session

  await likeMdl.toggleLike({
    idLiking:idUser,
    idLiked,
    likeType,
    likeTime
  })

  ctx.status = 200
  ctx.body = {
    msg:'like toggle successfully' 
  }
}

const router = new Router()

router.post('/mood/like', check.login, toggleLike)
router.post('/user/like', check.login, toggleLike)

module.exports = router