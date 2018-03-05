var UserModel = require('../models/SignInSignUp.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');

var LoginInfoModel = require('../models/LoginInfo.model.js');

var moment = require("moment");

var get_ip = require('ipware')().get_ip;
var ipapi = require('ipapi.co');
var parser = require('ua-parser-js');

var api_key = 'key-ac9f1b05506f5cbd321895d52e67d5ee';
var domain = 'mg.b2c.network';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var usersProjection = {
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserDateOfBirth: false,
    UserEmailVerifyToken: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
    Provider: false,
    ProviderType: false,
    ProviderId: false,
    ShowEmail: false,
    ShowDOB: false,
    ShowLocation: false
};


exports.SendFPVerifyEmail = function(req, res) {
        UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase()}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err, message: "Some error occurred while Validate The E-mail."});
            } else {
                if(data === null){
                    res.send({ status:"False", message: "Account is Not Available." });
                }else{
                    
                   var rand=Math.floor((Math.random() * 100) + 54);
                    var link = "http://www.b2c.network/SetNewpassword/" + data._id + "/" + rand;
                    var SendData = {
                        from: 'B2C Network <b2cnetworkapp@gmail.com>',
                        to: req.params.email,
                        subject: 'E-mail Verification',
                        html: '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"><table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"><tbody><tr><td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:500px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"><div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:500px;padding:10px;text-align:left" align="left"><table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"><tbody><tr><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"><table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"><tbody><tr style="font-family: sans-serif; line-height:20px" ><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"><img src="http://www.b2c.network/assets/images/logo.png" style="width:15%; margin-left:42.5%" alt="B2C Logo"><p style="font-size:14px;">Hi there,</p><p style="font-size:14px;"> To complete the email verification process, Please click the link below then Reset Your Password .</p><table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;margin-bottom:15px;width:auto" width="auto"><tbody><tr><td style="background-color:#ffda00;box-shadow: 0 1px 8px 0 hsla(0,0%,40%,.47);" valign="top" bgcolor="#ffda00" align="center"><a href="'+ link +'"  data-saferedirecturl="'+ link +'" style="background-color:#ffda00 ;box-sizing:border-box;color:#333333;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize;cursor:pointer" bgcolor="#ffda00" target="_blank"> Verify Your E-mail</a></td></tr></tbody></table><p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0">Thanks, B2C Network Team</p></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table></div>'
                      };
                       
                      mailgun.messages().send(SendData, function (error, body) {
                        if (error) {
                            res.send({ status:"False", Error: error,  message: "Some error occurred" });
                        } else {
                            data.UserEmailVerifyToken = rand;
                            data.save(function (newerr, newresult) {
                                if (newerr){
                                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UserEmailVerifyToken ."});
                                }else{
                                    res.send({ status:"True", data:body });
                                }
                            });
                        }
                    });
                } 
            }
        }); 
};

exports.NewPasswordEmailValidate = function(req, res) {
    UserModel.UserType.findOne({'_id': req.params.UserId, 'UserEmailVerifyToken': req.params.token}, "_id UserEmail UserPassword ", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                UserModel.UserType.findOne({'_id': req.params.UserId}, function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Validate The User."});
                    } else {
                        if(result !== null){
                            res.send({ status:"False", message: " Token Expired! " });
                        }else{
                            res.send({ status:"False", message: " User Not Find! " });
                        } 
                    }
                });
            }else{
                res.send({ status:"True", data:data });
            } 
        }
    });
};

exports.UpdatePassword = function(req, res) {
    UserModel.UserType.findOne({'_id': req.body.UserId, 'UserEmailVerifyToken': req.body.token}, "_id UserEmail UserPassword UserEmailVerifyToken", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            data.UserEmailVerifyToken = '';
            data.UserPassword = req.body.NewPassword;
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UserEmailVerifyToken ."});
                }else{
                    res.send({ status:"True" });
                }
            });
        }
    });
};

exports.ChangePassword = function(req, res) {
    UserModel.UserType.findOne({'_id': req.body.UserId, 'UserPassword': req.body.oldPassword}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null) {
                res.send({ status:"False", PassMatch: "False", message: " Password Not Match! " });
            }else {
                data.UserPassword = req.body.newPassword;
                data.save(function (newerr, newresult) {
                    if (newerr){
                        res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Password ."});
                    }else{
                        res.send({ status:"True" });
                    }
                });
            } 
        }
    });
};

exports.PrivacyUpdate = function(req, res) {
    UserModel.UserType.findOne({'_id': req.body.UserId}, "_id ShowEmail ShowDOB ShowLocation", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            data.ShowEmail = req.body.ShowEmail;
            data.ShowDOB = req.body.ShowDOB;
            data.ShowLocation = req.body.ShowLocation;

            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Privacy Settings ."});
                }else{
                    res.send({ status:"True" });
                }
            });
        }
    });
};

exports.Register = function(req, res) {
    if(!req.body.UserName) {
        res.status(400).send({status:"False", message: " Name can not be Empty! "});
    }
    if(!req.body.UserEmail){
        res.status(400).send({status:"False", message: " E-mail can not be Empty! "});
    }
    if(!req.body.UserCategoryId || !req.body.UserCategoryName ){
        res.status(400).send({status:"False", message: " Select Any One Category "});
    }

    var varUserType = new UserModel.UserType({
            UserName:  req.body.UserName,
            UserEmail: req.body.UserEmail,
            UserPassword: req.body.UserPassword,
            UserCategoryId:req.body.UserCategoryId,
            UserCategoryName:req.body.UserCategoryName,
            UserImage:req.body.UserImage || "userImage.png",
            ProviderType: req.body.ProviderType || 'Normal',
            ProviderId: req.body.ProviderId || '',
            UserCompany:req.body.UserCompany || "",
            UserProfession:req.body.UserProfession || "",
            UserDateOfBirth:req.body.UserDateOfBirth || "",
            UserGender:req.body.UserGender || "",
            UserCountry:req.body.UserCountry || "",
            UserState:req.body.UserState || "",
            UserCity:req.body.UserCity || "",
            ShowEmail: 'EveryOne',
            ShowDOB: 'EveryOne',
            ShowLocation: 'EveryOne'
    });


    varUserType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while creating the Account."});            
        } else {
            res.send({status:"True", data: result });
        }
    });
};

exports.ProfileUpdate = function(req, res) {
    UserModel.UserType.findOne({'_id': req.body.UserId}, {}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            
            data.UserName = req.body.UserName;
            data.UserCompany = req.body.UserCompany;
            data.UserProfession = req.body.UserProfession;
            data.UserDateOfBirth = req.body.UserDateOfBirth;
            data.UserGender = req.body.UserGender;
            data.UserCountry = req.body.UserCountry;
            data.UserState = req.body.UserState;
            data.UserCity = req.body.UserCity;

            data.save(function(err, result) {
                if(err) {
                    res.status(500).send({status:"False", Error:err, message: "Some error occurred while Update the Account."});            
                } else {
                    res.send({status:"True", data: result });
                }
            });
        }
    });
};

exports.NameValidate = function(req, res) {
        UserModel.UserType.findOne({'UserName': req.params.name.toLowerCase()}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", message: "Some error occurred while Validate The Name."});
            } else {
                if(data === null){
                    res.send({ status:"True", available: "True", message: "( " + req.params.name + " ) This Name is Available." });
                }else{
                    res.send({ status:"True", available: "False", message: "( " + req.params.name + " ) This Name is Already Exist. " });
                } 
            }
        });
};

exports.EmailValidate = function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase()}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Validate The E-mail."});
        } else {
            if(data === null){
                res.send({ status:"True", available: "True", message: "( " + req.params.email + " ) This E-mail is Available." });
            }else{
                res.send({ status:"True", available: "False", message: "( " + req.params.email + " ) This E-mail is Already Exist. " });
            } 
        }
    });
};

exports.UserValidate = function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase(), 'UserPassword': req.params.password}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase()}, function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
                    } else {
                        if(result !== null){
                            res.send({ status:"False", message: " Email and Password Not Match! " });
                        }else{
                            res.send({ status:"False", message: " Invalid Username and Password  " });
                        } 
                    }
                });
            }else{
                FollowModel.FollowUserType.count({'FollowingUserId': data._id}, function(newerr, count) {
                    if(newerr){
                        res.send({status:"False", Error:newerr });
                    }else{
                        var IpInfo = '';
                        var DeviceInfo = '';
                        var callback = function(res){
                            IpInfo = res;
                            DeviceInfo = parser(req.headers['user-agent']);
                           gotonext(); 
                        };
                        var req_ip = get_ip(req);
                        var ip = req_ip.clientIp;
                        ip = ip.split(':');
                        ipapi.location(callback, ip[ip.length - 1]);
                        function gotonext() {
                            var varLoginInfo = new LoginInfoModel.LoginInfo({
                                UserId:  data._id,
                                IpInfo: IpInfo,
                                DeviceInfo: DeviceInfo,
                                UtcTime: new Date(),
                                ActiveStates: 'Active'
                            });
                            varLoginInfo.save(function(Newerr, Newresult) {
                                if(Newerr) {
                                    res.status(500).send({status:"False", Error:Newerr, message: "Some error occurred while creating the Account."});            
                                } else {
                                    var newArray = [];
                                    newArray.push({
                                                    _id: data._id,
                                                    UserName: data.UserName,
                                                    UserEmail: data.UserEmail,
                                                    UserCategoryId: data.UserCategoryId,
                                                    UserCategoryName: data.UserCategoryName,
                                                    UserImage: data.UserImage,
                                                    UserCompany: data.UserCompany,
                                                    UserProfession: data.UserProfession,
                                                    Followers: count
                                                });
                                    res.send({ status:"True", message: "Sign In Successfully", data: newArray[0] });
                                }
                            });
                        }
                    }
                });
            } 
        }
    });
};

exports.UserInfo = function(req, res) {
    UserModel.UserType.findOne({'_id': req.params.UserId}, "_id UserName UserEmail UserCategoryId UserGender UserDateOfBirth UserCountry UserState UserCity UserCategoryName UserImage UserProfession UserCompany UserGender ShowEmail ShowDOB ShowLocation", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            res.send({ status:"True", data: data });
        }
    });
};

exports.UserCoinCount= function(req, res) {
    LikeAndRating.QuestionsRating.find({ 'PostUserId': req.params.UserId, 'ActiveStates': 'Active' }, function(QusRatingErr, QusRating) {
        if(QusRatingErr) {
            res.status(500).send({status:"False", Error: QusRatingErr, message: "Some error occurred while Rate the Post."}); 
        } else {
            var QusRatingTotalCount = 0 ;
            QusRatingCount();
             async function QusRatingCount(){
                for (let Info of QusRating) {
                    await QusRatingInfo(Info);
                }
                LikeAndRating.HighlightsLike.count({ 'PostUserId': req.params.UserId, 'ActiveStates': 'Active' }, function(HighlightsLikeErr, HighlightsLikeCount) {
                    if(HighlightsLikeErr) {
                        res.status(500).send({status:"False", Error: HighlightsLikeErr, message: "Some error occurred while Rate the Post."}); 
                    } else {
                        LikeAndRating.CommentLike.count({ 'CommentUserId': req.params.UserId, 'ActiveStates': 'Active' }, function(CommentLikeErr, CommentLikeCount) {
                            if(CommentLikeErr) {
                                res.status(500).send({status:"False", Error: CommentLikeErr, message: "Some error occurred while Rate the Post."}); 
                            } else {
                                LikeAndRating.AnswerRating.find({ 'AnswerUserId': req.params.UserId, 'ActiveStates': 'Active' }, function(AnswerRatingErr, AnswerRating) {
                                    if(AnswerRatingErr) {
                                        res.status(500).send({status:"False", Error: AnswerRatingErr, message: "Some error occurred while Rate the Post."}); 
                                    } else {
                                        var AnsRatingTotalCount = 0 ;
                                        AnsRatingCount();
                                         async function AnsRatingCount(){
                                            for (let Info of AnswerRating) {
                                                await AnsRatingInfo(Info);
                                            }
                                            res.send({ status:"True", HiLikes: HighlightsLikeCount, CommentLikes: CommentLikeCount, QusRatCount:QusRatingTotalCount, AnsRatCount: AnsRatingTotalCount  });
                                        }
                                        function AnsRatingInfo(Info){
                                            return new Promise(( resolve, reject )=>{
                                                LikeAndRating.AnswerRating.findOne({ '_id': Info._id}, function(ansRateerr, ansRateData) {
                                                    if(ansRateerr) {
                                                        res.send({status:"False", Error:ansRateerr });
                                                        reject(ansRateerr);
                                                    } else {
                                                        AnsRatingTotalCount += JSON.parse(ansRateData.Rating);
                                                        resolve(ansRateData);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

        function QusRatingInfo(rateInfo){
            return new Promise(( resolve, reject )=>{
                LikeAndRating.QuestionsRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
                    if(Rateerr) {
                        res.send({status:"False", Error:Rateerr });
                        reject(Rateerr);
                    } else {
                        QusRatingTotalCount += JSON.parse(RateData.Rating);
                        resolve(RateData);
                    }
                });
            });
        }
    });

};

exports.FBUserValidate = function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase(), 'ProviderId': req.params.fbid}, "_id UserName ProviderType UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                res.send({ status:"False", message: " Invalid Username and Password  " });
            }else{
                FollowModel.FollowUserType.count({'UserId': data._id}, function(newerr, count) {
                    if(newerr){
                        res.send({status:"False", Error:newerr });
                    }else{
                        var IpInfo = '';
                        var DeviceInfo = '';
                        var callback = function(res){
                            IpInfo = res;
                            DeviceInfo = parser(req.headers['user-agent']);
                           gotonext(); 
                        };
                        var req_ip = get_ip(req);
                        var ip = req_ip.clientIp;
                        ip = ip.split(':');
                        ipapi.location(callback, ip[ip.length - 1]);
                        function gotonext() {
                            var varLoginInfo = new LoginInfoModel.LoginInfo({
                                UserId:  data._id,
                                IpInfo: IpInfo,
                                DeviceInfo: DeviceInfo,
                                UtcTime: new Date(),
                                ActiveStates: 'Active'
                            });
                            varLoginInfo.save(function(Newerr, Newresult) {
                                if(Newerr) {
                                    res.status(500).send({status:"False", Error:Newerr, message: "Some error occurred while creating the Account."});            
                                } else {
                                    var newArray = [];
                                    newArray.push({
                                                    _id: data._id,
                                                    UserName: data.UserName,
                                                    UserEmail: data.UserEmail,
                                                    UserCategoryId: data.UserCategoryId,
                                                    UserCategoryName: data.UserCategoryName,
                                                    UserImage: data.UserImage,
                                                    UserCompany: data.UserCompany,
                                                    UserProfession: data.UserProfession,
                                                    Followers: count
                                                });
                                    res.send({ status:"True", message: "Sign In Successfully", data: newArray[0] });
                                }
                            });
                        }
                    }
                });
            } 
        }
    });
};

exports.SocialUserValidate = function(req, res) {
    UserModel.UserType.findOne({'ProviderType': req.params.type, 'UserEmail': req.params.email.toLowerCase(), 'ProviderId': req.params.uid}, "_id UserName ProviderType UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                res.send({ status:"False", message: " Invalid Username and Password  " });
            }else{
                FollowModel.FollowUserType.count({'UserId': data._id}, function(newerr, count) {
                    if(newerr){
                        res.send({status:"False", Error:newerr });
                    }else{
                        var IpInfo = '';
                        var DeviceInfo = '';
                        var callback = function(res){
                            IpInfo = res;
                            DeviceInfo = parser(req.headers['user-agent']);
                           gotonext(); 
                        };
                        var req_ip = get_ip(req);
                        var ip = req_ip.clientIp;
                        ip = ip.split(':');
                        ipapi.location(callback, ip[ip.length - 1]);
                        function gotonext() {
                            var varLoginInfo = new LoginInfoModel.LoginInfo({
                                UserId:  data._id,
                                IpInfo: IpInfo,
                                DeviceInfo: DeviceInfo,
                                UtcTime: new Date(),
                                ActiveStates: 'Active'
                            });
                            varLoginInfo.save(function(Newerr, Newresult) {
                                if(Newerr) {
                                    res.status(500).send({status:"False", Error:Newerr, message: "Some error occurred while creating the Account."});            
                                } else {
                                    var newArray = [];
                                    newArray.push({
                                                    _id: data._id,
                                                    UserName: data.UserName,
                                                    UserEmail: data.UserEmail,
                                                    UserCategoryId: data.UserCategoryId,
                                                    UserCategoryName: data.UserCategoryName,
                                                    UserImage: data.UserImage,
                                                    UserCompany: data.UserCompany,
                                                    UserProfession: data.UserProfession,
                                                    ProviderType: data.ProviderType,
                                                    Followers: count
                                                });
                                    res.send({ status:"True", message: "Sign In Successfully", data: newArray[0] });
                                }
                            });
                        }
                    }
                });
            } 
        }
    });
};

exports.AndroidUserValidate= function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.body.email.toLowerCase(), 'UserPassword': req.body.password}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                UserModel.UserType.findOne({'UserEmail': req.body.email.toLowerCase()}, function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
                    } else {
                        if(result !== null){
                            res.send({ status:"False", message: " Email and Password Not Match! " });
                        }else{
                            res.send({ status:"False", message: " Invalid Username and Password  " });
                        } 
                    }
                });
            }else{
                FollowModel.FollowUserType.count({'FollowingUserId': data._id}, function(newerr, count) {
                    if(newerr){
                        res.send({status:"False", Error:newerr });
                    }else{
                        var IpInfo = '';
                        var DeviceInfo = '';
                        ipapi.location(function(res) {   
                             IpInfo = res;
                             DeviceInfo = parser(req.headers['user-agent']);
                            gotonext(); 
                        });
                        function gotonext() {
                            var varLoginInfo = new LoginInfoModel.LoginInfo({
                                UserId:  data._id,
                                IpInfo: IpInfo,
                                DeviceInfo: DeviceInfo,
                                UtcTime: new Date(),
                                ActiveStates: 'Active'
                            });
                            varLoginInfo.save(function(Newerr, Newresult) {
                                if(Newerr) {
                                    res.status(500).send({status:"False", Error:Newerr, message: "Some error occurred while creating the Account."});            
                                } else {
                                    LoginInfoModel.AndroidAppInfo.findOne({'UserId': data._id, 'ActiveStates': 'Active'}, "_id UserId FirebaseToken DeviceInfo UtcTime ", function(olderr, olddata) {
                                        if(olderr) {
                                            res.status(500).send({status:"False", Error: olderr, message: "Some error occurred while User Validate."});
                                        } else {
                                            if(olddata === null){
                                                var varAndroidAppInfo = new LoginInfoModel.AndroidAppInfo({
                                                    UserId:  data._id,
                                                    FirebaseToken: req.body.FirebaseToken,
                                                    DeviceInfo: DeviceInfo,
                                                    UtcTime: new Date(),
                                                    ActiveStates: 'Active'
                                                });
                                                varAndroidAppInfo.save(function(apperr, appresult) {
                                                    if(apperr) {
                                                        res.status(500).send({status:"False", Error:apperr, message: "Some error occurred while creating the Account."});            
                                                    } else {
                                                        SendReturnOutput();
                                                    }
                                                });
                                            }else{
                                                olddata.FirebaseToken = req.body.FirebaseToken,
                                                olddata.save(function(apperr, appresult) {
                                                    if(apperr) {
                                                        res.status(500).send({status:"False", Error:apperr, message: "Some error occurred while creating the Account."});            
                                                    } else {
                                                        SendReturnOutput();
                                                    }
                                                });

                                            }
                                            function SendReturnOutput() {
                                                var newArray = [];
                                                newArray.push({
                                                                _id: data._id,
                                                                UserName: data.UserName,
                                                                UserEmail: data.UserEmail,
                                                                UserCategoryId: data.UserCategoryId,
                                                                UserCategoryName: data.UserCategoryName,
                                                                UserImage: data.UserImage,
                                                                UserCompany: data.UserCompany,
                                                                UserProfession: data.UserProfession,
                                                                Followers: count
                                                            });
                                                res.send({ status:"True", message: "Sign In Successfully", data: newArray[0] });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }  
        }
    });
};

exports.GetNotification = function(req, res) {
    if(!req.params.UserId){
        res.status(500).send({status:"False", message: " User Id Is Missing!"});
    }
    NotificationModel.Notification.find({'ResponseUserId': req.params.UserId, 'Viewed': 0 }, { }, { sort:{createdAt : -1} }, function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error:err, message: "Follow User DB Error"});
            } else {
                if(result.length > 0){
                    var NotificationsArray = new Array();
                    GetUserData();
                    async function GetUserData(){
                        for (let info of result) {
                            await getUserInfo(info);
                         }
                        res.send({status:"True", data: NotificationsArray });
                      }
                      
                      function getUserInfo(info){
                        return new Promise(( resolve, reject )=>{
                            UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, FollowesData) {
                                if(err) {
                                    res.send({status:"False", Error:err });
                                    reject(err);
                                } else {
                                    var newArray = [];
                                    newArray.push( {
                                                    _id: info._id,
                                                    UserId: FollowesData._id,
                                                    UserName: FollowesData.UserName,
                                                    UserCategoryName: FollowesData.UserCategoryName,
                                                    UserImage: FollowesData.UserImage,
                                                    SharedUserId: info.SharedUserId,
                                                    SharedUserName: info.SharedUserName,
                                                    NotificationType: info.NotificationType,
                                                    FollowUserId: info.FollowUserId,
                                                    FollowTopicId: info.FollowTopicId,
                                                    HighlightPostType: info.HighlightPostType,
                                                    HighlightPostId: info.HighlightPostId,
                                                    HighlightLikeId: info.HighlightLikeId,
                                                    HighlightCommentId: info.HighlightCommentId,
                                                    CommentText: info.CommentText,
                                                    HighlightShareId: info.HighlightShareId,
                                                    QuestionPostId: info.QuestionPostId,
                                                    QuestionRating: info.QuestionRating,
                                                    QuestionTopic: info.QuestionTopic,
                                                    QuestionTopicId: info.QuestionTopicId,
                                                    QuestionText: info.QuestionText,
                                                    QuestionRatingId: info.QuestionRatingId,
                                                    QuestionShareId: info.QuestionShareId,
                                                    QuestionAnswerId: info.QuestionAnswerId,
                                                    AnswerRating: info.AnswerRating,
                                                    AnswerTopic: info.AnswerTopic,
                                                    AnswerTopicId: info.AnswerTopicId,
                                                    AnswerText: info.AnswerText,
                                                    ImpressionPostId: info.ImpressionPostId,
                                                    ImpressionFolllowId: info.ImpressionFolllowId,
                                                    Viewed: info.Viewed,
                                                    NotificationDate: info.createdAt || ''
                                                }
                                    );
                                    NotificationsArray.push(newArray[0]);
                                    resolve(FollowesData);
                                    
                                }
                            });
                        });
                      };
            
                }else{
                res.send({status:"True", message:'Unread Notifications Empty.' });
                }
            }
        });
};

exports.GetNotificationCount = function(req, res) {
    if(!req.params.UserId){
        res.status(500).send({status:"False", message: " User Id Is Missing!"});
    }
    NotificationModel.Notification.find({'ResponseUserId': req.params.UserId, 'Viewed': 0 }, { }, { sort:{createdAt : -1} }, function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error:err, message: "Follow User DB Error"});
            } else {
                res.send({status:"True", count: result.length });
            }
        });
};

exports.GetMobileNotification = function(req, res) {
    if(!req.params.UserId){
        res.status(500).send({status:"False", message: " User Id Is Missing!"});
    }
    NotificationModel.Notification.find({'ResponseUserId': req.params.UserId, 'Viewed': 0 }, { }, { sort:{createdAt : -1} }, function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error:err, message: "Follow User DB Error"});
            } else {
                if(result.length > 0){
                    var NotificationsArray = new Array();
                    GetUserData();
                    async function GetUserData(){
                        for (let info of result) {
                            await getUserInfo(info);
                         }
                        res.send({status:"True", data: NotificationsArray });
                      }
                      
                      function getUserInfo(info){
                        return new Promise(( resolve, reject )=>{
                            UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, FollowesData) {
                                if(err) {
                                    res.send({status:"False", Error:err });
                                    reject(err);
                                } else {
                                    
                                         var newArray = [];
                                    if (info.NotificationType === 0 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Followed You ',
                                                    RedirectId: FollowesData._id,
                                                    RedirectType: 1,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 5 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' posted a ' + info.HighlightPostType,
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 8 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Shared Your '+ info.HighlightPostType,
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 17 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Share the '+  info.SharedUserName + ' ' + info.HighlightPostType,
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 6 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName + ' Gave a ',
                                                    ShowSecondImage: true,
                                                    ThirdText: ' to your ' + info.HighlightPostType,
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 15 ) {
                                        var cmtext = '';
                                        if(info.AnswerText){
                                            var cmstr = info.CommentText;
                                            cmtext = cmstr.slice(0, 15);
                                        }
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName + ' Gave a ',
                                                    ShowSecondImage: true,
                                                    ThirdText: ' to your Comment “' + cmtext + '...”',
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 7 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Commented on your ' + info.HighlightPostType,
                                                    RedirectId: info.HighlightPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 9 ) {
                                        var Qstext = '';
                                        if(info.QuestionText){
                                            var Qsstr = info.QuestionText;
                                            Qstext = Qsstr.slice(0, 15);
                                        }
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Asked “' + Qstext + '...” in ' + info.QuestionTopic,
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 3,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 12 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Shared your Question in ' + info.QuestionTopic,
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 3,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 18 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Shared a Question i ' + info.QuestionTopic,
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 3,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 11 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName,
                                                    ShowSecondImage: false,
                                                    ThirdText: ' Answered your Question in ' + info.QuestionTopic,
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 3,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 10 ) {
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName + ' Gave ' + info.QuestionRating + ' ',
                                                    ShowSecondImage: true,
                                                    ThirdText: ' for your Question in ' + info.QuestionTopic,
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 3,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                    if (info.NotificationType === 16 ) {
                                        var Antext = '';
                                        if(info.AnswerText){
                                            var Anstr = info.AnswerText;
                                            Antext = Anstr.slice(0, 15);
                                        }
                                        newArray.push({
                                                    _id: info._id,
                                                    NotificationType: info.NotificationType,
                                                    UserId: FollowesData._id,
                                                    UserImage: FollowesData.UserImage,
                                                    FirstText: FollowesData.UserName + ' Gave ' + info.AnswerRating + ' ',
                                                    ShowSecondImage: true,
                                                    ThirdText: ' for your Answer in  “' + Antext + '...” ',
                                                    RedirectId: info.QuestionPostId,
                                                    RedirectType: 2,
                                                    NotificationDate: moment(info.createdAt).fromNow()
                                                    }
                                        );
                                        NotificationsArray.push(newArray[0]);
                                        resolve(newArray[0]);
                                    }
                                  
                                }
                            });
                        });
                      };
            
                }else{
                res.send({status:"True", message:'Unread Notifications Empty.' });
                }
            }
        });
};

exports.GetUserInfo = function(req, res) {
    UserModel.UserType.findOne( { '_id': req.params.UserId }, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Info."});
        } else {
            FollowModel.FollowUserType.count({'UserId': data._id}, function(newerr, count) {
                if(newerr){
                    res.send({status:"False", Error:newerr });
                }else{
                    FollowModel.FollowUserType.find({'UserId': req.params.LoginUserId, 'FollowingUserId': data._id }, function(someerr, findresult) {
                        if(someerr){
                            res.send({status:"False", Error:someerr });
                        }else{
                            var UserFollow = false;
                            var FollowDbId = '';
                            if(findresult.length > 0){
                                UserFollow = true;
                                FollowDbId = findresult[0]._id;
                            }
                            var newArray = [];
                                newArray.push({
                                                _id: data._id,
                                                UserName: data.UserName,
                                                UserEmail: data.UserEmail,
                                                UserCategoryId: data.UserCategoryId,
                                                UserCategoryName: data.UserCategoryName,
                                                UserImage: data.UserImage,
                                                UserCompany: data.UserCompany,
                                                UserProfession: data.UserProfession,
                                                Followers: count,
                                                UserFollow: UserFollow,
                                                FollowDbId: FollowDbId
                                            });
                            res.send({ status:"True",  data: newArray[0] });
                        }
                    });
                }
            });
        }
    });
};

exports.RemoveNotification = function(req, res) {
    NotificationModel.Notification.findOne({'_id': req.params.NotifyId}, {}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Find."});
        } else {
            data.Viewed = 1;
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Image ."});
                }else{
                    res.send({status:"True", data: newresult });
                }
            });
        }
    });
};