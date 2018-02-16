module.exports = function(app) {

    var ReportAndDelete = require('../controllers/ReportAndDelete.controller.js');


    app.post('/API/ReportAndDelete/ReportUser', ReportAndDelete.ReportUser);

    app.post('/API/ReportAndDelete/ReportUserValidate', ReportAndDelete.ReportUserValidate);

    app.post('/API/ReportAndDelete/ReportPost', ReportAndDelete.ReportPost);

    app.post('/API/ReportAndDelete/ReportPostValidate', ReportAndDelete.ReportPostValidate);

    app.post('/API/ReportAndDelete/ReportSecondLevelPost', ReportAndDelete.ReportSecondLevelPost);

    app.post('/API/ReportAndDelete/ReportSecondLevelPostValidate', ReportAndDelete.ReportSecondLevelPostValidate);

};