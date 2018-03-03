'use strict'

const Koa = require('koa')
const path = require('path')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const MysqlStore = require('koa-mysql-session')
const router = require('koa-router')
const staticCache = require('koa-static-cache')
const cors = require('koa2-cors')
const config = require('./config/default')
const route = require('./routers/route')
const {initDB} = require('./lib/mysql')
const errorHandle = require('./middlewares/error')

// 初始化数据库
initDB()

const app = new Koa()

// app.use(cors())
app.use(errorHandle())

app.keys = ['forever','loving']

let db = config.database
const sessionMysqlConfig = {
  host: db.host,
  port: db.port,
  database: db.database,
  user: db.user,
  password: db.password
}

app.use(session({
  // maxAge: 1*60*60*1000,
  // httpOnly: false,
  // path: '/',
  // domain: 'http://localhost:3000/'
  // renew: true
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