var UserModel = require('../models/SignInSignUp.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');

var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "b2cnetworkapp@gmail.com",
        pass: "cryptoamillion"
    }
});

var rand,mailOptions,host,link;
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
                    link = "http://www.b2c.network/SetNewpassword/" + data._id + "/" + rand;
                    mailOptions = {
                        to: req.params.email,
                        subject: "Please confirm your Email account",
                        html: "Hello,<br> Please Click on the link to verify your email And Reset Your Password.<br><a href=" + link + ">Click here to verify</a>"
                    };
                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        console.log(error, response);
                        if (error) {
                            res.send({ status:"False", Error: error,  message: "Some error occurred" });
                        } else {
                            data.UserEmailVerifyToken = rand;
                            data.save(function (newerr, newresult) {
                                if (newerr){
                                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UserEmailVerifyToken ."});
                                }else{
                                    res.send({ status:"True", data:response });
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
                FollowModel.FollowUserType.count({'UserId': data._id}, function(newerr, count) {
                    if(newerr){
                        res.send({status:"False", Error:newerr });
                    }else{
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
};



exports.MobileUserValidate= function(req, res) {
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
                res.send({ status:"True", message: "Sign In Successfully", data:data });
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