var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentAndAnswer = require('../models/CommentAndAnswer.model.js');

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



exports.Timeline = function (req, res) {
    QuestionsPostModel.QuestionsPostType.find({'UserId' : req.params.UserId }, {} , { sort: { createdAt: -1 } }, function (queserr, QuesData) {
        if (queserr) {
            res.status(500).send({ status: "False", Error: queserr,  message: "Some error occurred while Find Question Post ." });
        } else {
            HighlightsPostModel.HighlightsPostType.find({'UserId' : req.params.UserId }, {} , { sort: { createdAt: -1 } }, function (anserr, AnsData) {
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
                        LikeAndRating.QuestionsRating.count({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                        LikeAndRating.HighlightsLike.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        LikeAndRating.HighlightsLike.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.HighlightsComment.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.QuestionsAnwer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                        CommentAndAnswer.QuestionsAnwer.find({ 'PostId': info._id }, 'AnswerText UserId Date').exec()
                    ]).then(data => {
                        var UserData = data[0];
                        var followCount = data[1];
                        var ratingCount = data[2];
                        var UserRating = data[3];
                        var LikingCount = data[4];
                        var UserLike = data[5];
                        var CommentCount = data[6];
                        var AnswerCount = data[7];
                        var Answerdata = data[8];
    

                    if(info.PostTopicId){
    
                        var AnswersArray= new Array();
    
                       return GetAnsUserData();
                        async function GetAnsUserData(){
                            for (var ansInfo of Answerdata) {
                                await getAnswerInfo(ansInfo);
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
                                PostText: info.PostText ,
                                PostLink: info.PostLink,
                                PostImage: info.PostImage,
                                PostVideo: info.PostVideo,
                                RatingCount: ratingCount,
                                UserRating: UserRating,
                                AnswersCount: AnswerCount,
                                Answers: AnswersArray,
        
                            };
                            return result;
                          }
                          
                          function getAnswerInfo(ansInfo){
                            return new Promise(( resolve, reject )=>{
                                UserModel.UserType.findOne({'_id': ansInfo.UserId }, usersProjection, function(err, AnsUserData) {
                                    if(err) {
                                        res.send({status:"Fale", Error:err });
                                        reject(err);
                                    } else {
                                        FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                            if(newerr){
                                                res.send({status:"Fale", Error:newerr });
                                                reject(newerr);
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
                            });
                        }
                    }else{

                        if(UserLike.length > 0){
                            var UserLiked = true;
                            var UserLikedId = UserLike[0]._id;
                        }else{
                            var UserLiked = false;
                            var UserLikedId = '';
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
                                        _id: info._id,
                                        PostType: info.PostType,
                                        PostDate: info.PostDate,
                                        PostText: info.PostText ,
                                        PostLink: info.PostLink,
                                        PostImage: info.PostImage,
                                        PostVideo: info.PostVideo,
                                        LikesCount: LikingCount,
                                        UserLiked: UserLiked,
                                        UserLikeId: UserLikedId,
                                        comments: [],
                                        commentsCount : CommentCount
                                    }
                        );

                        return newArray[0];

                    }
    
    
                    }).catch(error => {
                        console.log(error)
                    })
                 GetUserData(AnsData.concat(QuesData).sort(function(a, b) { return a.createdAt - b.createdAt }).reverse());

                }
            });
        }
    });
};