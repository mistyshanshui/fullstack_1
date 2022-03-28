const { request } = require('express')
const { response } = require('express')
const express = require('express')
const app = express()

const morgan = require('morgan')

app.use(express.json())
app.use(morgan((token, request, response)=>{
    return [
        token.method(request, response), 
        token.url(request, response), 
        token.status(request, response), 
        token.res(request, response, 'content-length', '-'),
        token['response-time'](request, response), ' ms',
        JSON.stringify(request.body)
    ].join(' ')
}))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    response.send(`phone book has info for ${persons.length} people <br/> ${Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (person.number == null || person.name == null) {
        response.status(400).send(`{error : 'person must have name and number}`)
    }
    else if (persons.find(p => p.name === person.name)) {
        response.status(400).send(`{error: 'name must be unique'}`)
    }
    else {
        person.id = Math.floor(Math.random() * 100000000)
        persons = persons.concat(person)
        response.send(person)
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)