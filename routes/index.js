'use strict'

const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {user: ctx.session.user})
})

module.exports = router