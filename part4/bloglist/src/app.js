const config = require('../utils/config')
const logger = require('../utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('../controller/blogs')


const mongoose = require('mongoose')
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(result => logger.info('connected to MongoDB'))
    .catch(error => logger.error(error.message))


app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app