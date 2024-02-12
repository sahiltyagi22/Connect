const mongoose = require('mongoose')

const alumniSchema = mongoose.Schema({

    email : {
        type :String
    },

    name :{
        type :String
    },
    
    password : {
        type :String

    },

    designation : {
        type :String
    } ,

    company : {
        type :String
    },

    role:{
        type:String,
        default :'alumni'
    },

    school:{
        type:String
    },

    profile:{
        type:String
    },

    meetings:[{
       type: mongoose.Schema.Types.ObjectId, 
        ref: 'meetingModel', 
        // required: true
    }],

    articles :[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'articleModel', 
    }]
       
    
})

const alumniModel = mongoose.model('alumniModel' , alumniSchema)
module.exports = alumniModel