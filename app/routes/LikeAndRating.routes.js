module.exports = function(app) {

    var Countroll = require('../controllers/LikeAndRating.controller.js');


    app.post('/API/LikeAndRating/HighlightsLikeAdd', Countroll.HighlightsLikeAdd);

    app.post('/API/LikeAndRating/CommentsLikeAdd', Countroll.CommentsLikeAdd);

    app.get('/API/LikeAndRating/HighlightsUnLike/:LikeId', Countroll.HighlightsUnLike);

    app.get('/API/LikeAndRating/CommentsUnLike/:LikeId', Countroll.CommentsUnLike);

    app.post('/API/LikeAndRating/QuestionsRatingAdd', Countroll.QuestionsRatingAdd);

    app.post('/API/LikeAndRating/AnswerRatingAdd', Countroll.AnswerRatingAdd);

    app.post('/API/LikeAndRating/Category4TopicPostRatingAdd', Countroll.Category4TopicPostRatingAdd);

    app.post('/API/LikeAndRating/Category4TopicCommentsLikeAdd', Countroll.Category4TopicCommentsLikeAdd);

    app.get('/API/LikeAndRating/Category4TopicCommentsUnLike/:LikeId', Countroll.Category4TopicCommentsUnLike);

};
