const checkLogin = (ctx) => {
  if(needLogin(ctx.url)) {
    if(ctx.session && ctx.session.user) {

    }
  }
}

module.exports = {
  checkLogin
}