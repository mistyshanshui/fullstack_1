const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    logger.info('inside blogsInDB', blogs)
    const blogsjson = blogs.map(blog => blog.toJSON())
    logger.info('inside blogsInDB', blogsjson)
    return blogsjson
}

const getAnUserId = async () => {
    const u = await User.findOne({})
    return u._id.toString()
}

module.exports = { blogsInDb, getAnUserId }