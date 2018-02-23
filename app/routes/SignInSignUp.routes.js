module.exports = function(app) {

    var user = require('../controllers/SignInSignUp.controller.js');


    app.post('/API/SigninSignup/Register', user.Register);

    app.get('/API/SigninSignup/NameValidate/:name', user.NameValidate);

    app.get('/API/SigninSignup/EmailValidate/:email', user.EmailValidate);

    app.get('/API/SigninSignup/UserValidate/:email/:password', user.UserValidate);

    app.get('/API/SigninSignup/UserInfo/:UserId', user.UserInfo);

    app.post('/API/SigninSignup/ProfileUpdate', user.ProfileUpdate);

    app.get('/API/SigninSignup/SendFPVerifyEmail/:email', user.SendFPVerifyEmail);

    app.get('/API/SigninSignup/NewPasswordEmailValidate/:UserId/:token', user.NewPasswordEmailValidate);

    app.post('/API/SigninSignup/UpdatePassword', user.UpdatePassword);

    app.post('/API/SigninSignup/ChangePassword', user.ChangePassword);

    app.post('/API/SigninSignup/PrivacyUpdate', user.PrivacyUpdate);

    app.get('/API/SigninSignup/FBUserValidate/:email/:fbid', user.FBUserValidate);

    app.get('/API/SigninSignup/SocialUserValidate/:email/:uid/:type', user.SocialUserValidate);

    app.get('/API/SigninSignup/GetNotification/:UserId', user.GetNotification);

    app.get('/API/SigninSignup/RemoveNotification/:NotifyId', user.RemoveNotification);

    app.post('/API/SigninSignup/UserValidate', user.MobileUserValidate);

    app.get('/API/SigninSignup/GetUserInfo/:UserId/:LoginUserId', user.GetUserInfo);

    app.get('/API/SigninSignup/UserCoinCount/:UserId', user.UserCoinCount);

};
