const express = require('express')
const app = express()

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

const PORT=3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
