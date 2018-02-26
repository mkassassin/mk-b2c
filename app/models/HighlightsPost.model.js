var mongoose = require('mongoose');

var HighlightsPostTypeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostType: { type : String , required : true },
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


var varHighlightsPostType = mongoose.model('HighlightsPostType', HighlightsPostTypeSchema, 'HighlightsPost');


module.exports = {
    HighlightsPostType : varHighlightsPostType
};