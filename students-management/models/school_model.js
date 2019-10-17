const mongoose = require('mongoose');
const Joi = require('joi')
let schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name of the school is required"
    },
    email: {
        type: String,
        required: "Description of the school is important"
    },
    sector: {
        type: String,
        required: "Name of the school is required"
    },
    district: {
        type: String,
        required: "Description of the school is important"
    }
 
});
const School = mongoose.model('School', schoolSchema);

function validateSchool(school){
    const validationSchema = {
        name: Joi.string().max(255).min(3).required(),
        email: Joi.string().max(255).min(3).required().email(),
        sector: Joi.string().max(255).min(3).required(),
        district: Joi.string().max(255).min(3).required()
    }
    return Joi.validate(school, validationSchema)
}
module.exports.School = School
module.exports.validate = validateSchool