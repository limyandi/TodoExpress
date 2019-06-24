import express from 'express'
import bodyParser from 'body-parser'
import db from './db/db'

// util function:
function convertToInt(value, base = 10) {
    return parseInt(value, base)
}

function sendErrorCode(responseHandler, errorMessage, code=400) {
    return responseHandler.status(code).send({
        success: false,
        message: errorMessage
    })
}

function checkTitle(responseHandler, title) {
    const errorMessage = 'Please specify title!'
    if (!title) {
        sendErrorCode(responseHandler, errorMessage)
    }
}

function checkDescription(responseHandler, description) {
    const errorMessage = 'Please specify description!'
    if (!description) {
        sendErrorCode(responseHandler, errorMessage)
    }
}

// end of util function

const app = express()

// parse incoming requests data (global).
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

const version = 0.1

// Endpoint to get all the todos
app.get(`/api/v${version}/todos`, (req, res) => {
    if (res.statusCode == 200) {
        res.send({
            success: true,
            message: 'todos retrieved successfully',
            todos: db
        })
    }
})

// Endpoint to add todo
app.post(`/api/v${version}/add_todo`, (req, res) => {
    checkTitle(res, req.body.title)
    checkDescription(res, req.body.description)

    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    db.push(todo)
    return res.status(201).send({
        success: true,
        message: 'succesfully added todo',
        todo
    })
})

// get single todo item.
app.get(`/api/v${version}/todo/:id`, (req, res) => {
    // convert id to int with base 10 (decimal)
    // req.params contain all parameters values (in this case "id")
    const id = convertToInt(req.params.id)

    db.map(todo => {
        if (todo.id == id) {
            return res.status(200).send({
                success: true,
                message: 'todo retrieved successfully',
                todo,
            })
        }
    })
    return res.status(404).send({
        success: false,
        message: `todo with id ${id} does not exist`,
    })
})

// delete single todo item
app.delete(`/api/v${version}/todo/:id`, (req, res) => {
    const id = convertToInt(req.params.id)

    // index refer to the index of database that we are trying to delete.
    db.map((todo, index) => {
        if (todo.id == id) {
            // delete this todo
            db.splice(index, 1)
            return res.status(200).send({
                success: true,
                message: 'succesfully deleted'
            })
        }
    })

    return res.status(404).send({
        success: false,
        message: `todo with id ${id} does not exist`
    })
})

// update todo item
app.put(`/api/v${version}/todo/:id`, (req, res) => {
    const id = convertToInt(req.params.id)

    let todoFound
    let foundIndex

    db.map((todo, index) => {
        if (todo.id == id) {
            todoFound = todo
            foundIndex = index
        }
    })

    if (!todoFound) {
        return res.status(404).send({
            success: false,
            message: `No todo note with id: ${id} found`
        })
    }

    checkTitle(res, req.body.title)
    checkDescription(res, req.body.description)

    const updatedTodo = {
        id: todoFound.id,
        // handle compatibility if user input empty title
        title: req.body.title || todoFound.title,
        description: req.body.description || todoFound.description
    }

    db.splice(foundIndex, 1, updatedTodo)
    return res.status(200).send({
        success: true,
        message: 'succesfully updated todo',
        todo: updatedTodo
    })
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
