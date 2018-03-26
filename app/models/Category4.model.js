var mongoose = require('mongoose');

var Category4TopicsTypeSchema = mongoose.Schema({
    UserId:{ type : String, required : true},
    TopicName: { type : String , unique : true, required : true },
    TopicDescription:{ type : String},
    TopicImage:String,
    Date: Date
    }, 
    { timestamps: true }
);

var Category4TopicPostTypeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    TopicId: { type : String , required : true },
    PostType: { type : String , required : true },
    PostDate: { type : String , required : true },
    PostText:{ type : String},
    PostLink:{ type : String},
    PostLinkInfo:{ type : Object},
    PostDocumnet:{ type : Object},
    Shared:{ type : String},
    ShareUserName:{ type : String},
    ShareUserId:{ type : String},
    SharePostId:{ type : String},
    PostImage: Array,
    PostVideo: Array,
    ActiveStates: String
    }, 
    { timestamps: true }
);


var varCategory4TopicsType = mongoose.model('Category4TopicsType', Category4TopicsTypeSchema, 'Category4Topics');

var varCategory4TopicPostType = mongoose.model('Category4TopicPostType', Category4TopicPostTypeSchema, 'Category4TopicPost');

module.exports = {
    Category4TopicsType : varCategory4TopicsType,
    Category4TopicPost : varCategory4TopicPostType
};