const mongoose = require('mongoose')
const logger = require('../utils/logger')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        logger.info('inside schema toJson id transform')
        delete ret._id
        delete ret.__v
    }
})
const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog