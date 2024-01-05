const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.nckrlyv.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length==5) {
  const newname = process.argv[3]
  const newnumber = process.argv[4]

  const person = new Person({
    name: newname,
    number: newnumber,
  })

  person.save().then(result => {
    console.log(`added ${newname} ${newnumber} to phonebook`)
    mongoose.connection.close()
  })}
else {
  console.log('phonebook:')
Person.find({}).then(result => {
  result.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})}