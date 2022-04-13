const userRouter = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

userRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltround = 10
    const passwordHash =  await bcryptjs.hash(password, saltround)
    
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response, next) =>{
    const users = await User.find({})
    response.json(users)
})

module.exports = userRouter