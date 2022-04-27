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


blogRouter.post('/', async (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({ error: 'invalid user' })
    }
    const blog = new Blog(request.body)
    blog.user = request.user
    blog
        .save()
        .then(savedBlog => response.status(201).json(savedBlog))
        .catch(error => next(error))
})

blogRouter.delete('/', async (request, response) => {
    await Blog.deleteMany({})
    response.status(200).json({ info: "all blogs deleted" })
})

blogRouter.delete('/:id', async (request, response, next) => {
    logger.info('in delete :', request.params.id)
    if (!request.user) {
        return response.status(401).json({ error: 'user in request is missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id) // how do you know the structure of the request?

    if (!blog) {
        return response.status(401).json({ error: 'requested blog doesn\'t exit' })
    }
    if (blog.user.toString() == request.user.toString()) {
        Blog
            .deleteOne({ _id: request.params.id })
            .then(result => response.status(204).json({ info: 'blog deleted' }))
            .catch(error => next(error))
    }
    else{
        response.status(401).json({error:'unauthorized user'})
    }
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