module.exports = function(app) {

    var Countroll = require('../controllers/CommentAndAnswer.controller.js');


    app.post('/API/CommentAndAnswer/HighlightsCommentAdd', Countroll.HighlightsCommentAdd);

    app.get('/API/CommentAndAnswer/GetHighlightsComments/:PostId/:UserId', Countroll.GetHighlightsComments);   

    app.post('/API/CommentAndAnswer/QuestionsAnswerAdd', Countroll.QuestionsAnwerAdd);


}