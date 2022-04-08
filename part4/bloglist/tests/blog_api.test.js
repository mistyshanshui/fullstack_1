const logger = require('../utils/logger')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('../tests/test_helpers')

const app = require('../src/app')
const help = require('nodemon/lib/help')

const api = supertest(app)

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    }
]


beforeEach(async () => {
    await Blog.deleteMany({})
    let objects = initialBlogs.map(b => new Blog(b))
    let promises = objects.map(o => o.save())
    await Promise.all(promises)
})

test('get notes', async () => {
    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
})


test('post notes', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }
    const postResp = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(postResp.body.likes).toBe(0)

    const getResp = await api.get('/api/blogs')
    expect(getResp.body).toHaveLength(initialBlogs.length + 1)
})

test('identifier property named id', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('post note without title or url should receive 400 user error', async () => {
    const blog1 = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    await api
        .post('/api/blogs')
        .send(blog1)
        .expect(400)

    const blog2 = {
        title: "Type wars",
        author: "Robert C. Martin",
    }

    await api
        .post('/api/blogs')
        .send(blog2)
        .expect(400)
})

test('delete one blog from the database should succeed', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete.length).toBe(4)

    const titles = blogsAfterDelete.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
})
