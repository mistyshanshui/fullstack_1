require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((token, request, response) => {
    return [
        token.method(request, response),
        token.url(request, response),
        token.status(request, response),
        token.res(request, response, 'content-length', '-'),
        token['response-time'](request, response), ' ms',
        JSON.stringify(request.body)
    ].join(' ')
}))

const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB", error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(results => {
        console.log(results)
        response.json(results)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(results=>{
        response.send(`phone book has info for ${results.length} people <br/> ${Date()}`)
    })
})

app.get('/', (request, response) => {
    Person.find({}).then(results=>{
        response.send(`phone book has info for ${results.length} people <br/> ${Date()}`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })
    newPerson.save().then(result => {
        response.send(result)
    })
})

app.put('/api/persons/:id', (request, response) => {
    const person = { ...request.body }
    Person.findByIdAndUpdate(person.id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.send(updatedPerson)
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)