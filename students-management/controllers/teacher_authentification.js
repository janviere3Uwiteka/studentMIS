const _ = require('lodash');
const express = require('express');
let router = express.Router();
const {Teacher} = require('../models/teacher_model')
const jwt = require('jsonwebtoken');
const config = require('config')
const Joi = require('joi')
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    //Validate teacher input
    const {error} = validateContent(req.body)
    if(error) return res.send(error.details[0].message).status(400)

    //Check email existence
    let teacher = await Teacher.findOne({email: req.body.email});
    if(!teacher) return res.send('Invalid email or password').status(400)

    const validPassword = await bcrypt.compare(req.body.password, teacher.password);
    if(!validPassword) return res.send('invalid email or password').status(400)
    return res.send(teacher.generateAuthenticationToken());
})

function validateContent(teacher){
    const schema = {
        email: Joi.string().max(255).min(3).required().email(),
        password:Joi.string().max(255).min(3).required()
    }
    return Joi.validate(teacher, schema)
}
module.exports = router;