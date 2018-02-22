module.exports = function(app) {

    var Countroll = require('../controllers/LikeAndRating.controller.js');


    app.post('/API/LikeAndRating/HighlightsLikeAdd', Countroll.HighlightsLikeAdd);

<<<<<<< HEAD
    app.post('/API/LikeAndRating/CommentsLikeAdd', Countroll.CommentsLikeAdd);
=======
    pp.post('/API/LikeAndRating/CommentsLikeAdd', Countroll.CommentsLikeAdd);
>>>>>>> d895031baad09dedd1c7ff2977d80c3ed65d8407

    app.get('/API/LikeAndRating/HighlightsUnLike/:LikeId', Countroll.HighlightsUnLike);

    app.get('/API/LikeAndRating/CommentsUnLike/:LikeId', Countroll.CommentsUnLike);

    app.post('/API/LikeAndRating/QuestionsRatingAdd', Countroll.QuestionsRatingAdd);

    app.post('/API/LikeAndRating/AnswerRatingAdd', Countroll.AnswerRatingAdd);

};
