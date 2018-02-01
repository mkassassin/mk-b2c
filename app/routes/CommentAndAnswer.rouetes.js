module.exports = function(app) {

    var Countroll = require('../controllers/CommentAndAnswer.controller.js');


    app.post('/API/CommentAndAnswer/HighlightsCommentAdd', Countroll.HighlightsCommentAdd);

    app.get('/API/CommentAndAnswer/GetHighlightsComments/:PostId', Countroll.GetHighlightsComments);   

    app.post('/API/CommentAndAnswer/QuestionsAnwerAdd', Countroll.QuestionsAnwerAdd);


}