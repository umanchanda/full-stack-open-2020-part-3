const mongoose = require('mongoose')

const url = `mongodb+srv://uman230:${process.argv[2]}@test.jtw7m.mongodb.net/persons?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(() => {
        console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
    const Person = mongoose.model('Person', personSchema)
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    console.log('Incorrect parameters')
    process.exit(1)
}