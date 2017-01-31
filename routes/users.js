'use strict'

const router = require('koa-router')()
const debug = require('debug')('user')
const uniformData = require('../middleware/uniform-data')
const userDB = [{ id: 1, name: "Hu" }, { id: 2, name: "Jun" }]

module.exports = router

router.get('/profile', uniformData, checkUser,
  async (ctx, next) => {
  ctx.body = 'your profile'
})

router.get('/:id', uniformData, checkId,
  async (ctx, next) => {
    const found = await findUser(parseInt(ctx.params.id))
    found && (ctx.body = found)
    await next()
  }
)

router.post('/:id', uniformData, checkId,
  async function editUser(ctx, next) {
    ctx.body = 'user was edited'
  }
)

async function findUser(id) {
  return new Promise((resolve, reject) => {
    const filtered = userDB.filter(item => item.id === id)
    resolve(filtered[0] ? filtered[0] : null)
  })
}

async function checkId(ctx, next) {
  ctx.checkParams('id').toInt('id必须是数字')
  if (ctx.errors) {
    const err = new Error('id必须是数字')
    err.status = 400
    throw err
  } else {
    await next()
  }
}

async function checkUser(ctx, next) {
  if (ctx.session && ctx.session.user) {
    await next()
  } else {
    const err = new Error('must login')
    err.status = 401
    throw err
  }
}