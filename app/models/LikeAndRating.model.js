var mongoose = require('mongoose');

var HighlightsLikeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var CommentLikeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    CommentId: { type : String , required : true },
    CommentUserId: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var QuestionsRatingSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    Rating: { type : Number , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var AnswerRatingSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    AnswerId: { type : String , required : true },
    AnswerUserId: { type : String , required : true },
    Rating: { type : Number , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var Category4TopicPostRatingSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    Rating: { type : Number , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var Category4TopicCommentLikeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    CommentId: { type : String , required : true },
    CommentUserId: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var varHighlightsLike = mongoose.model('HighlightsLike', HighlightsLikeSchema, 'HighlightsLike');
var varCommentLike = mongoose.model('CommentLike', CommentLikeSchema, 'CommentLike');

var varQuestionsRating = mongoose.model('QuestionsRating', QuestionsRatingSchema, 'QuestionsRating');
var varAnswerRating= mongoose.model('AnswerRating', AnswerRatingSchema, 'AnswerRating');

var varCategory4TopicPostRating = mongoose.model('Category4TopicPostRating', Category4TopicPostRatingSchema, 'Category4TopicPostRating');

var varCategory4TopicCommentLike = mongoose.model('Category4TopicCommentLike', Category4TopicCommentLikeSchema, 'Category4TopicCommentLike');


module.exports = {
    HighlightsLike : varHighlightsLike,
    CommentLike : varCommentLike,
    QuestionsRating : varQuestionsRating,
    AnswerRating : varAnswerRating,
    Category4TopicPostRating : varCategory4TopicPostRating,
    Category4TopicCommentLike : varCategory4TopicCommentLike
};