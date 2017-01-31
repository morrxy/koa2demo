'use strict'

const debug = require('debug')('errorHandler')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    console.log('f2 e:', e)
    await ctx.render('error', {
        status: e.status || 500,
        message: e.message || 'server error'
      }
    )
  }
}



