module.exports = function(app) {

    var QuestionsPost = require('../controllers/QuestionsPost.controller.js');


    app.post('/API/QuestionsPost/Submit', QuestionsPost.Submit);

    app.post('/API/QuestionsPost/Update', QuestionsPost.Update);

    app.get('/API/QuestionsPost/GetPostList/:UserId/:Limit', QuestionsPost.GetPostList);

    app.get('/API/QuestionsPost/ViewPost/:UserId/:PostId', QuestionsPost.ViewPost);

    app.get('/API/QuestionsPost/GetTopicPostList/:UserId/:Limit/:TopicId', QuestionsPost.GetTopicPostList);

}