# koa2 demo

## 需要

node.js 7.0以上版本

`npm install`

把`env`目录下的`.env.development.example`改名成`env.development`

## 运行

`npm run dev`

## demo内容

- 路由
- 模版
- 静态文件
- session
- flash 见 /session，/upload
- 文件上传
- 请求验证 见 /session，/upload，/users/:id
- csrf(Content-Type: application/x-www-form-urlencoded) 见 POST /session
- csrf(Content-Type: multipart/form-data) 见 POST /upload
- api(无限制的 /users/1)
- api(限制的 /users/profile)