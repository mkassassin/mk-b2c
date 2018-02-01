var mongoose = require('mongoose');

var HighlightsCommentSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    CommentText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var QuestionsAnwerSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    AnswerText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var varHighlightsComment = mongoose.model('HighlightsComment', HighlightsCommentSchema, 'HighlightsComment');

var varQuestionsAnwer = mongoose.model('QuestionsAnwer', QuestionsAnwerSchema, 'QuestionsAnwer');

module.exports = {
    HighlightsComment : varHighlightsComment,
    QuestionsAnwer : varQuestionsAnwer
};