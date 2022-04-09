const mongoose = require('mongoose')
const logger = require('../utils/logger')

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    likes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
    }
})
const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog