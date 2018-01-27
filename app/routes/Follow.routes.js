module.exports = function(app) {

    var controller = require('../controllers/Follow.controller.js');


    app.post('/API/Follow/FollowUser', controller.FollowUser);

    app.delete('/API/Follow/UnFollowUser/:FollowUserDBid', controller.UnFollowUser);

    app.post('/API/Follow/FollowTopic', controller.FollowTopic);

    app.delete('/API/Follow/UnFollowTopic/:FollowTopicDBid', controller.UnFollowTopic);

    app.get('/API/Follow/FollowingUsers/:UserId', controller.FollowingUsers);

    app.get('/API/Follow/UnFollowingUsers/:UserId', controller.UnFollowingUsers);
    
    // app.get('/API/Follow/FollowingTopics/:userId', controller.FollowingTopics);

    // app.get('/API/Follow/UnFollowingTopics/:userId', controller.UnFollowingTopics);
}