require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

const MAX = 1000

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people.map(person => person.toJSON()))
    })
})

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(people => {
        const numPeople = people.length
        const now = new Date()

        const renderDiv = `
            <div> Phonebook has info for ${numPeople} people</div>
            <br />
            <div>${now}</div>
        `
        res.send(renderDiv)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id).then(person => {
        console.log("Deleted", person.name, person.number, "from phonebook")
        res.status(204).end()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})


app.use(unknownEndpoint)

const PORT= process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
