const express = require('express');
const bodyParser = require('body-parser');
const Joi =  require('joi');
const router = express.Router();
const mongoose = require('mongoose')
const {School, validate} = require('../models/school_model');
const Student = mongoose.model('Student')
const admin = require('../middlewares/admin')
const jwt_verify = require('../middlewares/jwt_verify')
const {Teacher} = require('../models/teacher_model')

//Add a new school
router.post('/',  async (req,res) =>{
    const {error} = validate(req.body)
    if(error) return res.send(error.details[0].message).status(400)

    let school  = await School.findOne({email:req.body.email})
    if(school) return res.send('School already registered').status(400)
    school  =  new School({
        name: req.body.name,
        email: req.body.email,
        sector: req.body.sector,
        district:  req.body.district
   });

    await school.save()
    return res.send(school).status(201)
});

//Get all categories
router.get('/', (req, res) => {
    School.find().then(schools => res.send(schools).status(201))
                    .catch(err => res.send(err).status(404))
})

//Get a category by id
router.get('/:id', (req, res) => {
    School.findById(req.params.id).then(schools => res.send(schools))
                                    .catch(err => res.send(err).status(404));
});

//Update a Category
router.put('/',   (req, res) => {
    School.findByIdAndUpdate({ _id : req.body._id}, req.body, {new : true})
                        .then(updatedSchool => res.send(updatedSchool).status(201))
                        .catch(err => res.send(err).status(404))
})

//Delete a Category
router.delete('/:id',   async (req, res) => {
    let check = await checkStudentOfSchool(req.params.id);
    if(check){
            try{
                let deletable = await School.findByIdAndRemove(req.params.id)
                res.send(deletable).status(201)
            }
            catch (err){
                return res.send(err).status(400)
            }     
    }else{
          try{
                return res.send("School Can't be Deleted It has some Student to it").status(400)
          }
          catch (err){
                  return res.send(err).status(400)
          }   
    }
    
})

async  function checkStudentOfSchool(id){
    let count  = await Student.findOne({schoolId : id})
    if(count)
        return false;
    else
      return true;
}

//Api for statistics
function getStatistics(){
            School.find().countDocuments()
                    .then(schoolCount =>console.log({ TotalSchools : schoolCount}))
                    .catch(err => console.error(err));
            Student.find().countDocuments()
                    .then(studentCount => console.log({ TotalStudents : studentCount}))
            Teacher.find().countDocuments()
                    .then(teacherCount => console.log({ TotalTeachers : teacherCount}))
            Teacher.find({isAdmin: true}).countDocuments()
                    .then(admins => console.log({ TotalAdmins : admins}))
            Teacher.find({isAdmin: false}).countDocuments()
                    .then(noneAdmins => console.log({ TotalNoneAdmins : noneAdmins}))
}
getStatistics();
function displayCount(sectorName){
    School.find({sector: sectorName}).countDocuments()
       .then(count =>console.log({SchoolsInSector: count }))
       .catch(err => console.error(err));
    }
displayCount("Mukamira");
  module.exports = router;


