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

var QuestionsAnswerSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    AnswerText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var Category4TopicCommentSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    CommentText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var varHighlightsComment = mongoose.model('HighlightsComment', HighlightsCommentSchema, 'HighlightsComment');

var varQuestionsAnswer = mongoose.model('QuestionsAnswer', QuestionsAnswerSchema, 'QuestionsAnswer');

var varCategory4TopicComment = mongoose.model('Category4TopicComment', Category4TopicCommentSchema, 'Category4TopicComment');

module.exports = {
    HighlightsComment : varHighlightsComment,
    QuestionsAnswer : varQuestionsAnswer,
    Category4TopicComment : varCategory4TopicComment
};