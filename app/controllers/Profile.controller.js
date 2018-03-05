var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentAndAnswer = require('../models/CommentAndAnswer.model.js');
var SharePosts = require('../models/SharePost.model.js');

var moment = require("moment");

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



exports.Timeline = function (req, res) {
    QuestionsPostModel.QuestionsPostType.find({'UserId' : req.params.UserId, 'ActiveStates': 'Active' }, {} , { sort: { createdAt: -1 } }, function (queserr, QuesData) {
        if (queserr) {
            res.status(500).send({ status: "False", Error: queserr,  message: "Some error occurred while Find Question Post ." });
        } else {
            HighlightsPostModel.HighlightsPostType.find({'UserId' : req.params.UserId, 'ActiveStates': 'Active' }, {} , { sort: { createdAt: -1 } }, function (anserr, AnsData) {
                if (anserr) {
                    res.status(500).send({ status: "False", Error: anserr, message: "Some error occurred while Find Answers Post ." });
                } else {


                    var GetUserData = (result) =>
                    Promise.all(
                        result.map(info => getPostInfo(info))
                    ).then( result =>{  res.send({ status: "True", data: result }) }
                    ).catch(err => res.send({ status: "False", Error: err }));
    
    
                var getPostInfo = info =>
                    Promise.all([
                        UserModel.UserType.findOne({ '_id': info.UserId }, usersProjection).exec(),
                        FollowModel.FollowUserType.count({ 'UserId': info.UserId }).exec(),
                        LikeAndRating.QuestionsRating.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        LikeAndRating.QuestionsRating.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                        LikeAndRating.HighlightsLike.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        LikeAndRating.HighlightsLike.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.HighlightsComment.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.QuestionsAnswer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.QuestionsAnswer.find({ 'PostId': info._id, 'ActiveStates': 'Active' }, 'AnswerText UserId Date', { limit: 2 }).exec(),
                        CommentAndAnswer.HighlightsComment.find({'UserId': req.params.UserId, 'PostId': info._id, 'ActiveStates': 'Active'},{ limit: 2 }).exec(),
                        SharePosts.SharePost.count({'PostType': 'Highlights', PostId: info._id }).exec(),
                        SharePosts.SharePost.find({'PostType': 'Highlights', PostId: info._id, UserId: req.params.UserId  }).exec(),
                        SharePosts.SharePost.count({'PostType': 'Questions', PostId: info._id }).exec(),
                        SharePosts.SharePost.find({'PostType': 'Questions', PostId: info._id, UserId: req.params.UserId  }).exec(),
                    ]).then(data => {
                        var UserData = data[0];
                        var followCount = data[1];
                        var ratingCount = data[2];
                        var RatingList = data[3];
                        var LikingCount = data[4];
                        var UserLike = data[5];
                        var CommentCount = data[6];
                        var AnswerCount = data[7];
                        var Answerdata = data[8];
                        var CommantData = data[9];
                        var HighlightsShareCount = data[10];
                        var HighlightsShared = data[11];
                        var QusShareCount = data[12];
                        var QusUserShared = data[13];
    

                    if(info.PostTopicId){
    
                        var AnswersArray= new Array();
                        var RatingCal = 0 ;
                       return GetAnsUserData();
                        async function GetAnsUserData(){
                            for (var ansInfo of Answerdata) {
                                await getAnswerInfo(ansInfo);
                             }
                             return RatingCountFonction();
                                async function RatingCountFonction(){
                                    for (let rateInfo of RatingList) {
                                        await getRatingInfo(rateInfo);
                                    }
                                var userRated = false;
                                var userRating = 0 ;
                                    if(userRating.length > 0){
                                        userRated = true;
                                        userRating = userRating[0].Rating;  
                                    }else{
                                        userRated = false;
                                        userRating = 0;
                                    }
                                var alreadyShared = true;
                                    if(QusUserShared.length <= 0 ){
                                        alreadyShared = false;
                                    }else{
                                        alreadyShared = true;
                                    } 
                                var result = {
                                    Type:'Question',
                                    _id: info._id,
                                    UserId: UserData._id,
                                    UserName: UserData.UserName,
                                    UserCategoryId: UserData.UserCategoryId,
                                    UserCategoryName: UserData.UserCategoryName,
                                    UserImage: UserData.UserImage,
                                    UserCompany: UserData.UserCompany,
                                    UserProfession: UserData.UserProfession,
                                    Followers:followCount,
                                    PostTopicId: info.PostTopicId,
                                    PostTopicName: info.PostTopicName,
                                    PostDate: info.PostDate,
                                    timeAgo: moment(info.updatedAt).fromNow(),
                                    PostText: info.PostText ,
                                    PostLink: info.PostLink,
                                    PostLinkInfo: info.PostLinkInfo || '',
                                    PostImage: info.PostImage,
                                    PostVideo: info.PostVideo,
                                    Shared: info.Shared || '',
                                    ShareUserName: info.ShareUserName,
                                    ShareUserId: info.ShareUserId,
                                    SharePostId: info.SharePostId,
                                    RatingCount: JSON.parse(RatingCal) / JSON.parse(ratingCount),
                                    userRated: userRated,
                                    UserRating: userRating,
                                    AnswersCount: AnswerCount,
                                    ShareCount: QusShareCount,
                                    UserShared: alreadyShared,
                                    Answers: AnswersArray,
                                };
                                return result;
                            }
                          }
                          
                          function getRatingInfo(rateInfo){
                            return new Promise(( resolve, reject )=>{
                                LikeAndRating.QuestionsRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
                                    if(Rateerr) {
                                        res.send({status:"False", Error:Rateerr });
                                        reject(Rateerr);
                                    } else {
                                        RatingCal += JSON.parse(RateData.Rating);
                                        resolve(RateData);
                                    }
                                });
                            });
                        }

                          function getAnswerInfo(ansInfo){
                            return new Promise(( resolve, reject ) => {
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
                                                        LikeAndRating.AnswerRating.count({'AnswerId': ansInfo._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                                            if(NewErr){
                                                                res.send({status:"False", Error:NewErr });
                                                                reject(err);
                                                            }else{
                                                                LikeAndRating.AnswerRating.find({'UserId': req.params.UserId, 'AnswerId': ansInfo._id, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                                                    if(someerr){
                                                                        res.send({status:"False", Error:someerr });
                                                                        reject(err);
                                                                    }else{
                                                                        var userRated = false;
                                                                        var userRating = 0 ;
                                                                            if(newResult.length > 0){
                                                                                userRated = true;
                                                                                userRating = newResult[0].Rating;
                                                                                
                                                                            }else{
                                                                                userRated = false;
                                                                                userRating = 0;
                                                                            }
    
                                                                            var alreadyfollowuser = true;
                                                                            if(FollowesData.length <= 0 && req.params.UserId != AnsUserData._id){
                                                                                alreadyfollowuser = false;
                                                                            }else{
                                                                                alreadyfollowuser = true;
                                                                            }
                                                                        var AnsRatingCal = 0;
                                                                        if(NewCount > 0) {
                                                                            LikeAndRating.AnswerRating.find({'AnswerId': ansInfo._id , 'ActiveStates':'Active' }, function(NewErrAns, AnsRatings) {
                                                                                if(NewErrAns){
                                                                                    res.send({status:"False", Error:NewErrAns });
                                                                                    reject(NewErrAns);
                                                                                }else{
                                                                                    AswerRatingCount();
                                                                                        async function AswerRatingCount() {
                                                                                            for (let rateInfo of AnsRatings) {
                                                                                                 await getAnsRatingInfo(rateInfo);
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
                                                                                                        timeAgo: moment(ansInfo.updatedAt).fromNow(),
                                                                                                        RatingCount: JSON.parse(AnsRatingCal) / JSON.parse(NewCount),
                                                                                                        userRated: userRated,
                                                                                                        userRating: userRating,
                                                                                                        PostId: ansInfo.PostId,
                                                                                                        PostUserId: ansInfo.PostUserId ,
                                                                                                        AnswerText: ansInfo.AnswerText
                                                                                                    }
                                                                                        );
                                                                                        AnswersArray.push(newArray[0]);
                                                                                        resolve(newArray[0]);
                                                                                    }
    
                                                                                    function getAnsRatingInfo(rateInfo){
                                                                                        return new Promise(( resolve, reject )=>{
                                                                                            LikeAndRating.AnswerRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
                                                                                                if(Rateerr) {
                                                                                                    res.send({status:"False", Error:Rateerr });
                                                                                                    reject(Rateerr);
                                                                                                } else {
                                                                                                    AnsRatingCal += JSON.parse(RateData.Rating);
                                                                                                    resolve(AnsRatingCal);
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    }
    
                                                                                }
                                                                            });
                                                                        }else{
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
                                                                                            timeAgo: moment(ansInfo.updatedAt).fromNow(),
                                                                                            RatingCount: JSON.parse(AnsRatingCal) / JSON.parse(NewCount),
                                                                                            userRated: userRated,
                                                                                            userRating: userRating,
                                                                                            PostId: ansInfo.PostId,
                                                                                            PostUserId: ansInfo.PostUserId ,
                                                                                            AnswerText: ansInfo.AnswerText
                                                                                        }
                                                                            );
                                                                            AnswersArray.push(newArray[0]);
                                                                            resolve(newArray[0]);
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
                        }
                    }else{

                        var UserLiked = false;
                        var UserLikedId = '';
                        if(UserLike.length > 0){
                             UserLiked = true;
                             UserLikedId = UserLike[0]._id;
                        }else{
                             UserLiked = false;
                             UserLikedId = '';
                        }

                        var alreadyCommentuser = true;
                        if(CommantData.length <= 0 ){
                            alreadyCommentuser = false;
                        }else{
                            alreadyCommentuser = true;
                        }

                        var alreadyShared = true;
                            if(HighlightsShared.length <= 0 ){
                                alreadyShared = false;
                            }else{
                                alreadyShared = true;
                            } 

                        var newArray = [];

                        newArray.push( {
                                        Type:'Highlight',
                                        UserId: UserData._id,
                                        UserName: UserData.UserName,
                                        UserCategoryId: UserData.UserCategoryId,
                                        UserCategoryName: UserData.UserCategoryName,
                                        UserImage: UserData.UserImage,
                                        UserCompany: UserData.UserCompany,
                                        UserProfession: UserData.UserProfession,
                                        Followers:followCount,
                                        UserCommented: alreadyCommentuser,
                                        _id: info._id,
                                        PostType: info.PostType,
                                        PostDate: info.PostDate,
                                        PostText: info.PostText ,
                                        PostLink: info.PostLink,
                                        timeAgo: moment(info.updatedAt).fromNow(),
                                        PostLinkInfo: info.PostLinkInfo || '',
                                        PostImage: info.PostImage,
                                        PostVideo: info.PostVideo,
                                        Shared: info.Shared || '',
                                        ShareUserName: info.ShareUserName || '',
                                        ShareUserId: info.ShareUserId || '',
                                        SharePostId: info.SharePostId || '',
                                        LikesCount: LikingCount,
                                        UserLiked: UserLiked,
                                        ShareCount: HighlightsShareCount,
                                        UserShared: alreadyShared,
                                        UserLikeId: UserLikedId,
                                        comments: [],
                                        commentsCount : CommentCount
                                    }
                        );
                        return newArray[0];
                    }
    
    
                    }).catch(error => {
                        console.log(error);
                    })
                 GetUserData(AnsData.concat(QuesData).sort(function(a, b) { return a.createdAt - b.createdAt; }).reverse());

                }
            });
        }
    });
};