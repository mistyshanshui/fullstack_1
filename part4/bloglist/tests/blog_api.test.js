const logger = require('../utils/logger')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('../tests/test_helpers')

const app = require('../src/app')
const { default: mongoose } = require('mongoose')

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
    logger.info('inside before each')
    await Blog.deleteMany({})
    const userId = await helper.getAnUserId()
    let objects = initialBlogs.map(b => new Blog({ ...b, user: userId }))
    let promises = objects.map(o => o.save())
    await Promise.all(promises)
})

test('get blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)

    logger.info('get blogs..................', response.body)

    expect(response.body).toHaveLength(initialBlogs.length)
})


test('post blogs', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }
    const postResp = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiI2MjY4Y2Q0YjgxNDM3MmViNGM1ZjhkNjgiLCJpYXQiOjE2NTEwMzU1MTB9.P7pGqFByDurNZOoFOYDWaudDbZQO7n81GujRyz8t_Jg' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(postResp.body.likes).toBe(0)
    expect(postResp.body).toHaveProperty('user')

    const getResp = await api.get('/api/blogs')
    logger.info('after posting blog', getResp.body)
    expect(getResp.body).toHaveLength(initialBlogs.length + 1)
})

test('identifier property named id', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('post blog without token should fail with error 401', async ()=>{
    const blog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)

})

test('post note without title or url should receive 400 user error', async () => {
    const blog1 = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }

    await api
        .post('/api/blogs')
        .send(blog1)
        .set({ Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiI2MjY4Y2Q0YjgxNDM3MmViNGM1ZjhkNjgiLCJpYXQiOjE2NTEwMzU1MTB9.P7pGqFByDurNZOoFOYDWaudDbZQO7n81GujRyz8t_Jg' })
        .expect(400)

    const blog2 = {
        title: "Type wars",
        author: "Robert C. Martin",
    }

    await api
        .post('/api/blogs')
        .send(blog2)
        .set({ Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiI2MjY4Y2Q0YjgxNDM3MmViNGM1ZjhkNjgiLCJpYXQiOjE2NTEwMzU1MTB9.P7pGqFByDurNZOoFOYDWaudDbZQO7n81GujRyz8t_Jg' })
        .expect(400)
})

test('delete one blog from the database should succeed', async () => {
    const blogs = await helper.blogsInDb()
  //  logger.info('blog to delete======', blogs)
    const blogToDelete = blogs[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiI2MjY4Y2Q0YjgxNDM3MmViNGM1ZjhkNjgiLCJpYXQiOjE2NTEwMzU1MTB9.P7pGqFByDurNZOoFOYDWaudDbZQO7n81GujRyz8t_Jg' })
        .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete.length).toBe(4)

    const titles = blogsAfterDelete.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
})

test('should be able to update a blog', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]
    const newLikes = blogToUpdate.likes + 1
    const newBlog = { ...blogToUpdate, likes: newLikes }
    logger.info('update : ', blogToUpdate.id, newBlog)

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter[0].likes).toBe(newLikes)
})

afterAll(() => {
    mongoose.connection.close()
})