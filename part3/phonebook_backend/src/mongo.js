require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({}).then(persons => {
        persons.forEach(p => {
            console.log(p)
        })
        mongoose.connection.close()
    })
}
else {
    if (process.argv.length < 5) {
        console.log("please provide person's name and phone number")
        mongoose.connection.close()
    }
    else {
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })

        person.save().then(result => {
            console.log(`added ${result.name} ${result.number} to phonebook`)
            mongoose.connection.close()
        })
    }
}

