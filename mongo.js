const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = MONGODB_URI
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
    mongoose.connection.close()
    })
}

else if (process.argv.length == 4) {
    console.log("Please provide a name and a phone number to save into phonebook")
    process.exit(1)
}

else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(response => {
        console.log('Added', response.name, 'number', response.number, 'to phonebook')
        mongoose.connection.close()
    })
}