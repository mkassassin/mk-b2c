var mongoose = require('mongoose');

var QuestionsPostTypeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostTopicId: { type : String , required : true },
    PostTopicName: { type : String , required : true },
    PostDate: { type : String , required : true },
    PostText:{ type : String},
    PostLink:{ type : String},
    PostLinkInfo:{ type : Object},
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


var varQuestionsPostType = mongoose.model('QuestionsPostType', QuestionsPostTypeSchema, 'QuestionsPost');


module.exports = {
    QuestionsPostType : varQuestionsPostType
};