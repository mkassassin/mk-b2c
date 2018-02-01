module.exports = function(app) {

    var Countroll = require('../controllers/LikeAndRating.controller.js');


    app.post('/API/LikeAndRating/HighlightsLikeAdd', Countroll.HighlightsLikeAdd);

    app.post('/API/LikeAndRating/QuestionsRatingAdd', Countroll.QuestionsRatingAdd);


}