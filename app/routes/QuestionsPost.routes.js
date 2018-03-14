module.exports = function(app) {

    var QuestionsPost = require('../controllers/QuestionsPost.controller.js');


    app.post('/API/QuestionsPost/Submit', QuestionsPost.Submit);

    app.post('/API/QuestionsPost/AndroidSubmit', QuestionsPost.AndroidSubmit);

    app.post('/API/QuestionsPost/Update', QuestionsPost.Update);

    app.post('/API/QuestionsPost/SharePost', QuestionsPost.SharePost);

    app.post('/API/QuestionsPost/FacebookSharePost', QuestionsPost.FacebookSharePost);

    app.get('/API/QuestionsPost/GetPostList/:UserId/:Limit', QuestionsPost.GetPostList);

    app.get('/API/QuestionsPost/ViewPost/:UserId/:PostId', QuestionsPost.ViewPost);

    app.get('/API/QuestionsPost/ViewSharePost/:PostId', QuestionsPost.ViewSharePost);

    app.get('/API/QuestionsPost/GetTopicPostList/:UserId/:Limit/:TopicId', QuestionsPost.GetTopicPostList);

};
