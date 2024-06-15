const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique : true
    },

    password :{
        type :String
    },

    name :{
        type :String
    }, 

    rollno : {
        type : String
    },

    school :{
        type :String
    },

    year :{
        type : Number
    },

    role:{
        type:String,
        default : 'student'
    }
})

const studentModel = mongoose.model('studentModel' , studentSchema)

module.exports = studentModel