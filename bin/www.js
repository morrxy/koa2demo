'use strict'

require('dotenv').config()
const app = require('../app')

app.listen(process.env.port || 3000)
