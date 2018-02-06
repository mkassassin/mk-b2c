module.exports = function(app) {

    var controller = require('../controllers/Search.controller.js');

    app.get('/API/Search/Users/:UserId', controller.Users);
    app.get('/API/Search/FollowUsers/:UserId', controller.FollowUsers);
    app.get('/API/Search/UnfollowUsers/:UserId', controller.UnfollowUsers);
    app.get('/API/Search/OurfollowUsers/:UserId', controller.OurfollowUsers);

    app.get('/API/Search/Topics/:UserId', controller.Topics);
    app.get('/API/Search/FollowTopics/:UserId', controller.FollowTopics);
    app.get('/API/Search/UnFollowTopics/:UserId', controller.UnFollowTopics);

    app.get('/API/Search/Coins/:UserId', controller.Coins);

    app.get('/API/Search/Highlights/:UserId', controller.Highlights);
    app.get('/API/Search/OurHighlights/:UserId', controller.OurHighlights);

    app.get('/API/Search/Questions/:UserId', controller.Questions);
    app.get('/API/Search/OurQuestions/:UserId', controller.OurQuestions);

    app.get('/API/Search/Impressions/:UserId', controller.Impressions);
    app.get('/API/Search/OurImpressions/:UserId', controller.OurImpressions);

    app.get('/API/Search/Answers/:UserId', controller.Answers);
    app.get('/API/Search/OurAnswers/:UserId', controller.OurAnswers);

    app.get('/API/Search/Comments/:UserId', controller.Comments);
    app.get('/API/Search/OurComments/:UserId', controller.OurComments);

}