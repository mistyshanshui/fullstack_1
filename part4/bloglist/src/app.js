const config = require('../utils/config')
const logger = require('../utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('../controller/blogs')
const userRouter = require('../controller/users')
const loginRouter = require("../controller/login")

const mongoose = require('mongoose')
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(result => logger.info('connected to MongoDB'))
    .catch(error => logger.error(error.message))

app.use(cors())
app.use(express.json())

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        console.log(authorization.substring(7))
        request.token = authorization.substring(7)
    }
    next()
}
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

const unknownHandler = (request, response) => {
    logger.error("unknown handler")
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