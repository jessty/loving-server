const Router = require('koa-router')
const informModel = require('../lib/informModel')
const idenModel = require('../lib/idenModel')
const likeMdl = require('../lib/likesModel')
const check = require('../util/check')

const Tables = [
  'basic',
  'prefer',
  'details',
  'family',
  'hobby',
  'loveStatus',
  'maritalExpec',
  
]
const TablesName = [
  '基本信息',
  '心中的你',
  '详细信息',
  '家庭信息',
  '兴趣爱好',
  '恋爱状况',
  '婚姻期望'
]
async function search(ctx, next) {
  let body = ctx.request.body
  let {rank=0, idUser} = ctx.session;
  let r = await idenModel.checkIdenRec(idUser,3)
  let result;
  if(r.length === 1)  {
    result = await informModel.search(idUser, rank, 1, body);
  }else {
    result = await informModel.search(idUser, rank, 0, body);
  }
  let likeStates = await Promise.all(result.map(item => likeMdl.getLikeState(idUser, item.idUser, 1)))

  result.forEach((item, i) => {
    result[i].idLike = likeStates[i][0].idLike
    result[i].likeNum = likeStates[i][0].likeNum || 0
  });



  ctx.status = 200
  ctx.body = {
    msg: '查询成功',
    data: result
  }
}

async function getAllInform(ctx, next) {
  let {idUser} = ctx.query
  let list = Tables.map((table) => {
    return informModel.getInform(table, idUser)
  })
  let results = await Promise.all(list)

  let data = results.map((r, i) => {
    if(r.length === 1) {
      delete r[0].idUser
      return {
        name: TablesName[i],
        values: r[0]
      }
    }else {
      ctx.status = 400
      ctx.body = {
        msg: `用户不存在`
      }
    }
  })

  ctx.status = 200
  ctx.body = {
    code: 2,
    msg: '查询信息成功',
    data
  }
  
}

async function modifyInform(ctx, next) {
  let {table} = ctx.params;
  if(Tables.indexOf(table) === -1) {
    ctx.throw(400, 'url所指向的服务不存在')
  }

  let body = ctx.request.body
  let {idUser} = ctx.session
  let result = await informModel.updateInform(table, idUser, body)

  ctx.status = 200
  ctx.body = {
    msg: '信息更新成功'
  }
}

const router = new Router({
  prefix: '/inform'
})

router.post('/search', check.login, search)
router.get('/all', check.authen, getAllInform)
router.post('/:table', check.login, modifyInform)

module.exports = router