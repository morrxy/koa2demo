'use strict'

const router = require('koa-router')()

const csrf = require('../middleware/csrf')
const csrfMulti = require('../middleware/csrf-multipart')
const flash = require('../middleware/flash')
const vals = require('../config/default')
const fs = require('fs')
const body = require('koa-body')({
  multipart: true,
  formidable: {
    uploadDir: './uploads',
    keepExtensions: true
  }
})

router.use(flash)

router.get('/', csrf,
  async (ctx, next) => {
    await ctx.render('upload', {
      user: ctx.session.user,
      flash: ctx.flash.get(),
      csrf: ctx.csrf
    })
  }
)

router.post('/',
  //异常处理:csrf
  async (ctx, next) => {
    try {await next()}
    catch (e) {
      removeFile(ctx)
      ctx.flash.set({ message: e.message || vals.errorMessage})
      ctx.redirect('/upload')
    }
  },

  body,

  //校验：csrf
  csrfMulti,

  //校验:表单字段和上传的文件
  async (ctx, next) => {
    ctx.checkBody('title').notEmpty('用户名不能空')
    ctx.checkFile('file').notEmpty('文件不能为空').size(1, 2*1024*1024, '文件不能大于2M')

    if (ctx.errors) {
      removeFile(ctx)

      const msgs = ctx.errors.reduce((item, acc) => {
        return Object.assign(acc, item)
      }, {})

      ctx.flash.set(msgs)
      ctx.redirect('/upload')
    } else {
      await next()
    }
  },

  //成功
  async (ctx, next) => {
    ctx.flash.set({
      message: `上传成功: ${JSON.stringify(ctx.request.body)}`
    })
    ctx.redirect('/upload')
  })

function delFileAsync(path ,cb){
  if(!path) {
    if(cb) cb();
    return;
  }

  fs.stat(path, (err, stats) => {
    if (err && err.code == 'ENOENT') {
      return
    }

    fs.unlink(path , function(e){
      if(e){
        console.error(e);
      }
      if(cb) cb(e);
    })
  })
}

function removeFile(ctx) {
  const body = ctx.request.body
  if (body.files && body.files.file && body.files.file.path) {
    delFileAsync(body.files.file.path)
  }
}

module.exports = router