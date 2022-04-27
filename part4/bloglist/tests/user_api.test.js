const { default: mongoose } = require('mongoose')
//const logger = require('../utils/logger')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../src/app')
const bcryptjs = require('bcryptjs')

const api = supertest(app)

const initUsers = [
    {
        "username": "user1",
        "name": "blah",
        "password": "1234"
    },
    {
        "username": "biesan",
        "name": "name bdd",
        "password": "aaa"
    },
    {
        "username": "spring break",
        "name": "aa",
        "password": "ddd"
    }
]

beforeEach(async () => {
    console.log('in before each')
    await User.deleteMany({})
    for (let element of initUsers) {
        const { username, name, password } = element
        const passwordhash = await bcryptjs.hash(password, 10)
        const user = new User({ username, name, passwordhash })
        await user.save()
    }
    const users = await User.find({})
    console.log(users)
})

test('post a user', async () => {
    const newUser = {
        "username": "ddddd",
        "name": "kkkkk",
        "password": "123678"
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(response.body.name).toBe('kkkkk')
})

test('username and password has to be at least 3 characters long to post', async () => {
    const newUser = {
        "username": "dd",
        "name": "kkkkk",
        "password": "123678"
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

test('get all users', async () => {
    const response = await api
        .get('/api/users')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initUsers.length)
})

afterAll(() => {
    mongoose.connection.close()
})