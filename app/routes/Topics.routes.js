module.exports = function(app) {

    var topic = require('../controllers/Topics.controller.js');


    app.post('/API/Topic/Register', topic.Register);

    app.get('/API/Topic/NameValidate/:name', topic.NameValidate);


}