const signup = require('./signup')

const route = function (app) {
  app.use(signup.routes())

  app.use(async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log(err)
    }
  })
}

module.exports = route