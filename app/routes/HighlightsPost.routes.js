module.exports = function(app) {

    var HighlightsPost = require('../controllers/HighlightsPost.controller.js');


    app.post('/API/HighlightsPost/Submit', HighlightsPost.Submit);

    app.get('/API/HighlightsPost/GetPostList/:UserId/:Limit', HighlightsPost.GetPostList);

    app.get('/API/HighlightsPost/ViewPost/:UserId/:PostId', HighlightsPost.ViewPost);

}