const log = require('./log')

const authen = require('./authenticate')

const inform = require('./inform')

const album = require('./album')

const route = function (app) {
  app.use(log.routes())
  app.use(authen.routes())
  app.use(inform.routes())
  app.use(album.routes())

  app.use(async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log(err)
    }
  })
}

module.exports = route