var Model = require('../models/CommentAndAnswer.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');

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



exports.HighlightsCommentAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " PostUserId can not be Empty! "});
    }
    if(!req.body.CommentText) {
        res.status(400).send({status:"False", message: " Comment can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }


    var varHighlightsComment = new Model.HighlightsComment({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            CommentText: req.body.CommentText,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    varHighlightsComment.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Like the Post."});
            
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"Fale", Error:err });
                } else {
                    var varNotification = new NotificationModel.Notification({
                            UserId:  req.body.UserId,
                            HighlightPostId: req.body.PostId,
                            ResponseUserId: req.body.PostUserId,
                            HighlightCommentId: result._id,
                            NotificationType: 7,
                            Viewed: 0,
                            NotificationDate: new Date
                    });
                    varNotification.save(function(Nofifyerr, Notifydata) {
                        if(Nofifyerr) {
                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                            
                        } else {
                            FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                if(newerr){
                                    res.send({status:"Fale", Error:newerr });
                                }else{
                                    var newArray = [];
                                    newArray.push( {
                                                    _id: result._id,
                                                    UserId: UserData._id,
                                                    UserName: UserData.UserName,
                                                    UserCategoryId: UserData.UserCategoryId,
                                                    UserCategoryName: UserData.UserCategoryName,
                                                    UserImage: UserData.UserImage,
                                                    UserCompany: UserData.UserCompany,
                                                    UserProfession: UserData.UserProfession,
                                                    Followers: count,
                                                    Date: result.Date,
                                                    PostId: result.PostId,
                                                    PostUserId: result.PostUserId ,
                                                    CommentText: result.CommentText
                                                }
                                    );
                                    res.send({status:"True", data: newArray[0] });
                                }
                            });
                        }
                    });
                 }
            });
        }
    });   
};






exports.GetHighlightsComments = function(req, res) {
    Model.HighlightsComment.find({'PostId': req.params.PostId }, {} , {sort:{createdAt : -1}, limit: 3}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Commants ."});
        } else {
            if(result.length > 0){
                var CommentsArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: CommentsArray });
                  }
                  
                  function getUserInfo(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, UserData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(err);
                                        }else{
                                            var newArray = [];
                                            newArray.push( {
                                                            UserId: UserData._id,
                                                            UserName: UserData.UserName,
                                                            UserCategoryId: UserData.UserCategoryId,
                                                            UserCategoryName: UserData.UserCategoryName,
                                                            UserImage: UserData.UserImage,
                                                            UserCompany: UserData.UserCompany,
                                                            UserProfession: UserData.UserProfession,
                                                            Followers:count,
                                                            _id: info._id,
                                                            CommentText: info.CommentText,
                                                            PostId: req.params.PostId,
                                                        }
                                            );
                                            CommentsArray.push(newArray[0]);
                                            resolve(UserData);
                                        }
                                    });
                                }else{
                                    resolve(UserData);
                                }
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No More Comments' });
            }
        }
    });
};







exports.QuestionsAnwerAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " PostUserId can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }
    if(!req.body.AnswerText) {
        res.status(400).send({status:"False", message: " Answer can not be Empty! "});
    }

    var varQuestionsAnwer = new Model.QuestionsAnwer({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            AnswerText:req.body.AnswerText,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    varQuestionsAnwer.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Like the Post."});
            
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"Fale", Error:err });
                } else {
                    var varNotification = new NotificationModel.Notification({
                        UserId:  req.body.UserId,
                        QuestionPostId: req.body.PostId,
                        ResponseUserId: req.body.PostUserId,
                        QuestionAnswerId: result._id,
                        NotificationType: 11,
                        Viewed: 0,
                        NotificationDate: new Date
                    });
                    varNotification.save(function(Nofifyerr, Notifydata) {
                        if(Nofifyerr) {
                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                            
                        } else {
                            FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                if(newerr){
                                    res.send({status:"Fale", Error:newerr });
                                }else{
                                    var newArray = [];
                                    newArray.push( {
                                                    _id: result._id,
                                                    UserId: UserData._id,
                                                    UserName: UserData.UserName,
                                                    UserCategoryId: UserData.UserCategoryId,
                                                    UserCategoryName: UserData.UserCategoryName,
                                                    UserImage: UserData.UserImage,
                                                    UserCompany: UserData.UserCompany,
                                                    UserProfession: UserData.UserProfession,
                                                    Followers: count,
                                                    Date: result.Date,
                                                    PostId: result.PostId,
                                                    PostUserId: result.PostUserId ,
                                                    AnswerText: result.AnswerText
                                                }
                                    );
                                    res.send({status:"True", data: newArray[0] });
                                }
                            });
                        }
                    });
                 }
            });
        }
    });

     
};
