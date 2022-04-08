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

app.use(blogRouter)

const unknownHandler = (request, response) => {
    response.status(400).send({ error: 'unknown handler' })
}

app.use(unknownHandler)

const errorHandler = (error, request, response, next) => {
    if (error.name == "ValidationError") {
        response.status(400).send({ error: error.message })
    }
}

app.use(errorHandler)

module.exports = app