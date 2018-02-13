const checkLogin = (ctx) => {
  // 失效的情况没加
    if(ctx.session.isNew ) {
      return false
    }else {
      return true
    }
}

module.exports = {
  checkLogin
}