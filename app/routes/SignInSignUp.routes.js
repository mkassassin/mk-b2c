module.exports = function(app) {

    var user = require('../controllers/SignInSignUp.controller.js');


    app.post('/API/Register', user.Register);

    app.get('/API/NameValidate/:name', user.NameValidate);

    app.get('/API/EmailValidate/:email', user.EmailValidate);

    app.get('/API/UserValidate/:email/:password', user.UserValidate);

}