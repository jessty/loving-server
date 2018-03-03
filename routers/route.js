const log = require('./log')

const identify = require('./identify')

const inform = require('./inform')

const album = require('./album')

const mood = require('./mood')
const userSetting = require('./userSetting')

const route = function (app) {
  app.use(log.routes())
  app.use(identify.routes())
  app.use(inform.routes())
  app.use(album.routes())
  app.use(mood.routes())
  app.use(userSetting.routes())

  app.use(async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log(err)
    }
  })
}

module.exports = route