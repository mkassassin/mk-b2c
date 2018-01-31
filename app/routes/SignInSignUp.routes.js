module.exports = function(app) {

    var user = require('../controllers/SignInSignUp.controller.js');


    app.post('/API/SigninSignup/Register', user.Register);

    app.get('/API/SigninSignup/NameValidate/:name', user.NameValidate);

    app.get('/API/SigninSignup/EmailValidate/:email', user.EmailValidate);

    app.get('/API/SigninSignup/UserValidate/:email/:password', user.UserValidate);

    app.post('/API/SigninSignup/UserValidate', user.MobileUserValidate);

}