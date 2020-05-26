const peopleRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')


peopleRouter.get('/', (req, res) => {
    Person.find({}).then(people => {
        res.json(people.map(person => person.toJSON()))
    })
})

//peopleRouter.get('/favicon.ico', (req, res) => res.status(204))

peopleRouter.get('/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

/*peopleRouter.get('/info', (req, res, next) => {
    Person.find({})
        .then(people => {
            const numPeople = people.length
            const now = new Date()

            const renderDiv = `
                <div> Phonebook has info for ${numPeople} people</div>
                <br />
                <div>${now}</div>
            `
            res.send(renderDiv)
        })
        .catch(error => next(error))
})*/

peopleRouter.delete('/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(person => {
            if (person) {
                logger.info('Deleted', person.name, person.number, 'from phonebook')
            }
            res.status(204).end()
        })
        .catch(error => next(error))
})

peopleRouter.put('/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    const opts = {
        runValidators: true,
        new: true,
        context: 'query'
    }
    Person.findByIdAndUpdate(req.params.id, person, opts)
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson.toJSON())
            } else {
                res.status(204).end()
            }

        })
        .catch(error => next(error))
})

peopleRouter.post('/', (req, res, next) => {
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

    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

module.exports = peopleRouter
