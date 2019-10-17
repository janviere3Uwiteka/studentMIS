const _ = require('lodash');
const express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const School = mongoose.model('School');
const {Teacher, validate} = require('../models/teacher_model')
const hashPassword = require('../utils/hash')
const admin = require('../middlewares/admin')
const jwt_verify = require('../middlewares/jwt_verify')
//Get all teachers 
router.get('/' , async (req, res) => {
    const teachers = await Teacher.find();
    return res.send(teachers).status(201)
});

router.get('/:id' , async (req, res) => {
    const teachers = await Teacher.find({_id: req.params.id});
    return res.send(teachers).status(201)
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.send(error.details[0].message).status(400)

    let teacher = await Teacher.findOne({email: req.body.email})
    if(teacher) return res.send('You already have an account').status(400)

    try{
       let check = await checkSchoolExistence(req.body.schoolId);
      if(check){
        teacher = new Teacher(_.pick(req.body, ['name', 'email', 'password', 'schoolId', 'isAdmin']));
        const hashedPassword = await hashPassword(teacher.password)
        teacher.password = hashedPassword;
        await teacher.save();
        return res.send(_.pick(teacher, ["_id", 'name', 'email', 'isAdmin', 'schoolId'])).status(201)
      }
      else{           
              return res.send("School Doesn't Exist").status(400)
      }  
}
catch(err){
return res.send(err).status(400)
}

});

router.put('/', [jwt_verify, admin], async (req, res) => {
  try{
    let check = await checkSchoolExistence(req.body.schoolId);
   if(check){
    let teacher = await  Teacher.findByIdAndUpdate({ _id : req.body._id}, req.body, {new : true})
    return res.send(teacher).status(201)
   }
   else{           
           return res.send("School Doesn't Exist").status(400)
   }  
}
catch(err){
return res.send(err).status(400)
}


})

async function checkSchoolExistence(id){
    let count  = await School.findOne({_id:id})
        if(count)
            return true;
        else
          return false;
    }
router.delete('/:id',  [jwt_verify, admin], async (req, res) => {
    await Teacher.findByIdAndRemove(req.params.id);
    return res.send("Teacher Deleted!!!").status(201)
})
module.exports = router;