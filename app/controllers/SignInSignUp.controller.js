var UserModel = require('../models/SignInSignUp.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var FollowModel = require('../models/Follow.model.js');


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kathiraashi@gmail.com',
      pass: 'kathiraashi123'
    }
  });
  
  var usersProjection = { 
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserDateOfBirth: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
};

exports.Register = function(req, res) {
    if(!req.body.UserName) {
        res.status(400).send({status:"False", message: " Name can not be Empty! "});
    }
    if(!req.body.UserEmail){
        res.status(400).send({status:"False", message: " E-mail can not be Empty! "});
    }
    if(!req.body.UserPassword){
        res.status(400).send({status:"False", message: " Password can not be Empty! "});
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
            UserCompany:req.body.UserCompany || "",
            UserProfession:req.body.UserProfession || "",
            UserDateOfBirth:req.body.UserDateOfBirth || "",
            UserGender:req.body.UserGender || "",
            UserCountry:req.body.UserCountry || "",
            UserState:req.body.UserState || "",
            UserCity:req.body.UserCity || ""
    });

     
    varUserType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while creating the Account."});            
        } else {
            res.send({status:"True", data: result });
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
            res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
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
                res.send({ status:"True", message: "Sign In Successfully", data:data });
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
    NotificationModel.Notification.find({'ResponseUserId': req.params.UserId, 'Viewed': 0 }, function(err, result) {
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
                                    res.send({status:"Fale", Error:err });
                                    reject(err);
                                } else {
                                    var newArray = [];
                                    newArray.push( {
                                                    _id: info._id,
                                                    UserId: FollowesData._id,
                                                    UserName: FollowesData.UserName,
                                                    UserCategoryName: FollowesData.UserCategoryName,
                                                    UserImage: FollowesData.UserImage,
                                                    NotificationType: info.NotificationType,
                                                    FollowUserId: info.FollowUserId,
                                                    FollowTopicId: info.FollowTopicId,
                                                    HighlightPostId: info.HighlightPostId,
                                                    HighlightLikeId: info.HighlightLikeId,
                                                    HighlightCommentId: info.HighlightCommentId,
                                                    HighlightShareId: info.HighlightShareId,
                                                    QuestionPostId: info.QuestionPostId,
                                                    QuestionRatingId: info.QuestionRatingId,
                                                    QuestionShareId: info.QuestionShareId,
                                                    QuestionAnswerId: info.QuestionAnswerId,
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
                res.send({status:"True", message:'Un Read Notifications Empty.' });
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
                    res.send({status:"Fale", Error:newerr });
                }else{
                    FollowModel.FollowUserType.find({'UserId': req.params.LoginUserId, 'FollowingUserId': data._id }, function(someerr, findresult) {
                        if(someerr){
                            res.send({status:"Fale", Error:someerr });
                        }else{
                            var UserFollow = false;
                            var FollowDbId = '';
                            if(findresult.length > 0){
                                UserFollow = true;
                                FollowDbId = findresult[0]._id;
                            }
                            var newArray = [];
                                newArray.push( {
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
                                            }
                                );
                            res.send({ status:"True",  data: newArray[0] });
                        }
                    });
                }
            });
        }
    });
};