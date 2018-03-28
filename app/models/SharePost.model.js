var mongoose = require('mongoose');

var SharePostSchema = mongoose.Schema({
    ShareType: { type : String , required : true },
    UserId: { type : String , required : true },
    NewPostId: { type : String },
    PostType: { type : String, required : true },
    PostId: { type : String, required : true},
    PostUserId: { type : String, required : true},
    SharePostFrom: String ,
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);




var varSharePost = mongoose.model('SharePost', SharePostSchema, 'SharePost');


module.exports = {
    SharePost : varSharePost
};