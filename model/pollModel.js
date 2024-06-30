const mongoose = require('mongoose')

const pollSchema = mongoose.Schema({
    title:{
        type : String
    },

    description :{
        type:String
    },

    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'alumniModel', 
       
    },

    votecount:{
        type:Number,
        default:0
    }

})

const pollModel = mongoose.model('pollModel' , pollSchema)

module.exports = pollModel