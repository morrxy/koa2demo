'use strict'

const http = require('http')
const app = require('../app')
const debug = require('debug')('app:server');
const path = require('path')
const envPath = path.resolve(__dirname, `../env/.env.${process.env.NODE_ENV || 'development'}`)

require('dotenv').config({path: envPath})

const server = http.createServer(app.callback())
const port = process.env.port || require('../config/default').port
server.listen(port)

debug(port)
console.log(port)
