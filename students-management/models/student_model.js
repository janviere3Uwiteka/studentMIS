const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name of the Student is required'
    },
    email: {
        type: String,
        required: "Email of the Student is required"
    },
    gender: {
        type: String,
        required: "Gender of the Student is required"
    },
    age: {
        type: Number,
        required: "Age is required"
    },
    schoolId: {
        type: String,
        required: "School is required"
    }
});
const Student = mongoose.model('Student', studentSchema);

function validateStudent(student){
    const validationSchema = {
        name: Joi.string().max(255).min(3).required(),
        gender: Joi.string().max(255).min(3).required(),
        email: Joi.string().max(255).min(3).required(),
        age: Joi.number().required(),
        schoolId: Joi.objectId()
    }
    return Joi.validate(student, validationSchema)
}
module.exports.Student = Student
module.exports.validation = validateStudent