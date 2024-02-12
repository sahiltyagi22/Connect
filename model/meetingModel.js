const mongoose = require('mongoose')


const meetingSchema = mongoose.Schema({

    title : {
        type:String
    },

    date :{
        type :String
    },

    time : {
        type :String
    },

    host : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'alumniModel', 
        required: true
    },

    link:{
        type : String
    }
})

const meetingModel = mongoose.model('meetingModel' , meetingSchema)

module.exports = meetingModel