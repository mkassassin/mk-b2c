module.exports = function(app) {

    var controller = require('../controllers/FileUpload.controller.js');

    app.post('/API/FileUpload/UploadImage', controller.UploadImageFile);

    app.post('/API/FileUpload/UploadVideo', controller.UploadVideoFile);

    app.post('/API/FileUpload/UploadDocumetFile', controller.UploadDocumetFile);

    app.post('/API/FileUpload/ProfileUpdate',  controller.ProfileUpdate);

    app.post('/API/FileUpload/CreateTopic',  controller.CreateTopic);

};
