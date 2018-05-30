module.exports = function(app) {

    var user = require('../controllers/SignInSignUp.controller.js');


    app.post('/API/SigninSignup/Register', user.Register);

    app.get('/API/SigninSignup/NameValidate/:name', user.NameValidate);

    app.get('/API/SigninSignup/EmailValidate/:email', user.EmailValidate);

    app.get('/API/SigninSignup/UserValidate/:email/:password', user.UserValidate);

    app.get('/API/SigninSignup/Privacy_Update_Check/:User_Id', user.Privacy_Update_Check);
    app.get('/API/SigninSignup/Privacy_Update_Agree/:User_Id', user.Privacy_Update_Agree);


    app.get('/API/SigninSignup/UserInfo/:UserId', user.UserInfo);

    app.post('/API/SigninSignup/ProfileUpdate', user.ProfileUpdate);

    app.get('/API/SigninSignup/SendFPVerifyEmail/:email', user.SendFPVerifyEmail);

    app.get('/API/SigninSignup/NewPasswordEmailValidate/:UserId/:token', user.NewPasswordEmailValidate);

    app.post('/API/SigninSignup/UpdatePassword', user.UpdatePassword);

    app.post('/API/SigninSignup/ChangePassword', user.ChangePassword);

    app.post('/API/SigninSignup/PrivacyUpdate', user.PrivacyUpdate);

    app.get('/API/SigninSignup/FBUserValidate/:email/:fbid', user.FBUserValidate);

    app.post('/API/SigninSignup/AndroidSocialUserValidate', user.AndroidSocialUserValidate);

    app.get('/API/SigninSignup/SocialUserValidate/:email/:uid/:type', user.SocialUserValidate);

    app.get('/API/SigninSignup/GetNotification/:UserId', user.GetNotification);
    
    app.get('/API/SigninSignup/GetNotificationCount/:UserId', user.GetNotificationCount);

    app.get('/API/SigninSignup/GetMobileNotification/:UserId', user.GetMobileNotification);

    app.get('/API/SigninSignup/RemoveNotification/:NotifyId', user.RemoveNotification);

    app.post('/API/SigninSignup/AndroidUserValidate', user.AndroidUserValidate);

    app.get('/API/SigninSignup/AndroidUserSignOut/:UserId', user.AndroidUserSignOut);

    app.get('/API/SigninSignup/GetUserInfo/:UserId/:LoginUserId', user.GetUserInfo);

    app.get('/API/SigninSignup/UserCoinCount/:UserId', user.UserCoinCount);

    app.get('/API/SigninSignup/AndroidVersionSubmit/:Version', user.AndroidVersionSubmit);

    app.get('/API/SigninSignup/AndroidVersionUpdate/:Version', user.AndroidVersionUpdate);

    app.get('/API/SigninSignup/AndroidVersionGet/', user.AndroidVersionGet);

};
