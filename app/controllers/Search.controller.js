var CoinsModel = require('../models/Coins.model.js');
var TrendsModel = require('../models/Trends.model.js');
var TopicsModel = require('../models/Topics.model.js');
var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentAndAnswer = require('../models/CommentAndAnswer.model.js');


var usersProjection = { 
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserEmailVerifyToken: false,
    UserDateOfBirth: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
};

exports.Users = function(req, res) {
    UserModel.UserType.find({'_id': { $ne: req.params.UserId } }, usersProjection, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Search Users."});
        } else {
            var FollowersArray = new Array();
            GetFollowesCount();
                async function GetFollowesCount(){
                    for (let info of result) {
                        await getfollowInfo(info);
                     }
                    res.send({status:"True", data: FollowersArray });
                  }

                  function getfollowInfo(info){
                    return new Promise(( resolve, reject )=>{
                        FollowModel.FollowUserType.count({'FollowingUserId': info._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                            if(newerr){
                                res.send({status:"Fale", Error:newerr });
                                reject(err);
                            }else{
                                var newArray = [];
                                newArray.push( {
                                                Category: 'Users',
                                                _id: info._id,
                                                SearchText: info.UserName,
                                                UserName: info.UserName,
                                                UserCategoryId: info.UserCategoryId,
                                                UserCategoryName: info.UserCategoryName,
                                                UserImage: info.UserImage,
                                                UserCompany: info.UserCompany,
                                                UserProfession: info.UserProfession,
                                                Followers:count
                                            }
                                );
                                FollowersArray.push(newArray[0]);
                                resolve(newArray[0]);
                            }
                        });
                    });
                  };
        }
    });
};

exports.FollowUsers = function(req, res) {};

exports.UnfollowUsers = function(req, res) {};

exports.OurfollowUsers = function(req, res) {};

exports.Topics = function(req, res) {
    TopicsModel.TopicsType.find({}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Find Topics."});
        } else { 
            var TopicsArray = new Array();
            GetTopicsData();
            async function GetTopicsData(){
                for (let info of result) {
                    await getTopicInfo(info);
                    }
                res.send({status:"True", data: TopicsArray });
            }
                
            function getTopicInfo(info, i){
            return new Promise(( resolve, reject )=>{
                    FollowModel.FollowTopicType.count({'FollowingTopicId': info._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                        if(newerr){
                            res.send({status:"Fale", Error:newerr });
                            reject(newerr);
                        }else{
                            var newArray = [];
                            newArray.push( {
                                            Category: 'Topics',
                                            _id: info._id,
                                            SearchText: info.TopicName,
                                            TopicName: info.TopicName,
                                            TopicImage: info.TopicImage,
                                            Followers:count
                                        }
                            );
                            TopicsArray.push(newArray[0]);
                            resolve(newArray[0]);
                        }
                    });
                });
            }
        }
    });
};

exports.FollowTopics = function(req, res) {};

exports.UnFollowTopics = function(req, res) {};

exports.Coins = function(req, res) {};

exports.Highlights = function(req, res) {};

exports.OurHighlights = function(req, res) {};

exports.Questions = function(req, res) {};

exports.OurQuestions = function(req, res) {};

exports.Impressions = function(req, res) {};

exports.OurImpressions = function(req, res) {};

exports.Answers = function(req, res) {};

exports.OurAnswers = function(req, res) {};

exports.Comments = function(req, res) {};

exports.OurComments = function(req, res) {};