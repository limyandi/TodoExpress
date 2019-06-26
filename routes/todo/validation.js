import Joi from 'joi'

export default class Validation {
    static validate(request) {
        const todoSchema = Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required()
        })

        return Joi.validate(request, todoSchema)
    }
}