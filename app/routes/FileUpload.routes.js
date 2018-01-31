module.exports = function(app) {

    var controller = require('../controllers/FileUpload.controller.js');

    app.post('/API/FileUpload/UploadImage', controller.UploadImageFile);

    app.post('/API/FileUpload/UploadVideo', controller.UploadVideoFile);

}