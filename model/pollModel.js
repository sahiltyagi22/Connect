const mongoose = require('mongoose')

const pollSchema = mongoose.Schema({
    title:{
        type : String
    },

    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'alumniModel', 
       
    },

    votecount:{
        type:Number
    }

})

const pollModel = mongoose.model('pollModel' , pollSchema)

module.exports = pollModel