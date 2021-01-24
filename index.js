const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
const Person = require('./models/person')

const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

// morgan.token('body', (req, res) => {
//   return req.method === "POST" ? JSON.stringify(req.body) : null
// })

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World</h1>')
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(400).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // if (!body.name || !body.number) {
  //   return res.status(400).json({
  //     error: 'Content Missing'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      savedPerson.toJSON()
    })
    .catch(err => {
      next(err)
      console.log(`${err.response.data}`)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updated => {
      res.json(updated)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    )
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})