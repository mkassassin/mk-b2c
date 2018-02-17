module.exports = function(app) {

    var ReportAndDelete = require('../controllers/ReportAndDelete.controller.js');


    app.post('/API/ReportAndDelete/ReportUser', ReportAndDelete.ReportUser);

    app.post('/API/ReportAndDelete/ReportUserValidate', ReportAndDelete.ReportUserValidate);

    app.post('/API/ReportAndDelete/ReportPost', ReportAndDelete.ReportPost);

    app.post('/API/ReportAndDelete/ReportPostValidate', ReportAndDelete.ReportPostValidate);

    app.post('/API/ReportAndDelete/ReportSecondLevelPost', ReportAndDelete.ReportSecondLevelPost);

    app.post('/API/ReportAndDelete/ReportSecondLevelPostValidate', ReportAndDelete.ReportSecondLevelPostValidate);

    app.post('/API/ReportAndDelete/DeleteHighlightPost', ReportAndDelete.DeleteHighlightPost);

    app.post('/API/ReportAndDelete/DeleteQuestionPost', ReportAndDelete.DeleteQuestionPost);

    app.post('/API/ReportAndDelete/DeleteComment', ReportAndDelete.DeleteComment);

    app.post('/API/ReportAndDelete/DeleteAnswer', ReportAndDelete.DeleteAnswer);

    app.post('/API/ReportAndDelete/DeleteImpression', ReportAndDelete.DeleteImpression);
};