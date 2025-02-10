const Joi = require('joi')

module.exports = {
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    }),
    createUser: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('SUPERADMIN', 'MEMBER', 'PM'),
    },
    updateUser : {
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('SUPERADMIN', 'MEMBER', 'PM').optional(),
        divisionId : Joi.string().optional()
    }

}