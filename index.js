const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const MAX = 1000

app.use(express.json())
app.use(cors())
//app.use(express.static('build'))

morgan.token('data', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    {
      "name": "Arto Hellas",
      "number": "1232",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
        "name": "Ana",
        "number": "555-5555",
        "id": 5
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person) 
    }
    else {
        res.status(404).send(`<div>Person not found</div>`)
    }
})

app.get('/info', (req, res) => {
    const numPeople = persons.length
    const now = new Date()

    const renderDiv = `
        <div>Phonebook has info for ${numPeople} people</div>
        <br />
        <div>${now}</div>
    `
    res.send(renderDiv)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(MAX));
}

const checkName = (name) => {
    return persons.map(person => person.name === name).length
}

const createPersonObj = (name, number) => {
    return {
        name,
        number,
        id: generateId()
    }
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!(body.name && body.number)) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    else if (checkName(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = createPersonObj(body.name, body.number)

    persons.concat(person)
    res.json(person)
})


app.use(unknownEndpoint)

const PORT= process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
