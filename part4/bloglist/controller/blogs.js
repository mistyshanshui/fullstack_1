const blogRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
    logger.info('inside router get')
    const blogs = await Blog.find({})//.populate('user')
    response.json(blogs)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        console.log(authorization.substring(7))
        return authorization.substring(7)
    }
    return null
}

blogRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'Invalide user name or password' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = User.findById(decodedToken.id)

    blog.user = user._id
    blog
        .save()
        .then(savedBlog => response.status(201).json(savedBlog))
        .catch(error => next(error))
})

blogRouter.delete('/', async (request, response) => {
    await Blog.deleteMany({})
    response.status(400).json({ info: "all blogs deleted" })
})

blogRouter.delete('/:id', (request, response, next) => {
    logger.info('in delete :', request.params.id)
    Blog
        .findByIdAndRemove(request.params.id) // how do you know the structure of the request?
        .then(result => {
            logger.info(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogRouter.put('/:id', (request, response, next) => {
    const newBlog = { ...request.body }
    Blog
        .findByIdAndUpdate(request.params.id, newBlog, { new: true })
        .then(result => {
            logger.info(result)
            response.status(200).json(result)
        })
        .catch(error => next(error))
})

module.exports = blogRouter