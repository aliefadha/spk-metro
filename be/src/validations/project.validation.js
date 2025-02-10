const Joi = require('joi')

module.exports = {
    createDivision : Joi.object({
        divisionName : Joi.string().required(),
    }), 

    createProject : Joi.object({
        
    })
}