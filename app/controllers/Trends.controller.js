var CoinsModel = require('../models/Coins.model.js');
var TrendsModel = require('../models/Trends.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
const axios = require("axios");


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


exports.CoinsList = function(req, res) {
    CoinsModel.Coins.find({}, 'Name Symbol CoinName FullName SortOrder ImageUrl StartDate' , {skip: 0 , limit: 20}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Get The Coins."});
        } else {

            var CoinsArray = new Array();
            GetUserData();
            async function GetUserData(){
                for (let info of result) {
                    await getUserInfo(info);
                 }
                 res.send({ status:"True", data: CoinsArray });
              }
              
              function getUserInfo(info){
                return new Promise(( resolve, reject )=>{
                    axios.get('https://min-api.cryptocompare.com/data/price?fsym=' + info.Name + '&tsyms=USD')
                        .then(response => {
                                var newArray = [];
                                    newArray.push( {
                                        CoinId: info._id,
                                        Name: info.Name,
                                        FullName: info.CoinName,
                                        SortOrder: info.SortOrder,
                                        ImageUrl: info.ImageUrl,
                                        Rate: response.data.USD,
                                        TimeStamp: Date.now()
                                        }
                                    );

                            CoinsArray.push(newArray[0]);
                            resolve(newArray[0]);

                        })
                        .catch(error => {
                            reject(error);
                        });
                });
              };

        }
    });
};






exports.ImpressionAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostText) {
        res.status(400).send({status:"False", message: " Post Text can not be Empty! "});
    }
    if(!req.body.CoinId) {
        res.status(400).send({status:"False", message: " CoinId can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " PostDate can not be Empty! "});
    }

    var varImpressions = new TrendsModel.Impressions({
            UserId: req.body.UserId,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText,
            CoinId: req.body.CoinId,
            ActiveStates: 'Active'
    });

     
    varImpressions.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Impression Post."});
            
        } else {
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
                                            PostDate: result.PostDate,
                                            PostText: result.PostText
                                        }
                            );
                            res.send({status:"True", data: newArray[0] });
                        }
                    });
                 }
            });
        }
    });
};




exports.ImpressionPosts = function(req, res) {
    TrendsModel.Impressions.find({'CoinId': req.params.CoinId }, {} , {sort:{createdAt : -1}}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Commants ."});
        } else {
            if(result.length > 0){
                var ImpressionsArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: ImpressionsArray });
                  }
                  
                  function getUserInfo(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, UserData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
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
                                                            PostText: info.PostText,
                                                            PostDate: info.PostDate,
                                                            CoinId: req.params.CoinId,
                                                        }
                                            );
                                            ImpressionsArray.push(newArray[0]);
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
            res.send({status:"True", message:'No More Impressions' });
            }
        }
    });
};



exports.CoinInfo = function(req, res) {
        TopicsModel.TopicsType.findOne({'TopicName': req.params.name}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate The Name."});
            } else {
                if(data === null){
                    res.send({ status:"True", available: "True", message: "( " + req.params.name + " ) This Name is Available." });
                }else{
                    res.send({ status:"True", available: "False", message: "( " + req.params.name + " ) This Name is Already Exist. " });
                } 
            }
        });
};