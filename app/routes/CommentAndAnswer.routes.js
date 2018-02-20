module.exports = function(app) {

    var Countroll = require('../controllers/CommentAndAnswer.controller.js');


    app.post('/API/CommentAndAnswer/HighlightsCommentAdd', Countroll.HighlightsCommentAdd);

    app.post('/API/CommentAndAnswer/CommentUpdate', Countroll.CommentUpdate);

    app.get('/API/CommentAndAnswer/GetHighlightsComments/:PostId/:UserId', Countroll.GetHighlightsComments);   

    app.post('/API/CommentAndAnswer/QuestionsAnswerAdd', Countroll.QuestionsAnwerAdd);

    app.post('/API/CommentAndAnswer/AnswerUpdate', Countroll.AnswerUpdate);


}