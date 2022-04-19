const blogRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    logger.info('inside router get')
    const blogs = await Blog.find({})//.populate('user')
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    const u = await User.findOne({})

    blog.user = u._id.toString()

    blog
        .save()
        .then(savedBlog => response.status(201).json(savedBlog))
        .catch(error => next(error))
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