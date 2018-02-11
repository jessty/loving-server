const Koa = require('koa')
const path = require('path')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const MysqlStore = require('koa-mysql-session')
const router = require('koa-router')
const staticCache = require('koa-static-cache')
const config = require('./config/default')
const route = require('./routers/route')

const app = new Koa()

let dbConfig = config.database

const sessionMysqlConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  host: dbConfig.host
}

app.use(session({
  key: 'USER_SID',
  httpOnly: false,
  renew: true
  // store: new MysqlStore(sessionMysqlConfig)
}, app))

app.use(staticCache(
  path.join(__dirname, './public'),
  {
    dynamic: true
  },
  {
    maxAge: 365*24*60*60
  }
))
app.use(staticCache(
  path.join(__dirname, './public/images'),
  {
    dynamic: true
  },
  {
    maxAge: 365*24*60*60
  }
))

app.use(bodyparser())

route(app)

app.listen(config.port)

console.log(`listening on port ${config.port}`)