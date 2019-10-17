require('./models/db')
const Joi = require('joi')
const express = require('express');
const bodyparser = require('body-parser')
const studentController = require('./controllers/studentController')
const schoolController = require('./controllers/schoolController')
let app = express();
const teacherController = require('./controllers/teacherController');
const config = require('config');
const teacher_authentification = require('./controllers/teacher_authentification')


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.json());
 
if(!config.get("privateKey")){
    console.log("Private key not defined");
    process.exit(1);
}



app.use('/api/students',  studentController);
app.use('/api/schools',  schoolController);
app.use('/api/teachers', teacherController);
app.use('/api/auth', teacher_authentification);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));