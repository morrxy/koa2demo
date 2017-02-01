'use strict'

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const session = require('koa-session-minimal')
// const redisStore = require('koa-redis')
const faviocn = require('koa-favicon')
const convert = require('koa-convert')
const debug = require('debug')('app:app')

convert(require('koa-validate'))(app)

app.use(faviocn(__dirname + '/public/favicon.ico'))
app.keys = ['session secret']

//session存储用redis
// app.use(session({ store: redisStore() }))

//session存储用内存
app.use(session())

app.use(require('koa-static')(__dirname + '/public'))

app.use(require('./middleware/error-handler'))

//template
require('nunjucks').configure('./views')
app.use(views(__dirname + '/views', {
  extension: 'njk',
  map: {njk: 'nunjucks'}
}))

//routes
router.use('/', require('./routes/index').routes())
router.use('/users', require('./routes/users').routes())
router.use('/session', require('./routes/session').routes())
router.use('/upload', require('./routes/upload').routes())
app.use(router.routes()).use(router.allowedMethods())

module.exports = app
