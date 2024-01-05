const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('dist'))
app.use(requestLogger)

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

app.get('/info', (req, res) => {
  const time = new Date()
  Person.find({})
    .then(persons => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${time}</p>`
      )
    })
    .catch(error => next(error))

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
      if (person) {
      res.json(person)}
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
  
app.post('/api/persons', (req, res) => {
    const body = req.body

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

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
    })

const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
      console.error(error.message)
    
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
      }
    
      next(error)
    }
    
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})