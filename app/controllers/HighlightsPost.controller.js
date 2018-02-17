var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentModel = require('../models/CommentAndAnswer.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var axios = require("axios");


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
    if(!req.body.PostType) {
        res.status(400).send({status:"False", message: " Post Type can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
    }



    if(req.body.PostLink !== '') {
        var LinkInfo = '';
        var str = req.body.PostLink;
        var n = str.indexOf('http://www.youtube');
        var n1 = str.indexOf('https://www.youtube');
        var n2 = str.indexOf('https://youtu');

        if( n !== -1 || n1 !== -1 || n2 !== -1  ) {
            gotonext();
        }else{
            axios.get('http://api.linkpreview.net/?key=5a883a1e4c1cd65a5a1d19ec7011bb4a8ee7426a5cdcb&q='+ req.body.PostLink )
            .then(response => {
                 LinkInfo = response.data;
                gotonext();
            })
            .catch(error => {
                gotonext();
            });
        }

    }else{
        gotonext();
    }

    function gotonext() {
        var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
            UserId: req.body.UserId,
            PostType: req.body.PostType,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostLinkInfo: LinkInfo,
            PostImage: req.body.PostImage || '',
            PostVideo: req.body.PostVideo || '',
            ActiveStates: 'Active'
        });

     
        varHighlightsPostType.save(function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});    
            } else {
                UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                    if(err) {
                        res.send({status:"False", Error:err });
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
                                                Followers: count,
                                                PostType: result.PostType,
                                                PostDate: result.PostDate,
                                                PostText: result.PostText ,
                                                PostLink: result.PostLink,
                                                PostLinkInfo: result.PostLinkInfo || '',
                                                PostImage: result.PostImage,
                                                PostVideo: result.PostVideo,
                                                LikesCount: 0,
                                                UserLiked: false,
                                                UserLikeId: '',
                                                comments: [],
                                                commentsCount: 1,
                                            }
                                );

                                if(count > 0){
                                    FollowModel.FollowUserType.find({'FollowingUserId': UserData._id},  function(someerr, followUsers) {
                                        if(someerr){
                                            res.send({status:"False", Error:someerr });
                                        }else{
                                            SetNofifiction();
                                            async function SetNofifiction(){
                                                for (let info of followUsers) {
                                                    await SetNotify(info);
                                                }
                                                res.send({status:"True", data:newArray[0] });
                                            }

                                            function SetNotify(info){
                                                return new Promise(( resolve, reject )=>{
                                                    var varNotification = new NotificationModel.Notification({
                                                        UserId:  req.body.UserId,
                                                        HighlightPostId: result._id,
                                                        ResponseUserId: info.UserId,
                                                        NotificationType: 5,
                                                        Viewed: 0,
                                                        NotificationDate: new Date
                                                    });
                                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                                        if(Nofifyerr) {
                                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                            reject(Nofifyerr);
                                                        } else {
                                                        resolve(Notifydata);
                                                        }
                                                    });
                                                })
                                            }
                                        }
                                    });
                                    
                                }else{
                                    res.send({status:"True", data: newArray[0] });
                                }
                            }
                        });
                    }
                });
            }
        });
    }

};



exports.GetPostList = function(req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    HighlightsPostModel.HighlightsPostType.find({'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}, skip: SkipCoun, limit: 10  }, function(err, result) {
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
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(inerr, UserData) {
                            if(inerr) {
                                res.send({status:"False", Error:inerr });
                                reject(inerr);
                            } else {
                                if(UserData !== null){
                                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(err);
                                        }else{
                                            LikeAndRating.HighlightsLike.count({'PostId': info._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                                if(NewErr){
                                                    res.send({status:"False", Error:NewErr });
                                                    reject(err);
                                                }else{
                                                    LikeAndRating.HighlightsLike.find({'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': UserData._id, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                                        if(someerr){
                                                            res.send({status:"False", Error:someerr });
                                                            reject(err);
                                                        }else{
        
                                                            if(newResult.length > 0){
                                                                var UserLiked = true;
                                                                var UserLikedId = newResult[0]._id;
                                                            }else{
                                                                var UserLiked = false;
                                                                var UserLikedId = '';
                                                            }

                                                            CommentModel.HighlightsComment.count({'PostId': info._id , 'ActiveStates':'Active' }, function(commentErr, commentCount) {
                                                                if(commentErr){
                                                                    res.send({status:"False", Error:commentErr });
                                                                    reject(err);
                                                                }else{ 

                                                                    CommentModel.HighlightsComment.find({'UserId':req.params.UserId, 'PostId': info._id, 'ActiveStates':'Active'}, function(nowerr, CommantData) {
                                                                        if(nowerr){
                                                                            res.send({status:"False", Error:nowerr });
                                                                            reject(nowerr);
                                                                        }else{
                                                                            var alreadyCommentuser = true;
                                                                            if(CommantData.length <= 0 ){
                                                                                alreadyCommentuser = false;
                                                                            }else{
                                                                                alreadyCommentuser = true;
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
                                                                                            Followers:count,
                                                                                            UserCommented: alreadyCommentuser,
                                                                                            _id: info._id,
                                                                                            PostType: info.PostType,
                                                                                            PostDate: info.PostDate,
                                                                                            PostText: info.PostText ,
                                                                                            PostLink: info.PostLink,
                                                                                            PostLinkInfo: info.PostLinkInfo || '',
                                                                                            PostImage: info.PostImage,
                                                                                            PostVideo: info.PostVideo,
                                                                                            LikesCount: NewCount,
                                                                                            UserLiked: UserLiked,
                                                                                            UserLikeId: UserLikedId,
                                                                                            comments: [],
                                                                                            commentsCount : commentCount
                                                                                        }
                                                                            );
                                                                            PostsArray.push(newArray[0]);
                                                                            resolve(UserData);
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
                                }else{
                                    resolve(UserData);
                                }
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












exports.ViewPost = function(req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    HighlightsPostModel.HighlightsPostType.findOne({'_id': req.params.PostId},  function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            UserModel.UserType.findOne({'_id': req.params.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"False", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                        }else{
                            LikeAndRating.HighlightsLike.count({'PostId': result._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                if(NewErr){
                                    res.send({status:"False", Error:NewErr });
                                }else{
                                    LikeAndRating.HighlightsLike.find({'UserId': req.params.UserId, 'PostId': result._id, 'PostUserId': UserData._id, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                        if(someerr){
                                            res.send({status:"False", Error:someerr });
                                        }else{

                                            if(newResult.length > 0){
                                                var UserLiked = true;
                                                var UserLikedId = newResult[0]._id;
                                            }else{
                                                var UserLiked = false;
                                                var UserLikedId = '';
                                            }

                                            CommentModel.HighlightsComment.count({'PostId': result._id , 'ActiveStates':'Active' }, function(commentErr, commentCount) {
                                                if(commentErr){
                                                    res.send({status:"False", Error:commentErr });
                                                }else{
                                                    CommentModel.HighlightsComment.find({'UserId':req.params.UserId, 'PostId': result._id}, function(nowerr, CommantData) {
                                                        if(nowerr){
                                                            res.send({status:"False", Error:nowerr });
                                                            reject(nowerr);
                                                        }else{
                                                            var alreadyCommentuser = true;
                                                            if(CommantData.length <= 0 ){
                                                                alreadyCommentuser = false;
                                                            }else{
                                                                alreadyCommentuser = true;
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
                                                                            UserCommented: alreadyCommentuser,
                                                                            Followers:count,
                                                                            _id: result._id,
                                                                            PostType: result.PostType,
                                                                            PostDate: result.PostDate,
                                                                            PostText: result.PostText ,
                                                                            PostLink: result.PostLink,
                                                                            PostLinkInfo: result.PostLinkInfo || '',
                                                                            PostImage: result.PostImage,
                                                                            PostVideo: result.PostVideo,
                                                                            LikesCount: NewCount,
                                                                            UserLiked: UserLiked,
                                                                            UserLikeId: UserLikedId,
                                                                            comments: [],
                                                                            commentsCount : commentCount
                                                                        }
                                                            );
                                                            res.send({status:"True", data: newArray });
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
                }
            });
        }
    });
                    
};