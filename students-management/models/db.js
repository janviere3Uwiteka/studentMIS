const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/student-management-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})  .then(() => console.log('Connection Successful....'))
    .catch(err =>console.log('failed to connect to mongodb',err));
 
//Connecting Node and MongoDB
require('./school_model');
require('./student_model');