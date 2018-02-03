module.exports = function(app) {

    var Profile = require('../controllers/Profile.controller.js');

    app.get('/API/Profile/Timeline/:UserId', Profile.Timeline);

}