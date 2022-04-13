const { default: mongoose } = require('mongoose')
const logger = require('../utils/logger')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../src/app')
const { resource } = require('../src/app')

const api    = supertest(app)

initUsers = [
    {
        "username": "blah d",
        "name": "blah",
        "password": "1234"
    },
    {
        "username": "blah dblan",
        "name": "dd",
        "password": "456"
    },
    {
        "username": "blah cc",
        "name": "dd",
        "password": "789"
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let users = initUsers.map(u => new User(u))
    let promises = await users.map(u => u.save())
    await Promise.all(promises)
})

test('get all users', async () => {
    const response = await api
        .get('/api/users')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initUsers.length)
})

test('post a user', async()=>{
    const newUser = {
        "username" : "ddddd",
        "name": "kkkkk",
        "password":"123678"
    }
    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    expect(response.body.name).toBe('kkkkk')
})

afterAll(()=>{
    mongoose.connection.close()
})