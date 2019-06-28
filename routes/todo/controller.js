import db from '../../db/db'
import Validator from './validation'
import {
    convertToInt
} from '../../utility'
import models from '../../models'

export default class TodoController {
    static getAll(req, res) {
        models.Todo.findAll().then(todos => {
            return res.status(200).send({
                success: true,
                message: 'todos retrieved succesfully',
                todos
            })
        })
    }

    static get(req, res) {
        // convert id to int with base 10 (decimal)
        // req.params contain all parameters values (in this case "id")
        const id = convertToInt(req.params.id)

        models.Todo.findByPk(id).then(todo => {
            if (todo) {
                return res.status(200).send({
                    success: true,
                    message: 'todo retrieved successfully',
                    todo,
                })
            }

            return res.status(404).send({
                success: false,
                message: `todo with id ${id} does not exist`,
            })
        })
    }

    static add(req, res) {

        Validator.validate(req.body).then(() => {
            models.Todo.findOne({
                where: {
                    description: req.body.description
                }


            }).then((todoFound) => {
                //if this todo exist already in database.
                if (todoFound) {
                    return res.status(403).send({
                        success: true,
                        message: 'A todo with that title exist already'
                    })
                }

                const todo = {
                    description: req.body.description
                }
                models.Todo.create(todo).then((todo) => {
                    res.status(201).send({
                        success: true,
                        message: 'succesfully added todo',
                        todo
                    })
                })
            })

        }).catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message)
            res.status(400).send(errorMessage)
        })


    }

    static delete(req, res) {
        const id = convertToInt(req.params.id)

        models.Todo.destroy({
            where: {
                id: id
            }
        }).then((todo) => {
            if (todo) {
                return res.status(200).send({
                    success: true,
                    message: 'succesfully deleted'
                })
            }

            return res.status(404).send({
                success: false,
                message: `todo with id ${id} does not exist`
            })
        })
    }

    static update(req, res) {
        const id = convertToInt(req.params.id)

        Validator.validate(req.body).then(() => {
            models.Todo.findByPk(id).then((todo) => {
                if (todo) {
                    todo.update({
                        description: req.body.description || todo.description
                    })
                    return res.status(200).send({
                        success: true,
                        message: 'succesfully updated todo',
                        todo
                    })
                }

                return res.status(404).send({
                    success: false,
                    message: `No todo note with id: ${id} found`
                })
            })

        }).catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message)
            res.status(400).send(errorMessage)
        })


    }


}
