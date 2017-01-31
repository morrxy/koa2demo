'use strict'

const compose = require('koa-compose')

const errorResponse = async (ctx, next) => {
  try { await  next() }
  catch (err) {
    ctx.body = {
      status: err.status || 500,
      message: err.message || 'server error',
      data: err.stack ? err.stack.split('\n') : null
    }
  }
}

const jsonResponse = async (ctx, next) => {
  await next()

  ctx.body = Object.assign({
    status: 200,
    message: 'ok'
  }, ctx.body ? {data: ctx.body} : {data: null})
}

module.exports = compose([errorResponse, jsonResponse]);