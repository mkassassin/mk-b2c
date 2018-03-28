module.exports = function(app) {

    var controller = require('../controllers/Category4Topics.controller.js');

    app.post('/API/Category4Topics/Category4CreateTopic', controller.Ctegory4TopicCreate);

    app.get('/API/Category4Topics/Category4TopicNameValidate/:name', controller.Category4TopicNameValidate);

    app.get('/API/Category4Topics/AllCategory4Topics', controller.AllCategory4Topics);

    app.post('/API/Category4Topics/Category4TopicPostSubmit', controller.Category4TopicPostSubmit);

    app.get('/API/Category4Topics/Category4TopicPostList/:TopicId/:PostType/:UserId/:Limit', controller.Category4TopicPostList);

    app.post('/API/Category4Topics/Category4TopicPostUpdate', controller.Category4TopicPostUpdate);

};