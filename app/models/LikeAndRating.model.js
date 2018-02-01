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


var varHighlightsLike = mongoose.model('HighlightsLike', HighlightsLikeSchema, 'HighlightsLike');

var varQuestionsRating = mongoose.model('QuestionsRating', QuestionsRatingSchema, 'QuestionsRating');

module.exports = {
    HighlightsLike : varHighlightsLike,
    QuestionsRating : varQuestionsRating
};