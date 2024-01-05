const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String,
    minlength: 3,
    required: true },
  number: { type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (value) {
        return /^(?:\d{2}-\d{7}|\d{3}-\d{8})$/.test(value)
      },
      message: 'Not a valid phone number'
    } },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)