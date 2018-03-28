module.exports = function(app) {

    var HighlightsPost = require('../controllers/HighlightsPost.controller.js');


    app.post('/API/HighlightsPost/Submit', HighlightsPost.Submit);

    app.post('/API/HighlightsPost/AndroidSubmit', HighlightsPost.AndroidSubmit);

    app.post('/API/HighlightsPost/Update', HighlightsPost.Update);

    app.post('/API/HighlightsPost/AndroidUpdate', HighlightsPost.AndroidUpdate);

    app.post('/API/HighlightsPost/SharePost', HighlightsPost.SharePost);

    app.post('/API/HighlightsPost/FacebookSharePost', HighlightsPost.FacebookSharePost);

    app.get('/API/HighlightsPost/GetPostList/:UserId/:Limit', HighlightsPost.GetPostList);

    app.get('/API/HighlightsPost/ViewPost/:UserId/:PostId', HighlightsPost.ViewPost);

    app.get('/API/HighlightsPost/ViewSharePost/:PostId', HighlightsPost.ViewSharePost);

    app.post('/API/HighlightsPost/Category4TopicPostShare', HighlightsPost.Category4TopicPostShare);

    

};
