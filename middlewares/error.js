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
  app.use(errorHandle)
  app.on('error', (err, ctx) => {
    console.error('error', err, ctx)
  })
}

