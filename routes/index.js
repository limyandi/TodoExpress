import express from 'express'
import initTodo from './todo'

const router = express.Router()
initTodo(router)

export default router