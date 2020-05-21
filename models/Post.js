const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    name : {
     type:String  
    },
    description : {
        type:String,
        required:true
    },
    likes : [
      {
        user: 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
      } 
    ],
    postDate : {
        type:Date,
        default:Date.now
    },
    avatar : {
        type:String
    },
    comments : [
        {
            user : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            },
            text : {
                type:String,
                required:true
            },
            name : {
                type:String
            },
            avatar : {
                type:String
            },
            date : {
                type:Date,
                default:Date.now
            }
        }
    ]

})

module.exports = Post = mongoose.model('Post',PostSchema)