
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('please provide password')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://mistyshanshui:${password}@cluster0.sja7y.mongodb.net/testphonebook?retryWrites=true&w=majority`;
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
            console.log(`added ${name} ${number} to phonebook`)
            mongoose.connection.close()
        })
    }
}

