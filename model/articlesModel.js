const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
    title : {
        type : String
    },

    body:{
        type:String
    },

    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "alumniModel"
    },

    date:{
        type : Date,
        default : Date.now
    }
})

const articleModel = mongoose.model('articleModel' , articleSchema)
module.exports = articleModel

