var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    ResponseUserId: { type : String , required : true },
    FollowUserId: { type : String },
    FollowTopicId: { type : String },
    HighlightPostId: { type : String },
    HighlightLikeId: { type : String },
    HighlightCommentId: { type : String },
    HighlightShareId: { type : String },
    QuestionPostId: { type : String },
    QuestionRatingId: { type : String },
    QuestionShareId: { type : String },
    QuestionAnswerId: { type : String },
    ImpressionPostId: { type : String },
    ImpressionFolllowId: { type : String },
    NotificationType: Number  
    }, 
    { timestamps: true }
);


var varNotification = mongoose.model('Notification', NotificationSchema, 'Notification');


module.exports = {
    Notification : varNotification
};

//Notification Type
    // 0 == Follow User
    // 1 == UnFollow User
    // 2 == New Topic
    // 3 == Follow Topic
    // 4 == UnFollow Topic
    // 5 == New Highlight Post
    // 6 == Highlight Post Like
    // 7 == Highlight Post Comment
    // 8 == Highlight Post Share
    // 9== New Question Post
    // 10 == Question Post Rating
    // 11 == Question Post Answer
    // 12 == Question Post Share
    // 13 == New Impression Post
    // 14 == Impression Follow