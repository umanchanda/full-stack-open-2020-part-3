const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-532532",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-523221",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6426326",
    "id": 4
  },
  {
    "name": "Uday Manchanda",
    "number": "908-723-7481",
    "id": 5
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 500)
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.send('<p>Cannot find given person</p>')
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Content Missing'
    })
  }

  const nameExists = persons.find(p => p.name === body.name)

  if (nameExists) {
    return res.status(400).json({
      error: 'Name already exists'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})