module.exports = function(app) {

    var QuestionsPost = require('../controllers/QuestionsPost.controller.js');


    app.post('/API/QuestionsPost/Submit', QuestionsPost.Submit);

    app.get('/API/QuestionsPost/GetPostList/:UserId/:Limit', QuestionsPost.GetPostList);

}