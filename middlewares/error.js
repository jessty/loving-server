async function errorHandle(ctx, next) {
  try {
    await next()
  } catch (err) {
    let status = err.status || 500
    let msg = err.message || '服务器错误'
    let data = err.data || {}
    // code为0时，没有含义
    let code = err.code || 0

    ctx.status = status
    ctx.body = {
      code,
      msg,
      data
    }
    if(status == 500) {
      throw err
    }
  }
}

module.exports = function (app) {
  // app.use(errorHandle)
  app.on('error', (err, ctx) => {

    if(err.code === 'LIMIT_FILE_SIZE') {
      err.status = 400
      err.message = '文件大小超出限制'
      err.code = 0
    }
    
    let status = err.status || 500
    let msg = err.message || '服务器错误'
    let data = err.data || {}
    // code为0时，没有含义
    let code = err.code || 0

    ctx.status = status
    ctx.body = {
      code,
      msg,
      data
    }
    console.error('返回400时，没有将body的信息返回')
    if(status == 500) {
      console.error('error', err, err.stack, ctx)
    }
    
  })
}

