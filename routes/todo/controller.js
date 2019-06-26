import db from '../../db/db'
import {
    checkDescription,
    checkTitle,
    convertToInt
} from '../../utility'

export default class TodoController {
    static getAll(req, res) {
        return res.status(200).send({
            success: true,
            message: 'todos retrieved succesfully',
            todos: db
        })
    }

    static get(req, res) {
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
    }

    static add(req, res) {
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
    }

    static delete(req, res) {
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
    }

    static update(req, res) {
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
    }


}
