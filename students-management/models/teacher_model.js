const mongoose = require('mongoose');
const Joi = require('joi')
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
Joi.objectId = require('joi-objectid')(Joi)
var teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required for the teacher"
    },
    email: {
        type: String,
        required: "Email is required for the teacher"
    },
    schoolId: {
        type: String,
        required: "SchoolId is necessary"
    },
    password: {
        type: String,
        required: "Password is necessary"
    },
    isAdmin: {
        type: Boolean,     
    }
})
teacherSchema.methods.generateAuthenticationToken = function(){
    const token = jwt.sign({_id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin, schoolId: this.schoolId}, config.get('privateKey'))
    return token;
}

const Teacher = mongoose.model('Teacher', teacherSchema);

function validateteacher(teacher){
    const schema = {
        name:Joi.string().max(255).min(3).required(),
        email: Joi.string().max(255).min(3).required().email(),
        schoolId: Joi.objectId(),
        password:  Joi.string().max(255).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(teacher, schema)
}
module.exports.Teacher = Teacher;
module.exports.validate = validateteacher;

