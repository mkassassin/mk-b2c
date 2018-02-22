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
    UserEmailVerifyToken: false,
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
                    res.send({status:"False", Error:err });
                } else {
                    var varNotification = new NotificationModel.Notification({
                            UserId:  req.body.UserId,
                            HighlightPostId: req.body.PostId,
                            ResponseUserId: req.body.PostUserId,
                            HighlightCommentId: result._id,
                            NotificationType: 7,
                            Viewed: 0,
                            NotificationDate: new Date()
                    });
                    varNotification.save(function(Nofifyerr, Notifydata) {
                        if(Nofifyerr) {
                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                            
                        } else {
                            FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                if(newerr){
                                    res.send({status:"False", Error:newerr });
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
                                                    UserCommented: true,
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

exports.CommentUpdate = function(req, res) {
    if(!req.body._id) {
        res.status(400).send({status:"False", message: " Post can not be Empty! "});
    }
    if(!req.body.CommentText) {
        res.status(400).send({status:"False", message: " Comment Text can not be Empty! "});
    }

    Model.HighlightsComment.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.CommentText = req.body.CommentText,
                data.save(function (newerr, newresult) {
                    if (newerr){
                        res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Post ."});
                    }else{
                        res.send({status:"True", data: newresult });
                    }
                });
            }
        });
};

exports.GetHighlightsComments = function(req, res) {
    Model.HighlightsComment.find({'PostId': req.params.PostId, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}, limit: 2}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Comments ."});
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
                                res.send({status:"False", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': UserData._id}, function(nowerr, FollowesData) {
                                                if(nowerr){
                                                    res.send({status:"False", Error:nowerr });
                                                    reject(nowerr);
                                                }else{
                                                    var alreadyfollowuser = true;
                                                    if(FollowesData.length <= 0 && req.params.UserId != UserData._id){
                                                        alreadyfollowuser = false;
                                                    }else{
                                                        alreadyfollowuser = true;
                                                    }
                                                    var newArray = [];
                                                    newArray.push( {
                                                                    UserId: UserData._id,
                                                                    UserName: UserData.UserName,
                                                                    UserCategoryId: UserData.UserCategoryId,
                                                                    UserCategoryName: UserData.UserCategoryName,
                                                                    UserImage: UserData.UserImage,
                                                                    UserCompany: UserData.UserCompany,
                                                                    UserProfession: UserData.UserProfession,
                                                                    AlreadyFollow: alreadyfollowuser,
                                                                    Followers:count,
                                                                    _id: info._id,
                                                                    CommentText: info.CommentText,
                                                                    Date: info.Date,
                                                                    PostId: req.params.PostId,
                                                                }
                                                    );
                                                    CommentsArray.push(newArray[0]);
                                                    resolve(UserData);
                                                }
                                            });
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

exports.GetHighlightsAllComments = function(req, res) {
    Model.HighlightsComment.find({'PostId': req.params.PostId, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Comments ."});
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
                                res.send({status:"False", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': UserData._id}, function(nowerr, FollowesData) {
                                                if(nowerr){
                                                    res.send({status:"False", Error:nowerr });
                                                    reject(nowerr);
                                                }else{
                                                    var alreadyfollowuser = true;
                                                    if(FollowesData.length <= 0 && req.params.UserId != UserData._id){
                                                        alreadyfollowuser = false;
                                                    }else{
                                                        alreadyfollowuser = true;
                                                    }
                                                    var newArray = [];
                                                    newArray.push( {
                                                                    UserId: UserData._id,
                                                                    UserName: UserData.UserName,
                                                                    UserCategoryId: UserData.UserCategoryId,
                                                                    UserCategoryName: UserData.UserCategoryName,
                                                                    UserImage: UserData.UserImage,
                                                                    UserCompany: UserData.UserCompany,
                                                                    UserProfession: UserData.UserProfession,
                                                                    AlreadyFollow: alreadyfollowuser,
                                                                    Followers:count,
                                                                    _id: info._id,
                                                                    CommentText: info.CommentText,
                                                                    Date: info.Date,
                                                                    PostId: req.params.PostId,
                                                                }
                                                    );
                                                    CommentsArray.push(newArray[0]);
                                                    resolve(UserData);
                                                }
                                            });
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





exports.QuestionsAnswerAdd = function(req, res) {

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

    var varQuestionsAnswer = new Model.QuestionsAnswer({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            AnswerText:req.body.AnswerText,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    varQuestionsAnswer.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Like the Post."});
            
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"False", Error:err });
                } else {
                    var varNotification = new NotificationModel.Notification({
                        UserId:  req.body.UserId,
                        QuestionPostId: req.body.PostId,
                        ResponseUserId: req.body.PostUserId,
                        QuestionAnswerId: result._id,
                        NotificationType: 11,
                        Viewed: 0,
                        NotificationDate: new Date()
                    });
                    varNotification.save(function(Nofifyerr, Notifydata) {
                        if(Nofifyerr) {
                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                            
                        } else {
                            FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                if(newerr){
                                    res.send({status:"False", Error:newerr });
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
                                                    AlreadyFollow: true,
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

exports.AnswerUpdate = function(req, res) {
    if(!req.body._id) {
        res.status(400).send({status:"False", message: " Post can not be Empty! "});
    }
    if(!req.body.AnswerText) {
        res.status(400).send({status:"False", message: " Answer Text can not be Empty! "});
    }

    Model.QuestionsAnswer.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.AnswerText = req.body.AnswerText,
                data.save(function (newerr, newresult) {
                    if (newerr){
                        res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Post ."});
                    }else{
                        res.send({status:"True", data: newresult });
                    }
                });
            }
        });
};

exports.GetQuestionsAnswers = function(req, res) {
    Model.QuestionsAnswer.find({'PostId': req.params.PostId, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}, limit: 3}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Answers ."});
        } else {
            if(result.length > 0){
                var AnswersArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: AnswersArray });
                  }
                  
                  function getUserInfo(ansInfo){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': ansInfo.UserId }, usersProjection, function(err, AnsUserData) {
                            if(err) {
                                res.send({status:"False", Error:err });
                                reject(err);
                            } else {
                                FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                    if(newerr){
                                        res.send({status:"False", Error:newerr });
                                        reject(newerr);
                                    }else{
                                        FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': AnsUserData._id}, function(nowerr, FollowesData) {
                                            if(nowerr){
                                                res.send({status:"False", Error:nowerr });
                                                reject(nowerr);
                                            }else{
                                                var alreadyfollowuser = true;
                                                if(FollowesData.length <= 0 && req.params.UserId != AnsUserData._id){
                                                    alreadyfollowuser = false;
                                                }else{
                                                    alreadyfollowuser = true;
                                                }
                                                var newArray = [];
                                                newArray.push( {
                                                                _id: ansInfo._id,
                                                                UserId: AnsUserData._id,
                                                                UserName: AnsUserData.UserName,
                                                                UserCategoryId: AnsUserData.UserCategoryId,
                                                                UserCategoryName: AnsUserData.UserCategoryName,
                                                                UserImage: AnsUserData.UserImage,
                                                                UserCompany: AnsUserData.UserCompany,
                                                                UserProfession: AnsUserData.UserProfession,
                                                                AlreadyFollow: alreadyfollowuser,
                                                                Followers: count,
                                                                Date: ansInfo.Date,
                                                                PostId: ansInfo.PostId,
                                                                PostUserId: ansInfo.PostUserId ,
                                                                AnswerText: ansInfo.AnswerText
                                                            }
                                                );
                                                AnswersArray.push(newArray[0]);
                                                resolve(newArray[0]);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
        
            }else{
                res.send({status:"True", message:'No More Answers' });
            }
        }
    });
};

exports.GetQuestionsAllAnswers = function(req, res) {
    Model.QuestionsAnswer.find({'PostId': req.params.PostId, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Answers ."});
        } else {
            if(result.length > 0){
                var AnswersArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: AnswersArray });
                  }
                  
                  function getUserInfo(ansInfo){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': ansInfo.UserId }, usersProjection, function(err, AnsUserData) {
                            if(err) {
                                res.send({status:"False", Error:err });
                                reject(err);
                            } else {
                                FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                    if(newerr){
                                        res.send({status:"False", Error:newerr });
                                        reject(newerr);
                                    }else{
                                        FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': AnsUserData._id}, function(nowerr, FollowesData) {
                                            if(nowerr){
                                                res.send({status:"False", Error:nowerr });
                                                reject(nowerr);
                                            }else{
                                                var alreadyfollowuser = true;
                                                if(FollowesData.length <= 0 && req.params.UserId != AnsUserData._id){
                                                    alreadyfollowuser = false;
                                                }else{
                                                    alreadyfollowuser = true;
                                                }
                                                var newArray = [];
                                                newArray.push( {
                                                                _id: ansInfo._id,
                                                                UserId: AnsUserData._id,
                                                                UserName: AnsUserData.UserName,
                                                                UserCategoryId: AnsUserData.UserCategoryId,
                                                                UserCategoryName: AnsUserData.UserCategoryName,
                                                                UserImage: AnsUserData.UserImage,
                                                                UserCompany: AnsUserData.UserCompany,
                                                                UserProfession: AnsUserData.UserProfession,
                                                                AlreadyFollow: alreadyfollowuser,
                                                                Followers: count,
                                                                Date: ansInfo.Date,
                                                                PostId: ansInfo.PostId,
                                                                PostUserId: ansInfo.PostUserId ,
                                                                AnswerText: ansInfo.AnswerText
                                                            }
                                                );
                                                AnswersArray.push(newArray[0]);
                                                resolve(newArray[0]);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
        
            }else{
                res.send({status:"True", message:'No More Answers' });
            }
        }
    });
};