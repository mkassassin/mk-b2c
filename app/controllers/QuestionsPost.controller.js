var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var RatingModel = require('../models/LikeAndRating.model.js');
var AnswerModel = require('../models/CommentAndAnswer.model.js');

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

exports.Submit = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostTopicName || !req.body.PostTopicId) {
        res.status(400).send({status:"False", message: " Post Topic can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
    }

    var QuestionsPostType = new QuestionsPostModel.QuestionsPostType({
            UserId: req.body.UserId,
            PostTopicId: req.body.PostTopicId,
            PostTopicName: req.body.PostTopicName,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostImage: req.body.PostImage || '',
            PostVideo: req.body.PostVideo || '',
            ActiveStates: 'Active'
    });

     
    QuestionsPostType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"Fale", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                            res.send({status:"Fale", Error:newerr });
                        }else{
                            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                                if(err) {
                                    res.send({status:"Fale", Error:err });
                                } else {
                                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
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
                                                            PostTopicId: result.PostTopicId,
                                                            PostTopicName: result.PostTopicName,
                                                            PostDate: result.PostDate,
                                                            PostText: result.PostText ,
                                                            PostLink: result.PostLink,
                                                            PostImage: result.PostImage,
                                                            PostVideo: result.PostVideo,
                                                            RatingCount: 0,
                                                            UserRating: false,
                                                            Answers: [],
                                                            AnswersCount: 1,
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
        }
    });
};



exports.GetPostList = function(req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    QuestionsPostModel.QuestionsPostType.find({}, {} , {sort:{createdAt : -1}, skip: SkipCoun, limit: 10  }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                var PostsArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: PostsArray });
                  }
                  
                  function getUserInfo(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, UserData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
                                    if(newerr){
                                        res.send({status:"Fale", Error:newerr });
                                        reject(err);
                                    }else{
                                        RatingModel.QuestionsRating.count({'PostId': info._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                            if(NewErr){
                                                res.send({status:"Fale", Error:NewErr });
                                                reject(err);
                                            }else{
                                                RatingModel.QuestionsRating.find({'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': UserData._id, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                                    if(someerr){
                                                        res.send({status:"Fale", Error:someerr });
                                                        reject(err);
                                                    }else{
    
                                                        if(newResult.length > 0){
                                                            var UserRating = true;
                                                        }else{
                                                            var UserRating = false;
                                                        }

                                                        AnswerModel.QuestionsAnwer.count({'PostId': info._id , 'ActiveStates':'Active' }, function(commentErr, AnswerCount) {
                                                            if(commentErr){
                                                                res.send({status:"Fale", Error:commentErr });
                                                                reject(err);
                                                            }else{
                                                                if(AnswerCount > 0){
                                                                    AnswerModel.QuestionsAnwer.find({'PostId': info._id , 'ActiveStates':'Active' }, {} , {sort:{createdAt : -1}, limit:3 }, function(AnswerErr, AnswerArray) {
                                                                        if(AnswerErr){
                                                                            res.send({status:"Fale", Error:AnswerErr });
                                                                            reject(err);
                                                                        }else{
                                                                            var AnswerArray = new Array();
                                                                            GetAnswerData();
                                                                            async function GetAnswerData(){
                                                                                for (let newinfo of AnswerArray) {
                                                                                    await getAnswerInfo(newinfo);
                                                                                }
                                                                                var newArray = [];
                                                                                newArray.push({
                                                                                                _id: info._id,
                                                                                                UserId: UserData._id,
                                                                                                UserName: UserData.UserName,
                                                                                                UserCategoryId: UserData.UserCategoryId,
                                                                                                UserCategoryName: UserData.UserCategoryName,
                                                                                                UserImage: UserData.UserImage,
                                                                                                UserCompany: UserData.UserCompany,
                                                                                                UserProfession: UserData.UserProfession,
                                                                                                Followers:count,
                                                                                                PostTopicId: info.PostTopicId,
                                                                                                PostTopicName: info.PostTopicName,
                                                                                                PostDate: info.PostDate,
                                                                                                PostText: info.PostText ,
                                                                                                PostLink: info.PostLink,
                                                                                                PostImage: info.PostImage,
                                                                                                PostVideo: info.PostVideo,
                                                                                                RatingCount: NewCount,
                                                                                                UserRating: UserRating,
                                                                                                Answers: AnswerArray,
                                                                                                AnswersCount: AnswerCount,
                                                                                            }
                                                                                    );
                                                                                PostsArray.push(newArray[0]);

                                                                                function getAnswerInfo(newinfo){  
                                                                                    
                                                                                    return new Promise(( resolve, reject )=>{
                                                                                        UserModel.UserType.findOne({'_id': newinfo.UserId }, usersProjection, function(AnswerErr, AnswerUserData) {
                                                                                            if(AnswerErr) {
                                                                                                res.send({status:"Fale", Error:AnswerErr });
                                                                                                reject(AnswerErr);
                                                                                            } else {
                                                                                                console.log(AnswerUserData);
                                                                                                FollowModel.FollowUserType.count({'UserId': AnswerUserData._id}, function(AnswerFollowErr, AnswerUserFollowcount) {
                                                                                                    if(AnswerFollowErr){
                                                                                                        res.send({status:"Fale", Error:AnswerFollowErr });
                                                                                                        reject(err);
                                                                                                    }else{
                                                                                                        var newAnsArray = [];
                                                                                                        newAnsArray.push({
                                                                                                                        _id: newinfo._id,
                                                                                                                        UserName: AnswerUserData.UserName,
                                                                                                                        UserCategoryId: AnswerUserData.UserCategoryId,
                                                                                                                        UserCategoryName: AnswerUserData.UserCategoryName,
                                                                                                                        UserImage: AnswerUserData.UserImage,
                                                                                                                        UserCompany: AnswerUserData.UserCompany,
                                                                                                                        UserProfession: AnswerUserData.UserProfession,
                                                                                                                        Followers:AnswerUserFollowcount,
                                                                                                                        Date: info.Date,
                                                                                                                        AnswerText: info.AnswerText ,
                                                                                                                    }
                                                                                                            );
                                                                                                            AnswerArray.push(newAnsArray[0]);
                                                                                                        resolve(AnswerUserData);
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    })
                                                                                }

                                                                            resolve(newArray[0]);
                                                                            }

                                                                        }
                                                                    });

                                                                }else{
                                                                    var newArray = [];
                                                                    newArray.push( {
                                                                                    _id: info._id,
                                                                                    UserId: UserData._id,
                                                                                    UserName: UserData.UserName,
                                                                                    UserCategoryId: UserData.UserCategoryId,
                                                                                    UserCategoryName: UserData.UserCategoryName,
                                                                                    UserImage: UserData.UserImage,
                                                                                    UserCompany: UserData.UserCompany,
                                                                                    UserProfession: UserData.UserProfession,
                                                                                    Followers:count,
                                                                                    PostTopicId: info.PostTopicId,
                                                                                    PostTopicName: info.PostTopicName,
                                                                                    PostDate: info.PostDate,
                                                                                    PostText: info.PostText ,
                                                                                    PostLink: info.PostLink,
                                                                                    PostImage: info.PostImage,
                                                                                    PostVideo: info.PostVideo,
                                                                                    RatingCount: NewCount,
                                                                                    UserRating: UserRating,
                                                                                    Answers: [],
                                                                                    AnswersCount: 0,
                                                                                }
                                                                        );
                                                                    PostsArray.push(newArray[0]);
                                                                    resolve(UserData);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No More Posts' });
            }
        }
    });
};