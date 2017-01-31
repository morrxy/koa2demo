'use strict'

const router = require('koa-router')()
const body = require('koa-body')()
const csrf = require('../middleware/csrf')
const flash = require('../middleware/flash')
const defaultVal = require('../config/default')

const users = [{username: 'hj', password: '1'}, {username: 'xy', password: '2'}]

router.get('/', csrf, flash,
  async (ctx, next) => {
    await ctx.render('session', {
      user: ctx.session.user,
      flash: ctx.flash.get(),
      csrf: ctx.csrf
    })
  }
)

router.post('/', flash,
  async (ctx, next) => {
    try {await next()}
    catch (e) {
      ctx.flash.set({ message: e.message || defaultVal.errorMessage})
      ctx.redirect('/session')
    }
  },

  body, csrf,

  async (ctx, next) => {
    ctx.checkBody('username').notEmpty('用户名不能空')
    ctx.checkBody('password').notEmpty('密码不能空')
    if (ctx.errors) {
      ctx.flash.set(arrToObj(ctx.errors))
      ctx.redirect('/session')
    } else {
      await next()
    }
  },

  async (ctx, next) => {
    const user = await findUser(ctx.request.body.username, ctx.request.body.password)

    if (user) {
      ctx.session.user = user
      ctx.redirect('/')
    } else {
      ctx.flash.set({message: '用户或密码错误'})
      ctx.redirect('/session')
    }
  }
)

router.get('/destroy', async (ctx, next) => {
  ctx.session = null
  ctx.redirect('/')
})

async function findUser(username, password) {
  const filtered = users.filter(item => item.username === username && item.password === password)
  return filtered[0]
}

function arrToObj(arr) {
  return arr.reduce((item, acc) => {
    return Object.assign(acc, item)
  }, {})
}

module.exports = router