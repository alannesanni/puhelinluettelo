const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(express.json())

app.use(morgan('tiny', {
    skip: (req) => req.method === 'POST',
  }))

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :req-body', {
      skip: (req) => req.method !== 'POST',
    }))

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
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
      }
    ]

app.get('/info', (req, res) => {
  const time = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
    `)

})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})
  
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ 
        error: 'name must be unique' 
        })
    }

    if (!body.name) {
        return res.status(400).json({ 
            error: 'name missing' 
        })
        }

    if (!body.number) {
        return res.status(400).json({ 
            error: 'number missing' 
        })
        }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.random() * 10000,
    }

    persons = persons.concat(person)
    res.json(person)
    })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})