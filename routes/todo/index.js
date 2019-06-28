import controller from './controller'

export default (app) => {
    app.get('/todos', controller.getAll)
    app.get('/todos/:id', controller.get)
    app.post('/todos', controller.add)
    app.put('/todos/:id', controller.update)
    app.delete('/todos/:id', controller.delete)
}
