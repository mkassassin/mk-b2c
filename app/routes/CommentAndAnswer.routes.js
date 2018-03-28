module.exports = function(app) {

    var Countroll = require('../controllers/CommentAndAnswer.controller.js');


    app.post('/API/CommentAndAnswer/HighlightsCommentAdd', Countroll.HighlightsCommentAdd);

    app.post('/API/CommentAndAnswer/CommentUpdate', Countroll.CommentUpdate);

    app.get('/API/CommentAndAnswer/GetHighlightsComments/:PostId/:UserId', Countroll.GetHighlightsComments);

    app.get('/API/CommentAndAnswer/GetHighlightsAllComments/:PostId/:UserId', Countroll.GetHighlightsAllComments);   

    app.post('/API/CommentAndAnswer/QuestionsAnswerAdd', Countroll.QuestionsAnswerAdd);

    app.post('/API/CommentAndAnswer/AnswerUpdate', Countroll.AnswerUpdate);

    app.get('/API/CommentAndAnswer/GetQuestionsAnswers/:PostId/:UserId', Countroll.GetQuestionsAnswers);

    app.get('/API/CommentAndAnswer/GetQuestionsAllAnswers/:PostId/:UserId', Countroll.GetQuestionsAllAnswers);

    app.post('/API/CommentAndAnswer/Category4TopicCommentAdd', Countroll.Category4TopicCommentAdd);

    app.get('/API/CommentAndAnswer/Category4TopicCommentList/:PostId/:UserId', Countroll.Category4TopicCommentList);

    app.get('/API/CommentAndAnswer/Category4TopicAllCommentList/:PostId/:UserId', Countroll.Category4TopicAllCommentList);

    app.post('/API/CommentAndAnswer/Category4TopicCommentUpdate', Countroll.Category4TopicCommentUpdate);

}