require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./module/person')

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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(results => {
        console.log(results)
        response.json(results)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(results => {
        response.send(`phone book has info for ${results.length} people <br/> ${Date()}`)
    })
})

app.get('/', (request, response) => {
    Person.find({}).then(results => {
        response.send(`phone book has info for ${results.length} people <br/> ${Date()}`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })
    newPerson.save().then(result => {
        response.send(result)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = { ...request.body }
    Person.findByIdAndUpdate(person.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.send(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)