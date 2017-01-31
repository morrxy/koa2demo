'use strict'

const csrf = new (require('koa-csrf').default)()
const compose = require('koa-compose')

module.exports = compose([
  async (ctx, next) => {
    const reqBody = ctx.request.body
    reqBody.fields && reqBody.fields._csrf && (reqBody._csrf = reqBody.fields._csrf)
    await next()
  }, csrf
])