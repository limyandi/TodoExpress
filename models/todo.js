'use strict'

module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {})
    Todo.associate = (models) => {
        // associations can be defined here
        // Todo.hasMany(models.TodoItem, {
        //     foreignKey: 'todoId'
        // })
    }
    return Todo
}
