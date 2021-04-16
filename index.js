const http = require("http")
const cors = require("cors")
const express = require("express")
const nodemon = require("nodemon")
const morgan = require("morgan")
const {request} = require("express")
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
const PORT = 3001
//
let persons = [
    {id: 1, name: "Arto Hellas", number: "040-123456"},
    {id: 2, name: "Ada Lovelace", number: "39-44-545435"},
    {id: 3, name: "Dan Abramov", number: "12-43-5454"},
    {id: 4, name: "Mary Poppendieck", number: "415-666-5436"},
    {id: 5, name: "Soulja boy", number: "678-999-8212"}
]

// Returns a hardcoded list of phonebook entries from the address http://localhost:3001/api/persons:
app.get("/api/persons", (request, response) => {
    response.json(persons)
})

// Info page for /info
app.get("/info", (request, response) => {
    const currDate = new Date()
    const info = `<div> <p> Phonebook has info for ${persons.length} people </p> <p>  ${currDate} </p> </div>`
    response.send(info)
})

// Get a single phonebook entry
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((note) => note.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    // console.log("deleting: ", request.params.id)
    const id = Number(request.params.id)
    persons = persons.filter((person) => person.id != id)
    response.status(204).end()
})

const checkName = (name) => {
    const comparePersons = persons.find((person) => person.name === name)
    return comparePersons
}
app.post("/api/persons", (request, response) => {
    const newId = Math.floor(Math.random() * (1000 - 1 + 1) + 1)
    const person = request.body
    // First, check if they're there
    if (!person.name) {
        return response
            .status(400)
            .json({error: "name already exists in phonebook"})
    } else if (!person.number) {
        return response
            .status(400)
            .json({error: "number already exists in phonebook"})
    }
    // Then, check if the inputs are valid
    if (checkName(person.name)) {
        return response.status(400).json({error: "name must be unique"})
    }
    person.id = newId
    persons = persons.concat(person)
    response.json(person)
})

app.listen(PORT, () => console.log(`Running on Port ${PORT}`))
