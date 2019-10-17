const express = require('express');
const router = express.Router();
const _= require('lodash')
const mongoose = require('mongoose');
const School = mongoose.model('School');
const {Student, validation} =  require('../models/student_model');
const jwt_verify = require('../middlewares/jwt_verify')
const admin = require('../middlewares/admin')
//Add a new student to the db
router.post('/', [jwt_verify, admin] , async (req, res)=> {
    const {error} = validation(req.body)
    if(error) return res.send(error.details[0].message).status(400)
    let student  = await Student.findOne({email:req.body.email})
    if(student) return res.send('Student already registered').status(400)
    student = new Student();
    student.name = req.body.name;
    student.schoolId =  req.body.schoolId;
    student.age = req.body.age;
    student.gender = req.body.gender;
    student.email = req.body.email;
    if(req.teacher.schoolId == student.schoolId){
      try{
          let check = await checkSchoolExistence(req.body.schoolId);
          if(check){
              await  student.save()
              return res.send(student).status(201)
           }
         else{           
               return res.send("School Doesn't Exist").status(400)
           }  
        }
          catch(err){
              return res.send(err).status(400)
          }
    
        }else{
              res.send("You can't add a student who is not from the same school").status(403)
  }
});

//Get all students
router.get('/', (req, res)=>{
    Student.find()
                .then(students => res.send(students).status(201)) 
                .catch(err => res.send(err).status(404));
});

//Get a student by  id
router.get('/:id', (req, res) => {
  Student.findById(req.params.id)
                                    .then(student => res.send(student).status(201))
                                    .catch(err => res.send(err).status(404));
})

//Delete a products
router.delete('/:id',  [jwt_verify, admin], (req, res) => {
  Student.findByIdAndRemove(req.params.id).then(students => res.send(students).status(201)).catch(err => res.send(err).status(404))
});



//Update a school
router.put('/',  [jwt_verify, admin], async (req, res) => {

  if(req.teacher.schoolId == student.schoolId){
    try{
        let check = await checkSchoolExistence(req.body.schoolId);
        if(check){
          let updatedStudent = await Student.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true})
            return res.send(updatedStudent).status(201)
         }
       else{           
             return res.send("School Doesn't Exist").status(400)
         }  
      }
        catch(err){
            return res.send(err).status(400)
        }
  
      }else{
            res.send("You can't add a student who is not from the same school").status(403)
}
});

// get all students by schoolId
router.get('/bySchool/:schoolId', (req,res)=>{
   Student.find({schoolId: req.params.schoolId})
   .then(students => res.send(students))
   .catch(err => res.send(err).status(404));
});

router.get('/bySchool/:schoolId', (req,res)=>{
  Student.find({schoolId: req.params.schoolId})
  .then(students => res.send(students))
  .catch(err => res.send(err).status(404));
});




async function getFromSector(sectorName){
  let schoolFromSector = await School.find({sector: sectorName});
  try{
      let StudentsfromSectors = await Student.find({schoolId: schoolFromSector[0]._id}).countDocuments();
      console.log({StudentsFromSector : StudentsfromSectors})
  }
  catch (err){
    console.log({StudentsFromSector : 0})
  }
}


async function getFromDistrict(districtName){
  let i = 0;
  let NumberOfStudentsFromDistrict = 0;
  let schoolFromDistrict = await School.find({district: districtName});
    try{
        for(i = 0; i < schoolFromDistrict.length; i++){
          StudentsfromDistrict = await Student.find({schoolId: schoolFromDistrict[i]._id}).countDocuments();
          NumberOfStudentsFromDistrict += StudentsfromDistrict 
 	}
 	   console.log({StudentsFromDistrict : NumberOfStudentsFromDistrict})
      }
      catch (err){
          console.log({StudentsFromDistrict : 0})
      }
}


getFromDistrict('Nyabihu')
getFromSector('Mukamira')

  async function checkSchoolExistence(id){
    let count  = await School.findOne({_id:id})
      try{  if(count)
            return true;
        else
          return false;
    }
    catch{
          console.log("School Doesn't Exist")
    }
  }
    function countStudentsFromSchool(school){
      Student.find({schoolId: school}).countDocuments()
         .then(count =>console.log({StudentsInSchool: count }))
         .catch(err => console.error(err));
      }
  countStudentsFromSchool("5d94d0f1d4d3bd17477d853d");

module.exports = router;




