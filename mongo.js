const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log(
        "Please provide the password, and optionally - a person's name, and their number as arguments: node mongo.js <password> *<name of person> *<number>"
    )
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.1kw9j.mongodb.net/phonebook-entries?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
const entrySchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String
})

// Create a model
const Entry = mongoose.model("entry", entrySchema)
if (process.argv.length === 3) {
    // On succesfull find on the document entry, return everything then close the connection
    Entry.find({}).then((persons) => {
        console.log("phonebook: ")
        persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length > 4) {
    const personName = process.argv[3]
    const personNumber = process.argv[4]
    const personArgs = new Entry({name: personName, number: personNumber})

    personArgs.save().then((result) => {
        console.log(`added ${personName} ${personNumber} to phonebook`)
        mongoose.connection.close()
    })
}
