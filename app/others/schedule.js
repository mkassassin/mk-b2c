var schedule = require("node-schedule");
var LoginInfoModel = require('../models/LoginInfo.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var LoginInfoModel = require('../models/LoginInfo.model.js');

var api_key = 'key-ac9f1b05506f5cbd321895d52e67d5ee';
var domain = 'mg.b2c.network';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var admin = require('firebase-admin');
var serviceAccount = require('./../../b2c-network-firebase-adminsdk-fxm7d-00fad73e03.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://b2c-network.firebaseio.com/'
    });

module.exports = function(app) {

    // var jj = schedule.scheduleJob('0 21 * * * *', function(){
    //   console.log('date:'+ new Date());
    // });

    var DailyNewPost = schedule.scheduleJob('0 1 0 * * *', function(){
        UserModel.UserType.find({}, {}, function(err, data) {
            if(err) {
                var varScheduleHistory = new UserModel.ScheduleHistory({
                    DateTime: new Date(),
                    ScheduleType: 'DailyNotifyMsg',
                    Error: err,
                    ErrorStage: '1',
                    Success: 'False'
                });
                varScheduleHistory.save();
            } else {
                const GetNotificationInfo = (data) =>
                    Promise.all(
                        data.map(info => getInfo(info))
                    ).then( NotifiInfoResult => {
                        var varScheduleHistory = new UserModel.ScheduleHistory({
                            DateTime: new Date(),
                            ScheduleType: 'DailyNotifyMsg',
                            Error: '',
                            ErrorStage: '',
                            Success: NotifiInfoResult
                        });
                        varScheduleHistory.save();
                    }
                    ).catch(NotifiInfoErr => {
                        var varScheduleHistory = new UserModel.ScheduleHistory({
                                DateTime: new Date(),
                                ScheduleType: 'DailyNotifyMsg',
                                Error: NotifiInfoErr,
                                ErrorStage: '2',
                                Success: 'False'
                            });
                            varScheduleHistory.save(); });

                const getInfo = info =>
                    Promise.all([
                        UserModel.UserType.findOne({'_id': info._id }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'5', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'9', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'7', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'11', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'6', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info._id,'NotificationType':'15', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.find({'ResponseUserId': info._id,'NotificationType':'10', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.find({'ResponseUserId': info._id,'NotificationType':'16', 'Viewed': 0 }).exec(),
                    ]).then(InfoData => {
                        var UserInfo = InfoData[0];
                        var HighlightCount = InfoData[1];
                        var QuestionsCount = InfoData[2];
                        var CommentCount = InfoData[3];
                        var AnswersCount = InfoData[4];
                        var LikeCount = InfoData[5];
                        var CommentLikeCount = InfoData[6];
                        var Ratings = InfoData[7];
                        var AnsRatings = InfoData[8];
                        
                        
                        var RatingCount = 0;
                        var AnsRatingCount = 0;
                        var CoinCount = 0;
                        return RatingCountFonction();
                        async function RatingCountFonction(){
                            for (let rateInfo of Ratings) {
                                await getRatingInfo(rateInfo);
                            }
                            return AnsRatingCountFonction();
                            async function AnsRatingCountFonction() {
                                for (let ansrateInfo of AnsRatings) {
                                    await AnsgetRatingInfo(ansrateInfo);
                                }
                                CoinCount = RatingCount + AnsRatingCount + LikeCount + CommentLikeCount;
                                var userImage = '';
                                var n = UserInfo.UserImage.indexOf('http://');
                                var n1 = UserInfo.UserImage.indexOf('https://');
                                if(n !== -1 || n1 !== -1 ) {
                                    userImage = UserInfo.UserImage;
                                }else{
                                    userImage = 'http://www.b2c.network/static/users/' + UserInfo.UserImage;
                                }
                                var data = '';
                                if(HighlightCount > 0) {
                                    data = data + '<div><p style="font-size:14px;display:inline-flex; margin: 5px 0px 5px 20px; line-height: 32px;"> <img src="http://www.b2c.network/assets/images/icons/highlights.png" style="width:30px; height:30px;" alt="B2C Logo"> &nbsp; ' + HighlightCount + ' new Highlights Posts </p></div>';
                                }
                                if(QuestionsCount > 0) {
                                    data = data + '<div><p style="font-size:14px;display:inline-flex; margin: 5px 0px 5px 20px; line-height:27px;"> <img src="http://www.b2c.network/assets/images/icons/question.png" style="width:30px; height:27px;" alt="B2C Logo"> &nbsp; ' + QuestionsCount + ' new Questions </p></div>';
                                }
                                if(CommentCount > 0) {
                                    data = data + '<div><p style="font-size:14px;display:inline-flex; margin: 5px 0px 5px 20px; line-height:29px;"> <img src="http://www.b2c.network/assets/images/icons/commented.png" style="width:29px; height:29px;" alt="B2C Logo"> &nbsp; ' + CommentCount + ' Post Commented </p></div>';
                                }
                                if(AnswersCount > 0) {
                                    data = data + '<div><p style="font-size:14px;display:inline-flex; margin: 5px 0px 5px 20px; line-height:27px;"> <img src="http://www.b2c.network/assets/images/icons/write.png" style="width:27px; height:27px;" alt="B2C Logo"> &nbsp; ' + AnswersCount + ' Question Answerd </p></div>';
                                }
                                if(CoinCount > 0) {
                                    data = data + '<div><p style="font-size:14px;display:inline-flex; margin: 5px 0px 5px 20px; line-height:26px;"> <img src="http://www.b2c.network/assets/images/icons/liked.png" style="width:26px; height:26px;" alt="B2C Logo"> &nbsp; ' + CoinCount + ' Coins Added In Your Highlights and Questions </p></div>';
                                }

                                var link = "http://www.b2c.network";
                                var SendData = {
                                    from: 'B2C Network <b2cnetworkapp@gmail.com>',
                                    to: UserInfo.UserEmail,
                                    subject: 'B2C Notification',
                                    html: '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%">\
                                    <table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6">\
                                        <tbody>\
                                            <tr>\
                                                <td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:550px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto">\
                                                    <div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:550px;padding:10px;text-align:left" align="left">\
                                                        <table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%">\
                                                            <tbody>\
                                                                <tr>\
                                                                    <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:10px;vertical-align:top" valign="top">\
                                                                        <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%">\
                                                                            <tbody>\
                                                                                <tr style="font-family: sans-serif; line-height:20px">\
                                                                                    <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top">\
                                                                                        <div style="display:inline-flex">\
                                                                                            <img src="http://www.b2c.network/assets/images/logo.png" style="width:55px; height:55px" alt="B2C Logo">\
                                                                                            <h3 style="margin-left:15px"> You have new Notifications</h3>\
                                                                                        </div>\
                                                                                        <p style="font-size:14px;"> Your Pending Notifications Today </p>\
                                                                                        <div style="width:100%;border:1px solid silver;margin:10px 0px;">\
                                                                                            <div style="display:inline-flex;padding:5px">\
                                                                                                <img src="' + userImage + '" style="width:45px; height:45px; border-radius:50px" alt="User Img">\
                                                                                                <h4 style="margin:10px"> ' + UserInfo.UserName + ' </h4>\
                                                                                            </div>' + data + '\
                                                                                        </div>\
                                                                                        <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;margin-bottom:15px;width:auto" width="auto">\
                                                                                            <tbody>\
                                                                                                <tr>\
                                                                                                    <td style="background-color:#ffda00;box-shadow: 0 1px 8px 0 hsla(0,0%,40%,.47);" valign="top" bgcolor="#ffda00" align="center;cursor:pointer">\
                                                                                                        <a href="' + link + '" data-saferedirecturl="' + link + '" style="background-color:#ffda00 ;box-sizing:border-box;color:#333333;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize;cursor:pointer" bgcolor="#ffda00" target="_blank"> Open B2C </a>\
                                                                                                    </td>\
                                                                                                </tr>\
                                                                                            </tbody>\
                                                                                        </table>\
                                                                                        <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0">Thanks, B2C Network Team</p>\
                                                                                    </td>\
                                                                                </tr>\
                                                                            </tbody>\
                                                                        </table>\
                                                                    </td>\
                                                                </tr>\
                                                            </tbody>\
                                                        </table>\
                                                    </div>\
                                                </td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                                </div>'
                                };

                                if(HighlightCount > 0 ||  QuestionsCount > 0 || CommentCount > 0 || AnswersCount > 0 || CoinCount > 0) { 
                                    mailgun.messages().send(SendData, function (error, body) {
                                        if (error) {
                                            var varScheduleHistory = new UserModel.ScheduleHistory({
                                                DateTime: new Date(),
                                                ScheduleType: 'DailyNotifyMsg',
                                                Error: InfoError,
                                                ErrorStage: '4',
                                                Success: 'False'
                                            });
                                            varScheduleHistory.save();
                                        } else {
                                            return body;
                                        }
                                    });
                                } else{
                                    return 'Empty';
                                }
                            }
                        };

                        function getRatingInfo(rateInfo){
                            return new Promise(( resolve, reject )=>{
                                RatingCount += JSON.parse(rateInfo.QuestionRating);
                                resolve(rateInfo);
                            });
                        }
                        function AnsgetRatingInfo(ansrateInfo){
                            return new Promise(( resolve, reject )=>{
                                AnsRatingCount += JSON.parse(ansrateInfo.AnswerRating);
                                resolve(ansrateInfo);
                            });
                        }

                    }).catch(InfoError => {
                        var varScheduleHistory = new UserModel.ScheduleHistory({
                            DateTime: new Date(),
                            ScheduleType: 'DailyNotifyMsg',
                            Error: InfoError,
                            ErrorStage: '3',
                            Success: 'False'
                        });
                        varScheduleHistory.save();
                    });
                GetNotificationInfo(data);
            }
        });
    });


    var PushNotify = schedule.scheduleJob('0 0 * * * *', function(){
        LoginInfoModel.AndroidAppInfo.find({"FirebaseToken" : {"$exists" : true, "$ne" : ""}, "FirebaseToken" : {"$exists" : true, "$ne" : null}}, function(err, data) {
            if(err) {
                var varScheduleHistory = new UserModel.ScheduleHistory({
                    DateTime: new Date(),
                    ScheduleType: 'PushNotify',
                    Error: err,
                    ErrorStage: '1',
                    Success: 'False'
                });
                varScheduleHistory.save();
            } else {
                
                const GetNotificationInfo = (data) =>
                    Promise.all(
                        data.map(info => getInfo(info))
                    ).then( NotifiInfoResult => {
                        
                    }
                    ).catch(NotifiInfoErr => {
                        var varScheduleHistory = new UserModel.ScheduleHistory({
                                DateTime: new Date(),
                                ScheduleType: 'PushNotify',
                                Error: NotifiInfoErr,
                                ErrorStage: '2',
                                Success: 'False'
                            });
                            varScheduleHistory.save(); 
                        });

                const getInfo = info =>
                    Promise.all([
                        LoginInfoModel.AndroidAppInfo.findOne({'_id': info._id }).exec(),
                        UserModel.UserType.findOne({'_id': info.UserId  }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'5', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'9', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'7', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'11', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'6', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'15', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'10', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.count({'ResponseUserId': info.UserId ,'NotificationType':'16', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.find({'ResponseUserId': info.UserId ,'NotificationType':'10', 'Viewed': 0 }).exec(),
                        NotificationModel.Notification.find({'ResponseUserId': info.UserId ,'NotificationType':'16', 'Viewed': 0 }).exec(),
                    ]).then(InfoData => {
                        var AndroidAppInfo = InfoData[0];
                        var UserInfo = InfoData[1];
                        var HighlightCount = InfoData[2];
                        var QuestionsCount = InfoData[3];
                        var CommentCount = InfoData[4];
                        var AnswersCount = InfoData[5];
                        var LikeCount = InfoData[6];
                        var CommentLikeCount = InfoData[7];
                        var NotifyRatingCount = InfoData[8];
                        var NotifyAnsRatingCount = InfoData[9];
                        var Ratings = InfoData[10];
                        var AnsRatings = InfoData[11];
                        
                        
                        var RatingCount = 0;
                        var AnsRatingCount = 0;
                        var CoinCount = 0;
                        var TotalCount = 0;
                        var SendMessage = 0;
                        if (AndroidAppInfo.LastPushNotify === '' || AndroidAppInfo.LastPushNotify === null || !AndroidAppInfo.LastPushNotify ){
                            return RatingCountFonction();
                        }else{
                        var FilterDate  = AndroidAppInfo.LastPushNotify;
                            NotificationModel.Notification.count({'ResponseUserId': AndroidAppInfo.UserId,"createdAt" : { $gte: FilterDate }, 'Viewed': 0}, function(COUNTerr, COUNTdata) {
                                if(COUNTerr) {
                                    var varScheduleHistory = new UserModel.ScheduleHistory({
                                        DateTime: new Date(),
                                        ScheduleType: 'PushNotify',
                                        Error: COUNTerr,
                                        ErrorStage: '5',
                                        Success: 'False'
                                    });
                                    varScheduleHistory.save();
                                    return 'Empty';
                                } else {
                                    if(COUNTdata >= 10){
                                        return RatingCountFonction();
                                    }else{
                                        return 'Empty';
                                    }
                                }
                            });
                            
                        }

                            
                            async function RatingCountFonction(){
                                for (let rateInfo of Ratings) {
                                    await getRatingInfo(rateInfo);
                                }
                                return AnsRatingCountFonction();
                                async function AnsRatingCountFonction() {
                                    for (let ansrateInfo of AnsRatings) {
                                        await AnsgetRatingInfo(ansrateInfo);
                                    }
                                    CoinCount = RatingCount + AnsRatingCount + LikeCount + CommentLikeCount;
                                    TotalCount = HighlightCount + QuestionsCount + CommentCount + AnswersCount + LikeCount + CommentLikeCount + NotifyRatingCount + NotifyAnsRatingCount;

                                    var data = '';
                                    if(HighlightCount > 0) {
                                        data = data + HighlightCount + ' New Posts, ';
                                    }
                                    if(QuestionsCount > 0) {
                                        data = data + QuestionsCount + ' New Questions, ';
                                    }
                                    if(CommentCount > 0) {
                                        data = data + CommentCount + ' New Comments, ';
                                    }
                                    if(AnswersCount > 0) {
                                        data = data + AnswersCount + ' New Answers, ';
                                    }
                                    if(CoinCount > 0) {
                                        data = data + CoinCount + ' Coins Added To Your Posts and Questions. ';
                                    }


                                    if(TotalCount > 0) { 
                                        var registrationToken = AndroidAppInfo.FirebaseToken;

                                        var payload = {
                                            notification: {
                                                title: TotalCount + ' Pending Notifications',
                                                body: data,
                                                icon: 'http://www.b2c.network/assets/images/icons/logo.png',
                                                color: '#ffda00'
                                            }
                                        };
                                        
                                        var options = {
                                            priority: 'high',
                                            timeToLive: 60 * 60 * 24
                                        };

                                        admin.messaging().sendToDevice(registrationToken, payload, options)
                                            .then(function(response) {
                                                AndroidAppInfo.LastPushNotify = new Date();
                                                AndroidAppInfo.save(function(Updateerr, Updateresult) {
                                                    if(Updateerr) {
                                                        var varScheduleHistory = new UserModel.ScheduleHistory({
                                                            DateTime: new Date(),
                                                            ScheduleType: 'PushNotify',
                                                            Error: Updateerr,
                                                            ErrorStage: '6',
                                                            Success: 'False'
                                                        });
                                                    return Updateerr;            
                                                    } else {
                                                        return response;
                                                    }
                                                });
                                            })
                                            .catch(function(error) {
                                                var varScheduleHistory = new UserModel.ScheduleHistory({
                                                    DateTime: new Date(),
                                                    ScheduleType: 'PushNotify',
                                                    Error: error,
                                                    ErrorStage: '4',
                                                    Success: 'False'
                                                });
                                            return error;
                                            });
                                    } else{
                                        return 'Empty';
                                    }
                                }
                            };

                        function getRatingInfo(rateInfo){
                            return new Promise(( resolve, reject )=>{
                                RatingCount += JSON.parse(rateInfo.QuestionRating);
                                resolve(rateInfo);
                            });
                        }
                        function AnsgetRatingInfo(ansrateInfo){
                            return new Promise(( resolve, reject )=>{
                                AnsRatingCount += JSON.parse(ansrateInfo.AnswerRating);
                                resolve(ansrateInfo);
                            });
                        }

                    }).catch(InfoError => {
                        var varScheduleHistory = new UserModel.ScheduleHistory({
                            DateTime: new Date(),
                            ScheduleType: 'PushNotify',
                            Error: InfoError,
                            ErrorStage: '3',
                            Success: 'False'
                        });
                        varScheduleHistory.save();
                    });
                GetNotificationInfo(data);
            }
        });
    });

};
